
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, 
  Shield, 
  Cpu, 
  Save, 
  RefreshCcw, 
  CheckCircle2, 
  Loader2, 
  Activity, 
  AlertTriangle,
  Zap,
  Lock,
  BarChart3,
  History,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import GlassCard from './GlassCard';
import { encryptKey, decryptKey } from '../services/cryptoService';
import { KeyStats } from '../types';
import { checkAyrshareHealth } from '../services/ayrshareService';

const NodeMetric: React.FC<{ stats: KeyStats | null; label: string }> = ({ stats, label }) => (
  <div className="grid grid-cols-3 gap-2 mt-3">
    <div className="bg-black/20 p-2 rounded-lg border border-white/5">
      <div className="text-[8px] text-zinc-500 uppercase font-bold tracking-tighter">Sent</div>
      <div className="text-xs font-black text-indigo-400">{stats?.successCount || 0}</div>
    </div>
    <div className="bg-black/20 p-2 rounded-lg border border-white/5">
      <div className="text-[8px] text-zinc-500 uppercase font-bold tracking-tighter">Failed</div>
      <div className="text-xs font-black text-red-400">{stats?.failCount || 0}</div>
    </div>
    <div className="bg-black/20 p-2 rounded-lg border border-white/5">
      <div className="text-[8px] text-zinc-500 uppercase font-bold tracking-tighter">Health</div>
      <div className={`text-xs font-black ${stats?.isExhausted ? 'text-red-500' : 'text-accent'}`}>
        {stats?.isExhausted ? '0%' : '100%'}
      </div>
    </div>
  </div>
);

const SettingsView: React.FC = () => {
  const [ayrshareKey1, setAyrshareKey1] = useState('');
  const [ayrshareKey2, setAyrshareKey2] = useState('');
  const [stats1, setStats1] = useState<KeyStats | null>(null);
  const [stats2, setStats2] = useState<KeyStats | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const [health1, setHealth1] = useState<'idle' | 'checking' | 'ok' | 'fail'>('idle');
  const [health2, setHealth2] = useState<'idle' | 'checking' | 'ok' | 'fail'>('idle');
  
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  useEffect(() => {
    const k1 = localStorage.getItem('ayrshare_api_key_primary');
    const k2 = localStorage.getItem('ayrshare_api_key_failover');
    if (k1) setAyrshareKey1(decryptKey(k1));
    if (k2) setAyrshareKey2(decryptKey(k2));

    const s1 = localStorage.getItem('ayrshare_stats_primary');
    const s2 = localStorage.getItem('ayrshare_stats_failover');
    if (s1) setStats1(JSON.parse(s1));
    if (s2) setStats2(JSON.parse(s2));

    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      window.aistudio.hasSelectedApiKey().then(setHasGeminiKey);
    }
  }, []);

  const handleSaveAyrshare = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('ayrshare_api_key_primary', encryptKey(ayrshareKey1));
      localStorage.setItem('ayrshare_api_key_failover', encryptKey(ayrshareKey2));
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1200);
  };

  const testConnection = async (node: 1 | 2) => {
    const key = node === 1 ? ayrshareKey1 : ayrshareKey2;
    if (!key) return;

    if (node === 1) setHealth1('checking');
    else setHealth2('checking');

    const ok = await checkAyrshareHealth(key);

    if (node === 1) setHealth1(ok ? 'ok' : 'fail');
    else setHealth2(ok ? 'ok' : 'fail');

    setTimeout(() => {
      if (node === 1) setHealth1('idle');
      else setHealth2('idle');
    }, 3000);
  };

  const resetRotation = () => {
    localStorage.removeItem('ayrshare_stats_primary');
    localStorage.removeItem('ayrshare_stats_failover');
    setStats1(null);
    setStats2(null);
  };

  const handleSwitchNeuralCore = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setHasGeminiKey(true);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-black tracking-tighter text-white">System Configuration</h1>
        <p className="text-zinc-500 text-sm font-medium">Securely manage your neural links and orchestration dispatchers.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Ayrshare Rotation System - Left Column */}
        <div className="xl:col-span-2 space-y-6">
          <GlassCard className="flex flex-col gap-6" useNeuralBorder={true}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/10 rounded-2xl">
                  <RefreshCcw className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">Social Dispatch Nexus</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 bg-white/5 px-2 py-0.5 rounded">Ayrshare Integration</span>
                    <div className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-accent flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Encrypted Storage
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={resetRotation}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-zinc-600 hover:text-indigo-400 border border-white/5"
                title="Reset Node Metrics"
              >
                <History className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-8 mt-4">
              {/* Primary Node */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stats1?.isExhausted ? 'bg-red-500' : 'bg-indigo-500 animate-pulse'}`} />
                    <label className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-400">Node 01: Primary Link</label>
                  </div>
                  <AnimatePresence mode="wait">
                    {health1 !== 'idle' && (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${
                          health1 === 'checking' ? 'text-zinc-500' : health1 === 'ok' ? 'text-accent' : 'text-red-500'
                        }`}
                      >
                        {health1 === 'checking' ? <Loader2 className="w-3 h-3 animate-spin" /> : health1 === 'ok' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {health1 === 'checking' ? 'Validating...' : health1 === 'ok' ? 'Active' : 'Connection Error'}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="relative group">
                  <Key className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${stats1?.isExhausted ? 'text-red-900' : 'text-zinc-600 group-focus-within:text-indigo-400'}`} />
                  <input 
                    type="password" 
                    value={ayrshareKey1}
                    onChange={(e) => setAyrshareKey1(e.target.value)}
                    placeholder="Enter Primary API Key..." 
                    className={`w-full bg-zinc-950/60 border rounded-xl pl-12 pr-28 py-4 text-sm focus:outline-none transition-all font-medium ${stats1?.isExhausted ? 'border-red-500/50 text-red-200' : 'border-white/10 focus:ring-2 focus:ring-indigo-500/30'}`}
                  />
                  <button 
                    onClick={() => testConnection(1)}
                    disabled={health1 === 'checking' || !ayrshareKey1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all border border-white/5 active:scale-95 disabled:opacity-30"
                  >
                    Test Node
                  </button>
                </div>
                <NodeMetric stats={stats1} label="Node 01" />
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700">Automatic Failover Path</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              {/* Failover Node */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${ayrshareKey2 ? (stats1?.isExhausted ? 'bg-purple-500 animate-pulse' : 'bg-zinc-700') : 'bg-zinc-800'}`} />
                    <label className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-400">Node 02: Secondary Link</label>
                  </div>
                  <AnimatePresence mode="wait">
                    {health2 !== 'idle' && (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${
                          health2 === 'checking' ? 'text-zinc-500' : health2 === 'ok' ? 'text-accent' : 'text-red-500'
                        }`}
                      >
                        {health2 === 'checking' ? <Loader2 className="w-3 h-3 animate-spin" /> : health2 === 'ok' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {health2 === 'checking' ? 'Validating...' : health2 === 'ok' ? 'Active' : 'Connection Error'}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-purple-400 transition-colors" />
                  <input 
                    type="password" 
                    value={ayrshareKey2}
                    onChange={(e) => setAyrshareKey2(e.target.value)}
                    placeholder="Enter Failover API Key..." 
                    className="w-full bg-zinc-950/60 border border-white/10 rounded-xl pl-12 pr-28 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all font-medium placeholder:text-zinc-700"
                  />
                  <button 
                    onClick={() => testConnection(2)}
                    disabled={health2 === 'checking' || !ayrshareKey2}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all border border-white/5 active:scale-95 disabled:opacity-30"
                  >
                    Test Node
                  </button>
                </div>
                <NodeMetric stats={stats2} label="Node 02" />
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleSaveAyrshare}
                  disabled={isSaving}
                  className={`w-full py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all ${
                    isSaved 
                    ? 'bg-accent text-white shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.25)] active:scale-95'
                  } disabled:opacity-50`}
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : isSaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                  {isSaving ? 'Establishing Neural Link...' : isSaved ? 'Configuration Secured' : 'Update Orchestration Nodes'}
                </button>
              </div>
            </div>
          </GlassCard>

          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-6 flex gap-4">
             <div className="p-3 bg-indigo-500/10 rounded-xl h-fit">
                <AlertCircle className="w-5 h-5 text-indigo-400" />
             </div>
             <div className="space-y-2">
                <h3 className="text-sm font-black tracking-tight text-white/90">How Rotation Works</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Bina.ai implements an intelligent circuit-breaker pattern. Node 01 is always the primary dispatcher. If Node 01 encounters a rate limit (429) or quota exhaustion (402), the system hot-swaps to Node 02 instantly. Rotation metrics are reset once the primary node recovers.
                </p>
                <a href="https://www.ayrshare.com" target="_blank" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors mt-2">
                  Get API Keys <ExternalLink className="w-3 h-3" />
                </a>
             </div>
          </div>
        </div>

        {/* Right Sidebar - Status & Neural Core */}
        <div className="space-y-6">
          {/* Active Path Visualizer */}
          <GlassCard className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-accent/10 rounded-xl">
                <Activity className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-lg font-black tracking-tight">Node Topology</h2>
            </div>
            
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-4 py-4">
                 <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${!stats1?.isExhausted ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-zinc-900 border-white/5 text-zinc-600'}`}>
                    <Zap className={`w-3 h-3 ${!stats1?.isExhausted ? 'fill-indigo-400' : ''}`} /> NODE 01
                 </div>
                 <div className="flex flex-col items-center gap-1">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-500/50 to-purple-500/50" />
                    <ChevronRight className="w-4 h-4 text-zinc-700 rotate-90" />
                 </div>
                 <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${stats1?.isExhausted ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'bg-zinc-900 border-white/5 text-zinc-600'}`}>
                    <Zap className={`w-3 h-3 ${stats1?.isExhausted ? 'fill-purple-400' : ''}`} /> NODE 02
                 </div>
              </div>

              <div className="bg-black/20 rounded-xl p-4 border border-white/5 space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                  <span className="text-zinc-500">Global Health</span>
                  <span className="text-accent">Stable</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: stats1?.isExhausted && !ayrshareKey2 ? '10%' : '100%' }}
                    className={`h-full bg-gradient-to-r ${stats1?.isExhausted && !ayrshareKey2 ? 'from-red-500 to-red-600' : 'from-indigo-500 via-purple-500 to-accent'}`}
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Gemini Node Integration */}
          <GlassCard className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-500/10 rounded-xl">
                <Cpu className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-black tracking-tight">Neural Core Engine</h2>
            </div>

            <div className="bg-zinc-950/40 p-5 rounded-2xl border border-white/5 space-y-5">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl transition-all shadow-inner ${hasGeminiKey ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/10' : 'bg-zinc-900 text-zinc-600 border border-white/5'}`}>
                  <Zap className={`w-6 h-6 ${hasGeminiKey ? 'fill-indigo-400/20' : ''}`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-black tracking-tight text-white/90">{hasGeminiKey ? 'Gemini 3.0 Pro' : 'Core Offline'}</div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{hasGeminiKey ? 'Multi-Modal Active' : 'Waiting for Auth'}</div>
                </div>
              </div>

              <button 
                onClick={handleSwitchNeuralCore} 
                className="w-full py-3.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white border border-white/10 transition-all flex items-center justify-center gap-2 group"
              >
                <RefreshCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                {hasGeminiKey ? 'Rotate Neural Key' : 'Connect Neural Core'}
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
