
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Zap, ChevronRight, Activity } from 'lucide-react';
import GlassCard from './GlassCard';

const PredictiveCalendar: React.FC = () => {
  // Real-world distribution curve for engagement (simulated visually but presented as system analysis)
  const scores = [
    0.1, 0.05, 0.02, 0.01, 0.02, 0.15, 0.3, 0.45, 0.6, 0.5, 0.4, 0.35, 
    0.4, 0.55, 0.65, 0.7, 0.8, 0.9, 0.95, 0.85, 0.7, 0.5, 0.3, 0.2
  ];
  
  return (
    <GlassCard className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-500/10 rounded-xl">
            <CalendarIcon className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-white">Neural Dispatch Plan</h2>
        </div>
        <div className="flex items-center gap-1.5 bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
          <Activity className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest text-accent">LIVE</span>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        <div className="bg-zinc-900/40 p-4 rounded-2xl border border-white/5">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Optimal Broadcast Window</div>
          <div className="text-xl font-black text-white">Today @ <span className="text-indigo-400">19:30</span> <span className="text-[10px] text-zinc-500 font-normal ml-1">LCL</span></div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            <span>Engagement Density</span>
            <span>AI Probability Matrix</span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
            {scores.map((score, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.15, zIndex: 10 }}
                whileTap={{ scale: 0.95 }}
                className="relative h-10 rounded-lg group transition-all duration-300 cursor-pointer"
                style={{
                  backgroundColor: `rgba(99, 102, 241, ${0.1 + score * 0.9})`,
                  boxShadow: score > 0.8 ? '0 0 15px rgba(99, 102, 241, 0.3)' : 'none',
                  border: score > 0.8 ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid rgba(255,255,255,0.02)'
                }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block z-[50]">
                  <div className="glass px-3 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap shadow-2xl border-white/10 text-white">
                     {i}:00 • {Math.round(score * 100)}% Probability
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-zinc-600 font-black uppercase tracking-tighter">
            <span>00:00</span>
            <span>12:00</span>
            <span>23:59</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
            <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> High Affinity Nodes
            </h3>
            {[
              { label: "Viral Velocity Thread", time: "19:30 Today", badge: "OPTIMAL" },
              { label: "Community Signal Broadcast", time: "21:15 Today", badge: "STABLE" }
            ].map((node, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 group cursor-pointer"
                >
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold tracking-tight text-white/90">{node.label}</span>
                        <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${node.badge === 'OPTIMAL' ? 'bg-accent' : 'bg-indigo-500'}`} /> {node.time}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`text-[9px] font-black px-2 py-1 rounded-lg border ${node.badge === 'OPTIMAL' ? 'bg-accent/20 text-accent border-accent/20' : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20'}`}>{node.badge}</div>
                        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
      
      <button className="mt-6 w-full py-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all border border-white/5">
         Synchronize Global Matrix
      </button>
    </GlassCard>
  );
};

export default PredictiveCalendar;
