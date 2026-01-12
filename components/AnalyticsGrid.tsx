
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, Eye, MousePointer2, ArrowUpRight, BarChart3, Activity } from 'lucide-react';
import GlassCard from './GlassCard';

const areaData = [
  { name: 'Mon', count: 4200 },
  { name: 'Tue', count: 3800 },
  { name: 'Wed', count: 5600 },
  { name: 'Thu', count: 4900 },
  { name: 'Fri', count: 7200 },
  { name: 'Sat', count: 8100 },
  { name: 'Sun', count: 9500 },
];

const barData = [
  { name: 'X', val: 85 },
  { name: 'IG', val: 92 },
  { name: 'LI', val: 78 },
  { name: 'FB', val: 64 },
  { name: 'YT', val: 98 },
];

const StatCard: React.FC<{ label: string; value: string; trend: string; icon: any; delay: number }> = ({ label, value, trend, icon: Icon, delay }) => (
  <GlassCard className="flex flex-col gap-2 !p-4" delay={delay}>
    <div className="flex items-center justify-between">
      <div className="p-2 bg-indigo-500/10 rounded-lg">
        <Icon className="w-4 h-4 text-indigo-400" />
      </div>
      <div className="flex items-center gap-1 text-[10px] text-accent font-bold">
        <ArrowUpRight className="w-3 h-3" />
        {trend}
      </div>
    </div>
    <div className="mt-2">
      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{label}</p>
      <h3 className="text-xl font-black mt-1 tracking-tight text-white">{value}</h3>
    </div>
  </GlassCard>
);

const AnalyticsGrid: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Global Reach" value="142.8K" trend="15.4%" icon={Users} delay={0.1} />
        <StatCard label="Dispatch Imp" value="3.1M" trend="22.1%" icon={Eye} delay={0.2} />
        <StatCard label="Response Rate" value="6.4%" trend="4.2%" icon={TrendingUp} delay={0.3} />
        <StatCard label="Conversion" value="24.5K" trend="38.5%" icon={MousePointer2} delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 h-72 !p-6" delay={0.5}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-white/90">
                <Activity className="w-4 h-4 text-indigo-400" /> Neural Growth Matrix
            </h2>
            <div className="flex gap-2">
               <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
               <div className="w-2 h-2 rounded-full bg-purple-500/20" />
            </div>
          </div>
          <div className="h-full pb-10">
              <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                  <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272A" strokeOpacity={0.3} />
                  <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717A', fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis hide />
                  <Tooltip 
                      contentStyle={{ backgroundColor: '#09090B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                      itemStyle={{ color: '#6366F1' }}
                  />
                  <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#6366F1" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorCount)" 
                  />
              </AreaChart>
              </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="h-72 !p-6" delay={0.6}>
           <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-6 text-white/90">
                <BarChart3 className="w-4 h-4 text-purple-400" /> Channel Performance
            </h2>
            <div className="h-full pb-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#71717A', fontSize: 10, fontWeight: 900 }}
                  />
                  <YAxis hide />
                  <Bar dataKey="val" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, index) => (
                      <rect key={`cell-${index}`} fill={index % 2 === 0 ? '#6366F1' : '#A855F7'} fillOpacity={0.8} />
                    ))}
                  </Bar>
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#09090B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AnalyticsGrid;
