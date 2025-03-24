import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  BarChart, 
  FileText, 
  Filter, 
  InfoIcon, 
  Leaf, 
  Search, 
  Zap, 
  Plus, 
  SlidersHorizontal, 
  Bolt
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Navbar } from "@/components/Navbar";
import { useAuth } from '@/components/AuthProvider';
import { useMarketplace } from '@/hooks/useMarketplace';

const Marketplace = () => {
  const { isAuthenticated, walletAddress } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const { toast } = useToast();
  
  const { 
    powerListings, 
    nftListings, 
    loading, 
    buyPowerTokens, 
    buyNFT, 
    createPowerTokenListing 
  } = useMarketplace();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; 
  }

  const handleCreateListing = () => {
    if (!amount || !price) {
      toast({
        title: "Missing information",
        description: "Please enter both amount and price",
        variant: "destructive",
      });
      return;
    }

    createPowerTokenListing(Number(amount), Number(price));
    setIsDialogOpen(false);
    setAmount('');
    setPrice('');
  };

  const filteredPowerListings = powerListings.filter(listing => 
    listing.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.seller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNftListings = nftListings.filter(nft => 
    nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nft.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nft.seller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getNftCardColor = (type: string) => {
    switch (type) {
      case 'gold':
        return 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-700';
      case 'platinum':
        return 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700';
      case 'special':
        return 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700';
      default:
        return 'bg-gradient-to-br from-green-100 to-green-200 text-green-700';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
            <p className="text-muted-foreground">
              Buy and sell Power Tokens and Carbon Credit NFTs
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={() => setIsDialogOpen(true)}
              disabled={!walletAddress}
            >
              <Plus className="h-4 w-4" />
              Create Listing
            </Button>
          </div>
        </div>

        <div className="mb-8 max-w-lg mx-auto animate-fade-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search marketplace listings..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="power" className="animate-fade-in">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="power">Power Tokens</TabsTrigger>
            <TabsTrigger value="nfts">Carbon Credit NFTs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="power" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="bg-muted/20">
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    </CardContent>
                    <CardFooter>
                      <div className="h-8 bg-muted rounded w-full"></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredPowerListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPowerListings.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-scale-in">
                    <CardHeader className="bg-primary/5 pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl flex items-center">
                            <Bolt className="mr-2 h-5 w-5 text-primary" />
                            {listing.amount}
                          </CardTitle>
                          <CardDescription>Listed by {listing.seller}</CardDescription>
                        </div>
                        <div className="text-sm font-medium">
                          {listing.time}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="font-bold">{listing.price}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button 
                        size="sm"
                        onClick={() => buyPowerTokens(listing.id)}
                        disabled={!walletAddress}
                      >
                        Buy Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <CardTitle className="mb-2">No Power Token Listings Found</CardTitle>
                <CardDescription>
                  There are no power token listings matching your search criteria.
                </CardDescription>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="nfts" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="bg-muted/20">
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="h-4 bg-muted rounded w-full mb-2"></div>
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    </CardContent>
                    <CardFooter>
                      <div className="h-8 bg-muted rounded w-full"></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredNftListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNftListings.map((nft) => (
                  <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-scale-in">
                    <CardHeader className={`pb-3 ${getNftCardColor(nft.type)}`}>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl flex items-center">
                          <Leaf className="mr-2 h-5 w-5" />
                          {nft.title}
                        </CardTitle>
                        <div className="text-sm font-medium text-foreground/70">
                          {nft.time}
                        </div>
                      </div>
                      <CardDescription className="text-foreground/90">
                        Listed by {nft.seller}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm mb-3">{nft.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="font-bold">{nft.price}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button 
                        size="sm"
                        onClick={() => buyNFT(nft.id)}
                        disabled={!walletAddress}
                      >
                        Buy Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <CardTitle className="mb-2">No NFT Listings Found</CardTitle>
                <CardDescription>
                  There are no NFT listings matching your search criteria.
                </CardDescription>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Listing</DialogTitle>
              <DialogDescription>
                List your Power Tokens for sale on the marketplace
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (PT)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (ETH)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.01"
                  step="0.001"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateListing}>
                Create Listing
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Marketplace;
