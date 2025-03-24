
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Dashboard from '@/pages/Dashboard';
import GetStarted from '@/pages/GetStarted';
import Rewards from '@/pages/Rewards';
import NotFound from '@/pages/NotFound';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import Marketplace from '@/pages/Marketplace';
import StartTrading from '@/pages/StartTrading';
import ProductMarketplace from '@/pages/ProductMarketplace';
import Cart from '@/pages/Cart';
import { AuthProvider } from '@/components/AuthProvider';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/start-trading" element={<StartTrading />} />
            <Route path="/products" element={<ProductMarketplace />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
export default App;
