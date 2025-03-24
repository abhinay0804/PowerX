
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Bolt, Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { buyPowerTokens, sellPowerTokens } from "@/contract";

const StartTrading = () => {
  const { isAuthenticated, user, walletAddress } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  if (!isAuthenticated) {
    navigate("/signin");
    return null;
  }

  const handleTrade = async (type: 'buy' | 'sell') => {
    if (!amount || !price) {
      toast({
        title: "Missing information",
        description: "Please enter both amount and price",
        variant: "destructive",
      });
      return;
    }

    if (!walletAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to trade",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const amountValue = Number(amount);
      
      if (type === 'buy') {
        const txHash = await buyPowerTokens(amountValue);
        toast({
          title: "Purchase successful",
          description: `Transaction hash: ${txHash.substring(0, 10)}...${txHash.substring(txHash.length - 4)}`,
        });
      } else {
        const txHash = await sellPowerTokens(amountValue);
        toast({
          title: "Sell order successful",
          description: `Transaction hash: ${txHash.substring(0, 10)}...${txHash.substring(txHash.length - 4)}`,
        });
      }
      setAmount("");
      setPrice("");
      setTimeout(() => {
        navigate("/marketplace");
      }, 1500);
    } catch (error: any) {
      console.error("Trade error:", error);
      toast({
        title: `${type === 'buy' ? 'Purchase' : 'Sell'} failed`,
        description: error.message || "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Start Trading</h1>
          <p className="text-muted-foreground">
            Buy or sell Power Tokens on the decentralized marketplace
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/*trading form*/}
          <div className="md:col-span-2 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Create a new order</CardTitle>
                <CardDescription>
                  Choose whether you want to buy or sell Power Tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="buy" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="buy">Buy Power Tokens</TabsTrigger>
                    <TabsTrigger value="sell">Sell Power Tokens</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="buy" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="buy-amount">Amount (PT)</Label>
                      <div className="relative">
                        <Bolt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-yellow-500" />
                        <Input
                          id="buy-amount"
                          type="number"
                          placeholder="100"
                          className="pl-10"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          disabled={isProcessing}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="buy-price">Price per PT (ETH)</Label>
                      <Input
                        id="buy-price"
                        type="number"
                        placeholder="0.01"
                        step="0.001"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        disabled={isProcessing}
                      />
                    </div>
                    
                    <div className="bg-secondary/30 p-4 rounded-md flex items-start space-x-2">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Estimated Total</p>
                        <p className="text-sm text-muted-foreground">
                          {amount && price 
                            ? `${(parseFloat(amount) * parseFloat(price)).toFixed(6)} ETH` 
                            : '0.00 ETH'}
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => handleTrade('buy')}
                      disabled={isProcessing || !walletAddress}
                    >
                      {isProcessing ? 'Processing...' : 'Place Buy Order'}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="sell" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sell-amount">Amount (PT)</Label>
                      <div className="relative">
                        <Bolt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-yellow-500" />
                        <Input
                          id="sell-amount"
                          type="number"
                          placeholder="100"
                          className="pl-10"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          disabled={isProcessing}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sell-price">Price per PT (ETH)</Label>
                      <Input
                        id="sell-price"
                        type="number"
                        placeholder="0.01"
                        step="0.001"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        disabled={isProcessing}
                      />
                    </div>
                    
                    <div className="bg-secondary/30 p-4 rounded-md flex items-start space-x-2">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Estimated Earnings</p>
                        <p className="text-sm text-muted-foreground">
                          {amount && price 
                            ? `${(parseFloat(amount) * parseFloat(price)).toFixed(6)} ETH` 
                            : '0.00 ETH'}
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => handleTrade('sell')}
                      disabled={isProcessing || !walletAddress}
                    >
                      {isProcessing ? 'Processing...' : 'Place Sell Order'}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-6">
                <p>Trading fee: 0.1%</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/marketplace")}
                  disabled={isProcessing}
                >
                  View Market
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/*trading info*/}
          <div className="animate-fade-in animation-delay-200">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Balance</span>
                  <span className="font-medium">{user?.balance}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Wallet Address</span>
                  <span className="font-medium text-xs">
                    {walletAddress ? (
                      `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
                    ) : (
                      'Not connected'
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Active Orders</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Completed Trades</span>
                  <span className="font-medium">0</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/dashboard")}
                >
                  View Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/rewards")}
                >
                  View Rewards
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Market Trends</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Current Avg. Price</span>
                  <span className="font-medium text-green-500">0.0075 ETH</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">24h Change</span>
                  <span className="font-medium text-green-500">+2.5%</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">24h Volume</span>
                  <span className="font-medium">15,750 PT</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Active Listings</span>
                  <span className="font-medium">87</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartTrading;
