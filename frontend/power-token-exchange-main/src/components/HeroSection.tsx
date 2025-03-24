
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bolt, Globe, Leaf } from "lucide-react";

export const HeroSection = () => {
  const { connectWallet, isAuthenticated } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/*background ele*/}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl animate-pulse-subtle"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full filter blur-3xl animate-pulse-subtle animation-delay-1000"></div>
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/5 rounded-full opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/10 rounded-full opacity-30"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/20 rounded-full opacity-40"></div>

      {/*floating icons*/}
      <div className="absolute top-1/4 left-1/4 p-4 bg-white/20 backdrop-blur-md rounded-full shadow-lg animate-float">
        <Bolt className="h-8 w-8 text-primary" />
      </div>
      <div className="absolute bottom-1/3 right-1/4 p-4 bg-white/20 backdrop-blur-md rounded-full shadow-lg animate-float animation-delay-1000">
        <Leaf className="h-8 w-8 text-green-500" />
      </div>
      <div className="absolute top-1/3 right-1/3 p-4 bg-white/20 backdrop-blur-md rounded-full shadow-lg animate-float animation-delay-2000">
        <Globe className="h-8 w-8 text-blue-500" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 border border-primary/20 rounded-full bg-primary/5 backdrop-blur-sm">
            <span className="text-sm font-medium text-primary">Decentralized Energy Trading</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-slide-up">
            Trade Power. Earn Rewards. 
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent"> Save the Planet.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto animate-slide-up animation-delay-200">
            Join our revolutionary P2P energy trading platform where you can trade power tokens and earn carbon credit NFTs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up animation-delay-300">
            {!isAuthenticated ? (
              <>
                <Button 
                  onClick={connectWallet} 
                  size="lg" 
                  className="group relative overflow-hidden button-primary text-lg"
                >
                  <span className="relative z-10 flex items-center">
                    Connect Wallet
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg"
                >
                  Learn More
                </Button>
              </>
            ) : (
              <Button 
                size="lg" 
                className="group relative overflow-hidden button-primary text-lg"
                onClick={() => window.location.href = '/dashboard'}
              >
                <span className="relative z-10 flex items-center">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            )}
          </div>
        </div>
        
        {/*stats sec*/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto glass-panel rounded-2xl p-6 backdrop-blur-md">
          <div className="text-center p-4">
            <p className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">20K+</p>
            <p className="text-muted-foreground">Users Trading Energy</p>
          </div>
          <div className="text-center p-4">
            <p className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">100M+</p>
            <p className="text-muted-foreground">Power Tokens Exchanged</p>
          </div>
          <div className="text-center p-4">
            <p className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">5K+</p>
            <p className="text-muted-foreground">Carbon Credit NFTs</p>
          </div>
        </div>
      </div>

      {/*bottom decoration*/}
      <div className="absolute -bottom-10 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};
