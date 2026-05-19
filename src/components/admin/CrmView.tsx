import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { handleFirestoreError, OperationType } from '@/src/lib/firestore-errors';
import { Donor } from '@/src/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Mail, Phone, MoreHorizontal, UserCheck, Star, ShieldAlert, Users, Sparkles, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function CrmView() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'score'>('score');

  useEffect(() => {
    const q = query(collection(db, 'donors'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Donor));
      setDonors(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'donors');
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const sortedDonors = [...donors].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return b.score - a.score;
  });

  const filteredDonors = sortedDonors.filter(d => 
    d.email.toLowerCase().includes(search.toLowerCase()) || 
    d.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const getSegmentStyles = (segment: string) => {
    switch (segment) {
      case 'vip': return 'border-amber-500/50 text-amber-500 bg-amber-500/5';
      case 'high-value': return 'border-indigo-500/50 text-indigo-500 bg-indigo-500/5';
      case 'recurring': return 'border-primary/50 text-primary bg-primary/5';
      case 'at-risk': return 'border-red-500/50 text-red-500 bg-red-500/5';
      default: return 'border-zinc-500/50 text-zinc-500';
    }
  };

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Suporter Nexus</p>
          <h1 className="text-5xl font-black tracking-tighter mb-1 uppercase italic leading-none">Souls of <br /> Impact</h1>
          <p className="text-muted-foreground text-sm font-medium italic mt-2">"Behind every data point is a destiny you are helping to rewrite."</p>
        </div>
        <div className="flex flex-wrap gap-4">
            <div className="flex bg-secondary/30 rounded-2xl p-1 border border-border">
              {[
                { id: 'score', label: 'Score' },
                { id: 'newest', label: 'Newest' },
                { id: 'oldest', label: 'Oldest' }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id as any)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    sortBy === option.id 
                    ? 'bg-foreground text-background shadow-lg' 
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Locate a Soul..." 
                className="pl-12 h-14 bg-card border-2 border-border focus:border-primary rounded-2xl w-[240px] font-bold italic shadow-lg"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-card border-2 border-border p-6 rounded-[2.5rem] flex items-center gap-5 shadow-xl group hover:border-primary/30 transition-all">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
                  <Star className="w-7 h-7 fill-current" />
              </div>
              <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Pillars of Light</p>
                  <p className="text-2xl font-black tracking-tight">{donors.filter(d => d.segment === 'vip').length} Supporter Units</p>
              </div>
          </Card>
          <Card className="bg-card border-2 border-border p-6 rounded-[2.5rem] flex items-center gap-5 shadow-xl group hover:border-primary/30 transition-all">
              <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform shadow-lg shadow-secondary/5">
                  <UserCheck className="w-7 h-7" />
              </div>
              <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Harmonic Retention</p>
                  <p className="text-2xl font-black tracking-tight">78.4% Frequency</p>
              </div>
          </Card>
          <Card className="bg-card border-2 border-border p-6 rounded-[2.5rem] flex items-center gap-5 shadow-xl group hover:border-destructive/30 transition-all">
              <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive group-hover:scale-110 transition-transform shadow-lg shadow-destructive/5">
                  <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Resonance At Risk</p>
                  <p className="text-2xl font-black tracking-tight">12 Fragile Bonds</p>
              </div>
          </Card>
      </div>

      <div className="rounded-[3rem] border-4 border-foreground shadow-[0_40px_100px_rgba(0,0,0,0.1)] bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-foreground text-background">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="text-background font-black uppercase text-[10px] tracking-widest py-6 px-8">Divine Supporter</TableHead>
              <TableHead className="text-background font-black uppercase text-[10px] tracking-widest py-6 px-8">Impact Tier</TableHead>
              <TableHead className="text-background font-black uppercase text-[10px] tracking-widest py-6 px-8">Resonance Score</TableHead>
              <TableHead className="text-background font-black uppercase text-[10px] tracking-widest py-6 px-8">Lifetime Manifestation</TableHead>
              <TableHead className="text-right text-background font-black uppercase text-[10px] tracking-widest py-6 px-8 italic">Engage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDonors.length > 0 ? filteredDonors.map((donor) => (
              <TableRow key={donor.id} className="border-border hover:bg-secondary/30 transition-colors">
                <TableCell className="py-6 px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/30 border border-border flex items-center justify-center font-black text-xs text-primary shadow-inner">
                       {donor.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-black text-sm tracking-tight">{donor.fullName}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-[11px] text-muted-foreground italic font-medium">{donor.email}</p>
                        <span className="text-[8px] text-muted-foreground/30 font-black uppercase tracking-widest">
                          Joined {new Date(donor.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-6 px-8">
                   <Badge className={`uppercase text-[9px] font-black tracking-[0.2em] px-4 py-1.5 rounded-full border-2 ${getSegmentStyles(donor.segment)}`}>
                      {donor.segment === 'vip' ? 'Nexus Guardian' : donor.segment}
                   </Badge>
                </TableCell>
                <TableCell className="py-6 px-8">
                   <div className="space-y-1.5 w-32">
                      <div className="flex justify-between text-[8px] font-black tracking-widest uppercase mb-1">
                         <span className={donor.score > 80 ? 'text-primary' : 'text-muted-foreground'}>{donor.score}% Clarity</span>
                      </div>
                      <Progress value={donor.score} className="h-1.5 bg-secondary/50 rounded-full overflow-hidden" />
                   </div>
                </TableCell>
                <TableCell className="py-6 px-8">
                   <p className="text-lg font-black text-foreground tracking-tighter">₦{donor.totalDonated.toLocaleString()}</p>
                   <p className="text-[10px] text-muted-foreground font-bold italic">{donor.donationCount} Mission Inputs</p>
                </TableCell>
                <TableCell className="text-right py-6 px-8">
                  <div className="flex items-center justify-end gap-3 opacity-20 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary border-2 border-transparent hover:border-primary/20">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-secondary/20 hover:text-secondary border-2 border-transparent hover:border-secondary/20">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="py-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-8 max-w-md mx-auto">
                    <div className="relative">
                      <div className="w-24 h-24 bg-card border-4 border-foreground rounded-[2.5rem] flex items-center justify-center text-primary/30 rotate-12 animate-in fade-in zoom-in duration-700">
                        <Users className="w-12 h-12" />
                      </div>
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground shadow-xl border-4 border-card animate-bounce">
                        <Sparkles className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="space-y-3">
                       <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none">
                         {search ? 'Identity Lost in <br /> the Noise' : 'The Nexus is <br /><span className="text-primary italic">Awaiting Souls</span>'}
                       </h3>
                       <p className="text-xs text-muted-foreground font-medium italic leading-relaxed max-w-xs mx-auto px-4">
                         {search 
                           ? `No soul matches the resonance for "${search}". Perhaps they are waiting to be found under a different frequency.` 
                           : "The registry of supporters is currently empty. Every great movement begins with a single soul of impact. Share a mission to start the count."
                         }
                       </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {search ? (
                        <Button 
                          onClick={() => setSearch('')} 
                          variant="outline" 
                          className="h-14 px-10 rounded-2xl border-2 border-border hover:border-primary font-black uppercase text-[10px] tracking-widest transition-all"
                        >
                          Clear Search Buffer
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => window.location.href = '/admin?tab=builder'} 
                          className="h-16 px-10 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all active:scale-95 gap-3 shadow-xl shadow-primary/20"
                        >
                          Birth a Mission <ArrowRight className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={`rounded-2xl border ${className}`}>{children}</div>;
}
