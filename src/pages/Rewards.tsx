import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { supabase } from '@/integrations/supabase/client';
import { Leaf, Award, Calendar, Eye, Gift, TreePine } from 'lucide-react';
import { toast } from 'sonner';
import { NFTDetailModal } from '@/components/NFTDetailModal';

interface CarbonCreditNFT {
  id: string;
  title: string;
  description: string;
  carbon_offset_amount: number;
  image_url: string;
  nft_status: string;
  minted_at: string;
  acquired_at: string;
}

const Rewards = () => {
  const { user } = useAuth();
  const { walletAddress } = useWallet();
  const [userNFTs, setUserNFTs] = useState<CarbonCreditNFT[]>([]);
  const [availableRewards, setAvailableRewards] = useState<CarbonCreditNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<CarbonCreditNFT | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Redirect if not authenticated or no wallet
  if (!user || !walletAddress) {
    return <Navigate to="/get-started" replace />;
  }

  useEffect(() => {
    fetchNFTs();
    generateAvailableRewards();
  }, []);

  const fetchNFTs = async () => {
    try {
      const { data, error } = await supabase
        .from('carbon_credit_nfts')
        .select('*')
        .eq('owner_id', user.id)
        .order('acquired_at', { ascending: false });

      if (error) throw error;
      setUserNFTs(data || []);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAvailableRewards = () => {
    // Sample available rewards (in a real app, these would come from the database)
    const sampleRewards: CarbonCreditNFT[] = [
      {
        id: 'reward-1',
        title: 'Solar Energy Pioneer',
        description: 'Earned for completing your first solar energy trade',
        carbon_offset_amount: 1.5,
        image_url: '',
        nft_status: 'available',
        minted_at: new Date().toISOString(),
        acquired_at: new Date().toISOString()
      },
      {
        id: 'reward-2',
        title: 'Wind Power Champion',
        description: 'Earned for trading 100 kWh of wind energy',
        carbon_offset_amount: 5.0,
        image_url: '',
        nft_status: 'available',
        minted_at: new Date().toISOString(),
        acquired_at: new Date().toISOString()
      },
      {
        id: 'reward-3',
        title: 'Carbon Reducer',
        description: 'Earned for offsetting 10 tons of CO2',
        carbon_offset_amount: 10.0,
        image_url: '',
        nft_status: 'available',
        minted_at: new Date().toISOString(),
        acquired_at: new Date().toISOString()
      }
    ];
    setAvailableRewards(sampleRewards);
  };

  const handleClaimReward = async (reward: CarbonCreditNFT) => {
    try {
      const { error } = await supabase
        .from('carbon_credit_nfts')
        .insert([{
          owner_id: user.id,
          title: reward.title,
          description: reward.description,
          carbon_offset_amount: reward.carbon_offset_amount,
          image_url: reward.image_url || null,
          nft_status: 'owned'
        }]);

      if (error) throw error;

      // Update user's carbon credits count
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('carbon_credits')
        .eq('user_id', user.id)
        .single();

      await supabase
        .from('profiles')
        .update({ 
          carbon_credits: (currentProfile?.carbon_credits || 0) + 1
        })
        .eq('user_id', user.id);

      toast.success('Reward claimed successfully!');
      fetchNFTs();
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error('Failed to claim reward. Please try again.');
    }
  };

  const handleViewNFTDetails = (nft: CarbonCreditNFT) => {
    setSelectedNFT(nft);
    setIsDetailModalOpen(true);
  };

  const NFTCard = ({ nft, isReward = false }: { nft: CarbonCreditNFT; isReward?: boolean }) => (
    <Card className="hover:shadow-card transition-all duration-300">
      <CardHeader>
        <div className="w-full h-48 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
          {nft.image_url ? (
            <img src={nft.image_url} alt={nft.title} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <div className="text-center text-white">
              <TreePine className="w-16 h-16 mx-auto mb-2" />
              <div className="text-sm">Carbon Credit NFT</div>
            </div>
          )}
        </div>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-primary" />
          {nft.title}
        </CardTitle>
        <CardDescription>{nft.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Carbon Offset:</span>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {nft.carbon_offset_amount} tons CO₂
            </Badge>
          </div>
          {!isReward ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant="outline" className="capitalize">
                  {nft.nft_status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Acquired:</span>
                <span className="text-sm">{new Date(nft.acquired_at).toLocaleDateString()}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => handleViewNFTDetails(nft)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => handleClaimReward(nft)}
              size="sm" 
              className="w-full"
            >
              <Gift className="w-4 h-4 mr-2" />
              Claim Reward
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading rewards...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Carbon Credit Rewards</h1>
          <p className="text-muted-foreground">
            Earn and manage your carbon credit NFTs for sustainable energy contributions
          </p>
        </div>

        <Tabs defaultValue="rewards" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Available Rewards ({availableRewards.length})
            </TabsTrigger>
            <TabsTrigger value="nfts" className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              My NFTs ({userNFTs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rewards" className="mt-6">
            <div className="mb-6">
              <Card className="bg-gradient-secondary text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Earn Carbon Credit NFTs</h3>
                      <p className="text-white/90">
                        Complete energy trades and sustainable actions to unlock exclusive carbon credit NFTs
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {availableRewards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableRewards.map((reward) => (
                  <NFTCard key={reward.id} nft={reward} isReward={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No rewards available</h3>
                <p className="text-muted-foreground">
                  Start trading energy to unlock carbon credit rewards!
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="nfts" className="mt-6">
            {userNFTs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userNFTs.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Leaf className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No NFTs yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't earned any carbon credit NFTs yet.
                </p>
                <Button onClick={() => {
                  const rewardsTab = document.querySelector('[value="rewards"]') as HTMLElement;
                  rewardsTab?.click();
                }}>
                  <Award className="w-4 h-4 mr-2" />
                  View Available Rewards
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* NFT Detail Modal */}
        <NFTDetailModal
          nft={selectedNFT}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Rewards;