
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getContractInstance } from '@/contract';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { addTransaction, addNFT } from '@/lib/localStorage';

export interface PowerTokenListing {
  id: number;
  seller: string;
  amount: string;
  price: string;
  time: string;
}

export interface NFTListing {
  id: number;
  title: string;
  seller: string;
  price: string;
  description: string;
  type: string;
  time: string;
}

export const useMarketplace = () => {
  const [powerListings, setPowerListings] = useState<PowerTokenListing[]>([]);
  const [nftListings, setNftListings] = useState<NFTListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { walletAddress, user, updateBalance } = useAuth();

  useEffect(() => {
    const fetchListings = async () => {
      if (!walletAddress) return;
      
      try {
        setLoading(true);
        const mockPowerListings = [
          { id: 1, seller: '0x7d...41a2', amount: '100 PT', price: '0.05 ETH', time: '1 hour ago' },
          { id: 2, seller: '0x3b...f28c', amount: '50 PT', price: '0.025 ETH', time: '3 hours ago' },
          { id: 3, seller: '0x9e...12d4', amount: '200 PT', price: '0.1 ETH', time: '5 hours ago' },
          { id: 4, seller: '0x5a...87e6', amount: '75 PT', price: '0.0375 ETH', time: '1 day ago' },
          { id: 5, seller: '0x2f...e9b3', amount: '150 PT', price: '0.075 ETH', time: '2 days ago' },
          { id: 6, seller: '0x8c...56d7', amount: '300 PT', price: '0.15 ETH', time: '3 days ago' },
        ];

        const mockNftListings = [
          { 
            id: 1, 
            title: 'Energy Saver - Gold',
            seller: '0x4a...92c1',
            price: '0.2 ETH',
            description: 'Prestigious Gold tier NFT awarded for saving over 100 kWh of energy',
            type: 'gold',
            time: '5 hours ago' 
          },
          { 
            id: 2, 
            title: 'Carbon Neutralizer',
            seller: '0x6d...37f5',
            price: '0.15 ETH',
            description: 'Special NFT for achieving carbon neutrality in energy consumption',
            type: 'special',
            time: '1 day ago' 
          },
          { 
            id: 3, 
            title: 'Power Trader - Platinum',
            seller: '0x1b...e4a8',
            price: '0.25 ETH',
            description: 'Elite Platinum tier NFT for completing over 100 energy trades',
            type: 'platinum',
            time: '2 days ago' 
          },
          { 
            id: 4, 
            title: 'Community Champion',
            seller: '0x9c...f7b2',
            price: '0.18 ETH',
            description: 'Awarded for contributing significantly to community energy savings',
            type: 'special',
            time: '4 days ago' 
          },
        ];
        
        setPowerListings(mockPowerListings);
        setNftListings(mockNftListings);
      } catch (error) {
        console.error("Error fetching marketplace listings:", error);
        toast({
          title: "Failed to load marketplace",
          description: "Could not retrieve the latest listings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [walletAddress]);

  const buyPowerTokens = async (listingId: number) => {
    if (!walletAddress || !user) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make a purchase",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const listing = powerListings.find(l => l.id === listingId);
      if (!listing) throw new Error("Listing not found");
      const amount = parseInt(listing.amount.split(' ')[0]);
      const price = parseFloat(listing.price.split(' ')[0]);
      
      // In rl app we do call the smart contract here
      const currentBalance = parseInt(user.balance.split(' ')[0]);
      const newBalance = `${currentBalance + amount} PT`;
      await updateBalance(newBalance);
      // Record the trsctn
      const transaction = {
        id: uuidv4(),
        user_id: user.id,
        transaction_type: 'buy' as 'buy' | 'sell' | 'transfer',
        amount: amount,
        token_type: 'power' as 'power' | 'nft',
        price: price,
        timestamp: new Date().toISOString(),
        status: 'completed' as 'completed' | 'pending' | 'failed',
        counterparty: listing.seller,
        tx_hash: `0x${Math.floor(Math.random() * 1000000000).toString(16)}`
      };
      addTransaction(transaction);
      toast({
        title: "Purchase successful",
        description: `You bought ${listing.amount} for ${listing.price}`,
      });
      
      // Update items
      setPowerListings(powerListings.filter(l => l.id !== listingId));
    } catch (error) {
      console.error("Error buying power tokens:", error);
      toast({
        title: "Purchase failed",
        description: "There was an error completing your purchase",
        variant: "destructive",
      });
    }
  };

  const buyNFT = async (listingId: number) => {
    if (!walletAddress || !user) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make a purchase",
        variant: "destructive",
      });
      return;
    }
    
    try {
      //find listing
      const listing = nftListings.find(l => l.id === listingId);
      if (!listing) throw new Error("Listing not found");
      
      //get price
      const price = parseFloat(listing.price.split(' ')[0]);
      const transaction = {
        id: uuidv4(),
        user_id: user.id,
        transaction_type: 'buy' as 'buy' | 'sell' | 'transfer',
        amount: 1,
        token_type: 'nft' as 'power' | 'nft',
        token_id: `NFT-${listing.id}`,
        price: price,
        timestamp: new Date().toISOString(),
        status: 'completed' as 'completed' | 'pending' | 'failed',
        counterparty: listing.seller,
        tx_hash: `0x${Math.floor(Math.random() * 1000000000).toString(16)}`
      };
      
      addTransaction(transaction);
      const nftType = listing.type === 'platinum' ? 'gold' : listing.type;
      
      addNFT({
        id: `NFT-${listing.id}`,
        user_id: user.id,
        title: listing.title,
        description: listing.description,
        type: nftType as 'bronze' | 'silver' | 'gold' | 'special',
        date: new Date().toLocaleDateString()
      });
      
      toast({
        title: "Purchase successful",
        description: `You bought ${listing.title} for ${listing.price}`,
      });
      
      setNftListings(nftListings.filter(l => l.id !== listingId));
    } catch (error) {
      console.error("Error buying NFT:", error);
      toast({
        title: "Purchase failed",
        description: "There was an error completing your purchase",
        variant: "destructive",
      });
    }
  };

  const createPowerTokenListing = async (amount: number, price: number) => {
    if (!walletAddress || !user) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a listing",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const currentBalance = parseInt(user.balance.split(' ')[0]);
      if (currentBalance < amount) {
        toast({
          title: "Insufficient balance",
          description: `You need at least ${amount} PT to create this listing`,
          variant: "destructive",
        });
        return;
      }
      
      // Update bal
      const newBalance = `${currentBalance - amount} PT`;
      await updateBalance(newBalance);
      const transaction = {
        id: uuidv4(),
        user_id: user.id,
        transaction_type: 'sell' as 'buy' | 'sell' | 'transfer',
        amount: amount,
        token_type: 'power' as 'power' | 'nft',
        price: price,
        timestamp: new Date().toISOString(),
        status: 'completed' as 'completed' | 'pending' | 'failed',
        counterparty: 'Marketplace',
        tx_hash: `0x${Math.floor(Math.random() * 1000000000).toString(16)}`
      };
      
      addTransaction(transaction);
      
      const newListing = {
        id: powerListings.length + 1,
        seller: `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`,
        amount: `${amount} PT`,
        price: `${price} ETH`,
        time: 'Just now'
      };
      
      setPowerListings([newListing, ...powerListings]);
      
      toast({
        title: "Listing created",
        description: `Your tokens are now listed for sale`,
      });
    } catch (error) {
      console.error("Error creating listing:", error);
      toast({
        title: "Failed to create listing",
        description: "There was an error creating your listing",
        variant: "destructive",
      });
    }
  };

  return {
    powerListings,
    nftListings,
    loading,
    buyPowerTokens,
    buyNFT,
    createPowerTokenListing
  };
};
