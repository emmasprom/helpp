import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment, addDoc, collection } from 'firebase/firestore';
import { db, auth } from '@/src/lib/firebase';
import { handleFirestoreError, OperationType } from '@/src/lib/firestore-errors';
import { Campaign } from '@/src/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Share2, 
  Clock, 
  Users, 
  ShieldCheck, 
  ChevronLeft,
  ArrowRight,
  Flame,
  Sparkles,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export default function CampaignDetail() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(5000);
  const [donating, setDonating] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchCampaign = async () => {
      try {
        const docRef = doc(db, 'campaigns', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCampaign({ id: docSnap.id, ...docSnap.data() } as Campaign);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `campaigns/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const handleDonate = async () => {
    if (!auth.currentUser) {
      toast.error('Please sign in to donate');
      return;
    }
    setDonating(true);
    try {
      // 1. Initialize Paystack Transaction via our Backend
      const response = await axios.post('/api/payments/initialize', {
        email: auth.currentUser.email,
        amount: amount,
        metadata: {
          campaignId: id,
          donorId: auth.currentUser.uid,
          campaignTitle: campaign?.title
        }
      });

      if (response.data.status) {
        // Redirection to Paystack checkout
        window.location.href = response.data.data.authorization_url;
      }
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast.error('Payment initialization failed');
    } finally {
      setDonating(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  if (loading) return <div className="h-screen flex items-center justify-center pt-16 font-medium text-muted-foreground italic">Retrieving mission details...</div>;
  if (!campaign) return <div className="h-screen flex items-center justify-center pt-16 text-muted-foreground font-black uppercase tracking-widest">Mission not found.</div>;

  const progress = Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100);

  return (
    <div className="pb-20 max-w-7xl mx-auto px-4">
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group font-bold uppercase text-[10px] tracking-widest">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to missions
      </Link>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="aspect-video rounded-[2.5rem] overflow-hidden border border-border relative group shadow-2xl"
          >
            <img src={campaign.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={campaign.title} />
            <div className="absolute top-6 left-6 flex gap-2">
               <Badge className="bg-background/80 backdrop-blur-md text-foreground border-border px-3 py-1 font-black text-[10px] uppercase tracking-widest">
                  {campaign.category}
               </Badge>
               {campaign.urgency === 'high' && (
                 <Badge className="bg-orange-500 text-white border-none gap-1 px-3 py-1 font-black text-[10px] uppercase tracking-widest">
                   <Flame className="w-3 h-3" /> Urgent
                 </Badge>
               )}
            </div>
          </motion.div>

          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight italic">{campaign.title}</h1>
            
            <div className="flex flex-wrap gap-12 border-y border-border py-8 items-center text-muted-foreground">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center overflow-hidden border border-border">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=NGO" alt="NGO" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-foreground uppercase tracking-tight">HELPP NGO Verified</p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Governance Level: High</p>
                  </div>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Timeline</span>
                  <div className="flex items-center gap-2 text-sm italic font-medium text-foreground">
                    <Clock className="w-4 h-4" /> 12 days to go
                  </div>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Community</span>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Users className="w-4 h-4" /> {campaign.donorCount} supporters
                  </div>
               </div>
            </div>

            <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-[1.8] prose-p:text-lg italic">
              <p className="whitespace-pre-wrap">"{campaign.fullStory || campaign.shortDescription}"</p>
            </div>
          </div>
        </div>

        {/* Sticky Donation Sidebar */}
        <div className="lg:sticky lg:top-24 h-fit">
          <Card className="bg-card border-border rounded-[3rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-8 pb-0">
               <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-5xl font-black text-foreground tracking-tighter">₦{campaign.raisedAmount.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-2">Raised to target of ₦{campaign.targetAmount.toLocaleString()}</p>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 text-lg px-4 py-1 font-black rounded-xl">
                     {Math.round(progress)}%
                  </Badge>
               </div>
               <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                 <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-primary" 
                 />
               </div>
            </CardHeader>
            
            <CardContent className="p-8 space-y-6">
               <div className="grid grid-cols-3 gap-3">
                  {[2000, 5000, 10000].map(val => (
                    <Button 
                      key={val} 
                      variant="outline" 
                      onClick={() => setAmount(val)}
                      className={`h-14 border-border rounded-2xl transition-all font-black text-sm ${amount === val ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : 'bg-secondary/50 hover:bg-secondary'}`}
                    >
                      ₦{val.toLocaleString()}
                    </Button>
                  ))}
               </div>
               
               <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xl group-focus-within:text-primary">₦</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full h-16 bg-secondary/50 border border-border rounded-[1.5rem] pl-10 pr-6 text-2xl font-black focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
               </div>

               <Button 
                  size="lg" 
                  disabled={donating}
                  onClick={handleDonate}
                  className="w-full h-20 bg-primary text-primary-foreground text-2xl font-black rounded-[2rem] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {donating ? 'Negotiating...' : 'Donate Now'}
               </Button>

               {/* The Soul of the Mission */}
               <div className="bg-foreground text-background p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
                  <h3 className="text-3xl font-black tracking-tighter mb-6 italic uppercase leading-none">The Soul of <br /> this Mission</h3>
                  <p className="text-lg font-medium leading-relaxed opacity-80 mb-8 border-l-4 border-primary pl-6">
                    "This isn't just about resource allocation. It's about restoring the fundamental dignity of a human being. When you give, you aren't just buying water or food; you are purchasing a future that was once considered impossible."
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-6 bg-white/10 rounded-[2rem] border border-white/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Immediate Effect</p>
                        <p className="text-xs font-bold leading-tight">Physical restoration and safety for the vulnerable.</p>
                     </div>
                     <div className="p-6 bg-white/10 rounded-[2rem] border border-white/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Eternal Ripple</p>
                        <p className="text-xs font-bold leading-tight">Empowering a generation to end the cycle of crisis.</p>
                     </div>
                  </div>
               </div>

               {/* Impact Breakdown - Matching the Flyer Style */}
               <div className="space-y-4 pt-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-secondary" /> How will your donation help?
                  </h4>
                  <div className="space-y-2">
                    {[
                      { amount: '₦2,000', label: "Provides a week's worth of food for a family" },
                      { amount: '₦5,000', label: "Buys school supplies for 5 children" },
                      { amount: '₦10,000', label: "Buys school supplies for 10 children" },
                      { amount: '₦20,000', label: "Builds a well, ensuring clean water" }
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        onClick={() => setAmount(parseInt(item.amount.replace('₦', '').replace(',', '')))}
                        className="p-4 bg-secondary/20 hover:bg-secondary/40 border border-border rounded-2xl flex items-center justify-between cursor-pointer transition-all group/impact"
                      >
                        <p className="text-[11px] font-bold italic text-muted-foreground group-hover/impact:text-foreground">{item.label}</p>
                        <Badge className="bg-primary text-white border-none font-black text-[10px] px-3 py-1 rounded-lg">
                          {item.amount}
                        </Badge>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Mission Logistics Section - Like "Event Details" in Flyer */}
               <div className="p-8 bg-card border-2 border-primary/20 rounded-[2.5rem] shadow-xl space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center text-secondary">
                        <ArrowRight className="w-5 h-5" />
                     </div>
                     <h3 className="text-lg font-black uppercase tracking-tighter">Mission Logistics</h3>
                  </div>
                  
                  <div className="grid gap-6">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Main Nexus</p>
                        <p className="text-sm font-bold text-foreground">Global Outreach Center, Lagos, Nigeria</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Window</p>
                        <p className="text-sm font-bold text-foreground italic">12th Nov 2026 — 25th Dec 2026</p>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-border flex items-center gap-4">
                     <div className="w-16 h-16 bg-white border border-border p-1 rounded-xl flex items-center justify-center">
                        <div className="w-12 h-12 bg-foreground/10 rounded flex items-center justify-center">
                           <div className="grid grid-cols-3 gap-0.5">
                              {Array.from({length: 9}).map((_, i) => <div key={i} className="w-1 h-1 bg-foreground" />)}
                           </div>
                        </div>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Instant Reach</p>
                        <p className="text-[11px] text-muted-foreground italic leading-tight">Scan or copy wallet address to donate directly via Crypto.</p>
                     </div>
                  </div>
               </div>

               <div className="p-6 bg-secondary/30 rounded-[2rem] border border-border flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                     <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-foreground uppercase tracking-widest mb-1">Impact Analytics</p>
                    <p className="text-[11px] text-muted-foreground font-medium italic leading-tight">Your donation of ₦{amount.toLocaleString()} will directly provide essential resources to marginalized communities.</p>
                  </div>
               </div>

               <div className="flex items-center justify-center gap-8 pt-4 text-muted-foreground relative">
                  <div className="relative">
                    <motion.div 
                      whileHover={{ scale: 1.2 }} 
                      className="cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => setShowShareOptions(!showShareOptions)}
                    >
                      <Share2 className="w-6 h-6" />
                    </motion.div>
                    
                    <AnimatePresence>
                      {showShareOptions && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-card border border-border p-2 rounded-2xl shadow-2xl flex gap-2 z-50 min-w-[200px] justify-center"
                        >
                          <Button variant="ghost" size="icon" onClick={copyLink} className="hover:bg-secondary rounded-xl"><Copy className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="hover:bg-blue-500/10 text-blue-500 rounded-xl"><Twitter className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="hover:bg-blue-600/10 text-blue-600 rounded-xl"><Facebook className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="hover:bg-cyan-600/10 text-cyan-600 rounded-xl"><Linkedin className="w-4 h-4" /></Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer hover:text-primary transition-colors"><Heart className="w-6 h-6" /></motion.div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
                    <ShieldCheck className="w-4 h-4 text-blue-600" /> Secure
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

