
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bolt, CreditCard, History, Leaf, TrendingUp } from "lucide-react";
import { getBalance } from "@/contract";
import { NFTDisplay } from "@/components/NFTDisplay";
import { getUserTransactions, Transaction } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { getUserTransactions as getLocalUserTransactions } from '@/lib/localStorage';
import { toast } from '@/components/ui/use-toast';
const energyData = [
  { name: 'Jan', amount: 400 },
  { name: 'Feb', amount: 300 },
  { name: 'Mar', amount: 600 },
  { name: 'Apr', amount: 800 },
  { name: 'May', amount: 500 },
  { name: 'Jun', amount: 900 },
  { name: 'Jul', amount: 1100 },
];
const Dashboard = () => {
  const { isAuthenticated, user, walletAddress } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        try {
          if (walletAddress) {
            const tokenBalance = await getBalance();
            setBalance(tokenBalance);
          }
        } catch (error) {
          console.error("Error fetching on-chain balance:", error);
          setBalance(user.balance);
        }
        try {
          const userTrades = await getUserTransactions(user.id);
          setTransactions(userTrades);
        } catch (error) {
          console.error("Error fetching Supabase transactions:", error);
          const localTrades = getLocalUserTransactions(user.id);
          setTransactions(localTrades as Transaction[]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Data Fetch Error",
          description: "Using local data for display",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [walletAddress, user]);

  if (!isAuthenticated || !user) {
    return null;
  }
  const formattedTransactions = transactions.slice(0, 4).map(tx => ({
    id: tx.id,
    type: tx.transaction_type === 'buy' ? 'Purchased' : 
          tx.transaction_type === 'sell' ? 'Sold' : 'Transferred',
    amount: tx.token_type === 'power' ? `${tx.amount} PT` : tx.token_id || 'NFT',
    from: tx.counterparty || 'System',
    date: formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your power tokens and carbon credit NFTs
          </p>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Power Token Balance
              </CardTitle>
              <Bolt className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "Loading..." : balance || user.balance}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 inline mr-1 text-green-500" />
                +5% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="animate-scale-in animation-delay-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Carbon Credits
              </CardTitle>
              <Leaf className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : "3"}</div>
              <p className="text-xs text-muted-foreground mt-1">
                NFTs earned for sustainable trading
              </p>
            </CardContent>
          </Card>

          <Card className="animate-scale-in animation-delay-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Transactions
              </CardTitle>
              <CreditCard className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {new Set(transactions.map(t => t.counterparty || '')).size} different users
              </p>
            </CardContent>
          </Card>

          <Card className="animate-scale-in animation-delay-400">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Energy Saved
              </CardTitle>
              <Bolt className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">125 kWh</div>
              <p className="text-xs text-muted-foreground mt-1">
                Equivalent to 62kg CO2 reduction
              </p>
            </CardContent>
          </Card>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 overflow-hidden animate-fade-in">
            <CardHeader>
              <CardTitle>Energy Trading Activity</CardTitle>
              <CardDescription>Your token trading over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={energyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorUv)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in animation-delay-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Recent Activity</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formattedTransactions.length > 0 ? (
                  formattedTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between border-b border-border pb-2">
                      <div>
                        <p className="font-medium">{transaction.type} {transaction.amount}</p>
                        <p className="text-xs text-muted-foreground">
                          From: {transaction.from}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">{transaction.date}</div>
                    </div>
                  ))
                ) : loading ? (
                  <p className="text-muted-foreground">Loading transactions...</p>
                ) : (
                  <p className="text-muted-foreground">No recent transactions found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">Your Carbon Credit NFTs</h2>
          <NFTDisplay showActions={false} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
