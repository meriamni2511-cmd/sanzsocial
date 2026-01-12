
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, ArrowRight, Github, Chrome, Loader2 } from 'lucide-react';
import GlassCard from './GlassCard';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate auth latency
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-10 flex flex-col items-center gap-8" useNeuralBorder={true}>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
              <Zap className="w-8 h-8 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter">Enter Bina.ai</h1>
              <p className="text-zinc-500 text-sm font-medium mt-1">Autonomous Social Orchestration System</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-1">Access Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="w-full bg-zinc-950/60 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-1">Nexus Code</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  required
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-zinc-950/60 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black hover:bg-zinc-200 py-4 rounded-xl font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {isSubmitting ? 'Syncing...' : 'Initiate Session'}
            </button>
          </form>

          <div className="w-full space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-zinc-900/40 px-3 text-zinc-600">Enterprise SSO</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors">
                <Github className="w-4 h-4" /> GitHub
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors">
                <Chrome className="w-4 h-4" /> Google
              </button>
            </div>
          </div>
        </GlassCard>
        
        <p className="text-center mt-8 text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] leading-relaxed">
          Proprietary Intelligence System &copy; 2025<br/>
          Secure Node Connection Required
        </p>
      </motion.div>
    </div>
  );
};

export default LoginView;
