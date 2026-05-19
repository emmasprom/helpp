import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Target, Eye, Users, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-secondary/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Badge variant="outline" className="mb-8 px-6 py-2 rounded-full border-primary/20 text-primary font-black uppercase tracking-widest text-[10px]">
            The Architecture of Hope
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 uppercase">
            Empowering <br /><span className="text-primary italic">Less Privileged</span> <br />Persons.
          </h1>
          <p className="text-muted-foreground text-xl md:text-2xl font-medium italic max-w-3xl leading-relaxed">
            HELPP exists to bridge the gap between human potential and limited resources across Nigeria, providing the tools and knowledge for sustainable growth.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 md:gap-32">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter">Our <span className="italic text-primary">Mission</span></h2>
              <p className="text-muted-foreground text-lg leading-relaxed font-medium italic">
                To empower individuals through community-driven initiatives in agriculture, professional training, and renewable energy, fostering an environment where secondary aid becomes primary independence.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                <Eye className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter">Our <span className="italic text-primary">Vision</span></h2>
              <p className="text-muted-foreground text-lg leading-relaxed font-medium italic">
                A Nigeria where communities thrive through inclusive opportunity and sustainable growth, fueled by localized intelligence and global support.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Women? Section */}
      <section className="py-32 bg-foreground text-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-5 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[length:30px_30px]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
             <div>
                <Badge variant="outline" className="mb-8 px-6 py-2 rounded-full border-white/20 text-primary font-black uppercase tracking-widest text-[10px]">
                  Core Philosophy
                </Badge>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 uppercase">Why We Center <br /><span className="text-white italic">On Women.</span></h2>
                <div className="space-y-6 text-white/70 text-lg md:text-xl font-medium italic leading-relaxed">
                   <p>Women are central to food systems and household stability. Supporting a woman isn't just about one individual—it's about the ripple effect through an entire community.</p>
                   <p>When women are empowered with agricultural tools and renewable energy, malnutrition drops, education rates climb, and local economies stabilize at a fundamental level.</p>
                </div>
                <div className="mt-12 flex gap-12">
                   <div>
                      <p className="text-4xl font-black text-white tracking-tighter">85%</p>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-primary">Impact Re-investment</p>
                   </div>
                   <div>
                      <p className="text-4xl font-black text-white tracking-tighter">4.2x</p>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-primary">Community ROI</p>
                   </div>
                </div>
             </div>
             <div className="relative">
                <div className="aspect-square bg-white/5 rounded-[4rem] border border-white/10 p-12 flex flex-col justify-center gap-8 relative overflow-hidden">
                   <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10" />
                   {[
                     { icon: <ShieldCheck />, text: "Household stability is the foundation of national security." },
                     { icon: <Sparkles />, text: "Localized empowerment reduces urban migration pressure." },
                     { icon: <Users />, text: "Cooperative systems built by women are more resilient to crisis." }
                   ].map((item, i) => (
                     <div key={i} className="flex gap-6 items-start">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                           {item.icon}
                        </div>
                        <p className="text-white font-medium italic text-lg leading-tight">{item.text}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Team / Collective Section (Minimalist) */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 underline decoration-primary decoration-8 underline-offset-[12px]">The Collective</h2>
            <p className="text-muted-foreground font-medium italic max-w-xl mx-auto">"None of us is as powerful as all of us synchronized."</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[1,2,3,4].map(i => (
               <div key={i} className="aspect-[4/5] bg-secondary/20 rounded-3xl border-2 border-border flex flex-col items-center justify-end p-8 text-center hover:border-primary transition-all group">
                  <div className="w-20 h-20 bg-muted rounded-full mb-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                  <p className="font-black uppercase tracking-tight text-sm">Architect 0{i}</p>
                  <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Lead Strategist</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-12">Move from Awareness <br />to <span className="italic opacity-80 underline decoration-white decoration-4 underline-offset-8">Manifestation.</span></h2>
           <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/#campaigns">
                <Button className="h-16 px-12 bg-white text-primary hover:bg-white/90 text-sm font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95">
                   Initiate Support
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="h-16 px-12 border-white/30 text-white hover:bg-white/10 text-sm font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95">
                   Collaborate
                </Button>
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
