import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Wand2, ArrowRight, Save, Send, Smartphone, Mail, Zap, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { generateAIContent } from '@/src/services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/src/lib/firebase';
import { useNavigate } from 'react-router-dom';

import { handleFirestoreError, OperationType } from '@/src/lib/firestore-errors';

export default function AiBuilderView() {
  const [idea, setIdea] = useState('');
  const [audience, setAudience] = useState('');
  const [region, setRegion] = useState('Global');
  const [impactArea, setImpactArea] = useState('Education');
  const [pillar, setPillar] = useState('Resilience');
  const [urgency, setUrgency] = useState('Medium');
  const [endDate, setEndDate] = useState('');
  const [suggestedIdeas, setSuggestedIdeas] = useState<any[]>([]);
  const [fetchingIdeas, setFetchingIdeas] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [originalResult, setOriginalResult] = useState<any>(null);
  const [modifiedFields, setModifiedFields] = useState<string[]>([]);
  const [pendingResult, setPendingResult] = useState<any>(null);
  const [showApproval, setShowApproval] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manual');

  const fetchSuggestions = async () => {
    setFetchingIdeas(true);
    try {
      const text = await generateAIContent(
        `Research current trending global humanitarian needs and suggest 3-4 highly impactful campaign ideas for HELPP NGO.
        
        Parameters: 
        - Region: ${region}
        - Category: ${impactArea}
        - Core Mission Pillar: ${pillar}
        - Desired Urgency: ${urgency}
        
        HELPP core mission: Bridging human potential and resources in Nigeria and beyond.
        Focus on how ${pillar} can be manifest in the ${region} region within the context of ${impactArea}.
        
        Respond ONLY in valid JSON format as a list of objects with these fields: 
        missionTitle (compelling, evocative), 
        soulOfMission (2-3 sentences describing the core idea and its unique "resonance"), 
        suggestedAudience (who would support this?), 
        suggestedCategory (One of: Food Security, Renewable Energy, Education, Crisis Relief, Economic Inclusion),
        suggestedGoal (number),
        suggestedUrgency (low, medium, high),
        urgencyReasoning (briefly why this is a trending global need or mission priority right now).`,
        { 
          useSearch: true,
          systemPrompt: "You are the HELPP Oracle, a master of strategy and impact manifestation. You monitor global trends, humanitarian gaps, and neural patterns to identify where the world is hurting and where HELPP can heal. You think in terms of 'resonance', 'links', and 'manifestation'." 
        }
      );

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        setSuggestedIdeas(JSON.parse(jsonMatch[0]));
      }
      toast.success('Oracle concepts retrieved.');
    } catch (error) {
      toast.error('Oracle Link Busy. Try again later.');
    } finally {
      setFetchingIdeas(false);
    }
  };

  const generateCampaign = async () => {
    if (!idea) {
      toast.error('Please describe your campaign idea');
      return;
    }
    setLoading(true);
    try {
      const text = await generateAIContent(
        `Generate a full fundraising campaign based on this idea: "${idea}" for audience: "${audience}".
        Respond in JSON format with these fields:
        title, story (emotional and 3 paragraphs), summary (one sentence), ctaText, whatsappPromo, emailSubject, emailBody, score (0-100), improvements (list).`,
        { tool: 'Campaign Builder' }
      );

      // Parse JSON from AI response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      let parsed: any = null;
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = { story: text };
      }
      
      setPendingResult(parsed);
      setShowApproval(true);
      toast.info('AI has suggested some concepts. Please review them.');
    } catch (error) {
      toast.error('AI Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => {
    setResult(pendingResult);
    setOriginalResult(pendingResult);
    setModifiedFields([]);
    setPendingResult(null);
    setShowApproval(false);
    toast.success('AI suggestions accepted!');
  };

  const handleDecline = () => {
    setPendingResult(null);
    setShowApproval(false);
    toast.info('AI suggestions discarded.');
  };

  const persistCampaign = async (status: 'draft' | 'published') => {
    if (!result) return;
    setSaving(true);
    try {
      // Ensure we have some default values if AI missed them
      const campaignData = {
        title: result.title || idea.slice(0, 50) || 'AI Generated Campaign',
        shortDescription: result.summary || idea.slice(0, 150) || 'Impactful mission concept generated by AI Resonance.',
        fullStory: result.story || idea,
        targetAmount: 5000, 
        raisedAmount: 0,
        donorCount: 0,
        category: 'Crisis Relief', 
        urgency: 'medium',
        status: status,
        endDate: endDate,
        imageUrl: result.imageUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
        isAiOptimized: true,
        isUserModified: modifiedFields.length > 0,
        modifiedFields: modifiedFields,
        aiData: {
          ...result,
          audience: audience,
          originalResponse: originalResult,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'campaigns'), campaignData);

      toast.success(`Campaign ${status === 'published' ? 'manifested and live!' : 'preserved as draft'}`);
      
      if (status === 'published') {
        navigate('/');
      } else {
        setResult(null);
        setIdea('');
        setAudience('');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'campaigns');
    } finally {
      setSaving(false);
    }
  };

  const updateResultField = (field: string, value: any) => {
    setResult((prev: any) => ({ ...prev, [field]: value }));
    if (!modifiedFields.includes(field)) {
      setModifiedFields(prev => [...prev, field]);
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
           <p className="text-primary font-black uppercase tracking-[0.6em] text-[10px]">The Creator's Tool</p>
           <h1 className="text-6xl font-black tracking-tighter mb-1 uppercase leading-none italic">Mission <br /> Manifest</h1>
           <p className="text-muted-foreground text-sm font-medium italic">"Articulating vision, transforming it into impact."</p>
        </div>
        <div className="px-6 py-3 rounded-full bg-secondary/30 border border-border flex items-center gap-3 text-foreground font-black text-[10px] tracking-widest uppercase">
          <Sparkles className="w-4 h-4 text-primary" />
          Neural Resonance Engine Active
        </div>
      </div>

      {/* Strategic Exploration Section */}
      <Card className="bg-foreground text-background rounded-[4rem] border-none shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <CardHeader className="p-12 pb-6 relative z-10">
          <div className="flex items-center justify-between gap-8 flex-wrap">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary border border-white/10">
                <Globe className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-3xl font-black tracking-tighter uppercase mb-1">Strategic Exploration</CardTitle>
                <CardDescription className="text-white/40 font-medium italic">Synchronize with global trends to find your next mission link.</CardDescription>
              </div>
            </div>
            <Button 
              onClick={fetchSuggestions} 
              disabled={fetchingIdeas}
              className="h-16 px-10 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all active:scale-95 gap-3"
            >
              {fetchingIdeas ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Wand2 className="w-5 h-5" />}
              Extract Concepts
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-12 pt-0 relative z-10">
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Geographic Focus</label>
               <select 
                 className="w-full h-14 bg-white/5 border-2 border-white/10 rounded-2xl px-6 text-white font-bold appearance-none outline-none focus:border-primary transition-all"
                 value={region}
                 onChange={e => setRegion(e.target.value)}
               >
                  <option className="bg-foreground">Global Reach</option>
                  <option className="bg-foreground">West Africa (Regional)</option>
                  <option className="bg-foreground">Nigeria (Hyper-Local)</option>
                  <option className="bg-foreground">Urban Slums</option>
                  <option className="bg-foreground">Rural Heartland</option>
               </select>
            </div>
            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Mission Pillar</label>
               <select 
                 className="w-full h-14 bg-white/5 border-2 border-white/10 rounded-2xl px-6 text-white font-bold appearance-none outline-none focus:border-primary transition-all"
                 value={pillar}
                 onChange={e => setPillar(e.target.value)}
               >
                  <option className="bg-foreground">Resilience (Stability)</option>
                  <option className="bg-foreground">Equality (Opportunity)</option>
                  <option className="bg-foreground">Sustainability (Greener)</option>
                  <option className="bg-foreground">Innovation (AI/Tech)</option>
               </select>
            </div>
            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Impact Domain</label>
               <select 
                 className="w-full h-14 bg-white/5 border-2 border-white/10 rounded-2xl px-6 text-white font-bold appearance-none outline-none focus:border-primary transition-all"
                 value={impactArea}
                 onChange={e => setImpactArea(e.target.value)}
               >
                  <option className="bg-foreground">Food Systems</option>
                  <option className="bg-foreground">Renewable Energy</option>
                  <option className="bg-foreground">Education/Literacy</option>
                  <option className="bg-foreground">Crisis Response</option>
                  <option className="bg-foreground">Economic Inclusion</option>
               </select>
            </div>
            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Kinetic Urgency</label>
               <select 
                 className="w-full h-14 bg-white/5 border-2 border-white/10 rounded-2xl px-6 text-white font-bold appearance-none outline-none focus:border-primary transition-all"
                 value={urgency}
                 onChange={e => setUrgency(e.target.value)}
               >
                  <option className="bg-foreground">Standard Evolution</option>
                  <option className="bg-foreground">Medium Priority</option>
                  <option className="bg-foreground">Time Sensitive</option>
                  <option className="bg-foreground">Immediate Intervention</option>
               </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {suggestedIdeas.length > 0 ? suggestedIdeas.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 bg-white/5 border border-white/10 rounded-[3rem] hover:bg-white/10 transition-all group cursor-pointer border-dashed hover:border-solid hover:border-primary/50 relative overflow-hidden"
                  onClick={() => {
                    setIdea(item.soulOfMission);
                    setAudience(item.suggestedAudience || '');
                    // Use functional update to avoid stale state if needed, though not strictly necessary here
                    toast.success(`'${item.missionTitle}' conceptualized.`);
                  }}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-[7px] uppercase tracking-widest border-primary/20 text-primary bg-primary/5">{item.suggestedCategory || impactArea}</Badge>
                    <Badge variant="outline" className="text-[7px] uppercase tracking-widest border-white/10 text-white/40">${item.suggestedGoal || '5,000'}</Badge>
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-tighter mb-4 leading-tight group-hover:text-primary transition-colors line-clamp-2">{item.missionTitle}</h4>
                  <p className="text-white/40 text-[11px] font-medium italic leading-relaxed mb-6 line-clamp-3">{item.soulOfMission}</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.suggestedUrgency === 'high' ? 'bg-rose-500' : item.suggestedUrgency === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/60">Logic: {item.urgencyReasoning?.split(' ')[0] || 'Strategic'}</span>
                    </div>
                  </div>
                </motion.div>
              )) : (
                [1,2,3,4].map(i => (
                  <div key={i} className="h-40 border-2 border-dashed border-white/5 rounded-[3rem] flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white/5" />
                  </div>
                ))
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-12">
        <Card className="bg-card border-x-4 border-y-2 border-border rounded-[3rem] shadow-2xl h-fit overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
          <CardHeader className="p-10 pb-6">
            <CardTitle className="text-3xl font-black tracking-tight uppercase">Conception</CardTitle>
            <CardDescription className="italic font-medium">Describe the soul of the mission you wish to birth.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-10 pt-0">
            <AnimatePresence>
              {showApproval && pendingResult && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="max-w-md w-full p-10 bg-card border-4 border-primary rounded-[3.5rem] space-y-8 shadow-[0_50px_100px_rgba(37,99,235,0.4)] relative"
                  >
                    <div className="absolute top-6 right-8 text-primary opacity-20">
                       <Sparkles className="w-16 h-16" />
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center text-primary animate-pulse border border-primary/20">
                        <Wand2 className="w-10 h-10" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black uppercase tracking-tighter text-primary leading-none">Oracle <br /> Prophecy</h4>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-2">Manifestation Optimized</p>
                      </div>
                    </div>

                    <div className="bg-secondary/20 p-8 rounded-[2.5rem] space-y-6 border-2 border-border">
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em] mb-2">Sacred Title</p>
                        <p className="text-xl font-black text-foreground italic leading-tight">"{pendingResult.title}"</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em] mb-2">Impact Beacon</p>
                        <p className="text-sm italic text-foreground font-medium leading-relaxed">"{pendingResult.summary}"</p>
                      </div>
                      <div className="pt-6 border-t border-border flex items-center justify-between">
                        <div className="flex flex-col">
                           <span className="text-[8px] font-black uppercase text-muted-foreground mb-1">Clarity Score</span>
                           <Badge className="bg-primary text-white border-none font-black text-xs px-4 py-1">Nexus {pendingResult.score || '85'}%</Badge>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Harmonic Balance</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <Button onClick={handleApprove} className="w-full h-16 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/30 active:scale-95 transition-all">Embrace The Manifestation</Button>
                      <Button onClick={handleDecline} variant="ghost" className="w-full h-14 font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">Seek Another Path</Button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">The Mission Soul</label>
              <Textarea 
                placeholder="What vision has crossed your mind? e.g. Reconstructing a library to preserve ancient wisdom..."
                className="bg-secondary/30 border-2 border-border rounded-[2rem] min-h-[160px] p-6 focus:border-primary text-sm font-medium leading-relaxed italic shadow-inner"
                value={idea}
                onChange={e => setIdea(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Target Collective</label>
              <Input 
                placeholder="e.g. Wise elders and aspiring youth..."
                className="bg-secondary/30 border-2 border-border rounded-2xl h-14 px-6 focus:border-primary font-bold italic"
                value={audience}
                onChange={e => setAudience(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Mission Due Date</label>
              <Input 
                type="date"
                className="bg-secondary/30 border-2 border-border rounded-2xl h-14 px-6 focus:border-primary font-bold italic text-muted-foreground"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
            <Button 
              onClick={generateCampaign} 
              disabled={loading}
              className="w-full bg-foreground text-background hover:bg-primary hover:text-white font-black h-16 rounded-[1.5rem] gap-4 shadow-2xl transition-all active:scale-95 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
              {loading ? (
                <div className="w-6 h-6 border-4 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Wand2 className="w-6 h-6 group-hover:scale-125 transition-transform" />
                  <span className="uppercase tracking-[0.2em] text-xs">Prophesize Concepts</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {result ? (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <Card className="bg-card border-2 border-border rounded-[3.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full" />
              <CardHeader className="flex flex-row items-center justify-between p-10 pb-6 relative z-10 gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Input 
                      value={result.title} 
                      onChange={e => updateResultField('title', e.target.value)}
                      className="text-3xl font-black tracking-tighter text-foreground bg-transparent border-none p-0 focus-visible:ring-0 h-auto uppercase italic"
                    />
                    {modifiedFields.includes('title') && (
                      <Badge variant="outline" className="text-[8px] bg-orange-500/10 text-orange-600 border-orange-500/20 h-5 px-2">Human Sync</Badge>
                    )}
                  </div>
                </div>
                <div className="px-6 py-2 bg-secondary text-primary font-black text-[10px] tracking-widest rounded-full border border-border shrink-0">
                  RESONANCE: {result.score || '85'}%
                </div>
              </CardHeader>
              <CardContent className="p-10 pt-0 relative z-10">
                <Tabs defaultValue="story" className="w-full">
                  <TabsList className="bg-secondary/40 w-full justify-start p-2 mb-8 h-14 border-2 border-border rounded-2xl">
                    <TabsTrigger value="story" className="flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">STORY</TabsTrigger>
                    <TabsTrigger value="whatsapp" className="flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background gap-2 transition-all"><Smartphone className="w-4 h-4" /> SMS</TabsTrigger>
                    <TabsTrigger value="email" className="flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background gap-2 transition-all"><Mail className="w-4 h-4" /> EMAIL</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="story" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                    <div className="space-y-8">
                      <div className="p-6 bg-secondary/20 rounded-[2rem] border-2 border-border shadow-inner relative">
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] block">Mission Signal</label>
                          {modifiedFields.includes('summary') && (
                            <Badge variant="outline" className="text-[7px] bg-orange-500/10 text-orange-600 border-orange-500/20 px-2">Edited</Badge>
                          )}
                        </div>
                        <Textarea 
                          value={result.summary} 
                          onChange={e => updateResultField('summary', e.target.value)}
                          className="text-sm italic bg-transparent border-none p-0 focus-visible:ring-0 min-h-[60px] resize-none font-bold leading-relaxed"
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center ml-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] block">Universal Narrative</label>
                          {modifiedFields.includes('story') && (
                            <Badge variant="outline" className="text-[7px] bg-orange-500/10 text-orange-600 border-orange-500/20 px-2">Refined by Human</Badge>
                          )}
                        </div>
                        <Textarea 
                          value={result.story} 
                          onChange={e => updateResultField('story', e.target.value)}
                          className="bg-card border-2 border-border text-sm leading-relaxed min-h-[300px] rounded-[2.5rem] p-8 focus:border-primary shadow-xl italic font-medium"
                        />
                      </div>
                      <div className="p-6 bg-primary/5 rounded-3xl border-2 border-primary/20">
                         <div className="flex justify-between items-center mb-3">
                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] block">Manifestation Call</label>
                            {modifiedFields.includes('ctaText') && (
                              <Badge variant="outline" className="text-[7px] bg-orange-500/10 text-orange-600 border-orange-500/20 px-2">Human Intent</Badge>
                            )}
                         </div>
                         <Input 
                           value={result.ctaText} 
                           onChange={e => updateResultField('ctaText', e.target.value)}
                           className="bg-white/50 border-none font-black italic text-foreground focus-visible:ring-0"
                           placeholder="e.g. Join the Restoration..."
                         />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="whatsapp" className="animate-in fade-in slide-in-from-right-2">
                     <div className="bg-emerald-500/5 p-8 rounded-[3rem] border-2 border-emerald-500/20 space-y-4 shadow-inner">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.4em]">WhatsApp Resonance Sweep</p>
                          {modifiedFields.includes('whatsappPromo') && (
                            <Badge variant="outline" className="text-[7px] bg-orange-500/10 text-orange-600 border-orange-500/20 px-2 uppercase">Customized</Badge>
                          )}
                        </div>
                        <Textarea 
                          value={result.whatsappPromo} 
                          onChange={e => updateResultField('whatsappPromo', e.target.value)}
                          className="text-sm font-medium italic leading-relaxed bg-transparent border-none p-0 focus-visible:ring-0 min-h-[200px]"
                        />
                     </div>
                  </TabsContent>
...

                  <TabsContent value="email" className="animate-in fade-in slide-in-from-right-2">
                     <div className="space-y-6">
                        <div className="p-6 bg-secondary/30 rounded-2xl border-2 border-border shadow-inner">
                           <div className="flex justify-between items-center mb-2">
                             <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">Divine Outreach Subject</p>
                             {modifiedFields.includes('emailSubject') && (
                               <Badge variant="outline" className="text-[7px] bg-orange-500/10 text-orange-600 border-orange-500/20 px-2 uppercase">Adjusted</Badge>
                             )}
                           </div>
                           <Input 
                            value={result.emailSubject} 
                            onChange={e => updateResultField('emailSubject', e.target.value)}
                            className="text-lg font-black bg-transparent border-none p-0 h-auto focus-visible:ring-0 italic"
                           />
                        </div>
                        <div className="p-8 bg-card border-4 border-foreground rounded-[3rem] text-sm text-foreground italic shadow-2xl relative">
                           <div className="absolute top-4 right-4 z-20">
                             {modifiedFields.includes('emailBody') && (
                               <Badge variant="outline" className="text-[7px] bg-orange-500/10 text-orange-600 border-orange-500/20 px-2 uppercase">Human Authored</Badge>
                             )}
                           </div>
                           <div className="absolute top-4 left-4 opacity-5">
                             <Mail className="w-20 h-20" />
                           </div>
                           <Textarea 
                            value={result.emailBody} 
                            onChange={e => updateResultField('emailBody', e.target.value)}
                            className="bg-transparent border-none p-0 focus-visible:ring-0 min-h-[350px] font-medium leading-relaxed relative z-10"
                           />
                        </div>
                     </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-12 flex flex-col sm:flex-row gap-4">
                   <Button 
                    variant="outline" 
                    className="flex-1 h-16 border-2 border-border rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-secondary transition-all gap-3"
                    onClick={() => persistCampaign('draft')}
                    disabled={saving}
                   >
                      <Save className="w-5 h-5 leading-none" /> Preserve as Draft
                   </Button>
                   <Button 
                    className="flex-1 h-16 bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-primary/30 transition-all active:scale-95 gap-3"
                    onClick={() => persistCampaign('published')}
                    disabled={saving}
                   >
                      <Send className="w-5 h-5" /> {saving ? 'UNFOLDING...' : 'Manifest Mission'}
                   </Button>
                </div>
              </CardContent>
            </Card>

            {result.improvements && (
              <Card className="bg-primary/5 border-2 border-primary/20 rounded-[2.5rem] shadow-xl overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-sm text-primary font-black uppercase tracking-[0.4em] flex items-center gap-3">
                    <Zap className="w-5 h-5 fill-current" /> Wisdom Overlays
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <ul className="space-y-4">
                    {result.improvements.map((tip: string, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-4 italic font-medium leading-relaxed group/tip">
                        <div className="w-2 h-2 rounded-full bg-primary/30 mt-1.5 shrink-0 group-hover/tip:scale-150 transition-transform" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 border-4 border-dashed border-border rounded-[4rem] text-center bg-secondary/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="w-24 h-24 bg-card border-2 border-border shadow-2xl rounded-[2rem] flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform">
              <Sparkles className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <p className="text-foreground text-xl font-black italic tracking-tighter max-w-sm mb-4">Awaiting Divine Inspiration</p>
            <p className="text-muted-foreground text-sm font-medium italic max-w-xs px-10">Describe your vision to the Nexus, and it shall manifest a path for impact.</p>
          </div>
        )}
      </div>
    </div>
  );
}
