import { HeroSection } from "@/components/HeroSection";
import { Features } from "@/components/Features";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <Features />
      
      {}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to start trading?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join our platform today and start trading energy tokens while earning carbon credit rewards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Create Account <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/get-started">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="py-12 bg-secondary">
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
              <Link to="/signup" className="text-muted-foreground hover:text-primary transition-colors">
                Sign Up
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

export default Index;
