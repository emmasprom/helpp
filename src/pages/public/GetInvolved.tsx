import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Smartphone, Megaphone, Shield, Rocket, HandHeart, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const volunteerRoles = [
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Tech Synchronization",
    desc: "Build the digital infrastructure that powers global hope. We need React experts, mobile developers, and data architects.",
    link: "Join Engineering"
  },
  {
    icon: <Megaphone className="w-8 h-8" />,
    title: "Impact Amplification",
    desc: "Tell the stories that the world needs to hear. We need storytellers, content creators, and social media strategists.",
    link: "Join Storytelling"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Community Coordination",
    desc: "Orchestrate local support groups on the ground. We need project managers and regional coordinators.",
    link: "Join Logistics"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Neural Vetting",
    desc: "Ensure every mission meets our standards. We need researchers and compliance specialists.",
    link: "Join Governance"
  }
];

export default function GetInvolved() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero */}
      <section className="py-24 md:py-32 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent)]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Badge variant="outline" className="mb-8 px-6 py-2 rounded-full border-white/20 text-white font-black uppercase tracking-widest text-[10px] bg-white/5 backdrop-blur-sm">
            Architect Program
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 uppercase">
            Lend Your <br /><span className="italic opacity-80 underline decoration-white decoration-8 underline-offset-8">Neural Link.</span>
          </h1>
          <p className="text-white/80 text-xl md:text-2xl font-medium italic max-w-3xl leading-relaxed mb-12">
            Impact isn't just about capital. It's about capacity. Join our collective of architects committed to manifesting human potential.
          </p>
          <div className="flex gap-4">
             <Button className="h-16 px-12 bg-white text-primary hover:bg-white/90 text-sm font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95">
                Apply to Collective
             </Button>
          </div>
        </div>
      </section>

      {/* Roles Grid */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Ways to <span className="text-primary italic">Contribute.</span></h2>
            <p className="text-muted-foreground font-medium italic max-w-xl mx-auto italic leading-relaxed">
              "Whatever your frequency, the Oracle has a node for you."
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {volunteerRoles.map((role, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-card border-2 border-border hover:border-primary/30 rounded-[2.5rem] transition-all group flex flex-col h-full"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                   {role.icon}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 group-hover:text-primary transition-colors leading-[1.1]">{role.title}</h3>
                <p className="text-muted-foreground font-medium italic text-sm leading-relaxed mb-8 flex-grow">
                  {role.desc}
                </p>
                <Button variant="outline" className="w-full border-border hover:border-primary text-primary font-black uppercase text-[10px] tracking-widest rounded-xl group-hover:bg-primary group-hover:text-white transition-all h-12">
                   {role.link}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4">
           <div className="bg-foreground text-background p-12 md:p-24 rounded-[4rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/10 blur-[100px] rounded-full" />
              <div className="relative z-10 grid lg:grid-cols-2 gap-24 items-center">
                 <div>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-12 italic">Our Covenant.</h2>
                    <div className="space-y-8">
                       {[
                         { title: "No Hierarchy", desc: "Every node in the Helen Collective is equal in importance." },
                         { title: "Radical Transparency", desc: "Your efforts are logged and their impact is visible in real-time." },
                         { title: "Human Centric", desc: "Technology is our servant, but human dignity is our master." }
                       ].map((v, i) => (
                         <div key={i} className="flex gap-6">
                            <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-primary font-black text-xs shrink-0">{i+1}</div>
                            <div>
                               <h4 className="font-black uppercase tracking-tight text-xl mb-2 text-white">{v.title}</h4>
                               <p className="text-white/50 text-sm font-medium italic leading-relaxed">{v.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="flex flex-col items-center gap-8">
                    <HandHeart className="w-32 h-32 text-primary animate-bounce p-4 bg-white/5 rounded-full" />
                    <div className="text-center">
                       <p className="text-4xl font-black text-white tracking-tighter mb-2">1,200+</p>
                       <p className="text-[10px] uppercase font-bold tracking-widest text-primary">Active Global Architects</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Small FAQ about Volunteering */}
      <section className="py-24 bg-background">
        <div className="max-w-3xl mx-auto px-4 text-center">
           <h3 className="text-2xl font-black uppercase tracking-tight mb-8 italic">Ready to Synchronize?</h3>
           <p className="text-muted-foreground font-medium italic mb-12">
              The application process involves a brief neural vetting to ensure your skills align with current project trajectories. We respond to all frequencies within 72 hours.
           </p>
           <Button size="lg" className="h-20 px-16 bg-primary text-white hover:bg-primary/90 text-2xl font-black rounded-3xl transition-all active:scale-95 uppercase shadow-2xl shadow-primary/20">
              Apply to Synchronize
           </Button>
        </div>
      </section>
    </div>
  );
}
