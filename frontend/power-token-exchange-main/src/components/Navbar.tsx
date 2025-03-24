
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { WalletConnect } from "./WalletConnect";
import { useAuth } from "./AuthProvider";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm dark:bg-black/50" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent"
            >
              PowerX
            </Link>
          </div>

          {/*desktop navigation*/}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/" className="nav-item">Home</Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="nav-item">Dashboard</Link>
                <Link to="/marketplace" className="nav-item">Marketplace</Link>
                <Link to="/rewards" className="nav-item">Rewards</Link>
              </>
            )}
            <Link to="/about" className="nav-item">About</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <WalletConnect />
          </div>

          {/*mobile menu btn*/}
          <button 
            className="md:hidden flex items-center" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/*mobile nav*/}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel animate-fade-in">
          <div className="space-y-1 px-4 py-5">
            <Link 
              to="/" 
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className="block py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/marketplace" 
                  className="block py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Marketplace
                </Link>
                <Link 
                  to="/rewards" 
                  className="block py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Rewards
                </Link>
              </>
            )}
            <Link 
              to="/about" 
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-3">
              <WalletConnect />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
