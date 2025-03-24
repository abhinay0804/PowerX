
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthProvider";
import { Loader2, LogOut, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { getBalance } from "@/contract";
import { toast } from "@/components/ui/use-toast";

export const WalletConnect = () => {
  const { user, isAuthenticated, isLoading, connectWallet, disconnectWallet, walletAddress } = useAuth();
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [fetchingBalance, setFetchingBalance] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (walletAddress) {
        try {
          setFetchingBalance(true);
          const balance = await getBalance();
          setTokenBalance(balance);
        } catch (error) {
          console.error("Error fetching balance:", error);
        } finally {
          setFetchingBalance(false);
        }
      }
    };

    fetchBalance();
  }, [walletAddress]);

  if (isLoading || fetchingBalance) {
    return (
      <Button disabled variant="outline" size="sm" className="min-w-[140px]">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading
      </Button>
    );
  }

  if (isAuthenticated && walletAddress) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center bg-secondary px-3 py-1.5 rounded-md">
          <span className="text-sm font-medium text-secondary-foreground">
            {tokenBalance ? `${tokenBalance} PT` : user?.balance}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={disconnectWallet}
          className="group relative overflow-hidden transition-all duration-300"
        >
          <span className="flex items-center gap-2 group-hover:translate-y-[-100%] transition-transform duration-300">
            {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
          </span>
          <span className="absolute inset-0 flex items-center justify-center translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300">
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </span>
        </Button>
      </div>
    );
  }

  return (
    <Button 
      size="sm" 
      onClick={connectWallet}
      className="group relative overflow-hidden transition-all duration-300 bg-primary/90 hover:bg-primary"
    >
      <span className="flex items-center gap-2">
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </span>
      <span className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
    </Button>
  );
};
