
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ShoppingCart, Trash2, CreditCard } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
const cartData = [
  {
    id: "1",
    title: "100kWh Solar Energy Package",
    price: "0.05 ETH",
    quantity: 1,
    image: "https://images.unsplash.com/photo-1611365892117-bce7901ffef6?q=80&w=500",
  },
  {
    id: "3",
    title: "Carbon Offset Certificate - Premium",
    price: "0.12 ETH",
    quantity: 2,
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=500",
  }
];

const Cart = () => {
  const { isAuthenticated, walletAddress } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cart, setCart] = useState(cartData);
  const [promoCode, setPromoCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const subtotal = cart.reduce((acc, item) => {
    const price = parseFloat(item.price.split(" ")[0]) * item.quantity;
    return acc + price;
  }, 0);
  
  const fees = subtotal * 0.02;
  const total = subtotal + fees;
  
  const handleRemoveItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    });
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };
  
  const handleCheckout = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to complete the purchase",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Order successful!",
        description: "Your purchase has been completed",
      });
      
      setCart([]);
      navigate('/dashboard');
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order",
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
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 mr-4"
            onClick={() => navigate('/products')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Button>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>
        
        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Your Items ({cart.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-16 w-16 rounded overflow-hidden bg-gray-100">
                                <img 
                                  src={item.image} 
                                  alt={item.title} 
                                  className="h-full w-full object-cover" 
                                />
                              </div>
                              <div>
                                <p className="font-medium">{item.title}</p>
                                <p className="text-sm text-muted-foreground">ID: {item.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 rounded-r-none"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                -
                              </Button>
                              <div className="h-8 px-3 flex items-center justify-center border-y border-input">
                                {item.quantity}
                              </div>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 rounded-l-none"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>{item.price}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            {}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{subtotal.toFixed(3)} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee (2%)</span>
                    <span>{fees.toFixed(3)} ETH</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{total.toFixed(3)} ETH</span>
                  </div>
                  
                  <div className="pt-4">
                    <p className="text-sm mb-2">Promo Code</p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button variant="outline">Apply</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isProcessing || !walletAddress}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {isProcessing ? 'Processing...' : 'Checkout'}
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>By completing this purchase, you agree to our terms of service and privacy policy.</p>
              </div>
            </div>
          </div>
        ) : (
          <Card className="w-full max-w-md mx-auto text-center p-8">
            <div className="flex justify-center mb-4">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardTitle className="mb-2">Your cart is empty</CardTitle>
            <CardDescription className="mb-6">
              Looks like you haven't added any energy products to your cart yet.
            </CardDescription>
            <Button onClick={() => navigate('/products')}>
              Browse Marketplace
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Cart;
