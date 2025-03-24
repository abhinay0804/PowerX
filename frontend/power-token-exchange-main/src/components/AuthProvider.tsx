
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { getProviderAndSigner } from '@/contract';
import { supabase, getUserProfile, updateUserBalance as updateSupabaseBalance, getUserTransactions, Transaction } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { 
  LocalUser, 
  LocalTransaction, 
  getUser as getLocalUser, 
  saveUser as saveLocalUser, 
  getUserTransactions as getLocalUserTransactions,
  updateUserBalance as updateLocalUserBalance,
  getUserRewards as getLocalUserRewards,
  initializeDemoData
} from '@/lib/localStorage';
interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
  balance: string;
  isAdmin: boolean;
}
interface Reward {
  id: string;
  timestamp: number;
  type: string;
  description: string;
  tokenId: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  registerUser: (name: string, email: string, password: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  getUserTrades: () => Promise<Transaction[]>;
  getUserRewards: () => Reward[];
  walletAddress: string | null;
  updateBalance: (newBalance: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [useLocalStorage, setUseLocalStorage] = useState<boolean>(false);

  useEffect(() => {
    initializeDemoData();
  }, []);
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const userId = session.user.id;
          const userProfile = await getUserProfile(userId);
          if (userProfile) {
            const userInfo: User = {
              id: userId,
              name: userProfile.username,
              email: session.user.email || '',
              address: userProfile.wallet_address || undefined,
              balance: userProfile.balance,
              isAdmin: false,
            };
            setUser(userInfo);
            if (userProfile.wallet_address) {
              setWalletAddress(userProfile.wallet_address);
            }
          }
        } else {
          const localUser = getLocalUser();
          if (localUser) {
            setUser(localUser);
            setUseLocalStorage(true);
            if (localUser.address) {
              setWalletAddress(localUser.address);
            }
          }
        }
        if (window.ethereum && window.ethereum.selectedAddress) {
          const address = window.ethereum.selectedAddress;
          setWalletAddress(address);
          if (user) {
            if (!useLocalStorage) {
              const { error } = await supabase
                .from('profiles')
                .update({ wallet_address: address })
                .eq('user_id', user.id);
                
              if (!error) {
                setUser({
                  ...user,
                  address
                });
              }
            } else {
              const updatedUser = {
                ...user,
                address
              };
              saveLocalUser(updatedUser as LocalUser);
              setUser(updatedUser);
            }
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        const localUser = getLocalUser();
        if (localUser) {
          setUser(localUser);
          setUseLocalStorage(true);
          if (localUser.address) {
            setWalletAddress(localUser.address);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAuth();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          disconnectWallet();
        }
      });
    }
    
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  const registerUser = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      if (!useLocalStorage) {
        try {
          const { data, error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
              data: {
                name,
              }
            }
          });
          
          if (error) throw error;
          
          if (data.user) {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([
                {
                  user_id: data.user.id,
                  username: name,
                  balance: '1000 PT',
                }
              ]);
            if (profileError) throw profileError;
            const userInfo: User = {
              id: data.user.id,
              name: name,
              email: email,
              balance: '1000 PT',
              isAdmin: false
            };
            setUser(userInfo);
            toast({
              title: "Registration successful",
              description: "Your account has been created",
            });
            
            return;
          }
        } catch (supabaseError) {
          console.error('Supabase registration error:', supabaseError);
          setUseLocalStorage(true);
        }
      }
      if (useLocalStorage) {
        const userId = uuidv4();
        const newUser: LocalUser = {
          id: userId,
          name,
          email,
          balance: '1000 PT',
          isAdmin: false
        };
        
        saveLocalUser(newUser);
        setUser(newUser);
        
        toast({
          title: "Registration successful",
          description: "Your account has been created in offline mode",
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "There was an error creating your account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      if (!useLocalStorage) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          
          if (error) throw error;
          
          if (data.user) {
            const userProfile = await getUserProfile(data.user.id);
            
            if (userProfile) {
              const userInfo: User = {
                id: data.user.id,
                name: userProfile.username,
                email: data.user.email || '',
                address: userProfile.wallet_address || undefined,
                balance: userProfile.balance,
                isAdmin: false,
              };
              
              setUser(userInfo);
              if (userProfile.wallet_address) {
                setWalletAddress(userProfile.wallet_address);
              }
              
              toast({
                title: "Welcome back!",
                description: `Signed in as ${userProfile.username}`,
              });
              
              return;
            }
          }
        } catch (supabaseError) {
          console.error('Supabase login error:', supabaseError);
          setUseLocalStorage(true);
        }
      }
      
      if (useLocalStorage) {
        const localUser = getLocalUser();
        
        if (localUser && localUser.email === email) {
          setUser(localUser);
          if (localUser.address) {
            setWalletAddress(localUser.address);
          }
          
          toast({
            title: "Welcome back!",
            description: `Signed in as ${localUser.name} in offline mode`,
          });
        } else {
          throw new Error("Invalid email or password");
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    
    try {
      if (!window.ethereum) {
        toast({
          title: "MetaMask not detected",
          description: "Please install MetaMask to connect your wallet",
          variant: "destructive",
        });
        return;
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      setWalletAddress(address);
      if (user) {
        if (!useLocalStorage) {
          const { error } = await supabase
            .from('profiles')
            .update({ wallet_address: address })
            .eq('user_id', user.id);
            
          if (error) {
            console.error('Error updating wallet address:', error);
          } else {
            setUser({
              ...user,
              address
            });
            
            toast({
              title: "Wallet connected",
              description: `Wallet linked to your account: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
            });
          }
        } else {
          const updatedUser = {
            ...user,
            address
          };
          saveLocalUser(updatedUser as LocalUser);
          setUser(updatedUser);
          
          toast({
            title: "Wallet connected",
            description: `Wallet linked to your account: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
          });
        }
      } else {
        toast({
          title: "Wallet connected",
          description: "Please sign in or register to associate this wallet with your account",
        });
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    if (!useLocalStorage) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setWalletAddress(null);
    
    toast({
      title: "Disconnected",
      description: "You have been signed out",
    });
  };

  const getUserTrades = async (): Promise<Transaction[]> => {
    if (!user) return [];
    
    if (!useLocalStorage) {
      return getUserTransactions(user.id);
    } else {
      const localTransactions = getLocalUserTransactions(user.id);
      return localTransactions as Transaction[];
    }
  };

  const getUserRewards = (): Reward[] => {
    if (!user) return [];
    
    if (useLocalStorage) {
      const localRewards = getLocalUserRewards(user.id);
      return localRewards.map(reward => ({
        id: reward.id,
        timestamp: new Date(reward.timestamp).getTime(),
        type: reward.reward_type,
        description: reward.description,
        tokenId: reward.id
      }));
    }
    return [
      {
        id: 'r1',
        timestamp: Date.now() - 86400000,
        type: 'carbon_credit',
        description: 'Earned for trading renewable energy',
        tokenId: 'CC001'
      }
    ];
  };

  const updateBalance = async (newBalance: string) => {
    if (!user) return;
    
    try {
      if (!useLocalStorage) {
        await updateSupabaseBalance(user.id, newBalance);
      } else {
        updateLocalUserBalance(user.id, newBalance);
      }
      
      setUser({
        ...user,
        balance: newBalance
      });
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        connectWallet,
        disconnectWallet,
        registerUser,
        loginWithEmail,
        getUserTrades,
        getUserRewards,
        walletAddress,
        updateBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
declare global {
  interface Window {
    ethereum: any;
  }
}
