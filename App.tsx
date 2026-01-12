
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  PenTool, 
  Calendar as CalendarIcon, 
  Settings, 
  Bell, 
  Zap,
  Menu,
  X,
  ChevronRight,
  User,
  ShieldCheck,
  Users
} from 'lucide-react';
import NeuralBackground from './components/NeuralBackground';
import AIComposer from './components/AIComposer';
import AnalyticsGrid from './components/AnalyticsGrid';
import PredictiveCalendar from './components/PredictiveCalendar';
import CommandCenter from './components/CommandCenter';
import SettingsView from './components/SettingsView';
import GlassCard from './components/GlassCard';
import { SocialCommandIntent } from './types';

const SidebarItem: React.FC<{ icon: any; label: string; active?: boolean; onClick: () => void }> = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]' 
        : 'text-zinc-500 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-bold text-sm tracking-tight">{label}</span>
    {active && <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-indigo-500 ml-auto" />}
  </button>
);

const BottomNavItem: React.FC<{ icon: any; label: string; active?: boolean; onClick: () => void }> = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-all relative ${
      active ? 'text-indigo-400' : 'text-zinc-500'
    }`}
  >
    <div className={`p-1.5 rounded-lg transition-all ${active ? 'bg-indigo-500/10' : ''}`}>
      <Icon className={`w-5 h-5 ${active ? 'fill-indigo-400/20' : ''}`} />
    </div>
    <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
    {active && <motion.div layoutId="bottomActive" className="absolute bottom-0.5 w-1 h-1 rounded-full bg-indigo-400" />}
  </button>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'composer' | 'calendar' | 'settings'>('dashboard');
  const [pendingCommand, setPendingCommand] = useState<SocialCommandIntent | null>(null);

  const handleAICommand = (intent: SocialCommandIntent) => {
    setPendingCommand(intent);
    setActiveTab('composer');
  };

  return (
    <div className="min-h-screen bg-background text-white selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      <NeuralBackground />
      
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/5 hidden lg:flex flex-col p-6 z-40">
        <div className="flex items-center gap-2 mb-10 px-2 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter">Bina<span className="text-indigo-500">.ai</span></span>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={PenTool} label="Composer" active={activeTab === 'composer'} onClick={() => setActiveTab('composer')} />
          <SidebarItem icon={CalendarIcon} label="Calendar" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
          <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 bg-white/5 p-3 rounded-2xl border border-white/5">
            <div className="relative">
              <img src="https://picsum.photos/seed/bina/100/100" className="w-10 h-10 rounded-full border-2 border-indigo-500/30" alt="Profile" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-accent border-2 border-background rounded-full" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-black truncate tracking-tight">Master Node</span>
              <span className="text-[9px] text-indigo-400 uppercase font-black tracking-widest text-left">Active Session</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:ml-64 min-h-screen relative z-10 px-4 pt-6 pb-28 lg:px-10 lg:py-8 transition-all duration-500">
        
        {/* Top Navbar */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4 lg:hidden">
             <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Zap className="w-5 h-5 text-white fill-white" />
             </div>
             <span className="text-xl font-bold tracking-tighter">Bina<span className="text-indigo-500">.ai</span></span>
          </div>

          <div className="hidden lg:flex items-center gap-3">
             <div className="flex items-center gap-2 text-zinc-500 text-xs font-black uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>Production Environment</span>
             </div>
             <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <ChevronRight className="w-4 h-4 text-zinc-700" />
                <span className="text-white font-black capitalize tracking-tight text-xs uppercase opacity-60">{activeTab}</span>
             </div>
          </div>

          <div className="flex items-center gap-2.5">
             <button className="p-2.5 glass rounded-xl relative hover:bg-white/10 transition-colors group">
                <Bell className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-background animate-pulse" />
             </button>
             <button onClick={() => setActiveTab('composer')} className="hidden sm:flex bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-[10px] font-black tracking-widest px-5 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/25 items-center gap-2 active:scale-95">
                <PenTool className="w-3.5 h-3.5" /> NEW DISPATCH
             </button>
             <button className="sm:hidden p-2.5 glass rounded-xl active:bg-white/10">
                <User className="w-5 h-5 text-zinc-400" />
             </button>
          </div>
        </header>

        {/* Neural Command Center */}
        <CommandCenter onCommandProcessed={handleAICommand} />

        {/* Dynamic Views */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    <AnalyticsGrid />
                </div>
                <div className="space-y-6">
                    <PredictiveCalendar />
                </div>
              </div>
            )}

            {activeTab === 'composer' && (
              <div className="max-w-6xl mx-auto lg:h-[calc(100vh-250px)] pb-10 lg:pb-0">
                <AIComposer externalCommand={pendingCommand} />
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="max-w-5xl mx-auto space-y-6">
                 <PredictiveCalendar />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GlassCard className="p-8 flex flex-col items-center justify-center text-center gap-4">
                       <div className="w-16 h-16 bg-indigo-500/10 rounded-3xl flex items-center justify-center">
                          <Zap className="w-8 h-8 text-indigo-400" />
                       </div>
                       <div>
                          <h3 className="text-lg font-black tracking-tight">Neural Strategy Nodes</h3>
                          <p className="text-sm text-zinc-500 max-w-[240px] mt-2">Active analysis suggests prioritizing YouTube short-form content for high conversion during peak hours.</p>
                       </div>
                    </GlassCard>
                    <GlassCard className="p-8 flex flex-col items-center justify-center text-center gap-4">
                       <div className="w-16 h-16 bg-purple-500/10 rounded-3xl flex items-center justify-center">
                          <Users className="w-8 h-8 text-purple-400" />
                       </div>
                       <div>
                          <h3 className="text-lg font-black tracking-tight">Audience Velocity</h3>
                          <p className="text-sm text-zinc-500 max-w-[240px] mt-2">Historical data indicates a 14% increase in retention when utilizing AI-composed visual narratives.</p>
                       </div>
                    </GlassCard>
                 </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-4xl mx-auto">
                 <SettingsView />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 px-6 pt-3 pb-safe-bottom z-[100] flex lg:hidden items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.6)]">
        <BottomNavItem icon={LayoutDashboard} label="LIVE" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <BottomNavItem icon={PenTool} label="WRITE" active={activeTab === 'composer'} onClick={() => setActiveTab('composer')} />
        <BottomNavItem icon={CalendarIcon} label="PLAN" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
        <BottomNavItem icon={Settings} label="CONFIG" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </nav>

      {/* System Version Indicator */}
      <div className="fixed top-0 right-0 p-8 opacity-5 pointer-events-none hidden xl:block">
         <div className="text-[80px] font-black leading-none select-none tracking-tighter">BINA CORE v1.0.4</div>
      </div>
    </div>
  );
};

export default App;
