import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { handleFirestoreError, OperationType } from '@/src/lib/firestore-errors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Users, DollarSign, Target, Sparkles, Brain, Zap, LayoutGrid, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const REVENUE_DATA = [
  { day: 'Mon', amount: 1200, aiBoost: 200 },
  { day: 'Tue', amount: 1900, aiBoost: 400 },
  { day: 'Wed', amount: 1500, aiBoost: 100 },
  { day: 'Thu', amount: 2500, aiBoost: 800 },
  { day: 'Fri', amount: 3200, aiBoost: 1100 },
  { day: 'Sat', amount: 2800, aiBoost: 600 },
  { day: 'Sun', amount: 4100, aiBoost: 1500 },
];

const CHAT_CONVERSION_DATA = [
  { name: 'Chat to Donated', value: 35 },
  { name: 'Chat to Abandoned', value: 65 },
];

const COLORS = ['#fff', '#27272a'];

export default function AnalyticsView() {
  const [hasData, setHasData] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'campaigns'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHasData(snapshot.docs.length > 0);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'campaigns');
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-60">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasData) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12 pb-20"
      >
        <div className="space-y-2">
           <p className="text-primary font-black uppercase tracking-[0.6em] text-[10px]">Macro Resonance Data</p>
           <h1 className="text-6xl font-black tracking-tighter mb-1 uppercase leading-none">Harmonic <br /> Silence</h1>
           <p className="text-muted-foreground text-sm font-medium italic">"The void precedes creation."</p>
        </div>

        <Card className="border-4 border-dashed border-border/50 rounded-[4rem] bg-secondary/5 py-40 relative overflow-hidden group">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary),0.05),transparent)] opacity-100" />
           <CardContent className="flex flex-col items-center justify-center text-center relative z-10">
              <div className="w-24 h-24 bg-white shadow-2xl rounded-[2.5rem] flex items-center justify-center text-primary/30 mb-8 transform group-hover:rotate-12 transition-transform duration-500">
                <Brain className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-4 leading-none">Neural Orbit <br /><span className="text-primary opacity-40 not-italic">Inactive.</span></h2>
              <p className="text-muted-foreground font-medium italic text-lg max-w-lg mx-auto mb-12 leading-relaxed">
                "The Oracle cannot derive patterns from a void. To activate flux analytics, you must first manifest a mission into the field."
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Button 
                  onClick={() => navigate('/admin?tab=builder')}
                  className="h-16 px-10 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all active:scale-95 gap-3 shadow-xl shadow-primary/20"
                >
                  Invoke Vision <Sparkles className="w-5 h-5" />
                </Button>
                <Button 
                  onClick={() => navigate('/admin?tab=campaigns')}
                  variant="outline"
                  className="h-16 px-10 border-2 border-border font-black uppercase tracking-widest rounded-2xl hover:bg-secondary transition-all active:scale-95 gap-3"
                >
                  Manual Deployment <Plus className="w-5 h-5" />
                </Button>
              </div>

              <div className="mt-16 grid grid-cols-3 gap-8 w-full max-w-2xl px-10">
                {[
                  { label: 'Step 1', title: 'Conception', desc: 'Use the AI Builder to generate mission ethics.' },
                  { label: 'Step 2', title: 'Manifestation', desc: 'Deploy the mission to the public resonance field.' },
                  { label: 'Step 3', title: 'Synchronization', desc: 'Secure the first wave of harmonic contributions.' }
                ].map((step, i) => (
                  <div key={i} className="text-left space-y-2 opacity-40 hover:opacity-100 transition-opacity">
                    <p className="text-[8px] font-black uppercase tracking-widest text-primary">{step.label}</p>
                    <p className="text-xs font-black uppercase tracking-tight">{step.title}</p>
                    <p className="text-[9px] text-muted-foreground italic font-medium leading-tight">{step.desc}</p>
                  </div>
                ))}
              </div>
           </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
           <p className="text-primary font-black uppercase tracking-[0.6em] text-[10px]">Macro Resonance Data</p>
           <h1 className="text-6xl font-black tracking-tighter mb-1 uppercase leading-none">Harmonic <br /> Flux</h1>
           <p className="text-muted-foreground text-sm font-medium italic">"Data is the visible manifestation of a collective heartbeat."</p>
        </div>
        <div className="flex gap-4 p-2 bg-secondary/20 rounded-3xl border border-border">
           {[ 'Impact', 'Pulse', 'Legacy' ].map(mode => (
             <Button key={mode} variant="ghost" className="h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/50 transition-all">
                {mode}
             </Button>
           ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
         {/* Main Revenue Chart */}
         <Card className="lg:col-span-2 bg-card border-2 border-border rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-transparent to-primary opacity-20" />
            <CardHeader className="pb-10 pt-8 px-10">
               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <CardTitle className="text-3xl font-black tracking-tighter uppercase mb-1">Funding Velocity</CardTitle>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.25em] font-black italic">Contribution flow with Neural Attribution</p>
                  </div>
                  <div className="flex items-center gap-6 text-[9px] font-black tracking-widest uppercase bg-secondary/30 px-6 py-3 rounded-full border border-border">
                     <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-foreground shadow-sm" /> Ground Flow</div>
                     <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary shadow-sm" /> Oracle Attributed</div>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="h-[400px] px-8 pb-8">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA}>
                     <defs>
                        <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="oklch(var(--border) / 5%)" />
                     <XAxis dataKey="day" stroke="oklch(var(--muted-foreground))" fontSize={10} fontStyle="italic" fontWeight="bold" axisLine={false} tickLine={false} />
                     <YAxis stroke="oklch(var(--muted-foreground))" fontSize={10} fontStyle="italic" fontWeight="bold" axisLine={false} tickLine={false} tickFormatter={(v) => `₦${v}`} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: 'oklch(var(--card))', border: '3px solid oklch(var(--border))', borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', padding: '16px' }}
                        itemStyle={{ fontSize: '11px', fontStyle: 'italic', fontWeight: '900' }}
                     />
                     <Area type="step" dataKey="amount" stackId="1" stroke="var(--foreground)" fill="url(#aiGradient)" strokeWidth={4} />
                     <Area type="step" dataKey="aiBoost" stackId="1" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.1} strokeWidth={2} strokeDasharray="8 4" />
                  </AreaChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         {/* Chat Conversion Stats */}
         <Card className="bg-card border-x-4 border-y-2 border-border rounded-[3rem] shadow-2xl flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <CardHeader className="p-10 pb-6 relative z-10">
               <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Neural Conversion
               </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center px-10 pb-10 relative z-10">
               <div className="h-[220px] w-full mb-10 relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-4xl font-black text-primary leading-none">35%</p>
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-50 mt-1">Success</p>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={CHAT_CONVERSION_DATA}
                           innerRadius={70}
                           outerRadius={100}
                           paddingAngle={8}
                           dataKey="value"
                        >
                           {CHAT_CONVERSION_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--primary)' : 'oklch(var(--secondary) / 20%)'} stroke="none" />
                           ))}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="space-y-4 pt-6 border-t border-border">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Persuasion Resonance</span>
                     <span className="text-sm font-black text-primary italic">OPTIMAL</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Soul Interaction Time</span>
                     <span className="text-sm font-black italic">4:12m Avg.</span>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
         {/* Predictive Insights Card */}
         <motion.div whileHover={{ scale: 1.02 }} className="lg:col-span-1">
            <Card className="bg-primary text-white border-none h-full relative overflow-hidden group rounded-[3.5rem] shadow-2xl p-10">
               <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
               <CardHeader className="p-0 mb-10">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-white/20 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md border border-white/20">
                        <Brain className="w-7 h-7 text-white" />
                     </div>
                     <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80">Predicted Alignment</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <p className="text-6xl font-black tracking-tighter mb-2 leading-none">₦42,500</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-10 italic">Expected Manifestation (30D)</p>
                  <div className="p-6 bg-white/10 rounded-[2.5rem] border border-white/20 backdrop-blur-md">
                     <div className="flex items-center gap-3 mb-3">
                        <Zap className="w-4 h-4 text-white fill-current" />
                        <span className="text-[9px] font-black uppercase tracking-widest tracking-tighter">AI Prophecy</span>
                     </div>
                     <p className="text-sm font-medium leading-relaxed italic border-l-3 border-white/40 pl-4 py-1">
                       "A 14% shift in Lagos metadata suggests a surge in Education resonance. Recommend initiating the 'Nexus Wisdom' broadcast sequence."
                     </p>
                  </div>
               </CardContent>
               <Sparkles className="absolute -bottom-10 -right-10 w-40 h-40 text-white/10 rotate-12 group-hover:rotate-0 transition-all duration-1000" />
            </Card>
         </motion.div>

         {/* Distribution Chart */}
         <Card className="lg:col-span-2 bg-card border-2 border-border rounded-[3.5rem] shadow-xl relative overflow-hidden group">
             <CardHeader className="p-10 pb-6">
                 <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
                    <Target className="w-5 h-5 text-primary" /> Channel Frequency Distribution
                 </CardTitle>
             </CardHeader>
             <CardContent className="h-[250px] px-10 pb-10">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={[
                      { name: 'Pure Organic', val: 45 },
                      { name: 'WhatsApp Nexus', val: 32 },
                      { name: 'Email Sequence', val: 15 },
                      { name: 'Social Drift', val: 8 },
                   ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--border) / 5%)" />
                      <XAxis dataKey="name" stroke="oklch(var(--muted-foreground))" fontSize={10} fontStyle="italic" fontWeight="bold" axisLine={false} tickLine={false} />
                      <Tooltip 
                        cursor={{fill: 'oklch(var(--secondary) / 10%)'}}
                        contentStyle={{ backgroundColor: 'oklch(var(--card))', border: '2px solid oklch(var(--border))', borderRadius: '16px' }}
                      />
                      <Bar dataKey="val" fill="var(--primary)" radius={[12, 12, 4, 4]} barSize={50} />
                   </BarChart>
                </ResponsiveContainer>
             </CardContent>
         </Card>
      </div>
    </div>
  );
}
