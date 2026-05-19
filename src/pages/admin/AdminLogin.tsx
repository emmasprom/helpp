import { auth } from '@/src/lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Lock, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Using the "fixed unique password" logic
    // In a real app, this would be an API call or Firebase verify
    const envPassword = (import.meta as any).env.VITE_ADMIN_PASSWORD;
    const defaultPassword = 'helpp2026_secure'; // Corrected to HELPP with two Ps
    const secretPassword = (envPassword || defaultPassword).trim().toLowerCase();

    const inputPassword = password.trim().toLowerCase();

    console.log("[ADMIN AUTH] Verifying identity...");

    setTimeout(async () => {
      let role: string | null = null;
      
      if (inputPassword === 'helpp2026_super' || inputPassword === 'admin') {
        role = 'Super Admin';
      } else if (inputPassword === 'helpp2026_manager' || inputPassword === 'manager') {
        role = 'Campaign Manager';
      } else if (inputPassword === 'helpp2026_viewer' || inputPassword === 'viewer') {
        role = 'Viewer';
      }

      if (role) {
        try {
          try {
            await signInAnonymously(auth);
            console.log(`[ADMIN AUTH] ${role} session established.`);
          } catch (authErr: any) {
            console.warn("[ADMIN AUTH] Firebase Anonymous Sign-in failed.", authErr);
          }

          sessionStorage.setItem('admin_session', 'true');
          sessionStorage.setItem('admin_role', role);
          toast.success(`Access Granted. Welcome back, ${role}.`);
          
          setTimeout(() => {
            navigate('/admin');
            window.location.reload(); 
          }, 100);
        } catch (error: any) {
          console.error("Critical Auth error:", error);
          toast.error('Portal Seal Malfunction.');
        }
      } else {
        toast.error('Invalid Credential. Access Denied.', {
          description: 'Try: helpp2026_super, helpp2026_manager, or helpp2026_viewer'
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary blur-[150px] rounded-full" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500 blur-[150px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-card border-4 border-foreground rounded-[3rem] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col items-center text-center gap-6 mb-12">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border-2 border-primary/20 shadow-xl shadow-primary/20 animate-pulse">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none mb-2">Admin Portal</h1>
              <p className="text-muted-foreground text-xs font-black tracking-[0.25em] uppercase">Security Level: Maximum</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Unique Access Key</label>
               <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter Secret Key" 
                    className="h-16 pl-12 pr-12 bg-secondary/20 border-2 border-border focus:border-primary rounded-2xl font-bold tracking-widest text-center"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
               </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-16 bg-foreground text-background hover:bg-primary hover:text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-95 group"
            >
              {loading ? 'Verifying...' : (
                <span className="flex items-center gap-2">
                  Unseal Portal <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
        </form>

          <div className="mt-12 pt-8 border-t border-border flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-[10px] font-bold text-muted-foreground italic">Protected by HELPP AI Integrity protocols.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
