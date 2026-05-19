import { useState, useEffect, useRef } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/src/lib/firebase';
import { Campaign } from '@/src/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, ExternalLink, MoreVertical, Flame, Upload, X, CheckCircle2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import { handleFirestoreError, OperationType } from '@/src/lib/firestore-errors';

export default function CampaignsView() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: 'targetAmount' | 'raisedAmount' | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'desc' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Campaign>>({
    title: '',
    shortDescription: '',
    fullStory: '',
    targetAmount: 0,
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    category: 'Education',
    urgency: 'medium',
    status: 'draft'
  });

  useEffect(() => {
    const q = query(collection(db, 'campaigns'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
      setCampaigns(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'campaigns');
    });
    return unsubscribe;
  }, []);

  const openCreateDialog = () => {
    setEditingId(null);
    setFormData({
      title: '',
      shortDescription: '',
      fullStory: '',
      targetAmount: 0,
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
      category: 'Education',
      urgency: 'medium',
      status: 'draft'
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (campaign: Campaign) => {
    setEditingId(campaign.id);
    setFormData(campaign);
    setIsDialogOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      setUploading(false);
      toast.success('Image processed locally');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.targetAmount) {
        toast.error('Please fill in required fields');
        return;
      }

      if (editingId) {
        await updateDoc(doc(db, 'campaigns', editingId), {
          ...formData,
          updatedAt: new Date().toISOString()
        });
        toast.success('Campaign resonance updated');
      } else {
        await addDoc(collection(db, 'campaigns'), {
          ...formData,
          raisedAmount: 0,
          donorCount: 0,
          isAiOptimized: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        toast.success('Mission seeded successfully');
      }

      setIsDialogOpen(false);
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, editingId ? `campaigns/${editingId}` : 'campaigns');
    }
  };

  const toggleStatus = async (campaign: Campaign) => {
    const newStatus = campaign.status === 'published' ? 'draft' : 'published';
    try {
      await updateDoc(doc(db, 'campaigns', campaign.id), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      toast.success(`Mission is now ${newStatus === 'published' ? 'resonating' : 'dormant'}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `campaigns/${campaign.id}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to dissolve this mission from orbit?')) return;
    try {
      await deleteDoc(doc(db, 'campaigns', id));
      toast.success('Mission dissolved');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `campaigns/${id}`);
    }
  };

  const handleInlineUpdate = async (id: string, field: keyof Campaign, value: any) => {
    try {
      await updateDoc(doc(db, 'campaigns', id), {
        [field]: value,
        updatedAt: new Date().toISOString()
      });
      toast.success('Resonance adjusted');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `campaigns/${id}`);
    }
  };

  const handleSort = (key: 'targetAmount' | 'raisedAmount') => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key] || 0;
    const bValue = b[sortConfig.key] || 0;
    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
           <p className="text-primary font-black uppercase tracking-[0.6em] text-[10px]">Strategic Resonance</p>
           <h1 className="text-6xl font-black tracking-tighter mb-1 uppercase leading-none italic">Mission <br /> Orbit</h1>
           <p className="text-muted-foreground text-sm font-medium italic">"Every active mission is a celestial point of influence in our ecosystem."</p>
        </div>
        <Button onClick={openCreateDialog} className="h-16 px-10 rounded-[1.5rem] bg-foreground text-background hover:bg-primary hover:text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 gap-3">
          <Plus className="w-5 h-5" /> Seed New Mission
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-4 border-foreground text-foreground sm:max-w-[600px] rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] p-0 overflow-hidden">
          <DialogHeader className="p-10 pb-4 bg-secondary/20 border-b border-border">
            <DialogTitle className="text-3xl font-black tracking-tighter uppercase italic">{editingId ? 'Refine Mission Soul' : 'Birth New Mission'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-8 p-10 py-8 max-h-[60vh] overflow-y-auto pr-6 custom-scrollbar">
            <div className="grid gap-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Mission Title</label>
              <Input 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="bg-secondary/30 border-2 border-border h-14 rounded-2xl px-6 focus:border-primary font-bold italic"
                placeholder="The Resilient Wisdom Initiative"
              />
            </div>
            <div className="grid gap-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Impact Beacon (Short Description)</label>
              <Input 
                value={formData.shortDescription} 
                onChange={e => setFormData({...formData, shortDescription: e.target.value})}
                className="bg-secondary/30 border-2 border-border h-14 rounded-2xl px-6 focus:border-primary font-medium italic"
                placeholder="A signal of hope for the future..."
              />
            </div>
            <div className="grid gap-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Universal Narrative</label>
              <Textarea 
                value={formData.fullStory} 
                onChange={e => setFormData({...formData, fullStory: e.target.value})}
                className="bg-secondary/30 border-2 border-border min-h-[150px] rounded-[2rem] p-6 focus:border-primary font-medium italic leading-relaxed"
                placeholder="Articulate the divine impact..."
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="grid gap-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Target Manifestation (₦)</label>
                <Input 
                  type="number"
                  value={formData.targetAmount} 
                  onChange={e => setFormData({...formData, targetAmount: Number(e.target.value)})}
                  className="bg-secondary/30 border-2 border-border h-14 rounded-2xl px-6 focus:border-primary font-black"
                />
              </div>
              <div className="grid gap-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Resonance Sphere</label>
                <Input 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="bg-secondary/30 border-2 border-border h-14 rounded-2xl px-6 focus:border-primary font-bold"
                />
              </div>
            </div>

            <div className="grid gap-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Mission Urgency</label>
              <div className="grid grid-cols-4 gap-3">
                {['low', 'medium', 'high', 'critical'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, urgency: level as any })}
                    className={`h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                      formData.urgency === level 
                        ? 'bg-foreground text-background border-foreground shadow-xl' 
                        : 'bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Visual Essence</label>
              <div 
                className="relative aspect-video rounded-[2rem] overflow-hidden border-4 border-dashed border-border group cursor-pointer hover:border-primary transition-all shadow-inner bg-secondary/10"
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.imageUrl ? (
                  <>
                    <img src={formData.imageUrl} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                      <p className="text-white font-black uppercase text-[10px] tracking-widest bg-primary px-6 py-2 rounded-full">Transmute Essence</p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground group-hover:text-primary transition-colors">
                    <Upload className="w-10 h-10" />
                    <p className="text-[10px] uppercase font-black tracking-widest">Cast Image into Orbit</p>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
              <Input 
                value={formData.imageUrl} 
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                className="bg-secondary/20 border-border text-[10px] rounded-xl font-mono"
                placeholder="Or provide a direct neural link (URL)..."
              />
            </div>
          </div>
          <DialogFooter className="p-10 pt-4 bg-secondary/10 border-t border-border">
            <Button onClick={handleSubmit} className="w-full h-16 font-black bg-primary text-white text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              {editingId ? 'Update Manifestation' : 'Initialize Mission Galaxy'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-[3.5rem] border-4 border-foreground shadow-[0_50px_150px_rgba(0,0,0,0.15)] bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-foreground text-background">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="text-background font-black uppercase text-[10px] tracking-[0.3em] py-8 px-10 italic">The Signal</TableHead>
              <TableHead className="text-background font-black uppercase text-[10px] tracking-[0.3em] py-8 px-6">Manifestation State</TableHead>
              <TableHead className="text-background font-black uppercase text-[10px] tracking-[0.3em] py-8 px-6">
                <div className="flex items-center gap-4">
                  <span>Resonance Energy</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleSort('raisedAmount')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${sortConfig.key === 'raisedAmount' ? 'bg-background/20 text-white' : 'hover:bg-background/10'}`}
                      title="Sort by Raised Amount"
                    >
                      <span className="text-[7px]">RAISED</span>
                      {sortConfig.key === 'raisedAmount' ? (
                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                    </button>
                    <button 
                      onClick={() => handleSort('targetAmount')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${sortConfig.key === 'targetAmount' ? 'bg-background/20 text-white' : 'hover:bg-background/10'}`}
                      title="Sort by Target Amount"
                    >
                      <span className="text-[7px]">TARGET</span>
                      {sortConfig.key === 'targetAmount' ? (
                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                    </button>
                  </div>
                </div>
              </TableHead>
              <TableHead className="text-background font-black uppercase text-[10px] tracking-[0.3em] py-8 px-6">Soul Count</TableHead>
              <TableHead className="text-right text-background font-black uppercase text-[10px] tracking-[0.3em] py-8 px-10 italic">Alter</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCampaigns.length > 0 ? sortedCampaigns.map((campaign) => (
              <TableRow key={campaign.id} className="border-border group hover:bg-secondary/40 transition-all duration-500">
                <TableCell className="py-8 px-10">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-14 rounded-2xl bg-secondary overflow-hidden shrink-0 border-2 border-border/50 shadow-inner group-hover:scale-110 transition-transform">
                      <img src={campaign.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <div>
                      <p className="font-black text-xl tracking-tighter uppercase italic leading-none mb-1">{campaign.title}</p>
                      <div className="flex items-center gap-3">
                        <input
                          className="text-[9px] text-muted-foreground uppercase font-black tracking-widest bg-secondary/50 px-3 py-1 rounded-full border-none focus:ring-1 focus:ring-primary w-24 hover:bg-secondary transition-colors cursor-pointer focus:cursor-text outline-none"
                          defaultValue={campaign.category}
                          onBlur={(e) => {
                            if (e.target.value !== campaign.category) {
                              handleInlineUpdate(campaign.id, 'category', e.target.value);
                            }
                          }}
                        />
                        {campaign.urgency === 'high' && <Flame className="w-3 h-3 text-red-500 fill-current animate-pulse" />}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-8 px-6">
                  <Badge 
                    variant="outline" 
                    className={`uppercase font-black text-[9px] tracking-widest px-4 py-2 rounded-full border-2 ${
                      campaign.status === 'published' 
                        ? 'border-primary/50 text-primary bg-primary/5' 
                        : 'border-zinc-400 text-zinc-500 italic'
                    }`}
                  >
                    {campaign.status === 'published' ? 'Active Resonance' : 'Dormant Soul'}
                  </Badge>
                </TableCell>
                <TableCell className="py-8 px-6">
                  <div className="space-y-2 w-48">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                      <span className="text-primary">₦{campaign.raisedAmount.toLocaleString()}</span>
                      <div className="flex items-center gap-1">
                        <span className="opacity-40">OF ₦</span>
                        <input
                          type="number"
                          className="bg-transparent border-none p-0 w-24 focus:ring-0 font-black opacity-40 focus:opacity-100 hover:opacity-70 transition-opacity cursor-pointer focus:cursor-text outline-none"
                          defaultValue={campaign.targetAmount}
                          onBlur={(e) => {
                            const val = Number(e.target.value);
                            if (val !== campaign.targetAmount) {
                              handleInlineUpdate(campaign.id, 'targetAmount', val);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden border border-border/20">
                      <div 
                        className="h-full bg-primary transition-all duration-1000 shadow-[0_0_15px_rgba(var(--primary),0.5)]" 
                        style={{ width: `${Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-8 px-6">
                   <p className="text-2xl font-black tracking-tighter italic">{campaign.donorCount}</p>
                   <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Participating souls</p>
                </TableCell>
                <TableCell className="text-right py-8 px-10">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => toggleStatus(campaign)}
                      className="h-10 w-10 border border-border hover:bg-primary/10 hover:text-primary rounded-xl"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openEditDialog(campaign)}
                      className="h-10 w-10 border border-border hover:bg-secondary rounded-xl"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(campaign.id)}
                      className="h-10 w-10 border border-border hover:bg-destructive/10 text-destructive rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="py-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-8 max-w-md mx-auto">
                    <div className="relative">
                      <div className="w-24 h-24 bg-secondary/40 rounded-[2rem] flex items-center justify-center text-primary/20 animate-pulse">
                        <Flame className="w-12 h-12" />
                      </div>
                      <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
                    </div>
                    <div className="space-y-3">
                       <h3 className="text-2xl font-black uppercase tracking-tighter italic leading-none">The Orbit is <br /><span className="text-primary italic">Silent & Empty</span></h3>
                       <p className="text-xs text-muted-foreground font-medium italic leading-relaxed max-w-xs mx-auto px-4">
                         "A mission control without signals is just a room of potential. Seed your first mission to activate the global resonance field."
                       </p>
                    </div>
                    <Button 
                      onClick={openCreateDialog} 
                      className="h-16 px-10 rounded-2xl bg-foreground text-background hover:bg-primary hover:text-white font-black uppercase text-[11px] tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-foreground/10 flex items-center gap-3"
                    >
                       <Plus className="w-5 h-5" /> Seed Your Mission
                    </Button>
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
