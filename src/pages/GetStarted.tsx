import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { Wallet, Shield, Zap, ArrowRight } from 'lucide-react';

const GetStarted = () => {
  const { user, signUp, signIn, loading } = useAuth();
  const { walletAddress, connectWallet, isConnecting } = useWallet();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if user is authenticated and wallet is connected
  if (user && walletAddress) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsSubmitting(true);
    await signUp(email, password);
    setIsSubmitting(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsSubmitting(true);
    await signIn(email, password);
    setIsSubmitting(false);
  };

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-20">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get Started with PowerX
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join the decentralized energy revolution. Create your account and connect your wallet to start trading.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Authentication Card */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-glow">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  {!user ? 'Create Your Account' : 'Welcome Back!'}
                </CardTitle>
                <CardDescription className="text-center">
                  {!user ? 'Sign up to access the PowerX platform' : 'Connect your wallet to start trading'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <Tabs defaultValue="signup" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="signup">Sign Up</TabsTrigger>
                      <TabsTrigger value="signin">Sign In</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signup">
                      <form onSubmit={handleSignUp} className="space-y-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </Button>
                      </form>
                    </TabsContent>
                    <TabsContent value="signin">
                      <form onSubmit={handleSignIn} className="space-y-4">
                        <div>
                          <Label htmlFor="signin-email">Email</Label>
                          <Input
                            id="signin-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="signin-password">Password</Label>
                          <Input
                            id="signin-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                      <Shield className="w-8 h-8" />
                    </div>
                    <p className="text-muted-foreground">
                      Account created successfully! Now connect your wallet to start trading.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Wallet Connection Card */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-glow">
              <CardHeader>
                <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                  <Wallet className="w-6 h-6" />
                  Connect Your Wallet
                </CardTitle>
                <CardDescription className="text-center">
                  Connect a cryptocurrency wallet to trade energy tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!walletAddress ? (
                  <>
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto">
                        <Wallet className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">MetaMask Wallet</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect your MetaMask wallet to start trading energy tokens and earning carbon credits.
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleConnectWallet}
                      disabled={isConnecting || !user}
                      className="w-full"
                      size="lg"
                    >
                      {isConnecting ? 'Connecting...' : 'Connect MetaMask Wallet'}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                    {!user && (
                      <p className="text-sm text-muted-foreground text-center">
                        Please create an account first to connect your wallet.
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                      <Zap className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Wallet Connected!</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        You're all set! You can now access the dashboard and start trading.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <div className="mt-12">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-glow">
              <CardHeader>
                <CardTitle className="text-center">How to Get Started</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold">1</span>
                    </div>
                    <h3 className="font-semibold mb-2">Create Account</h3>
                    <p className="text-sm text-muted-foreground">
                      Sign up with your email to create your PowerX account
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">Connect Wallet</h3>
                    <p className="text-sm text-muted-foreground">
                      Link your MetaMask wallet to enable energy token trading
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">Start Trading</h3>
                    <p className="text-sm text-muted-foreground">
                      Access the marketplace and begin trading energy tokens
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;