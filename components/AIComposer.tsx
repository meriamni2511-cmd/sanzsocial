
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Sparkles, Image as ImageIcon, Loader2, Share2, Check, 
  Twitter, Instagram, Linkedin, Facebook, Youtube, AlertCircle, 
  Settings2, ChevronDown, ChevronUp, Link as LinkIcon, UploadCloud,
  Type as TypeIcon, Calendar as CalendarIcon, Clock, Terminal,
  Eye, EyeOff, Music, AtSign, Cloud, MessageSquare, Pin, MapPin, Ghost,
  CalendarCheck, AlertTriangle
} from 'lucide-react';
import { streamPostContent, generatePostImage } from '../services/geminiService';
import { publishToAyrshare } from '../services/ayrshareService';
import { PlatformOptions, SocialCommandIntent } from '../types';
import GlassCard from './GlassCard';

const PLATFORMS = [
  { id: 'twitter', icon: Twitter, label: 'X' },
  { id: 'instagram', icon: Instagram, label: 'Insta' },
  { id: 'linkedin', icon: Linkedin, label: 'Link' },
  { id: 'facebook', icon: Facebook, label: 'FB' },
  { id: 'youtube', icon: Youtube, label: 'YT' },
  { id: 'threads', icon: AtSign, label: 'Threads' },
  { id: 'tiktok', icon: Music, label: 'TikTok' },
  { id: 'bluesky', icon: Cloud, label: 'Bluesky' },
  { id: 'reddit', icon: MessageSquare, label: 'Reddit' },
  { id: 'pinterest', icon: Pin, label: 'Pin' },
  { id: 'gmb', icon: MapPin, label: 'GMB' },
  { id: 'telegram', icon: Send, label: 'TG' },
  { id: 'snapchat', icon: Ghost, label: 'Snap' },
];

const AIComposer: React.FC<{ externalCommand?: SocialCommandIntent | null }> = ({ externalCommand }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter']);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPreviewOnMobile, setShowPreviewOnMobile] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [options, setOptions] = useState<PlatformOptions>({
    instagram: { postType: 'post' },
    facebook: { postType: 'post' },
    youtube: { visibility: 'public' }
  });

  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const key = localStorage.getItem('ayrshare_api_key_primary');
    setIsConfigured(!!key);

    if (externalCommand) {
      if (externalCommand.title) setTitle(externalCommand.title);
      if (externalCommand.content) setPrompt(externalCommand.content);
      if (externalCommand.platforms) {
        const valid = externalCommand.platforms.filter(p => PLATFORMS.some(item => item.id === p));
        if (valid.length > 0) setSelectedPlatforms(valid);
      }
      if (externalCommand.options) setOptions(prev => ({ ...prev, ...externalCommand.options }));
      if (externalCommand.content && !generatedText) {
        handleCompose();
      }
      if (externalCommand.scheduleDate) {
        setIsScheduling(true);
        const dt = new Date(externalCommand.scheduleDate);
        setScheduleDate(dt.toISOString().split('T')[0]);
        setScheduleTime(dt.toTimeString().split(' ')[0].slice(0, 5));
      }
    }
  }, [externalCommand]);

  const handleCompose = async () => {
    if (!prompt) return;
    setIsGeneratingText(true);
    setIsComplete(false);
    setError(null);
    setGeneratedText('');
    try {
      await streamPostContent(prompt, (chunk) => {
        setGeneratedText((prev) => prev + chunk);
      });
      if (window.innerWidth < 1024) {
        setTimeout(() => setShowPreviewOnMobile(true), 500);
      }
    } catch (err: any) {
      setError('Neural transmission failed: ' + (err.message || 'Unknown Error'));
    } finally {
      setIsGeneratingText(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!prompt) return;
    setIsGeneratingImage(true);
    setError(null);
    const img = await generatePostImage(prompt);
    setGeneratedImage(img);
    setIsGeneratingImage(false);
  };

  const handlePublish = async () => {
    if (!generatedText || selectedPlatforms.length === 0) return;
    if (!isConfigured) {
      setError('System nodes not configured. Please add an Ayrshare API key in Settings.');
      return;
    }

    setIsPublishing(true);
    setError(null);
    
    try {
      const scheduleISO = isScheduling && scheduleDate && scheduleTime 
        ? `${scheduleDate}T${scheduleTime}:00Z` 
        : undefined;

      await publishToAyrshare({
        text: generatedText,
        title: title || undefined,
        platforms: selectedPlatforms,
        media: generatedImage,
        options: options,
        scheduleDate: scheduleISO
      });

      setIsComplete(true);
      setTimeout(() => setIsComplete(false), 5000);
    } catch (err: any) {
      console.error("Publishing error:", err);
      setError(err.message || 'Critical failure during broadcast.');
    } finally {
      setIsPublishing(false);
    }
  };

  const setRecommendedTime = (offsetHours: number) => {
    const now = new Date();
    now.setHours(now.getHours() + offsetHours);
    setScheduleDate(now.toISOString().split('T')[0]);
    setScheduleTime(now.toTimeString().split(' ')[0].slice(0, 5));
    setIsScheduling(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 h-full items-start pb-4">
      {/* Input Side */}
      <GlassCard className={`flex flex-col gap-5 lg:gap-6 overflow-y-auto max-h-full scrollbar-hide relative transition-all duration-500 ${showPreviewOnMobile ? 'hidden lg:flex' : 'flex'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">Neural Composer</h2>
          </div>
          <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors bg-white/5 px-2 py-1 rounded-lg">
            <Settings2 className="w-3.5 h-3.5" />
            {showAdvanced ? 'HIDE' : 'CONFIG'}
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Target Dispatch Nodes</label>
              {!isConfigured && (
                <span className="text-[8px] bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded border border-red-500/20 font-black uppercase tracking-tighter flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" /> CONFIG REQUIRED
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-[160px] overflow-y-auto scrollbar-hide pr-1">
              {PLATFORMS.map((platform) => {
                const Icon = platform.icon;
                const isActive = selectedPlatforms.includes(platform.id);
                return (
                  <button 
                    key={platform.id} 
                    onClick={() => setSelectedPlatforms(prev => prev.includes(platform.id) ? prev.filter(p => p !== platform.id) : [...prev, platform.id])} 
                    className={`py-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 ${isActive ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-zinc-900/30 border-white/5 text-zinc-500 hover:border-white/10'}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[9px] font-black tracking-tighter uppercase">{platform.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <TypeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post Title (Meta/YouTube/SEO)" className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium text-white" />
            </div>
            <div className="relative">
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="What's the message or objective? AI will refine it..." className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-4 h-32 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none transition-all scrollbar-hide font-medium leading-relaxed text-white" />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-white/5 transition-colors text-zinc-400 hover:text-white" title="Upload Media Assets">
                  <UploadCloud className="w-4 h-4" />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setGeneratedImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} accept="image/*" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-md ${isScheduling ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-500'}`}>
                  <CalendarIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold tracking-tight text-white">Scheduled Orchestration</span>
              </div>
              <button onClick={() => setIsScheduling(!isScheduling)} className={`w-9 h-5 rounded-full transition-all relative ${isScheduling ? 'bg-indigo-600' : 'bg-zinc-700'}`}>
                <motion.div animate={{ x: isScheduling ? 18 : 2 }} className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-md" transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
              </button>
            </div>
            
            <AnimatePresence>
              {isScheduling && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-3 overflow-hidden">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="bg-zinc-950/80 border border-white/5 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500/50 color-scheme-dark font-medium text-white" />
                    <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="bg-zinc-950/80 border border-white/5 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500/50 color-scheme-dark font-medium text-white" />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] font-black uppercase tracking-wider text-zinc-600 w-full mb-1">Peak Engagement Predictions</span>
                    <button onClick={() => setRecommendedTime(2)} className="text-[9px] font-bold bg-white/5 hover:bg-white/10 px-2 py-1.5 rounded-md border border-white/5 transition-colors text-zinc-400">Today @ Peak</button>
                    <button onClick={() => setRecommendedTime(24)} className="text-[9px] font-bold bg-white/5 hover:bg-white/10 px-2 py-1.5 rounded-md border border-white/5 transition-colors text-zinc-400">Tomorrow AM</button>
                    <button onClick={() => setRecommendedTime(48)} className="text-[9px] font-bold bg-white/5 hover:bg-white/10 px-2 py-1.5 rounded-md border border-white/5 transition-colors text-zinc-400">Next Tuesday</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-3">
            <button onClick={handleCompose} disabled={isGeneratingText} className="flex-1 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all text-xs tracking-wider">
              {isGeneratingText ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 fill-white/20" />}
              {isGeneratingText ? 'GENERATING...' : 'GENERATE CONTENT'}
            </button>
            <button onClick={handleGenerateImage} disabled={isGeneratingImage} className="bg-zinc-800 hover:bg-zinc-700 active:scale-95 disabled:opacity-50 text-white px-5 rounded-xl border border-white/10 transition-all">
              {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            </button>
          </div>
          
          <button 
            onClick={() => setShowPreviewOnMobile(true)}
            className="lg:hidden w-full flex items-center justify-center gap-2 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest border border-dashed border-white/10 rounded-xl"
          >
            <Eye className="w-3 h-3" /> Inspect Stream Preview
          </button>
        </div>
      </GlassCard>

      {/* Preview Side */}
      <GlassCard className={`bg-zinc-900/40 relative overflow-hidden flex flex-col h-full transition-all duration-500 ${showPreviewOnMobile ? 'flex' : 'hidden lg:flex'}`}>
        <div className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isPublishing ? 'bg-indigo-500 animate-ping' : 'bg-indigo-500 animate-pulse'}`} />
            <span>Neural Stream Monitoring</span>
          </div>
          <button onClick={() => setShowPreviewOnMobile(false)} className="lg:hidden p-2 glass rounded-lg active:scale-90">
            <EyeOff className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto pr-1 scrollbar-hide">
          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-xs text-red-200 font-medium">{error}</div>
            </motion.div>
          )}

          <AnimatePresence>
            {isScheduling && scheduleDate && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 rounded-xl text-indigo-400"
              >
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Scheduled Orchestration: {scheduleDate} @ {scheduleTime || '--:--'}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {generatedImage && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative group">
                <img src={generatedImage} alt="Preview" className="w-full aspect-video lg:max-h-52 object-cover rounded-2xl border border-white/5 shadow-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                   <span className="text-[10px] font-bold text-white/80">AI Visual Asset Generated</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {title && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-black text-white/95 border-b border-white/5 pb-3 tracking-tight">
                {title}
              </motion.div>
            )}
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 min-h-[180px] whitespace-pre-wrap text-sm leading-relaxed text-zinc-200 font-medium italic-none">
              {generatedText || <div className="h-full flex flex-col items-center justify-center gap-3 py-10 opacity-30">
                <Terminal className="w-8 h-8 text-zinc-500" />
                <span className="text-xs uppercase tracking-[0.2em] font-black text-center text-zinc-600">Waiting for stream synthesis...</span>
              </div>}
              {isGeneratingText && <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="inline-block w-2.5 h-4 bg-indigo-500 ml-1 rounded-sm" />}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            onClick={handlePublish} 
            disabled={!generatedText || selectedPlatforms.length === 0 || isPublishing || isComplete} 
            className={`w-full font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all text-xs tracking-[0.1em] ${
              isComplete ? 'bg-accent shadow-[0_0_30px_rgba(16,185,129,0.3)] text-white' : 
              isScheduling ? 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-[0_0_30px_rgba(139,92,246,0.25)] text-white' :
              'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_30px_rgba(99,102,241,0.25)] text-white'
            } disabled:opacity-20 disabled:grayscale`}
          >
            {isPublishing ? <Loader2 className="w-5 h-5 animate-spin" /> : 
             isComplete ? <Check className="w-5 h-5 stroke-[3]" /> : 
             isScheduling ? <CalendarCheck className="w-5 h-5" /> :
             <Share2 className="w-5 h-5" />}
            
            {isPublishing ? 'TRANSMITTING BROADCAST...' : 
             isComplete ? (isScheduling ? 'ORCHESTRATION LOCKED' : 'DISPATCH SUCCESSFUL') : 
             isScheduling ? 'SCHEDULE DISPATCH' : 'EXECUTE DISPATCH'}
          </motion.button>
          
          <div className="flex items-center justify-center gap-4 text-[9px] text-zinc-600 font-black uppercase tracking-widest border-t border-white/5 pt-4">
             <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-accent" /> Production Node Active</span>
             <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-indigo-500" /> High Integrity Connection</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default AIComposer;
