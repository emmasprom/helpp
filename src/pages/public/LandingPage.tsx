import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { handleFirestoreError, OperationType } from '@/src/lib/firestore-errors';
import { Campaign } from '@/src/types';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ShieldCheck, Zap, Globe, Github, Sparkles, CheckCircle2, Users, MessageSquare, Shield, Megaphone, Smartphone } from 'lucide-react';
import CampaignCard from '@/src/components/shared/CampaignCard';

export default function LandingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'campaigns'), where('status', '==', 'published'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
      setCampaigns(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'published_campaigns');
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 flex items-center justify-center">
                 <img 
                    src="/src/assets/images/helpp_logo_1779196494638.png" 
                    alt="HELPP Logo" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                 />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-black tracking-[0.2em] uppercase">
                <Zap className="w-3 h-3 fill-current" />
                Impact Orchestration 2.0
              </div>
            </div>
            
            <motion.h1 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl sm:text-6xl md:text-8xl lg:text-[9.5rem] font-black tracking-tighter leading-[0.85] mb-12 bg-gradient-to-br from-foreground via-foreground/80 to-primary/60 bg-clip-text text-transparent italic"
            >
              HUMANITY <br /> <span className="text-primary not-italic">REMastered.</span> <br /> START HERE.
            </motion.h1>

            <div className="flex flex-col gap-8 mb-12">
              <div className="p-8 bg-card border-2 border-primary/20 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-colors" />
                <h3 className="text-2xl font-black tracking-tighter mb-4 uppercase">The Promise of Presence</h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed italic mb-6">
                  "We don't just transfer funds. We orchestrate hope. Every naira is a building block for a destiny that was almost forgotten."
                </p>
                <div className="space-y-4">
                  {[
                    { amount: '₦2,000', label: "Vital Nutrition: A week of life" },
                    { amount: '₦5,000', label: "Education Nexus: Schooling for 5 souls" },
                    { amount: '₦15,000', label: "Pure Life: A well for an entire community" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between group/item cursor-pointer">
                      <p className="text-muted-foreground font-bold italic text-sm group-hover/item:text-foreground transition-colors">{item.label}</p>
                      <Badge className="bg-secondary text-secondary-foreground font-black text-xs px-4 py-1.5 rounded-xl border-none group-hover/item:bg-primary group-hover/item:text-white transition-all">
                        {item.amount}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <Button 
                size="lg" 
                onClick={() => document.getElementById('campaigns')?.scrollIntoView({ behavior: 'smooth' })}
                className="h-20 px-12 bg-primary text-white hover:bg-primary/90 text-2xl font-black rounded-[2rem] shadow-2xl shadow-primary/30 transform hover:-translate-y-1 transition-all active:scale-95"
              >
                Donate Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => document.getElementById('campaigns')?.scrollIntoView({ behavior: 'smooth' })}
                className="h-20 px-12 border-4 border-border hover:bg-secondary text-2xl font-black rounded-[2rem] gap-3 transition-all active:scale-95"
              >
                Start Mission <ArrowRight className="w-8 h-8" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative lg:block hidden"
          >
            {/* Hexagonal Image Grid Layout Mimicking the Web Flyer */}
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="space-y-4 pt-12">
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border-8 border-background shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-700">
                  <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square rounded-[3rem] overflow-hidden border-8 border-background shadow-2xl -skew-x-3 hover:skew-x-0 transition-transform duration-700">
                  <img src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="aspect-square rounded-[3rem] overflow-hidden border-8 border-background shadow-2xl -skew-y-3 hover:skew-y-0 transition-transform duration-700">
                  <img src="https://images.unsplash.com/photo-1524069290683-0457abfe42c3?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border-8 border-background shadow-2xl skew-x-3 hover:skew-x-0 transition-transform duration-700">
                  <img src="https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Central Floating Score Card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-primary text-white p-10 rounded-[3rem] shadow-[0_30px_70px_rgba(37,99,235,0.6)] text-center border-8 border-background min-w-[280px]">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">Global Goal Reached</p>
                <p className="text-6xl font-black tracking-tighter mb-2">₦3.6B</p>
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 2 }} className="h-full bg-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners / Supporters Section */}
      <section className="py-12 border-y border-border/50 bg-secondary/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-8 opacity-60">Architects of Change & Global Supporters</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
             <div className="flex items-center gap-3 font-black text-2xl tracking-tighter"><Globe className="w-8 h-8" /> UN-OVERSIGHT</div>
             <div className="flex items-center gap-3 font-black text-2xl tracking-tighter"><Shield className="w-8 h-8" /> REDCROSS-SYNC</div>
             <div className="flex items-center gap-3 font-black text-2xl tracking-tighter"><Github className="w-8 h-8" /> OPEN-HOPE</div>
             <div className="flex items-center gap-3 font-black text-2xl tracking-tighter"><Zap className="w-8 h-8" /> GRID-IMPACT</div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 relative overflow-hidden bg-secondary/5">
        <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-primary/5 blur-[120px] rounded-full translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-primary font-black uppercase tracking-[.4em] text-[10px] mb-6">The HELPP Philosophy</p>
              <h2 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12">
                RADICAL <br /> <span className="italic text-muted-foreground">TRANSPARENCY</span> <br /> AS A STANDARD.
              </h2>
              <div className="space-y-8">
                <div className="p-10 bg-white border-4 border-foreground rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)] relative">
                   <div className="absolute top-6 right-6 text-primary/20"><Sparkles className="w-12 h-12" /></div>
                   <p className="text-xl font-bold leading-tight italic">
                     "Charity is not an act of pity, but an act of justice. We believe those who give deserve to see the seeds they plant grow into forests."
                   </p>
                   <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-primary">— THE HELPP MANIFESTO</p>
                </div>
                <p className="text-muted-foreground font-medium text-lg leading-relaxed italic border-l-4 border-primary pl-8">
                  Our platform uses AI-driven impact assessments and direct-to-mission verification. No hidden fees. No broken promises. Just pure, unadulterated impact.
                </p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
               <div className="aspect-[4/5] rounded-[4rem] overflow-hidden border-8 border-background shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-1000">
                  <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
               </div>
               <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-primary rounded-[4rem] p-10 flex flex-col items-center justify-center text-white shadow-2xl -rotate-12 group cursor-pointer hover:rotate-0 transition-transform">
                  <p className="text-center font-black text-6xl leading-none tracking-tighter uppercase mb-2">2026</p>
                  <p className="text-center font-black text-[10px] leading-tight tracking-[0.2em] uppercase opacity-70">Established for Humanity</p>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <Badge variant="outline" className="mb-6 px-6 py-2 rounded-full border-primary/20 text-primary font-black uppercase tracking-widest text-[10px]">
              Protocol: Impact
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase">How the <span className="text-primary italic">HELPP</span> Network Functions</h2>
            <p className="text-muted-foreground text-xl font-medium italic max-w-2xl mx-auto">"Removing the friction between your intent and global manifestation."</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 bg-card border-2 border-border hover:border-primary/30 rounded-[3rem] transition-all group relative overflow-hidden"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                <Megaphone className="w-10 h-10" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Phase 01</p>
              <h3 className="text-3xl font-black tracking-tighter mb-6 uppercase">Mission Discovery</h3>
              <p className="text-muted-foreground font-medium leading-relaxed italic">Browse the Oracle for missions that resonate with your personal frequency. Every mission is AI-vetted for maximum kinetic impact.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-12 bg-card border-2 border-border hover:border-primary/30 rounded-[3rem] transition-all group"
            >
              <div className="w-20 h-20 bg-secondary rounded-[1.5rem] flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                <Zap className="w-10 h-10" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Phase 02</p>
              <h3 className="text-3xl font-black tracking-tighter mb-6 uppercase">Seamless Fueling</h3>
              <p className="text-muted-foreground font-medium leading-relaxed italic">Fuel missions with zero friction. Our backend orchestrates the transfer directly to the local heroes on the ground, bypassing traditional lag.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-12 bg-card border-2 border-border hover:border-primary/30 rounded-[3rem] transition-all group"
            >
              <div className="w-20 h-20 bg-foreground text-background rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Phase 03</p>
              <h3 className="text-3xl font-black tracking-tighter mb-6 uppercase">Impact Echo</h3>
              <p className="text-muted-foreground font-medium leading-relaxed italic">Receive real-time feedback through the Oracle. Watch the impact resonate across communities via our transparency dashboard.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Proof Section */}
      <section className="py-40 bg-foreground text-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[length:40px_40px]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[.5em] text-primary">Global Reach</p>
              <div className="flex items-end gap-2">
                <span className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter shrink-0">42</span>
                <span className="text-2xl sm:text-3xl md:text-4xl text-primary font-black mb-4">+</span>
              </div>
              <p className="text-sm font-bold opacity-60 uppercase tracking-widest leading-relaxed max-w-[200px]">Nations unified under a single mission of change.</p>
            </div>
            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[.5em] text-primary">Total Agency</p>
              <span className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter">140k</span>
              <p className="text-sm font-bold opacity-60 uppercase tracking-widest leading-relaxed max-w-[200px]">Souls transitioned from crisis to sustainable hope.</p>
            </div>
            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[.5em] text-primary">Integrity Score</p>
              <span className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter">100%</span>
              <p className="text-sm font-bold opacity-60 uppercase tracking-widest leading-relaxed max-w-[200px]">Verified mission distribution with zero leakages.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Campaigns */}
      <section id="campaigns" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-4xl font-black tracking-tight mb-4">Live Campaigns</h2>
              <p className="text-muted-foreground max-w-md font-medium text-lg italic">"Real projects, real impact. Find a cause that speaks to your heart."</p>
            </div>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-none">
              {['Health', 'Education', 'Clean Water', 'Crisis'].map(cat => (
                <Button key={cat} variant="outline" size="sm" className="rounded-full border-border bg-card hover:bg-secondary transition-colors font-bold text-[10px] uppercase shrink-0">
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Horizontal Scroll on Mobile, Grid on Desktop */}
          <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-10 flex md:flex-none overflow-x-auto md:overflow-x-visible pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="min-w-[300px] md:min-w-0 h-[450px] bg-secondary/50 rounded-3xl animate-pulse shrink-0" />
              ))
            ) : campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <div key={campaign.id} className="min-w-[300px] md:min-w-0 shrink-0 snap-center">
                   <CampaignCard campaign={campaign} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-40 text-center border-4 border-dashed border-border/50 rounded-[4rem] bg-secondary/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 bg-card shadow-2xl rounded-[2rem] flex items-center justify-center text-primary/20 mb-8 transform group-hover:rotate-12 transition-transform duration-700">
                    <Sparkles className="w-12 h-12" />
                  </div>
                  <h3 className="text-4xl font-black tracking-tighter uppercase mb-4 italic leading-none">The Oracle is <br /><span className="text-primary not-italic">Calibrating.</span></h3>
                  <p className="text-muted-foreground font-medium italic text-lg max-w-md mx-auto mb-10 px-6 leading-relaxed">
                    "Currently, the resonance field is quiet. Our AI Oracle is curating new high-impact missions to manifest."
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      className="h-16 px-10 rounded-2xl bg-primary text-white hover:bg-primary/90 font-black text-xs uppercase tracking-widest transition-all active:scale-95 gap-3 shadow-xl shadow-primary/20"
                      onClick={() => window.location.reload()}
                    >
                      Scan for Signals <Zap className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline"
                      className="h-16 px-10 rounded-2xl border-2 border-border font-black text-xs uppercase tracking-widest transition-all hover:bg-secondary"
                      onClick={() => document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      View Past Impact
                    </Button>
                  </div>
                </div>
                <div className="absolute top-10 left-10 opacity-5 animate-pulse">
                   <Globe className="w-40 h-40" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section id="impact" className="py-24 border-y border-border bg-secondary/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex md:grid md:grid-cols-4 gap-12 relative z-10 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-none snap-x">
          <div className="text-center group min-w-[200px] md:min-w-0 shrink-0 snap-center">
            <h3 className="text-6xl font-black text-primary mb-2 group-hover:scale-110 transition-transform">98%</h3>
            <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold">Transfer Rate</p>
          </div>
          <div className="text-center group min-w-[200px] md:min-w-0 shrink-0 snap-center">
            <h3 className="text-6xl font-black text-foreground mb-2 group-hover:scale-110 transition-transform">12k+</h3>
            <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold">Active Donors</p>
          </div>
          <div className="text-center group min-w-[200px] md:min-w-0 shrink-0 snap-center">
            <h3 className="text-6xl font-black text-foreground mb-2 group-hover:scale-110 transition-transform">50</h3>
            <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold">Countries</p>
          </div>
          <div className="text-center group min-w-[200px] md:min-w-0 shrink-0 snap-center">
            <h3 className="text-6xl font-black text-primary mb-2 group-hover:scale-110 transition-transform">24/7</h3>
            <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold">AI Support</p>
          </div>
        </div>
      </section>

      {/* Contribution / Skills Section */}
      <section className="py-24 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
           <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-primary blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: <Smartphone className="w-8 h-8" />, title: "Tech Sync", desc: "Build the infrastructure that powers global hope." },
                  { icon: <Megaphone className="w-8 h-8" />, title: "Amplification", desc: "Tell the stories that the world needs to hear." },
                  { icon: <Users className="w-8 h-8" />, title: "Community", desc: "Orchestrate local support groups on the ground." },
                  { icon: <Shield className="w-8 h-8" />, title: "Vetting", desc: "Ensure every mission meets our neural standards." }
                ].map((item, i) => (
                  <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all group">
                    <div className="text-primary mb-6 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-tight mb-2">{item.title}</h4>
                    <p className="text-white/50 text-xs font-medium italic leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
               <Badge variant="outline" className="mb-8 px-6 py-2 rounded-full border-white/20 text-primary font-black uppercase tracking-widest text-[10px]">
                 Collective Intelligence
               </Badge>
               <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase">Lend Your <span className="text-white italic">Neural Link.</span></h2>
               <p className="text-white/60 text-xl font-medium italic mb-12 leading-relaxed">
                 "Impact isn't just about capital. It's about capacity. If you have skills in software, storytelling, or coordination, the Oracle has a place for your frequency."
               </p>
               <Button size="lg" className="h-20 px-12 bg-white text-foreground hover:bg-white/90 text-2xl font-black rounded-[2rem] transition-all active:scale-95 uppercase">
                 Volunteer Now
               </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-secondary/10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">Frequency Asked Questions</h2>
            <p className="text-muted-foreground font-medium italic">Everything you need to know about the HELPP Infrastructure.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "How do I know my donation is secure?", a: "Every transaction is logged on our private Oracle mesh. We maintain 100% transparency with real-time impact tracking." },
              { q: "Can I start my own campaign?", a: "Yes, once you link your identity and pass the Neural Vetting process, you can start seeding missions in your community." },
              { q: "What are the administration fees?", a: "HELPP operates on a 0% platform fee model for missions. We are sustained by voluntary tips and private grants from our Architect partners." }
            ].map((faq, i) => (
              <details key={i} className="group p-8 bg-card border-2 border-border rounded-[2rem] open:border-primary/30 transition-all cursor-pointer">
                <summary className="list-none flex items-center justify-between font-black text-lg uppercase tracking-tight">
                  {faq.q}
                  <ArrowRight className="w-6 h-6 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-6 text-muted-foreground font-medium italic leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Join the Movement Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="bg-primary p-12 md:p-24 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-[0_50px_100px_rgba(37,99,235,0.4)]">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent)]" />
            
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full text-[10px] font-black tracking-widest uppercase mb-8 backdrop-blur-sm border border-white/20">
                <Users className="w-3 h-3" /> Citizens of Earth Unified
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-8 uppercase">Join the <br /><span className="italic opacity-80">Evolution.</span></h2>
              <p className="text-white/80 font-medium text-xl italic mb-12">
                "Be the first to receive status updates from the frontlines of human progress. No spam, just pure impact manifestation."
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Enter your comms ID (email)..." 
                  className="h-16 px-8 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-bold md:min-w-[300px]"
                />
                <Button className="h-16 px-12 bg-white text-primary hover:bg-white/90 text-sm font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95">
                  Synchronize
                </Button>
              </div>
            </div>

            <div className="relative z-10 hidden lg:block">
              <div className="w-80 h-80 bg-white/10 rounded-full p-8 backdrop-blur-md border border-white/10 flex items-center justify-center">
                 <div className="text-center">
                    <p className="text-xs uppercase font-black tracking-widest opacity-60 mb-2">Network Strength</p>
                    <p className="text-7xl font-black tracking-tighter">94%</p>
                    <div className="mt-4 flex gap-1 justify-center">
                      {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-1 bg-white rounded-full" />)}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="/src/assets/images/helpp_logo_1779196494638.png" 
                  alt="HELPP Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-black text-2xl tracking-tighter text-primary">HELPP</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs font-medium italic">"Planting the future. Empowering lives."</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-6 text-muted-foreground">
            <div className="flex flex-wrap justify-center md:justify-end gap-8 font-bold text-[10px] uppercase tracking-widest">
              <Link to="/about" className="hover:text-primary transition-colors">About</Link>
              <Link to="/programs" className="hover:text-primary transition-colors">Programs</Link>
              <Link to="/get-involved" className="hover:text-primary transition-colors">Get Involved</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
              <Link to="/admin" className="hover:text-primary transition-colors">Mission Control</Link>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">© 2026 HELPP NGO Network. Manifesting Human Potential.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

