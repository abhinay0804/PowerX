
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Award, Gift, Leaf, Star, Trophy } from "lucide-react";
import { NFTDisplay } from '@/components/NFTDisplay';
import { useAuth } from '@/components/AuthProvider';
import { 
  getUserRewards as getLocalUserRewards, 
  claimReward, 
  addNFT 
} from '@/lib/localStorage';
import { toast } from '@/components/ui/use-toast';
import { Navbar } from '@/components/Navbar';

interface Reward {
  id: string;
  user_id: string;
  title: string;
  description: string;
  progress: number;
  reward_type: string;
  claimed: boolean;
  icon: JSX.Element;
}

const RewardsPage = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRewards = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userRewards = getLocalUserRewards(user.id);
        const mappedRewards = userRewards.map(reward => {
          let icon;
          switch (reward.reward_type) {
            case 'Bronze NFT':
              icon = <Leaf className="h-5 w-5 text-green-500" />;
              break;
            case 'Silver NFT':
              icon = <Trophy className="h-5 w-5 text-slate-400" />;
              break;
            case 'Gold NFT':
              icon = <Award className="h-5 w-5 text-yellow-500" />;
              break;
            default:
              icon = <Star className="h-5 w-5 text-blue-500" />;
          }
          
          return {
            ...reward,
            icon
          };
        });
        
        setRewards(mappedRewards);
      } catch (error) {
        console.error("Error fetching rewards:", error);
        const mockRewards: Reward[] = [
          {
            id: '1',
            user_id: user.id,
            title: "Trade 100 Energy Units",
            description: "Successfully trade 100 units of sustainable energy on the platform.",
            progress: 75,
            reward_type: "Bronze NFT",
            claimed: false,
            icon: <Leaf className="h-5 w-5 text-green-500" />
          },
          {
            id: '2',
            user_id: user.id,
            title: "Refer 3 New Users",
            description: "Invite three new users to join the platform and make their first trade.",
            progress: 100,
            reward_type: "Silver NFT",
            claimed: false,
            icon: <Trophy className="h-5 w-5 text-slate-400" />
          },
          {
            id: '3',
            user_id: user.id,
            title: "Maintain a 95% Positive Energy Score",
            description: "Achieve and maintain a positive energy score of 95% or higher for a month.",
            progress: 60,
            reward_type: "Gold NFT",
            claimed: false,
            icon: <Award className="h-5 w-5 text-yellow-500" />
          },
          {
            id: '4',
            user_id: user.id,
            title: "Participate in 5 Community Events",
            description: "Actively participate in five community events or webinars.",
            progress: 40,
            reward_type: "Exclusive Badge",
            claimed: false,
            icon: <Star className="h-5 w-5 text-blue-500" />
          },
        ];
        
        setRewards(mockRewards);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRewards();
  }, [user]);

  const handleClaimReward = (rewardId: string, rewardType: string) => {
    if (!user) return;
    
    try {
      claimReward(rewardId, user.id);
      const nftType = rewardType.toLowerCase().includes('bronze') ? 'bronze' : 
                     rewardType.toLowerCase().includes('silver') ? 'silver' : 
                     rewardType.toLowerCase().includes('gold') ? 'gold' : 'special';
      
      const newNFT = {
        id: `nft-${Date.now()}`,
        user_id: user.id,
        title: `${rewardType} - Reward`,
        description: `This NFT was awarded for completing the "${rewards.find(r => r.id === rewardId)?.title}" achievement.`,
        type: nftType as 'bronze' | 'silver' | 'gold' | 'special',
        date: new Date().toLocaleDateString()
      };
      
      addNFT(newNFT);
      setRewards(rewards.map(reward => 
        reward.id === rewardId ? { ...reward, claimed: true } : reward
      ));
      
      toast({
        title: "Reward Claimed!",
        description: `You've received a new ${rewardType} for your achievement.`,
      });
      
      setActiveTab("myNFTs");
    } catch (error) {
      console.error("Error claiming reward:", error);
      toast({
        title: "Claim Failed",
        description: "There was an error claiming your reward. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-10 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center">Rewards & Achievements</h1>
          <p className="text-muted-foreground text-center mt-2">
            Unlock exclusive NFTs and badges by contributing to sustainable energy trading.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="justify-center">
            <TabsTrigger value="available">Available Rewards</TabsTrigger>
            <TabsTrigger value="myNFTs">My NFTs</TabsTrigger>
          </TabsList>
          <TabsContent value="available" className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-8 bg-muted rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded w-full mb-4"></div>
                      <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                      <div className="h-2 bg-muted rounded w-full"></div>
                    </CardContent>
                    <CardFooter>
                      <div className="h-10 bg-muted rounded w-24 ml-auto"></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map((reward) => (
                  <Card key={reward.id} className="bg-card text-card-foreground shadow-md">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        {reward.icon}
                        <CardTitle>{reward.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm text-muted-foreground">
                        {reward.description}
                      </CardDescription>
                      <Separator className="my-4" />
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-xs font-medium">Progress</p>
                          <Progress value={reward.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">{reward.progress}% completed</p>
                        </div>
                        <Badge variant="secondary">{reward.reward_type}</Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                      <Button 
                        onClick={() => handleClaimReward(reward.id, reward.reward_type)}
                        disabled={reward.progress < 100 || reward.claimed}
                      >
                        {reward.claimed ? 'Claimed' : reward.progress < 100 ? 'In Progress' : 'Claim Reward'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="myNFTs" className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Your Carbon Credit NFTs</h2>
            <NFTDisplay showActions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RewardsPage;
