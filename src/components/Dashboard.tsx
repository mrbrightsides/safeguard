import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { Shield, Activity, Users, AlertTriangle, TrendingUp, Heart, Globe, Map, Watch, Zap, Bluetooth, Sparkles, Briefcase, User as UserIcon, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

import { UserRole } from './RoleSelection';

const data = [
  { name: 'Mon', risk: 40, fatigue: 24, stress: 24 },
  { name: 'Tue', risk: 30, fatigue: 13, stress: 22 },
  { name: 'Wed', risk: 20, fatigue: 98, stress: 22 },
  { name: 'Thu', risk: 27, fatigue: 39, stress: 20 },
  { name: 'Fri', risk: 18, fatigue: 48, stress: 21 },
  { name: 'Sat', risk: 23, fatigue: 38, stress: 25 },
  { name: 'Sun', risk: 34, fatigue: 43, stress: 21 },
];

const heatmapData = [
  { region: 'Jakarta', risk: 'High', count: 45, color: 'bg-red-500' },
  { region: 'Surabaya', risk: 'Moderate', count: 28, color: 'bg-yellow-500' },
  { region: 'Bandung', risk: 'Low', count: 12, color: 'bg-teal-500' },
  { region: 'Medan', risk: 'High', count: 38, color: 'bg-red-500' },
  { region: 'Makassar', risk: 'Moderate', count: 15, color: 'bg-yellow-500' },
  { region: 'Semarang', risk: 'Low', count: 8, color: 'bg-teal-500' },
];

interface DashboardProps {
  role?: UserRole | null;
  isAccessibilityMode?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ role, isAccessibilityMode }) => {
  const [lang, setLang] = useState<'EN' | 'ID'>('EN');
  const [bpm, setBpm] = useState(72);
  const [hrv, setHrv] = useState(45);
  const [isSyncing, setIsSyncing] = useState(true);
  const [personalContext, setPersonalContext] = useState<'worker' | 'patient'>('worker');

  // Voice Summary Effect
  useEffect(() => {
    if (isAccessibilityMode) {
      const summary = role === 'personal' 
        ? "Welcome to your personal prevention roadmap. Your heart rate is stable at 72 beats per minute. No high-risk psychosocial hazards detected today."
        : "Population Health Surveillance active. Overall risk level is low. Three departments showing minor fatigue spikes. System monitoring in real-time.";
      
      const utterance = new SpeechSynthesisUtterance(summary);
      window.speechSynthesis.speak(utterance);
    }
  }, [isAccessibilityMode, role]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBpm(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      setHrv(prev => Math.max(30, Math.min(100, prev + (Math.random() > 0.5 ? 2 : -2))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isPersonal = role === 'personal';

  return (
    <div className={cn(
      "space-y-6 overflow-x-hidden transition-all duration-500",
      isAccessibilityMode && "p-4"
    )}>
      {/* Header with Language Toggle */}
      <div className="flex justify-between items-center">
        <h2 className={cn(
          "font-bold transition-all",
          isAccessibilityMode ? "text-4xl text-white" : "text-2xl text-gray-900"
        )}>
          {isPersonal 
            ? (lang === 'EN' ? 'Personalized Prevention Roadmap' : 'Peta Jalan Pencegahan Personal')
            : (lang === 'EN' ? 'Population Health Surveillance' : 'Surveilans Kesehatan Populasi')}
        </h2>
        <button 
          onClick={() => setLang(l => l === 'EN' ? 'ID' : 'EN')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-mono font-bold hover:bg-gray-50 transition-all"
        >
          <Globe className="w-4 h-4" />
          {lang}
        </button>
      </div>

      {/* Personalized Prevention Section for Personal Users */}
      {isPersonal && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-1 bg-gray-100 rounded-2xl w-fit">
            <button 
              onClick={() => setPersonalContext('worker')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                personalContext === 'worker' ? "bg-white text-teal-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Worker Mode
            </button>
            <button 
              onClick={() => setPersonalContext('patient')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                personalContext === 'patient' ? "bg-white text-teal-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <UserIcon className="w-3.5 h-3.5" />
              Patient Mode
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-50 rounded-xl">
                      <Sparkles className="w-5 h-5 text-teal-600" />
                    </div>
                    <h3 className="font-bold text-lg">
                      {personalContext === 'worker' ? 'Occupational Health Strategy' : 'Clinical Prevention Roadmap'}
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    AI Personalized
                  </span>
                </div>
                
                <div className="space-y-6">
                  {(personalContext === 'worker' ? [
                    { title: 'Psychosocial Stressor Index', status: 'Moderate', progress: 65, desc: 'Exposure to workplace conflict and peer-pressure (L3 Prognostic) is currently elevated.' },
                    { title: 'Occupational Functioning', status: 'Optimal', progress: 88, desc: 'Your productivity and attendance metrics show high resilience against burnout triggers.' },
                    { title: 'Burnout Resilience', status: 'Improving', progress: 74, desc: 'Recovery markers post-shift indicate better autonomic nervous system regulation.' },
                  ] : [
                    { title: 'Symptom Severity (L2 Domain)', status: 'Stable', progress: 82, desc: 'Core symptoms of anxiety (F41) and mood (F32) are within manageable thresholds.' },
                    { title: 'Social Support Buffer', status: 'Strengthening', progress: 70, desc: 'Quality of social network and peer support (L3) is trending positively.' },
                    { title: 'Medical Comorbidity Sync', status: 'On Track', progress: 78, desc: 'Physical health markers (Axis III legacy) are synchronized with mental wellness goals.' },
                  ]).map((item, i) => (
                    <div key={i} className="group">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <div className="text-sm font-bold text-gray-900">{item.title}</div>
                          <div className="text-[10px] text-gray-400 uppercase font-mono">{item.status}</div>
                        </div>
                        <div className="text-sm font-bold text-teal-600">{item.progress}%</div>
                      </div>
                      <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          className="h-full bg-teal-500 rounded-full"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal ROI / Economic Impact */}
              <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100 flex flex-col sm:flex-row items-center gap-6">
                <div className="p-4 bg-white rounded-2xl shadow-sm">
                  <Coins className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-emerald-900 mb-1">Your Personal Prevention ROI</h4>
                  <p className="text-xs text-emerald-700/80 mb-3">Estimated annual healthcare savings through proactive wellness (WHO 1:4 ROI Model).</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                    <div className="bg-white/50 px-3 py-1.5 rounded-lg border border-emerald-200/50">
                      <div className="text-[10px] font-mono text-emerald-600 uppercase">Potential Savings</div>
                      <div className="text-lg font-black text-emerald-900">Rp 24.6M/yr</div>
                    </div>
                    <div className="bg-white/50 px-3 py-1.5 rounded-lg border border-emerald-200/50">
                      <div className="text-[10px] font-mono text-emerald-600 uppercase">Productivity Value</div>
                      <div className="text-lg font-black text-emerald-900">+Rp 54.4M/yr</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-teal-900 p-8 rounded-[40px] text-white shadow-xl shadow-teal-900/10">
              <h3 className="text-lg font-bold mb-6">Next Action Steps</h3>
              <div className="space-y-4">
                {[
                  { icon: '📋', text: 'Complete L3 Psychosocial Survey' },
                  { icon: '🤝', text: 'Schedule Peer Support Check-in' },
                  { icon: '🧘', text: '15-min Mindfulness Session' },
                  { icon: '📵', text: 'Digital Detox (1hr before bed)' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-teal-800/50 rounded-2xl border border-teal-700/50 hover:bg-teal-800 transition-colors cursor-pointer">
                    <span className="text-xl">{step.icon}</span>
                    <span className="text-xs font-medium">{step.text}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-4 bg-white text-teal-900 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all">
                View Full Roadmap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wearable Sync & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wearable Sync Widget */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Watch className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center">
                  <Watch className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Live Biometrics</h3>
                  <div className="flex items-center gap-1.5">
                    <div className={cn("w-1.5 h-1.5 rounded-full", isSyncing ? "bg-teal-500 animate-pulse" : "bg-gray-300")}></div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                      {isSyncing ? 'Syncing via Bluetooth' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>
              <Bluetooth className={cn("w-4 h-4 transition-colors", isSyncing ? "text-blue-500" : "text-gray-300")} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-rose-600">
                  <Heart className="w-4 h-4 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Heart Rate</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900">{bpm}</span>
                  <span className="text-xs text-gray-400 font-medium">BPM</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-blue-600">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">HRV Index</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900">{hrv}</span>
                  <span className="text-xs text-gray-400 font-medium">ms</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">Stress Recovery State</span>
                <span className="text-xs font-bold text-teal-600">Optimal</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  className="h-full bg-teal-500 rounded-full"
                ></motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: lang === 'EN' ? 'Active Surveillance' : 'Surveilans Aktif', value: '1,284', icon: Activity, color: 'text-teal-600' },
            { label: lang === 'EN' ? 'High Risk Alerts' : 'Peringatan Risiko Tinggi', value: '12', icon: AlertTriangle, color: 'text-orange-600' },
            { label: lang === 'EN' ? 'Well-being Index' : 'Indeks Kesejahteraan', value: '84%', icon: Heart, color: 'text-rose-600' },
            { label: lang === 'EN' ? 'Population Coverage' : 'Cakupan Populasi', value: '92%', icon: Users, color: 'text-teal-600' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Real-time</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Daily Mood Tracker */}
      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-900">How are you feeling today?</h3>
            <p className="text-gray-500 text-sm">Your daily check-in helps us monitor population resilience.</p>
          </div>
          <div className="flex gap-4 sm:gap-6">
            {[
              { emoji: '😔', label: 'Stressed', color: 'hover:bg-red-50 hover:text-red-600' },
              { emoji: '😐', label: 'Neutral', color: 'hover:bg-gray-50 hover:text-gray-600' },
              { emoji: '😊', label: 'Good', color: 'hover:bg-teal-50 hover:text-teal-600' },
              { emoji: '🤩', label: 'Great', color: 'hover:bg-teal-50 hover:text-teal-600' },
            ].map((mood) => (
              <button 
                key={mood.label}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-3xl transition-all group",
                  mood.color
                )}
              >
                <span className="text-3xl group-hover:scale-125 transition-transform">{mood.emoji}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-teal-900 p-8 rounded-3xl text-white shadow-xl shadow-teal-900/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Heart className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Need Professional Help?</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Connect with licensed mental health professionals, psychologists, or counselors instantly.
            </p>
            <button 
              onClick={() => {
                // In a real app, this would open the consultation modal or navigate
                window.dispatchEvent(new CustomEvent('open-consultation'));
              }}
              className="px-6 py-3 bg-white text-teal-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Consult a Professional
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-teal-600">
            <Shield className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2 text-gray-900">Digital Anamnesis</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
              Complete your psychosocial self-assessment to get AI-driven risk stratification.
            </p>
            <button 
              onClick={() => {
                // This will be handled by the parent component
                window.dispatchEvent(new CustomEvent('navigate-to-assessment'));
              }}
              className="px-6 py-3 bg-teal-900 text-white rounded-xl font-bold text-sm hover:bg-teal-950 transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Start Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-mono uppercase tracking-widest text-gray-400">
              {lang === 'EN' ? 'Psychosocial Risk Trend' : 'Risiko Psikososial'}
            </h3>
            <TrendingUp className="w-4 h-4 text-gray-300" />
          </div>
          <div className="h-[300px] relative min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#999' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#999' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="risk" 
                  stroke="#000" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRisk)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-mono uppercase tracking-widest text-gray-400">
              {lang === 'EN' ? 'Fatigue vs Stress Mapping' : 'Pemetaan Kelelahan vs Stres'}
            </h3>
            <Activity className="w-4 h-4 text-gray-300" />
          </div>
          <div className="h-[300px] relative min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#999' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#999' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8f8f8' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="fatigue" fill="#000" radius={[4, 4, 0, 0]} />
                <Bar dataKey="stress" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-mono uppercase tracking-widest text-gray-400">
            {lang === 'EN' ? 'Regional Risk Heatmap' : 'Heatmap Risiko Regional'}
          </h3>
          <Map className="w-4 h-4 text-gray-300" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {heatmapData.map((item) => (
            <div key={item.region} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="text-xs font-bold text-gray-900 mb-1">{item.region}</div>
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", item.color)}></div>
                <span className="text-[10px] font-mono text-gray-500">{item.risk}</span>
              </div>
              <div className="mt-2 text-lg font-black text-gray-900">{item.count}</div>
              <div className="text-[8px] font-mono text-gray-400 uppercase">Cases</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-bottom border-gray-50 flex items-center justify-between">
          <h3 className="text-sm font-mono uppercase tracking-widest text-gray-400">
            {lang === 'EN' ? 'Critical Risk Stratification' : 'Stratifikasi Risiko Kritis'}
          </h3>
          <Shield className="w-4 h-4 text-gray-300" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-6 py-4 text-[10px] font-mono text-gray-400 uppercase tracking-widest">Entity ID</th>
                <th className="px-6 py-4 text-[10px] font-mono text-gray-400 uppercase tracking-widest">Risk Level</th>
                <th className="px-6 py-4 text-[10px] font-mono text-gray-400 uppercase tracking-widest">ICD Coding</th>
                <th className="px-6 py-4 text-[10px] font-mono text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { id: 'W-9284', risk: 'Emergency', icd: 'F32.3', status: lang === 'EN' ? 'Escalated' : 'Eskalasi' },
                { id: 'W-1029', risk: 'High', icd: 'F41.0', status: lang === 'EN' ? 'Monitoring' : 'Pemantauan' },
                { id: 'W-8821', risk: 'Moderate', icd: 'F43.2', status: lang === 'EN' ? 'Counseling' : 'Konseling' },
                { id: 'W-4492', risk: 'Low', icd: 'N/A', status: lang === 'EN' ? 'Healthy' : 'Sehat' },
              ].map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{row.id}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter",
                      row.risk === 'Emergency' ? "bg-red-100 text-red-600" :
                      row.risk === 'High' ? "bg-orange-100 text-orange-600" :
                      row.risk === 'Moderate' ? "bg-yellow-100 text-yellow-600" :
                      "bg-teal-100 text-teal-600"
                    )}>
                      {row.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.icd}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 italic">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
