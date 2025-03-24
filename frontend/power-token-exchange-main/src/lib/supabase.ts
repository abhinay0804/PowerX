
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://example.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  wallet_address: string | null;
  balance: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  transaction_type: 'buy' | 'sell' | 'transfer';
  amount: number;
  token_type: 'power' | 'nft';
  token_id?: string;
  price: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  counterparty?: string;
  tx_hash?: string;
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
};

export const updateUserBalance = async (userId: string, newBalance: string) => {
  const { error } = await supabase
    .from('profiles')
    .update({ balance: newBalance })
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error updating user balance:', error);
    throw error;
  }
};

export const createTransaction = async (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      ...transaction,
      timestamp: new Date().toISOString()
    }])
    .select();
  
  if (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
  
  return data[0];
};

export const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });
  
  if (error) {
    console.error('Error fetching user transactions:', error);
    return [];
  }
  
  return data;
};
