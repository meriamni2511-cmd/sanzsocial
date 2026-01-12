
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Sparkles, Loader2, ArrowRight, Zap, MessageSquare, X, ChevronDown } from 'lucide-react';
import { parseSocialCommand, chatWithAssistant } from '../services/geminiService';
import { SocialCommandIntent } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface CommandCenterProps {
  onCommandProcessed: (intent: SocialCommandIntent) => void;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ onCommandProcessed }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Halo! Saya Bina. Apa yang boleh saya bantu anda uruskan hari ini?' }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isExpanded]);

  const handleSendMessage = async (e?: React.FormEvent, textToUse?: string) => {
    e?.preventDefault();
    const finalInput = textToUse || inputValue;
    if (!finalInput || isProcessing) return;

    const userMsg: Message = { role: 'user', text: finalInput };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsProcessing(true);
    setIsExpanded(true);

    try {
      // 1. Get conversational response
      const history = messages.concat(userMsg).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const aiResponse = await chatWithAssistant(history);
      setMessages(prev => [...prev, { role: 'model', text: aiResponse || 'Maaf, saya menghadapi gangguan saraf.' }]);

      // 2. Secretly check for intent if the message looks like a command
      const intent = await parseSocialCommand(finalInput);
      if (intent && (intent.action === 'POST' || intent.action === 'SCHEDULE')) {
        onCommandProcessed(intent);
      }
    } catch (error) {
      console.error("AI Agent error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Terdapat ralat teknikal. Sila cuba sebentar lagi.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 relative z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 400, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass rounded-t-2xl border-b-0 overflow-hidden flex flex-col mb-[-1px]"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-zinc-950/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Neural Chat Session</span>
              </div>
              <button onClick={() => setIsExpanded(false)} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                <ChevronDown className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/10' 
                    : 'bg-zinc-800/80 text-zinc-200 border border-white/5 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800/40 px-4 py-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        layout
        className={`glass ${isExpanded ? 'rounded-b-2xl rounded-t-none' : 'rounded-2xl'} neural-border overflow-hidden p-1 shadow-[0_0_50px_rgba(99,102,241,0.15)] transition-all`}
      >
        <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-zinc-950/40 rounded-[14px] p-4 group">
          <div className="flex items-center gap-3 text-indigo-400 pl-2">
            <Zap className={`w-5 h-5 ${isProcessing ? 'animate-pulse text-purple-400' : ''}`} />
            <div className="h-6 w-[1px] bg-white/10" />
          </div>
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Katakan arahan anda... (cth: 'Post video ni ke YouTube dan Twitter')"
            className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-zinc-500 font-medium"
          />

          <button
            type="submit"
            disabled={!inputValue || isProcessing}
            className={`p-2 rounded-xl transition-all ${
              inputValue ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40' : 'bg-zinc-800 text-zinc-600'
            } active:scale-95`}
          >
            {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
          </button>
        </form>
      </motion.div>

      <AnimatePresence>
        {!isExpanded && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-4 flex gap-3 overflow-x-auto scrollbar-hide pb-2"
          >
            {[
              "Post topik AI ke YouTube",
              "Schedule post Twitter esok pukul 10 pagi",
              "Tolong buat thread LinkedIn tentang Bina.ai",
            ].map((hint, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(undefined, hint)}
                className="glass whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white hover:border-indigo-500/50 transition-all flex items-center gap-2 active:scale-95"
              >
                <MessageSquare className="w-3 h-3" />
                {hint}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommandCenter;
