import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { auth } from '@/src/lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { 
  Users, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Megaphone,
  Sparkles,
  MessageCircle,
  Mail,
  Zap,
  ShieldCheck,
  Menu,
  X,
  Key,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { onAuthStateChanged } from 'firebase/auth';
import { AdminRole } from '@/src/types';

// Admin Sub-pages
import OverviewView from '@/src/components/admin/OverviewView';
import CampaignsView from '@/src/components/admin/CampaignsView';
import CrmView from '@/src/components/admin/CrmView';
import AnalyticsView from '@/src/components/admin/AnalyticsView';
import AiBuilderView from '@/src/components/admin/AiBuilderView';
import SettingsView from '@/src/components/admin/SettingsView';

const NAV_ITEMS = [
  { label: 'Overview', icon: LayoutDashboard, path: '/admin', roles: ['Super Admin', 'Campaign Manager', 'Viewer'] },
  { label: 'Campaigns', icon: Megaphone, path: '/admin/campaigns', roles: ['Super Admin', 'Campaign Manager', 'Viewer'] },
  { label: 'AI Builder', icon: Sparkles, path: '/admin/ai-builder', roles: ['Super Admin', 'Campaign Manager'] },
  { label: 'Donors CRM', icon: Users, path: '/admin/crm', roles: ['Super Admin', 'Campaign Manager', 'Viewer'] },
  { label: 'Settings', icon: Settings, path: '/admin/settings', roles: ['Super Admin'] },
];

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFirebaseAuthed, setIsFirebaseAuthed] = useState(true);
  const [userRole, setUserRole] = useState<AdminRole>((sessionStorage.getItem('admin_role') as AdminRole) || 'Viewer');

  useEffect(() => {
    const role = sessionStorage.getItem('admin_role') as AdminRole;
    if (role) setUserRole(role);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsFirebaseAuthed(!!user);
    });
    return unsubscribe;
  }, []);

  const filteredNavItems = NAV_ITEMS.filter((item: any) => item.roles.includes(userRole));

  const handleLogout = async () => {
    try {
      await auth.signOut();
      sessionStorage.removeItem('admin_session');
      toast.success('System Logged Out. Portal Sealed.');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed.');
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-64 border-r border-border flex flex-col bg-card shrink-0 transition-transform duration-500 lg:static lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="/src/assets/images/helpp_logo_1779196494638.png" 
                  alt="HELPP Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1 text-primary">Mission Control</p>
                <p className="text-[10px] text-muted-foreground font-bold italic">Node: 001_LAGOS</p>
             </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <div className="px-4 mb-6">
             <div className="px-3 py-2 bg-primary/10 border border-primary/20 rounded-xl">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-primary mb-0.5">Authorization Level</p>
                <p className="text-[10px] font-bold text-foreground">{userRole}</p>
             </div>
          </div>
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-4 h-12 px-4 rounded-[1.2rem] transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                  <span className="font-bold text-[10px] uppercase tracking-[0.15em]">{item.label}</span>
                  {isActive && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-border space-y-4">
          <div className="bg-secondary/40 rounded-3xl p-5 border border-border relative overflow-hidden group">
            <Zap className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground mb-1">Neural Insights</p>
            <p className="text-[10px] text-muted-foreground mb-3 leading-tight italic">"Global resonance is up 12% in Nigeria. Suggest boosting Education outreach."</p>
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 blur-2xl rounded-full" />
          </div>

          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full h-14 rounded-2xl border-2 border-transparent hover:border-destructive hover:bg-destructive/10 text-muted-foreground hover:text-destructive group transition-all"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
            <span className="font-black text-[10px] uppercase tracking-widest">Seal Portal</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background/50">
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {/* Mobile Header Toggle */}
          <div className="flex lg:hidden items-center justify-between mb-8 pb-4 border-b border-border">
             <div className="flex items-center gap-2">
                <img 
                  src="/src/assets/images/helpp_logo_1779196494638.png" 
                  alt="HELPP Logo" 
                  className="w-8 h-8 object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="font-black text-sm uppercase tracking-tighter text-primary">Mission Control</span>
             </div>
             <div className="flex gap-2">
               <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-xl text-destructive hover:bg-destructive/10">
                 <LogOut className="w-5 h-5" />
               </Button>
               <Button variant="outline" size="sm" onClick={() => setIsSidebarOpen(true)} className="rounded-xl border-2 border-border font-bold">
                 <Menu className="w-5 h-5 mr-2" /> Menu
               </Button>
             </div>
          </div>

          <Routes>
            <Route index element={<OverviewView />} />
            <Route path="campaigns" element={<CampaignsView />} />
            <Route path="crm" element={<CrmView />} />
            <Route path="analytics" element={<AnalyticsView />} />
            
            {/* Protected Routes */}
            {(userRole === 'Super Admin' || userRole === 'Campaign Manager') && (
              <Route path="ai-builder" element={<AiBuilderView />} />
            )}
            
            {userRole === 'Super Admin' && (
              <Route path="settings" element={<SettingsView />} />
            )}

            <Route path="*" element={<div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <Sparkles className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
              <h2 className="text-2xl font-black tracking-tight mb-2 uppercase">Under AI Construction</h2>
              <p className="text-muted-foreground max-w-sm italic text-sm">Our neural networks are currently formulating the optimal interface for this module.</p>
            </div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}


