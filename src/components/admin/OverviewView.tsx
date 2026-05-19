import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Users, Megaphone, TrendingUp, ArrowUpRight, ArrowDownRight, Sparkles, Plus } from 'lucide-react';
import { handleFirestoreError, OperationType } from '@/src/lib/firestore-errors';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const MOCK_CHART_DATA = [
  { name: 'Jan', donations: 4000 },
  { name: 'Feb', donations: 3000 },
  { name: 'Mar', donations: 5000 },
  { name: 'Apr', donations: 4500 },
  { name: 'May', donations: 6000 },
];

export default function OverviewView() {
  const [stats, setStats] = useState({
    totalRaised: 0,
    activeCampaigns: 0,
    totalDonors: 0,
    growth: 12.5
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'campaigns'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      const totalRaised = data.reduce((acc, curr) => acc + (curr.raisedAmount || 0), 0);
      const totalDonors = data.reduce((acc, curr) => acc + (curr.donorCount || 0), 0);
      const active = data.filter(c => c.status === 'published').length;

      setStats({
        totalRaised,
        activeCampaigns: active,
        totalDonors,
        growth: 12.5
      });
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'campaigns');
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const STATS_CARDS = [
    { label: 'Manifested Growth', value: `₦${stats.totalRaised.toLocaleString()}`, icon: DollarSign, trend: '+14% Resonance', color: 'text-primary' },
    { label: 'Sovereign Missions', value: stats.activeCampaigns, icon: Megaphone, trend: 'Reaching Fulfillment', color: 'text-secondary' },
    { label: 'Unified Souls', value: stats.totalDonors.toLocaleString(), icon: Users, trend: '+45 Connections Today', color: 'text-primary' },
    { label: 'Harmonic Average', value: stats.totalDonors > 0 ? `₦${Math.round(stats.totalRaised / stats.totalDonors).toLocaleString()}` : '₦0', icon: TrendingUp, trend: 'Equilibrium Stable', color: 'text-secondary' },
  ];

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Command & Oversight</p>
          <h1 className="text-5xl font-black tracking-tighter mb-1 uppercase italic leading-none">Providential <br /> Dashboard</h1>
          <p className="text-muted-foreground text-sm font-medium italic mt-2">"Vision becomes reality when data meets purpose."</p>
        </div>
        <div className="px-6 py-3 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center gap-3 text-secondary font-black text-[10px] tracking-widest uppercase">
          <Sparkles className="w-4 h-4" />
          Neural Integrity Verified
        </div>
      </div>

      {stats.activeCampaigns === 0 && stats.totalRaised === 0 ? (
        <div className="grid lg:grid-cols-3 gap-8 py-12">
          <div className="lg:col-span-2 p-20 border-4 border-dashed border-border rounded-[4rem] bg-secondary/5 flex flex-col items-center justify-center text-center space-y-8 group">
            <div className="relative">
              <div className="w-32 h-32 bg-card border-2 border-border shadow-2xl rounded-[2.5rem] flex items-center justify-center text-primary/20 group-hover:rotate-6 transition-transform">
                <TrendingUp className="w-16 h-16" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-xl animate-pulse">
                <Plus className="w-6 h-6" />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Awaiting the <br /><span className="text-primary italic">First Resonance</span></h2>
              <p className="text-sm text-muted-foreground font-medium italic max-w-sm leading-relaxed px-10">
                "Your oversight is currently monitoring a dormant field. To see harmonic data, we must first manifest a mission into existence."
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/admin?tab=builder'}
              className="h-20 px-16 bg-foreground text-background hover:bg-primary hover:text-white font-black text-xs uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl transition-all active:scale-95"
            >
              Invoke Creation Sequence
            </Button>
          </div>
          
          <div className="space-y-8">
            <Card className="bg-primary text-white border-none rounded-[3rem] shadow-2xl p-10 relative overflow-hidden group">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-8 relative z-10">System Status</h4>
               <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[11px] font-black uppercase tracking-widest">Neural Link: SECURE</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[11px] font-black uppercase tracking-widest">Oracle Mesh: SYNCED</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <p className="text-[11px] font-black uppercase tracking-widest opacity-80">Impact: PENDING_ACT</p>
                  </div>
               </div>
               <Sparkles className="absolute -bottom-10 -right-10 w-40 h-40 text-white/5 opacity-40 group-hover:rotate-45 transition-transform duration-1000" />
            </Card>
            
            <div className="p-8 border-2 border-border rounded-[3rem] bg-card italic font-medium text-xs text-muted-foreground leading-relaxed">
              "Every great achievement was once a thought. The PROVIDENTIAL DASHBOARD is ready to visualize your first wave of impact."
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS_CARDS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="bg-card border-border border-2 relative overflow-hidden group hover:border-primary/50 transition-all duration-500 rounded-[2rem] shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
                    <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</CardTitle>
                    <stat.icon className={`w-6 h-6 ${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-4xl font-black tracking-tighter mb-1">{stat.value}</div>
                    <p className="text-[10px] text-muted-foreground font-bold italic flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3 text-primary" />
                      {stat.trend}
                    </p>
                  </CardContent>
                  <div className={`absolute -right-10 -bottom-10 w-32 h-32 opacity-5 bg-primary rounded-full blur-[60px] group-hover:scale-150 transition-all duration-700`} />
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Revenue Forecast */}
            <Card className="lg:col-span-2 bg-card border-x-4 border-y-2 border-border rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-black tracking-tight uppercase">Expansion Arc</CardTitle>
                    <p className="text-xs text-muted-foreground italic font-medium">Trajectory of worldwide impact resonance.</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-10 rounded-xl px-6 text-[10px] font-black border-2 border-border hover:bg-secondary transition-all">EXTRACT LEGACY</Button>
                </div>
              </CardHeader>
              <CardContent className="h-[350px] w-full pt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_CHART_DATA}>
                    <defs>
                      <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--border) / 5%)" />
                    <XAxis dataKey="name" stroke="oklch(var(--muted-foreground))" fontSize={10} fontStyle="italic" fontWeight="bold" axisLine={false} tickLine={false} />
                    <YAxis stroke="oklch(var(--muted-foreground))" fontSize={10} fontStyle="italic" fontWeight="bold" axisLine={false} tickLine={false} tickFormatter={(value) => `₦${value/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'oklch(var(--card))', border: '2px solid oklch(var(--border))', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="step" 
                      dataKey="donations" 
                      stroke="var(--primary)" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorDonations)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* AI Recommendations Side Panel */}
            <div className="space-y-8">
              <Card className="bg-primary text-white border-none rounded-[3rem] shadow-[0_30px_60px_rgba(37,99,235,0.2)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">The Oracle's Vision</h4>
                      <CardTitle className="text-xl font-black tracking-tight leading-none uppercase">Prophetic <br /> Insights</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10 text-white">
                  <div className="p-5 bg-white/10 rounded-[2rem] border border-white/20 backdrop-blur-sm group-hover:bg-white/15 transition-all">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/80 mb-2">Soul Retention</p>
                    <p className="text-sm font-medium leading-relaxed italic mb-4">"12 Souls at risk of disconnection. Re-initialize hope with a 'Mission Manifest' update?"</p>
                    <Button size="sm" className="w-full h-12 bg-white text-primary hover:bg-white/90 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95">Execute Union</Button>
                  </div>
                  <div className="p-5 bg-white/10 rounded-[2rem] border border-white/20 backdrop-blur-sm group-hover:bg-white/15 transition-all opacity-80">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/80 mb-2">Resonance Alignment</p>
                    <p className="text-sm font-medium leading-relaxed italic border-l-2 border-white/30 pl-4">Crisis Mission resonance is fluctuating. Suggest recalibrating visual anchor.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-2 border-border rounded-[3rem] shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" /> Vital Stream
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-5 group cursor-not-allowed">
                        <div className="relative">
                           <div className="w-12 h-12 bg-secondary/40 rounded-[1.2rem] flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Users className="w-5 h-5 text-primary" />
                           </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-black uppercase tracking-tight leading-none mb-1">Soul Reconnection</p>
                          <p className="text-[10px] text-muted-foreground font-medium italic">Nexus: SARAH_M. / IMPACT: ₦7,500</p>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 italic">{i*2}M</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
