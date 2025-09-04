import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Zap, Leaf, TrendingUp, Calendar, DollarSign, Hash } from 'lucide-react';

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  price_per_unit: number;
  total_cost: number;
  token_type: string;
  created_at: string;
}

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  isOpen,
  onClose
}) => {
  if (!transaction) return null;

  const getTransactionIcon = () => {
    if (transaction.transaction_type === 'buy') return <TrendingUp className="w-5 h-5 text-primary" />;
    if (transaction.transaction_type === 'sell') return <TrendingUp className="w-5 h-5 rotate-180 text-secondary" />;
    return <Zap className="w-5 h-5 text-accent" />;
  };

  const getTokenIcon = () => {
    return transaction.token_type === 'power_token' 
      ? <Zap className="w-4 h-4" />
      : <Leaf className="w-4 h-4" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTransactionIcon()}
            Transaction Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this transaction
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Transaction ID */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Hash className="w-4 h-4" />
              Transaction ID
            </div>
            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
              {transaction.id.slice(0, 8)}...
            </code>
          </div>

          <Separator />

          {/* Transaction Type & Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Type</span>
              <Badge variant="outline" className="capitalize">
                {transaction.transaction_type}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Token</span>
              <div className="flex items-center gap-2">
                {getTokenIcon()}
                <span className="text-sm capitalize">
                  {transaction.token_type.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Transaction Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="font-medium">{transaction.amount} units</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Price per Unit</span>
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                <span className="font-medium">{transaction.price_per_unit.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold">Total Cost</span>
              <div className="flex items-center gap-1 text-primary">
                <DollarSign className="w-4 h-4" />
                <span className="font-bold">{transaction.total_cost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Date & Time
            </div>
            <span className="text-sm">
              {new Date(transaction.created_at).toLocaleString()}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};