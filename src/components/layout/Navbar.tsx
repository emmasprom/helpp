import { Link } from 'react-router-dom';
import { User } from 'firebase/auth';
import { auth } from '@/src/lib/firebase';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  LayoutDashboard, 
  LogOut, 
  User as UserIcon,
  Menu,
  X,
  LogIn
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface NavbarProps {
  user: User | null;
  isAdmin: boolean;
}

export default function Navbar({ user, isAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogin = () => {
    window.location.href = '/admin-entrance';
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      sessionStorage.removeItem('admin_session');
      toast.info('Signed out. Mission Control sealed.');
      window.location.href = '/';
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <img 
              src="/src/assets/images/helpp_logo_1779196494638.png" 
              alt="HELPP Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-black text-2xl tracking-tighter text-primary leading-none">HELPP</span>
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-secondary opacity-80 leading-none mt-1">Empowering Lives</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Portal</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          <Link to="/programs" className="hover:text-primary transition-colors">Programs</Link>
          <Link to="/get-involved" className="hover:text-primary transition-colors">Get Involved</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          
          <div className="h-4 w-[1px] bg-border mx-2" />

          {user || isAdmin ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary hover:bg-primary/10 font-bold uppercase tracking-widest text-[10px]">
                    <LayoutDashboard className="w-4 h-4" />
                    Mission Control
                  </Button>
                </Link>
              )}
              {(user || isAdmin) && (
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 border-border hover:bg-secondary text-foreground text-[10px] font-bold uppercase tracking-widest">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/admin-entrance">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground text-[10px] font-bold uppercase tracking-widest">
                  <LogIn className="w-4 h-4" />
                  Portal
                </Button>
              </Link>
              <Button size="sm" onClick={() => (window.location.href = '/#campaigns')} className="bg-primary text-white hover:bg-primary/90 font-black px-6 rounded-xl shadow-lg shadow-primary/20 text-[10px] uppercase tracking-widest">
                Donate Now
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden border-b border-border bg-card px-4 py-6 flex flex-col gap-4 text-foreground shadow-2xl"
          >
            <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-black tracking-tight">Portal</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="text-lg font-black tracking-tight">About</Link>
            <Link to="/programs" onClick={() => setIsOpen(false)} className="text-lg font-black tracking-tight">Programs</Link>
            <Link to="/get-involved" onClick={() => setIsOpen(false)} className="text-lg font-black tracking-tight text-primary">Get Involved</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="text-lg font-black tracking-tight">Contact</Link>
            {isAdmin && <Link to="/admin" onClick={() => setIsOpen(false)} className="text-lg font-black tracking-tight text-primary uppercase">Admin Dashboard</Link>}
            
            <div className="pt-4 border-t border-border">
              {user ? (
                <Button variant="outline" className="w-full text-foreground border-border font-bold rounded-xl" onClick={handleLogout}>Sign Out</Button>
              ) : (
                <Button className="w-full bg-primary text-primary-foreground font-black rounded-xl" onClick={handleLogin}>Sign In</Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
