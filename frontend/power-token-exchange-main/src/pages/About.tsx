
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Award, Leaf, Lightbulb, RefreshCw, Shield, Users } from "lucide-react";
const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About PowerX</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Revolutionizing energy trading through blockchain technology and sustainable rewards.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/get-started">
              <Button size="lg">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button variant="outline" size="lg">
                Explore Marketplace
              </Button>
            </Link>
          </div>
        </section>
        
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg mb-4">
                At PowerX, we're on a mission to democratize energy trading and accelerate the transition to renewable energy sources. By leveraging blockchain technology, we're making it possible for anyone to participate in the energy market.
              </p>
              <p className="text-lg mb-6">
                Our platform allows users to buy and sell energy directly, eliminating intermediaries and reducing costs. We also incentivize sustainable practices through our unique Carbon Credit NFT rewards system.
              </p>
              <div className="flex items-center space-x-2">
                <Leaf className="text-green-500 h-5 w-5" />
                <span className="font-medium">Committed to a sustainable future</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-background/80 backdrop-blur">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Users className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-bold">P2P Trading</h3>
                    <p className="text-sm text-muted-foreground">Direct energy exchange between users</p>
                  </CardContent>
                </Card>
                <Card className="bg-background/80 backdrop-blur">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Award className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-bold">Carbon Credits</h3>
                    <p className="text-sm text-muted-foreground">Earn NFTs for sustainable actions</p>
                  </CardContent>
                </Card>
                <Card className="bg-background/80 backdrop-blur">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Shield className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-bold">Secure</h3>
                    <p className="text-sm text-muted-foreground">Blockchain-based security</p>
                  </CardContent>
                </Card>
                <Card className="bg-background/80 backdrop-blur">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <RefreshCw className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-bold">Transparent</h3>
                    <p className="text-sm text-muted-foreground">All transactions visible on-chain</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Connect Your Wallet</h3>
              <p className="text-muted-foreground">
                Sign up and connect your crypto wallet to securely access the platform.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <RefreshCw className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Trade Energy Tokens</h3>
              <p className="text-muted-foreground">
                Buy or sell energy tokens representing real electricity in our marketplace.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Earn Carbon Credits</h3>
              <p className="text-muted-foreground">
                Receive unique NFT rewards for participating in eco-friendly energy trading.
              </p>
            </div>
          </div>
        </section>
        
        <section className="bg-primary/5 p-10 rounded-2xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Join the Energy Revolution</h2>
            <p className="text-lg mb-8">
              Be part of a community that's reshaping how energy is traded and consumed around the world.
            </p>
            <Link to="/signup">
              <Button size="lg">
                Create Your Account Today
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="py-12 bg-secondary mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mb-2">PowerX</h2>
              <p className="text-muted-foreground">Decentralized Energy Trading Platform</p>
            </div>
            <div className="mt-6 md:mt-0 flex flex-col md:flex-row gap-4">
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/get-started" className="text-muted-foreground hover:text-primary transition-colors">
                Get Started
              </Link>
              <Link to="/signin" className="text-muted-foreground hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link to="/marketplace" className="text-muted-foreground hover:text-primary transition-colors">
                Marketplace
              </Link>
            </div>
            <div className="mt-6 md:mt-0">
              <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} PowerX. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
