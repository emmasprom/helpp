import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { ChatMessage } from '@/src/types';
import { generateAIContent } from '@/src/services/geminiService';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async (forcedInput?: string) => {
    const textToSend = forcedInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!forcedInput) setInput('');
    setIsLoading(true);

    try {
      // Special logic for "Show me missions"
      if (textToSend.toLowerCase().includes('mission') || textToSend.toLowerCase().includes('campaign')) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I have gathered the current manifestations of hope. Choose a destiny to support:\n\n1. 🌊 **Pure Life Initiative** - Bringing clean water to 50 communities.\n2. 🍎 **Nutrition Nexus** - Ending hunger for vulnerable children.\n3. 📚 **Education Sovereign** - Empowering future leaders through schooling.\n\nWhich path shall you choose?",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      const result = await generateAIContent(textToSend, {
        systemPrompt: `You are The Oracle of Resonance for HELPP NGO. 
        Your goal is to guide souls (users) toward collective impact, treating every interaction as a meaningful connection.
        Speak with deep empathy, philosophical wisdom, and encouraging authority. 
        View every donation not as a transaction, but as a sacred bridge between a person's abundance and another's destiny.
        Always be polite, emotionally resonant, and gently persuasive. Keep responses concise but spiritually impactful.`,
        history: messages.slice(-5),
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, my resonance is currently interrupted by the cosmic void. Please try again soon.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[600px] max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden relative border border-gray-200"
          >
            {/* Header */}
            <div className="p-4 bg-[#0084ff] text-white flex items-center justify-between relative z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-sm tracking-tight text-white">The Oracle</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/10 text-white rounded-full h-8 w-8"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white scroll-smooth">
              {messages.length === 0 && (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full mx-auto flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-[#0084ff]" />
                  </div>
                  <div className="px-6">
                    <p className="text-gray-900 font-bold text-base">How can I help?</p>
                    <p className="text-gray-500 text-xs mt-2 px-4 italic leading-relaxed mb-6">
                      I can help you navigate our missions, understand our impact, or guide your contribution to the collective.
                    </p>
                    <div className="flex flex-col gap-2">
                       <Button 
                         variant="outline" 
                         className="rounded-full border-[#0084ff] text-[#0084ff] hover:bg-blue-50 font-bold"
                         onClick={() => handleSend('Show me current missions')}
                       >
                         Explore Missions
                       </Button>
                       <Button 
                         variant="outline" 
                         className="rounded-full border-[#ffc107] text-[#ffc107] hover:bg-amber-50 font-bold"
                         onClick={() => handleSend('How can I donate?')}
                       >
                         How to Donate
                       </Button>
                    </div>
                  </div>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 text-sm shadow-sm relative ${
                      msg.role === 'user'
                        ? 'bg-[#0084ff] text-white rounded-[20px] rounded-tr-none'
                        : 'bg-[#ffc107] text-black rounded-[20px] rounded-tl-none font-medium'
                    }`}
                  >
                    <div className="relative z-10 leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#ffc107] px-4 py-3 rounded-[20px] rounded-tl-none flex gap-1.5 items-center">
                    <div className="w-2 h-2 bg-black/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-black/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-black/40 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-gray-100 bg-[#fef3c7] shrink-0 z-20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-white h-11 border border-gray-200 rounded-full px-5 focus:outline-none focus:ring-1 focus:ring-[#0084ff] text-sm text-black shadow-inner"
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !input.trim()} 
                  className="h-11 w-11 shrink-0 rounded-full bg-[#0084ff] text-white hover:bg-blue-600 transition-all active:scale-95 shadow-lg flex items-center justify-center disabled:opacity-50"
                >
                  <Send className="w-5 h-5 ml-1" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`h-16 w-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-white text-gray-800' : 'bg-[#0084ff] text-white'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageSquare className="w-7 h-7 fill-current" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
