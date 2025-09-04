import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Leaf, Calendar, Hash, TreePine, Award } from 'lucide-react';

interface CarbonCreditNFT {
  id: string;
  title: string;
  description: string;
  carbon_offset_amount: number;
  image_url: string;
  nft_status: string;
  minted_at: string;
  acquired_at: string;
}

interface NFTDetailModalProps {
  nft: CarbonCreditNFT | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NFTDetailModal: React.FC<NFTDetailModalProps> = ({
  nft,
  isOpen,
  onClose
}) => {
  if (!nft) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            NFT Details
          </DialogTitle>
          <DialogDescription>
            Complete information about your carbon credit NFT
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* NFT Image/Visual */}
          <div className="w-full h-32 bg-gradient-primary rounded-lg flex items-center justify-center">
            {nft.image_url ? (
              <img src={nft.image_url} alt={nft.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="text-center text-white">
                <TreePine className="w-12 h-12 mx-auto mb-2" />
                <div className="text-sm">Carbon Credit NFT</div>
              </div>
            )}
          </div>

          {/* NFT ID */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Hash className="w-4 h-4" />
              NFT ID
            </div>
            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
              {nft.id.slice(0, 8)}...
            </code>
          </div>

          <Separator />

          {/* NFT Basic Info */}
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                {nft.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {nft.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant="outline" className="capitalize">
                {nft.nft_status}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Carbon Offset</span>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {nft.carbon_offset_amount} tons CO₂
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Minted
              </div>
              <span className="text-sm">
                {new Date(nft.minted_at).toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Acquired
              </div>
              <span className="text-sm">
                {new Date(nft.acquired_at).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Environmental Impact</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This NFT represents {nft.carbon_offset_amount} tons of CO₂ offset, contributing to a cleaner environment and sustainable future.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};