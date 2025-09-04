import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { supabase } from '@/integrations/supabase/client';
import { Search, Plus, Zap, Leaf, TrendingUp, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface Listing {
  id: string;
  listing_type: string;
  amount: number;
  price_per_unit: number;
  total_value: number;
  created_at: string;
}

const Marketplace = () => {
  const { user } = useAuth();
  const { walletAddress } = useWallet();
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newListing, setNewListing] = useState({
    type: 'power_token',
    amount: '',
    price: ''
  });

  // Redirect if not authenticated or no wallet
  if (!user || !walletAddress) {
    return <Navigate to="/get-started" replace />;
  }

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load marketplace listings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async () => {
    if (!newListing.amount || !newListing.price) {
      toast.error('Please fill in all fields');
      return;
    }

    const amount = parseFloat(newListing.amount);
    const price = parseFloat(newListing.price);
    const totalValue = amount * price;

    try {
      const { error } = await supabase
        .from('listings')
        .insert([{
          seller_id: user.id,
          listing_type: newListing.type as 'power_token' | 'carbon_credit',
          amount: amount,
          price_per_unit: price,
          total_value: totalValue,
          is_active: true
        }]);

      if (error) throw error;

      toast.success('Listing created successfully!');
      setCreateModalOpen(false);
      setNewListing({ type: 'power_token', amount: '', price: '' });
      fetchListings();
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing');
    }
  };

  const handleBuyListing = async (listing: Listing) => {
    if (!user || !walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          transaction_type: 'buy' as 'buy' | 'sell' | 'transfer',
          amount: listing.amount,
          price_per_unit: listing.price_per_unit,
          total_cost: listing.total_value,
          token_type: listing.listing_type as 'power_token' | 'carbon_credit'
        }]);

      if (transactionError) throw transactionError;

      // Deactivate the listing
      const { error: listingError } = await supabase
        .from('listings')
        .update({ is_active: false })
        .eq('id', listing.id);

      if (listingError) throw listingError;

      // Update user profile with new balances (simplified)
      // Get current profile to update balances
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const updatedProfile = {
        total_transactions: (currentProfile?.total_transactions || 0) + 1,
        power_token_balance: listing.listing_type === 'power_token' 
          ? (currentProfile?.power_token_balance || 0) + listing.amount - listing.total_value  // Add tokens but deduct cost
          : (currentProfile?.power_token_balance || 0) - listing.total_value,  // Just deduct cost
        carbon_credits: listing.listing_type === 'carbon_credit'
          ? (currentProfile?.carbon_credits || 0) + listing.amount
          : currentProfile?.carbon_credits || 0
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      toast.success('Purchase successful!');
      fetchListings();
    } catch (error) {
      console.error('Error buying listing:', error);
      toast.error('Failed to complete purchase');
    }
  };

  const filteredListings = listings.filter(listing =>
    listing.listing_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const powerTokenListings = filteredListings.filter(l => l.listing_type === 'power_token');
  const carbonCreditListings = filteredListings.filter(l => l.listing_type === 'carbon_credit');

  const ListingCard = ({ listing }: { listing: Listing }) => (
    <Card className="hover:shadow-card transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {listing.listing_type === 'power_token' ? (
              <Zap className="w-5 h-5 text-primary" />
            ) : (
              <Leaf className="w-5 h-5 text-secondary" />
            )}
            {listing.listing_type === 'power_token' ? 'Power Token' : 'Carbon Credit'}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {new Date(listing.created_at).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-medium">{listing.amount} units</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price per unit:</span>
            <span className="font-medium">${listing.price_per_unit}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-primary">${listing.total_value.toFixed(2)}</span>
          </div>
          <Button 
            onClick={() => handleBuyListing(listing)}
            className="w-full"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading marketplace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Marketplace</h1>
            <p className="text-muted-foreground">
              Trade energy tokens and carbon credits with other users
            </p>
          </div>
          <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Listing
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Listing</DialogTitle>
                <DialogDescription>
                  List your energy tokens or carbon credits for sale
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Type</Label>
                  <Select 
                    value={newListing.type} 
                    onValueChange={(value) => setNewListing({...newListing, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="power_token">Power Token</SelectItem>
                      <SelectItem value="carbon_credit">Carbon Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={newListing.amount}
                    onChange={(e) => setNewListing({...newListing, amount: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Price per unit ($)</Label>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    value={newListing.price}
                    onChange={(e) => setNewListing({...newListing, price: e.target.value})}
                  />
                </div>
                {newListing.amount && newListing.price && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Total Value:</span>
                      <span className="font-bold">
                        ${(parseFloat(newListing.amount) * parseFloat(newListing.price)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleCreateListing}>Create Listing</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search marketplace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Marketplace Tabs */}
        <Tabs defaultValue="power_tokens" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="power_tokens" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Power Tokens ({powerTokenListings.length})
            </TabsTrigger>
            <TabsTrigger value="carbon_credits" className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Carbon Credits ({carbonCreditListings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="power_tokens" className="mt-6">
            {powerTokenListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {powerTokenListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Zap className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Power Token listings</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'No listings match your search.' : 'Be the first to create a Power Token listing!'}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="carbon_credits" className="mt-6">
            {carbonCreditListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {carbonCreditListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Leaf className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Carbon Credit listings</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'No listings match your search.' : 'Be the first to create a Carbon Credit listing!'}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Marketplace;