
//local strg keys
const KEYS = {
  USER: 'eco_power_user',
  TRANSACTIONS: 'eco_power_transactions',
  REWARDS: 'eco_power_rewards',
  NFTS: 'eco_power_nfts'
};
//user type
export interface LocalUser {
  id: string;
  name: string;
  email: string;
  address?: string;
  balance: string;
  isAdmin: boolean;
}

//transaction type
export interface LocalTransaction {
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

//reward type
export interface LocalReward {
  id: string;
  user_id: string;
  title: string;
  description: string;
  progress: number;
  reward_type: string;
  claimed: boolean;
  timestamp: string;
}

//NFT type
export interface LocalNFT {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: 'bronze' | 'silver' | 'gold' | 'special';
  date: string;
}

//save to local str
export const saveUser = (user: LocalUser): void => {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
};

//get user from ls
export const getUser = (): LocalUser | null => {
  const userData = localStorage.getItem(KEYS.USER);
  return userData ? JSON.parse(userData) : null;
};

//save transactions to ls
export const saveTransactions = (userId: string, transactions: LocalTransaction[]): void => {
  const allTransactions = getAllTransactions();
  const filteredTransactions = allTransactions.filter(tx => tx.user_id !== userId);
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify([...filteredTransactions, ...transactions]));
};

//get user transactions from ls
export const getUserTransactions = (userId: string): LocalTransaction[] => {
  const allTransactions = getAllTransactions();
  return allTransactions.filter(tx => tx.user_id === userId);
};

//get all transactions from ls
export const getAllTransactions = (): LocalTransaction[] => {
  const transactionsData = localStorage.getItem(KEYS.TRANSACTIONS);
  return transactionsData ? JSON.parse(transactionsData) : [];
};

//add  new transaction
export const addTransaction = (transaction: LocalTransaction): void => {
  const transactions = getAllTransactions();
  transactions.push(transaction);
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

//update user bal
export const updateUserBalance = (userId: string, newBalance: string): void => {
  const user = getUser();
  if (user && user.id === userId) {
    user.balance = newBalance;
    saveUser(user);
  }
};

//save rewards to ls
export const saveRewards = (userId: string, rewards: LocalReward[]): void => {
  const allRewards = getAllRewards();
  const filteredRewards = allRewards.filter(reward => reward.user_id !== userId);
  localStorage.setItem(KEYS.REWARDS, JSON.stringify([...filteredRewards, ...rewards]));
};

//get user rewards from ls
export const getUserRewards = (userId: string): LocalReward[] => {
  const allRewards = getAllRewards();
  return allRewards.filter(reward => reward.user_id === userId);
};

//get all rewards from ls
export const getAllRewards = (): LocalReward[] => {
  const rewardsData = localStorage.getItem(KEYS.REWARDS);
  return rewardsData ? JSON.parse(rewardsData) : [];
};

//update reward status
export const claimReward = (rewardId: string, userId: string): void => {
  const rewards = getAllRewards();
  const updatedRewards = rewards.map(reward => {
    if (reward.id === rewardId && reward.user_id === userId) {
      return { ...reward, claimed: true };
    }
    return reward;
  });
  localStorage.setItem(KEYS.REWARDS, JSON.stringify(updatedRewards));
};

//save NFTs to ls
export const saveNFTs = (userId: string, nfts: LocalNFT[]): void => {
  const allNFTs = getAllNFTs();
  const filteredNFTs = allNFTs.filter(nft => nft.user_id !== userId);
  localStorage.setItem(KEYS.NFTS, JSON.stringify([...filteredNFTs, ...nfts]));
};

//get user NFTs from ls
export const getUserNFTs = (userId: string): LocalNFT[] => {
  const allNFTs = getAllNFTs();
  return allNFTs.filter(nft => nft.user_id === userId);
};

//get all NFTs from ls
export const getAllNFTs = (): LocalNFT[] => {
  const nftsData = localStorage.getItem(KEYS.NFTS);
  return nftsData ? JSON.parse(nftsData) : [];
};

//add a new NFT
export const addNFT = (nft: LocalNFT): void => {
  const nfts = getAllNFTs();
  nfts.push(nft);
  localStorage.setItem(KEYS.NFTS, JSON.stringify(nfts));
};
export const initializeDemoData = (): void => {
  if (!getUser()) {
    const demoUser: LocalUser = {
      id: 'demo-user-1',
      name: 'Demo User',
      email: 'demo@example.com',
      balance: '1000 PT',
      isAdmin: false
    };
    saveUser(demoUser);
    const demoTransactions: LocalTransaction[] = [
      {
        id: '1',
        user_id: 'demo-user-1',
        transaction_type: 'buy',
        amount: 100,
        token_type: 'power',
        price: 0.05,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'completed',
        counterparty: '0x7d...41a2',
        tx_hash: '0x123...abc'
      },
      {
        id: '2',
        user_id: 'demo-user-1',
        transaction_type: 'sell',
        amount: 50,
        token_type: 'power',
        price: 0.025,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed',
        counterparty: '0x3b...f28c',
        tx_hash: '0x456...def'
      },
      {
        id: '3',
        user_id: 'demo-user-1',
        transaction_type: 'transfer',
        amount: 1,
        token_type: 'nft',
        token_id: 'NFT-001',
        price: 0.1,
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        status: 'completed',
        counterparty: '0x9e...12d4',
        tx_hash: '0x789...ghi'
      }
    ];
    saveTransactions('demo-user-1', demoTransactions);
    const demoRewards: LocalReward[] = [
      {
        id: 'r1',
        user_id: 'demo-user-1',
        title: 'Trade 100 Energy Units',
        description: 'Successfully trade 100 units of sustainable energy on the platform.',
        progress: 75,
        reward_type: 'Bronze NFT',
        claimed: false,
        timestamp: new Date().toISOString()
      },
      {
        id: 'r2',
        user_id: 'demo-user-1',
        title: 'Refer 3 New Users',
        description: 'Invite three new users to join the platform and make their first trade.',
        progress: 100,
        reward_type: 'Silver NFT',
        claimed: false,
        timestamp: new Date().toISOString()
      },
      {
        id: 'r3',
        user_id: 'demo-user-1',
        title: 'Maintain a 95% Positive Energy Score',
        description: 'Achieve and maintain a positive energy score of 95% or higher for a month.',
        progress: 60,
        reward_type: 'Gold NFT',
        claimed: false,
        timestamp: new Date().toISOString()
      },
      {
        id: 'r4',
        user_id: 'demo-user-1',
        title: 'Participate in 5 Community Events',
        description: 'Actively participate in five community events or webinars.',
        progress: 40,
        reward_type: 'Exclusive Badge',
        claimed: false,
        timestamp: new Date().toISOString()
      }
    ];
    saveRewards('demo-user-1', demoRewards);
    const demoNFTs: LocalNFT[] = [
      {
        id: 'nft-1',
        user_id: 'demo-user-1',
        title: 'Carbon Credit NFT #1',
        description: 'This NFT represents carbon credits earned through sustainable energy trading.',
        type: 'bronze',
        date: new Date(Date.now() - 604800000).toLocaleDateString()
      },
      {
        id: 'nft-2',
        user_id: 'demo-user-1',
        title: 'Carbon Credit NFT #2',
        description: 'This NFT represents carbon credits earned through sustainable energy trading.',
        type: 'silver',
        date: new Date(Date.now() - 1209600000).toLocaleDateString()
      },
      {
        id: 'nft-3',
        user_id: 'demo-user-1',
        title: 'Carbon Credit NFT #3',
        description: 'This NFT represents carbon credits earned through sustainable energy trading.',
        type: 'gold',
        date: new Date(Date.now() - 2592000000).toLocaleDateString()
      }
    ];
    saveNFTs('demo-user-1', demoNFTs);
  }
};
