import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInAnonymously } from 'firebase/auth';
import { auth, db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './lib/firestore-errors';
import { Toaster } from '@/components/ui/sonner';

// Pages
import LandingPage from './pages/public/LandingPage';
import CampaignDetail from './pages/public/CampaignDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import PaymentVerify from './pages/public/PaymentVerify';
import AdminLogin from './pages/admin/AdminLogin';
import About from './pages/public/About';
import Programs from './pages/public/Programs';
import Contact from './pages/public/Contact';
import GetInvolved from './pages/public/GetInvolved';

// Components
import Navbar from './components/layout/Navbar';
import ChatbotWidget from './components/shared/ChatbotWidget';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('helpp-theme') || 'theme-blue');

  useEffect(() => {
    localStorage.setItem('helpp-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Safety timeout to prevent infinite loading if Firebase hangs
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(safetyTimeout);
      setUser(user);
      
      const adminSession = sessionStorage.getItem('admin_session');
      const isSessionAdmin = adminSession === 'true';

      if (isSessionAdmin && !user) {
        try {
          await signInAnonymously(auth);
          return; // onAuthStateChanged will fire again with user
        } catch (error) {
          console.warn("[ADMIN AUTH] App-level sync failed, proceeding with session only:", error);
          setIsAdmin(true);
          setLoading(false);
          return;
        }
      }

      if (user) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          const isBootstrappedAdmin = user.email === 'emmasprom@gmail.com';
          setIsAdmin(adminDoc.exists() || isBootstrappedAdmin || isSessionAdmin);
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `admins/${user.uid}`);
          setIsAdmin(isSessionAdmin);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    }, (error) => {
      console.error("onAuthStateChanged error:", error);
      setLoading(false);
    });
    return () => {
      unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  if (loading) {
    return (
      <div className={`h-screen w-full flex items-center justify-center bg-background ${theme}`}>
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground font-medium">HELPP is loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className={`min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden ${theme}`}>
        <Navbar user={user} isAdmin={isAdmin} />
        <main className="flex-1 relative z-0 pt-16">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/campaign/:id" element={<CampaignDetail />} />
            <Route path="/payment/verify" element={<PaymentVerify />} />
            <Route path="/admin-entrance" element={<AdminLogin />} />
            
            {/* Admin Protected Routes */}
            <Route 
              path="/admin/*" 
              element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin-entrance" replace />} 
            />
          </Routes>
        </main>
        
        {/* Floating Theme Switcher for User Choice */}
        <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-2 p-2 bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl scale-75 md:scale-100 origin-bottom-left">
           <p className="text-[8px] font-black uppercase tracking-widest text-center opacity-50 mb-1">Aura Aura Switcher</p>
           <div className="flex gap-2">
             {[
               { id: 'theme-blue', color: 'bg-blue-600', label: 'Action' },
               { id: 'theme-emerald', color: 'bg-emerald-600', label: 'Growth' },
               { id: 'theme-solar', color: 'bg-amber-500', label: 'Impact' },
               { id: 'theme-midnight', color: 'bg-indigo-900', label: 'Royal' },
             ].map((t) => (
               <button
                 key={t.id}
                 onClick={() => setTheme(t.id)}
                 className={`w-8 h-8 rounded-full ${t.color} border-2 ${theme === t.id ? 'border-foreground scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'} transition-all`}
                 title={t.label}
               />
             ))}
           </div>
        </div>

        <ChatbotWidget />
        <Toaster position="top-center" richColors />
      </div>
    </BrowserRouter>
  );
}

