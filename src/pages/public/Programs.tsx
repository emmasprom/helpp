import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sprout, Sun, GraduationCap, Heart, ArrowRight, Zap, Coffee, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const programs = [
  {
    icon: <Sprout className="w-8 h-8" />,
    title: "Agricultural Empowerment",
    desc: "Providing training, high-yield tools, and access to sustainable irrigation to improve farm productivity and food security.",
    impact: "Impact: 5,000+ Farmers Assisted",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
  },
  {
    icon: <Sun className="w-8 h-8" />,
    title: "Renewable Energy",
    desc: "Solar-powered solutions for irrigation, crop storage, and nighttime processing to extend the productive hours of rural workers.",
    impact: "Impact: 200+ Rural Grids Deployed",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20"
  },
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: "Training & Capacity Building",
    desc: "Practical workshops in agribusiness management, digital literacy, finance, and community leadership for youth and adults.",
    impact: "Impact: 1,200 Certificates Awarded",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Women Empowerment",
    desc: "Supporting women-led cooperatives with micro-grants, legal advocacy, and dedicated supply chain integration.",
    impact: "Impact: 45 Active Cooperatives",
    color: "bg-rose-500/10 text-rose-600 border-rose-500/20"
  }
];

export default function Programs() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header Section */}
      <section className="py-24 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <Badge variant="outline" className="mb-6 px-6 py-2 rounded-full border-primary/20 text-primary font-black uppercase tracking-widest text-[10px]">
            Operational Spheres
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">Programs & <br /><span className="text-primary italic">Initiatives.</span></h1>
          <p className="text-muted-foreground text-xl font-medium italic max-w-2xl">
            HELPP delivers practical programs that strengthen livelihoods, build women’s economic power, and support community resilience.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-24 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {programs.map((program, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-12 bg-card border-2 border-border hover:border-primary/30 rounded-[3.5rem] transition-all group flex flex-col items-start gap-8 shadow-sm hover:shadow-xl"
              >
                <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center border transition-all group-hover:scale-110 ${program.color}`}>
                   {program.icon}
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-black uppercase tracking-tighter group-hover:text-primary transition-colors">{program.title}</h2>
                  <p className="text-muted-foreground font-medium italic leading-relaxed text-lg">
                    {program.desc}
                  </p>
                </div>
                <div className="mt-auto w-full flex items-center justify-between border-t border-border pt-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-full">{program.impact}</span>
                  <Link to="/#campaigns" className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                    View Missions <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Integration Section */}
      <section className="py-32 bg-foreground text-background">
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-24 items-center">
               <div className="lg:w-1/2">
                  <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">Fueled by <br /><span className="text-primary italic">Deep Integration.</span></h2>
                  <p className="text-white/60 text-xl font-medium italic mb-12">
                     Our programs aren't just standalone acts of charity; they are integrated nodes in a larger ecosystem powered by AI and real-time vetting.
                  </p>
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <Zap className="w-10 h-10 text-primary" />
                        <h4 className="font-black uppercase tracking-tight text-xl">Real-time Vetting</h4>
                        <p className="text-white/40 text-xs font-medium italic leading-relaxed">Every recipient is identity-verified via national databases to ensure integrity.</p>
                     </div>
                     <div className="space-y-4">
                        <Globe className="w-10 h-10 text-primary" />
                        <h4 className="font-black uppercase tracking-tight text-xl">Supply Logic</h4>
                        <p className="text-white/40 text-xs font-medium italic leading-relaxed">AI optimizes seed and tool distribution based on hyper-local climate data.</p>
                     </div>
                  </div>
               </div>
               <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                  <div className="h-40 bg-white/5 rounded-3xl border border-white/10" />
                  <div className="h-40 bg-primary/20 rounded-3xl border border-white/10 mt-12" />
                  <div className="h-40 bg-white/10 rounded-3xl border border-white/10 -mt-12" />
                  <div className="h-40 bg-white/5 rounded-3xl border border-white/10" />
               </div>
            </div>
         </div>
      </section>

      {/* Community Evidence */}
      <section className="py-32 bg-background overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
           <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                 <h3 className="text-4xl font-black uppercase tracking-tighter mb-6">Voices of <br /><span className="text-primary italic">Manifestation.</span></h3>
                 <p className="text-muted-foreground font-medium italic leading-relaxed">Direct frequency from the field. Real impact, real people.</p>
              </div>
              <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
                 {[
                   { q: "The solar grid changed my bakery business in Ekiti. I no longer lose dough to heat.", a: "Aisha B., Ekiti Bakers Coop" },
                   { q: "The high-yield maize training doubled my harvest this season. My children are back in school.", a: "Musa K., Agba Farms" }
                 ].map((t, i) => (
                   <div key={i} className="p-8 bg-card border-l-4 border-primary rounded-2xl shadow-sm italic font-medium text-lg leading-relaxed">
                      "{t.q}"
                      <p className="not-italic mt-4 font-black uppercase tracking-widest text-[10px] text-primary">{t.a}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-primary text-white text-center">
        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-12 italic">Join the Effort.</h2>
        <div className="flex gap-4 justify-center">
           <Link to="/#campaigns">
             <Button className="h-16 px-12 bg-white text-primary hover:bg-white/90 text-sm font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95">Support a node</Button>
           </Link>
        </div>
      </section>
    </div>
  );
}
