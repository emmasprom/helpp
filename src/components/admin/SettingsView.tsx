import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Lock, Sparkles, Key, Globe, Bell } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsView() {
  const [accessKey, setAccessKey] = useState('HELPP2026_SECURE');
  const [showKey, setShowKey] = useState(false);

  const handleUpdateKey = () => {
    toast.success('Security protocol updated. This will take effect on next cycle.');
  };

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-black uppercase tracking-[.4em] text-primary">System Integrity</p>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Core Configuration</h1>
        <p className="text-muted-foreground text-sm font-medium italic">"The architecture of change must be guarded by truth."</p>
      </div>

      <div className="grid gap-8">
        <Card className="bg-card border-2 border-border rounded-[3rem] shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tight">Access Integrity</CardTitle>
                <CardDescription className="italic">Manage the master vibration (password) for this portal.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 max-w-2xl relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Master Portal Key</label>
              <div className="flex gap-4">
                <div className="relative flex-1 group">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                   <Input 
                    type={showKey ? "text" : "password"} 
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    className="h-16 pl-12 bg-secondary/20 border-2 border-border focus:border-primary rounded-2xl font-bold tracking-widest"
                   />
                </div>
                <Button 
                  variant="outline" 
                  className="h-16 w-16 border-2 border-border rounded-2xl hover:bg-secondary"
                  onClick={() => setShowKey(!showKey)}
                >
                   <Key className="w-6 h-6" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground italic font-medium px-2">This is the unique key referenced as VITE_ADMIN_PASSWORD. Changing it here only simulates the update; apply it to your environment for true effect.</p>
            </div>
            
            <Button 
              onClick={handleUpdateKey}
              className="h-16 px-10 bg-foreground text-background font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all active:scale-95"
            >
              Update Security Seal
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
           <Card className="bg-card border-2 border-border rounded-[2.5rem] shadow-lg">
              <CardHeader>
                 <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <CardTitle className="text-sm font-black uppercase tracking-widest">Global Resonance</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-border">
                    <p className="text-xs font-bold uppercase tracking-tight">Automatic Translation</p>
                    <div className="w-12 h-6 bg-primary rounded-full relative">
                       <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-border">
                    <p className="text-xs font-bold uppercase tracking-tight">Public Presence</p>
                    <div className="w-12 h-6 bg-primary rounded-full relative">
                       <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                 </div>
                 <p className="text-[10px] text-muted-foreground italic">"Enabling these ensures the mission is visible across all realms."</p>
              </CardContent>
           </Card>

           <Card className="bg-card border-2 border-border rounded-[2.5rem] shadow-lg">
              <CardHeader>
                 <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-primary" />
                    <CardTitle className="text-sm font-black uppercase tracking-widest">Divine Notifications</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-border">
                    <p className="text-xs font-bold uppercase tracking-tight">Impact Alerts</p>
                    <div className="w-12 h-6 bg-primary rounded-full relative">
                       <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-border opacity-50">
                    <p className="text-xs font-bold uppercase tracking-tight">Fraud Detection</p>
                    <div className="w-12 h-6 bg-muted-foreground rounded-full relative">
                       <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                 </div>
                 <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="w-4 h-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">AI Guardian is Monitoring</p>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
