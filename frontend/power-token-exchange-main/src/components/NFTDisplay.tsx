
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, ExternalLink, Leaf, Trophy } from "lucide-react";
import { getUserNFTs } from '@/contract';
import { CONTRACT_ADDRESS } from '@/contract';
import { useAuth } from './AuthProvider';
import { toast } from '@/components/ui/use-toast';
import { getUserNFTs as getLocalUserNFTs, LocalNFT } from '@/lib/localStorage';

type NFT = {
  id: string;
  uri?: string;
  title: string;
  description: string;
  type: string;
  date: string;
};

interface NFTDisplayProps {
  showActions?: boolean;
}

export const NFTDisplay = ({ showActions = true }: NFTDisplayProps) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const { walletAddress, user } = useAuth();

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        let userNFTs: NFT[] = [];
        
        try {
          if (walletAddress) {
            const contractNFTs = await getUserNFTs();
            userNFTs = contractNFTs.map((nft, index) => {
              const mockTypes = ['bronze', 'silver', 'gold', 'special'];
              
              return {
                ...nft,
                title: `Carbon Credit NFT #${nft.id}`,
                description: `This NFT represents carbon credits earned through sustainable energy trading.`,
                type: mockTypes[index % mockTypes.length],
                date: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toLocaleDateString(),
              };
            });
          }
        } catch (error) {
          console.error("Error fetching NFTs from contract:", error);
        }
        if (userNFTs.length === 0) {
          const localNFTs = getLocalUserNFTs(user.id);
          userNFTs = localNFTs.map(nft => ({
            id: nft.id,
            title: nft.title,
            description: nft.description,
            type: nft.type,
            date: nft.date
          }));
        }
        
        setNfts(userNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        toast({
          title: "Failed to load NFTs",
          description: "Using backup data for display",
          variant: "destructive",
        });
        const fallbackNFTs: NFT[] = [
          {
            id: 'nft-1',
            title: 'Carbon Credit NFT #1',
            description: 'This NFT represents carbon credits earned through sustainable energy trading.',
            type: 'bronze',
            date: new Date(Date.now() - 604800000).toLocaleDateString()
          },
          {
            id: 'nft-2',
            title: 'Carbon Credit NFT #2',
            description: 'This NFT represents carbon credits earned through sustainable energy trading.',
            type: 'silver',
            date: new Date(Date.now() - 1209600000).toLocaleDateString()
          },
          {
            id: 'nft-3',
            title: 'Carbon Credit NFT #3',
            description: 'This NFT represents carbon credits earned through sustainable energy trading.',
            type: 'gold',
            date: new Date(Date.now() - 2592000000).toLocaleDateString()
          }
        ];
        setNfts(fallbackNFTs);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [walletAddress, user]);

  const getTypeColor = (type: string = 'bronze') => {
    switch (type) {
      case 'bronze':
        return 'bg-amber-500';
      case 'silver':
        return 'bg-slate-400';
      case 'gold':
        return 'bg-yellow-500';
      case 'special':
        return 'bg-purple-500';
      default:
        return 'bg-green-500';
    }
  };

  const getIcon = (type: string = 'bronze') => {
    switch (type) {
      case 'bronze':
        return <Leaf className="h-8 w-8 text-amber-500" />;
      case 'silver':
        return <Trophy className="h-8 w-8 text-slate-400" />;
      case 'gold':
        return <Award className="h-8 w-8 text-yellow-500" />;
      case 'special':
        return <Leaf className="h-8 w-8 text-purple-500" />;
      default:
        return <Leaf className="h-8 w-8 text-green-500" />;
    }
  };
  
  const handleViewDetails = (nftId: string) => {
    toast({
      title: "NFT Details",
      description: `Viewing details for NFT #${nftId}`,
    });
  };
  
  const handleExternalView = (nftId: string) => {
    toast({
      title: "Opening External Link",
      description: "Redirecting to blockchain explorer",
    });
    
    window.open(`https://etherscan.io/token/${CONTRACT_ADDRESS}?a=${nftId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <Card className="p-6 text-center">
        <CardTitle className="mb-2">No NFTs Found</CardTitle>
        <CardDescription>
          You don't have any carbon credit NFTs yet. Start trading energy to earn your first NFT!
        </CardDescription>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft) => (
        <Card key={nft.id} className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getTypeColor(nft.type)} bg-opacity-10`}>
                  {getIcon(nft.type)}
                </div>
                <div>
                  <CardTitle className="text-lg">{nft.title}</CardTitle>
                  <CardDescription>Earned on {nft.date}</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className={`${getTypeColor(nft.type)} text-white`}>
                {nft.type?.charAt(0).toUpperCase()}{nft.type?.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">{nft.description}</p>
            {showActions && (
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewDetails(nft.id)}
                >
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExternalView(nft.id)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
