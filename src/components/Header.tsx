import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { Zap } from 'lucide-react';

const Header = () => {
  const { user, signOut } = useAuth();
  const { walletAddress, connectWallet, isConnecting } = useWallet();
  const location = useLocation();

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            PowerX
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Home
          </Link>
          {user && (
            <>
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/marketplace" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/marketplace' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Marketplace
              </Link>
              <Link 
                to="/rewards" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/rewards' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Rewards
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {!user ? (
            <Link to="/get-started">
              <Button variant="default">Get Started</Button>
            </Link>
          ) : (
            <>
              {!walletAddress ? (
                <Button 
                  onClick={handleConnectWallet} 
                  disabled={isConnecting}
                  variant="secondary"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="px-3 py-2 bg-primary/10 text-primary text-sm font-mono rounded-md border">
                    {formatWalletAddress(walletAddress)}
                  </div>
                </div>
              )}
              <Button onClick={signOut} variant="outline">
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;