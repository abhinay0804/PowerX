
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { Search, SlidersHorizontal, ShoppingCart, X } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { ProductListing, Product } from '@/components/ProductListing';
const sampleProducts: Product[] = [
  {
    id: "1",
    title: "100kWh Solar Energy Package",
    description: "Clean energy from solar farms. Purchase this package to offset your carbon footprint.",
    price: "0.05 ETH",
    image: "https://images.unsplash.com/photo-1611365892117-bce7901ffef6?q=80&w=500",
    seller: "SolarFarm DAO",
    category: "renewable",
    rating: 4.5,
    reviewCount: 128,
    available: true
  },
  {
    id: "2",
    title: "Wind Energy Credits - 200kWh",
    description: "Support wind farms and reduce your carbon footprint with these energy credits.",
    price: "0.08 ETH",
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=500",
    seller: "WindPower Collective",
    category: "renewable",
    rating: 4.8,
    reviewCount: 95,
    available: true
  },
  {
    id: "3",
    title: "Carbon Offset Certificate - Premium",
    description: "Gold-standard carbon offset certificate, verified and authenticated on blockchain.",
    price: "0.12 ETH",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=500",
    seller: "Carbon Zero Initiative",
    category: "offset",
    rating: 5.0,
    reviewCount: 42,
    available: true
  },
  {
    id: "4",
    title: "Home Solar Installation Credit",
    description: "Redeem this token for a discount on home solar panel installation by certified partners.",
    price: "0.25 ETH",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=500",
    seller: "GreenHome Solutions",
    category: "service",
    rating: 4.2,
    reviewCount: 36,
    available: true
  },
  {
    id: "5",
    title: "Biomass Energy Package - 150kWh",
    description: "Sustainable energy produced from organic materials and agricultural waste.",
    price: "0.06 ETH",
    image: "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?q=80&w=500",
    seller: "BioPower Network",
    category: "renewable",
    rating: 4.1,
    reviewCount: 63,
    available: true
  },
  {
    id: "6",
    title: "Electric Vehicle Charging Credit",
    description: "Credits for EV charging at participating stations. Powered by renewable energy.",
    price: "0.04 ETH",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba16933e3?q=80&w=500",
    seller: "EV Green Charge",
    category: "service",
    rating: 4.7,
    reviewCount: 89,
    available: false
  }
];

const categories = [
  { id: "all", name: "All Categories" },
  { id: "renewable", name: "Renewable Energy" },
  { id: "offset", name: "Carbon Offsets" },
  { id: "service", name: "Energy Services" }
];

const ProductMarketplace = () => {
  const { isAuthenticated, walletAddress } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  const [cartItems, setCartItems] = useState<string[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);
  
  const handleAddToCart = (productId: string) => {
    setCartItems([...cartItems, productId]);
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart",
    });
  };
  
  const handleViewDetails = (productId: string) => {
    toast({
      title: "View product details",
      description: `Viewing details for product ${productId}`,
    });
  };
  
  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    const productPrice = parseFloat(product.price.split(" ")[0]);
    const matchesPrice = productPrice >= priceRange[0] / 1000 && productPrice <= priceRange[1] / 1000;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Energy Marketplace</h1>
            <p className="text-muted-foreground">
              Buy and sell renewable energy credits and carbon offsets
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        <div className="mb-8 max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search energy products..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {}
          {showFilters && (
            <Card className="lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Filters</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Category</h3>
                  <Select 
                    value={selectedCategory} 
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium">Price Range (ETH)</h3>
                    <span className="text-sm text-muted-foreground">
                      {(priceRange[0] / 1000).toFixed(2)} - {(priceRange[1] / 1000).toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    defaultValue={priceRange}
                    max={100}
                    step={1}
                    onValueChange={setPriceRange}
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Availability</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="justify-start">In Stock</Button>
                    <Button variant="outline" size="sm" className="justify-start">Pre-order</Button>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline">
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          )}
          
          {}
          <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductListing
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setPriceRange([0, 100]);
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMarketplace;
