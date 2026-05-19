import { useState } from 'react';
import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'Donation Inquiry'
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Frequency Synchronized. The Oracle will respond shortly.');
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'Donation Inquiry'
      });
      setSending(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header */}
      <section className="py-24 bg-secondary/10 border-b border-border relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary/10 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Badge variant="outline" className="mb-6 px-6 py-2 rounded-full border-primary/20 text-primary font-black uppercase tracking-widest text-[10px]">
            Neural Link: Comms
          </Badge>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6">Establish <br /><span className="text-primary italic">Contact.</span></h1>
          <p className="text-muted-foreground text-xl font-medium italic max-w-2xl">
            We welcome dialogue with donors, field partners, and visionary supporters. Your frequency is our strength.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-24">
            
            {/* Info Side */}
            <div className="lg:col-span-4 space-y-12">
               <div className="space-y-8">
                  <h3 className="text-3xl font-black uppercase tracking-tighter italic text-primary">Direct Nodes</h3>
                  <div className="space-y-6">
                     <div className="flex items-center gap-6 group cursor-pointer">
                        <div className="w-14 h-14 bg-card border-2 border-border rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                           <Mail className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Email Frequency</p>
                           <p className="font-bold text-lg">hello@helpp.org</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-6 group cursor-pointer">
                        <div className="w-14 h-14 bg-card border-2 border-border rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                           <Phone className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Local Comms</p>
                           <p className="font-bold text-lg">+234 800 000 0000</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-6 group cursor-pointer">
                        <div className="w-14 h-14 bg-card border-2 border-border rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                           <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Physical Node</p>
                           <p className="font-bold text-lg italic">Lagos Digital Hub, VI</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-secondary/20 rounded-[2.5rem] border-2 border-border/50">
                  <ShieldCheck className="w-10 h-10 text-primary mb-6" />
                  <h4 className="font-black uppercase tracking-tight text-xl mb-4">Integrity Guarantee</h4>
                  <p className="text-muted-foreground text-sm font-medium italic leading-relaxed">
                    "Every message is processed through our secure Oracle node. We respect your data privacy as much as we respect human dignity."
                  </p>
               </div>
            </div>

            {/* Form Side */}
            <div className="lg:col-span-8">
               <motion.form 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 onSubmit={handleSubmit}
                 className="bg-card border-2 border-border p-8 md:p-16 rounded-[4rem] shadow-xl md:-mt-32 relative z-20 bg-white"
               >
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest px-4">Full Identity</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Architect Name"
                          className="w-full h-16 px-8 rounded-3xl bg-secondary/10 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold"
                          value={form.name}
                          onChange={e => setForm({...form, name: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest px-4">Email Address</label>
                        <input 
                          required
                          type="email" 
                          placeholder="email@frequency.com"
                          className="w-full h-16 px-8 rounded-3xl bg-secondary/10 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold"
                          value={form.email}
                          onChange={e => setForm({...form, email: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest px-4">Phone (Optional)</label>
                        <input 
                          type="tel" 
                          placeholder="+234..."
                          className="w-full h-16 px-8 rounded-3xl bg-secondary/10 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold"
                          value={form.phone}
                          onChange={e => setForm({...form, phone: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest px-4">Interest Channel</label>
                        <select 
                          className="w-full h-16 px-8 rounded-3xl bg-secondary/10 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold appearance-none cursor-pointer"
                          value={form.category}
                          onChange={e => setForm({...form, category: e.target.value})}
                        >
                           <option>Donation Inquiry</option>
                           <option>Field Partnership</option>
                           <option>Corporate Sponsorship</option>
                           <option>Volunteering Skills</option>
                           <option>Other Manifestation</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-2 mb-12">
                     <label className="text-[10px] font-black uppercase tracking-widest px-4">Message / Intent</label>
                     <textarea 
                        required
                        placeholder="Describe your intent or inquiry..."
                        className="w-full h-48 p-8 rounded-[2.5rem] bg-secondary/10 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold resize-none italic"
                        value={form.message}
                        onChange={e => setForm({...form, message: e.target.value})}
                     />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={sending}
                    className="w-full h-20 bg-primary text-white hover:bg-primary/90 text-xl font-black uppercase tracking-widest rounded-3xl transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-4"
                  >
                    {sending ? (
                      <div className="w-8 h-8 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <>
                        Synchronize Frequency <Send className="w-6 h-6" />
                      </>
                    )}
                  </Button>
               </motion.form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Illustration Area */}
      <section className="py-24 bg-secondary/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
           <Globe className="w-24 h-24 text-primary/20 mb-8 animate-pulse" />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-4 opacity-60">Global Presence Nodes</p>
           <h3 className="text-3xl font-black italic tracking-tighter max-w-lg mb-12 uppercase">Bridging Local Reality with <span className="text-primary italic">Global Intent.</span></h3>
           <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale">
              <div className="flex items-center gap-2 font-black">Lagos | HQ</div>
              <div className="flex items-center gap-2 font-black">London | Strategy</div>
              <div className="flex items-center gap-2 font-black">New York | Partnerships</div>
           </div>
        </div>
      </section>
    </div>
  );
}
