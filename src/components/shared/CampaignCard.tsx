import { Campaign } from '@/src/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Flame, Sparkles, Share2, Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const [showShare, setShowShare] = useState(false);
  const progress = Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100);

  const copyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/campaign/${campaign.id}`);
    toast.success('Link copied to clipboard!');
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group bg-card rounded-[3rem] border-2 border-border overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative"
    >
      <div className="relative aspect-[16/11] overflow-hidden m-5 rounded-[2.2rem]">
        <img 
          src={campaign.imageUrl} 
          alt={campaign.title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-5 left-5 flex gap-2">
          <Badge className="bg-primary text-white border-none font-black text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 shadow-lg">
            {campaign.category}
          </Badge>
          {campaign.isAiOptimized && (
            <Badge className="bg-secondary text-secondary-foreground border-none font-black text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 shadow-lg">
              AI Optimized
            </Badge>
          )}
        </div>
        
        <button 
          onClick={copyLink}
          className="absolute top-5 right-5 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary hover:scale-110 transition-all shadow-xl"
        >
          <Share2 className="w-5 h-5" />
        </button>

        {campaign.urgency === 'high' && (
          <div className="absolute bottom-5 left-5 bg-orange-500 text-white px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 font-black text-[10px] uppercase tracking-widest animate-pulse">
            <Flame className="w-3.5 h-3.5" /> High Priority
          </div>
        )}
      </div>

      <div className="px-8 pb-10 flex-1 flex flex-col">
        <div className="mb-6">
          <h3 className="text-3xl font-black tracking-tighter mb-4 group-hover:text-primary transition-colors leading-[0.95] line-clamp-2">
            {campaign.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 font-medium leading-relaxed italic border-l-4 border-secondary pl-4">
            "{campaign.shortDescription}"
          </p>
        </div>

        <div className="space-y-6 mb-10 bg-secondary/10 p-6 rounded-[2rem] border border-secondary/20">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-4xl font-black text-foreground tracking-tighter">₦{campaign.raisedAmount.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.15em] mt-1">Raised / Target ₦{campaign.targetAmount.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-primary font-black text-xl leading-none">{Math.round(progress)}%</p>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Goal</p>
            </div>
          </div>
          <div className="h-4 w-full bg-secondary/30 rounded-full overflow-hidden p-1 border border-secondary/20">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
            />
          </div>
          <div className="flex items-center justify-between text-muted-foreground pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">{campaign.donorCount} Donors</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-auto">
          <Link to={`/campaign/${campaign.id}`} className="block">
            <Button 
              className="w-full h-16 bg-primary text-white hover:bg-primary/90 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95"
            >
              Donate Now
            </Button>
          </Link>
          <Button 
            variant="outline"
            onClick={copyLink}
            className="w-full h-16 border-2 border-border hover:bg-secondary rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" /> Share
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

