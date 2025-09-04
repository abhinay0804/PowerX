import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { supabase } from '@/integrations/supabase/client';
import { Battery, Leaf, TrendingUp, Zap, Activity, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TransactionDetailModal } from '@/components/TransactionDetailModal';

interface Profile {
  power_token_balance: number;
  carbon_credits: number;
  total_transactions: number;
  energy_saved_kwh: number;
}

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  price_per_unit: number;
  total_cost: number;
  token_type: string;
  created_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { walletAddress } = useWallet();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Redirect if not authenticated or no wallet
  if (!user || !walletAddress) {
    return <Navigate to="/get-started" replace />;
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }

        // Fetch recent transactions
        const { data: transactionData } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (transactionData) {
          setTransactions(transactionData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.id]);

  // Sample data for the chart when no transactions exist
  const chartData = transactions.length > 0 
    ? transactions.slice(-7).map((tx, index) => ({
        day: `Day ${index + 1}`,
        energy: tx.amount,
      }))
    : [];

  const stats = [
    {
      title: "Power Token Balance",
      value: profile?.power_token_balance?.toFixed(2) || "0.00",
      icon: <Zap className="w-5 h-5" />,
      unit: "PWR"
    },
    {
      title: "Carbon Credits",
      value: profile?.carbon_credits?.toString() || "0",
      icon: <Leaf className="w-5 h-5" />,
      unit: "Credits"
    },
    {
      title: "Total Transactions",
      value: profile?.total_transactions?.toString() || "0",
      icon: <TrendingUp className="w-5 h-5" />,
      unit: ""
    },
    {
      title: "Energy Saved",
      value: profile?.energy_saved_kwh?.toFixed(1) || "0.0",
      icon: <Battery className="w-5 h-5" />,
      unit: "kWh"
    }
  ];

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your energy trading overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-card transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value} {stat.unit && <span className="text-sm font-normal">{stat.unit}</span>}
                    </p>
                  </div>
                  <div className="text-primary">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Energy Trading Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Energy Trading Activity
              </CardTitle>
              <CardDescription>
                Your energy trading activity over the last 7 transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="energy" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No trading activity yet.</p>
                    <p className="text-sm">Start trading to see your activity here!</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest energy trading transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleTransactionClick(transaction)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.transaction_type === 'buy' ? 'bg-primary/10 text-primary' : 
                          transaction.transaction_type === 'sell' ? 'bg-secondary/10 text-secondary' : 
                          'bg-accent/10 text-accent'
                        }`}>
                          {transaction.transaction_type === 'buy' ? <TrendingUp className="w-5 h-5" /> : 
                           transaction.transaction_type === 'sell' ? <TrendingUp className="w-5 h-5 rotate-180" /> : 
                           <Zap className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium capitalize">
                            {transaction.transaction_type} {transaction.token_type.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.amount} units at ${transaction.price_per_unit}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${transaction.total_cost.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No transactions yet.</p>
                    <p className="text-sm">Start trading to see your transactions here!</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Transaction Detail Modal */}
        <TransactionDetailModal
          transaction={selectedTransaction}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Dashboard;