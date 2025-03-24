
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ChevronRight, Leaf, Zap } from "lucide-react";

const GetStarted = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Get Started with PowerX</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our decentralized energy trading platform and start making a positive impact on the environment
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {}
          <div className="mb-16 animate-fade-in animation-delay-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-3">
                1
              </div>
              <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
            </div>
            <div className="ml-13 pl-10 border-l border-primary/20">
              <p className="mb-4">
                To get started, you'll need to connect your cryptocurrency wallet to PowerX. We support popular wallets like MetaMask and WalletConnect.
              </p>
              <div className="bg-card rounded-lg p-6 shadow-sm mb-4">
                <h3 className="font-bold mb-2">Why connect your wallet?</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Securely authenticate your identity on the platform</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Enable buying and selling of Power Tokens</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Receive and manage Carbon Credit NFTs</span>
                  </li>
                </ul>
              </div>
              <Link to="/signin">
                <Button className="mb-6">
                  Connect Your Wallet <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {}
          <div className="mb-16 animate-fade-in animation-delay-300">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-3">
                2
              </div>
              <h2 className="text-2xl font-bold">Trade Energy Tokens</h2>
            </div>
            <div className="ml-13 pl-10 border-l border-primary/20">
              <p className="mb-4">
                Once your wallet is connected, you can start trading Power Tokens (PT) with other users on the platform.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-2">
                    <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                    <h3 className="font-bold">Buying Power</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Browse listings in the marketplace and purchase power tokens from sellers at competitive rates.
                  </p>
                </div>
                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-2">
                    <Zap className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="font-bold">Selling Power</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    List your excess power tokens for sale and set your own price based on market demand.
                  </p>
                </div>
              </div>
              <Link to="/start-trading">
                <Button className="mb-6">
                  Start Trading <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {}
          <div className="animate-fade-in animation-delay-400">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-3">
                3
              </div>
              <h2 className="text-2xl font-bold">Earn Carbon Credit NFTs</h2>
            </div>
            <div className="ml-13 pl-10">
              <p className="mb-4">
                As you participate in energy trading, you'll earn unique Carbon Credit NFTs as rewards for eco-friendly actions.
              </p>
              <div className="bg-card rounded-lg p-6 shadow-sm mb-4">
                <div className="flex items-center mb-2">
                  <Leaf className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="font-bold">Carbon Credit NFT Benefits</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Showcase your commitment to sustainable energy</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Trade NFTs in the marketplace for additional value</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Unlock platform benefits and rewards</span>
                  </li>
                </ul>
              </div>
              <Link to="/rewards">
                <Button className="mb-6">
                  View Rewards <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-16 animate-fade-in animation-delay-500">
          <h2 className="text-2xl font-bold mb-4">Ready to join PowerX?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Start your journey toward sustainable energy trading and earn rewards for your eco-conscious actions
          </p>
          <Link to="/signin">
            <Button size="lg" className="px-8">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
