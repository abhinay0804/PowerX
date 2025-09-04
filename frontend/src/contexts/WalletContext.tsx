import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface WalletContextType {
  walletAddress: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { user } = useAuth();

  const connectWallet = useCallback(async (): Promise<boolean> => {
    if (isConnecting) return false;

    setIsConnecting(true);
    
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        toast.error('MetaMask is not installed. Please install MetaMask to connect your wallet.');
        return false;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);

        // Update user profile with wallet address if user is authenticated
        if (user) {
          const { error } = await supabase
            .from('profiles')
            .update({ wallet_address: address })
            .eq('user_id', user.id);

          if (error) {
            console.error('Error updating wallet address:', error);
          }
        }

        toast.success('Wallet connected successfully!');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        toast.error('Wallet connection rejected by user');
      } else {
        toast.error('Failed to connect wallet. Please try again.');
      }
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, user]);

  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    toast.success('Wallet disconnected');
  }, []);

  return (
    <WalletContext.Provider value={{
      walletAddress,
      isConnecting,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// Extend the Window interface to include ethereum and web3
declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}