import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { Zap, Leaf, Shield, TrendingUp, ArrowRight, Users, Globe, Battery } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const { walletAddress, connectWallet, isConnecting } = useWallet();

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  const scrollToHowItWorks = () => {
    console.log('Learn More button clicked');
    const element = document.getElementById('how-it-works');
    console.log('Element found:', element);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      console.log('Scrolling to How It Works section');
    } else {
      console.log('Element with id "how-it-works" not found');
    }
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Decentralized Trading",
      description: "Trade energy tokens directly with other users without intermediaries"
    },
    {
      icon: <Leaf className="w-8 h-8 text-primary" />,
      title: "Carbon Credits",
      description: "Earn and trade carbon credit NFTs for your sustainable energy contributions"
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Blockchain Security",
      description: "All transactions secured by blockchain technology and smart contracts"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Real-time Analytics",
      description: "Track your energy trading performance and environmental impact"
    }
  ];

  const stats = [
    { icon: <Users className="w-6 h-6" />, label: "Active Traders", value: "10,000+" },
    { icon: <Globe className="w-6 h-6" />, label: "Countries", value: "50+" },
    { icon: <Battery className="w-6 h-6" />, label: "Energy Traded", value: "1M kWh" },
    { icon: <Leaf className="w-6 h-6" />, label: "CO2 Offset", value: "500T" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              PowerX: Revolutionizing Energy Trading with{' '}
              <span className="bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent">
                Blockchain
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join the future of sustainable energy trading. Buy, sell, and trade renewable energy 
              tokens while earning carbon credits through our decentralized marketplace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!user ? (
                <>
                  <Link to="/get-started">
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-glow">
                      Get Started <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10"
                    onClick={scrollToHowItWorks}
                  >
                    Learn More
                  </Button>
                </>
              ) : !walletAddress ? (
                <Button 
                  size="lg" 
                  onClick={handleConnectWallet} 
                  disabled={isConnecting}
                  className="bg-white text-primary hover:bg-white/90 shadow-glow"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Link to="/dashboard">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-glow">
                    Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2 text-primary">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform makes energy trading simple, secure, and sustainable through blockchain technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-card transition-all duration-300 border-primary/20">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Start Trading Energy?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of traders already making a difference in the renewable energy market
          </p>
          {!user && (
            <Link to="/get-started">
              <Button size="lg" variant="secondary" className="shadow-glow">
                Join PowerX Today <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
