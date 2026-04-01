import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download
} from 'lucide-react';
import { cn } from '../lib/utils';

const riskData = [
  { name: 'L0: Emergency', count: 12, color: '#ef4444', desc: 'Suicidal risk, psychosis, acute crisis' },
  { name: 'L1: Organic/Substance', count: 25, color: '#f59e0b', desc: 'Rule out F00-F19 conditions' },
  { name: 'L2: Syndrome Domain', count: 145, color: '#3b82f6', desc: 'F30-F48 (Mood & Anxiety)' },
  { name: 'L3: Prognostic Layer', count: 312, color: '#10b981', desc: 'Severity & functioning assessment' },
];

const trendData = [
  { month: 'Oct', stress: 45, anxiety: 30, forecast: null },
  { month: 'Nov', stress: 42, anxiety: 32, forecast: null },
  { month: 'Dec', stress: 55, anxiety: 40, forecast: null },
  { month: 'Jan', stress: 48, anxiety: 35, forecast: null },
  { month: 'Feb', stress: 40, anxiety: 28, forecast: null },
  { month: 'Mar', stress: 38, anxiety: 25, forecast: 38 },
  { month: 'Apr', stress: null, anxiety: null, forecast: 32 },
  { month: 'May', stress: null, anxiety: null, forecast: 28 },
  { month: 'Jun', stress: null, anxiety: null, forecast: 25 },
];

const COLORS = ['#14b8a6', '#82a382', '#ef4444'];

const icdData = [
  { name: 'F40-F48 (Anxiety/Stress)', value: 42, color: '#0d9488' },
  { name: 'F30-F39 (Mood/Depression)', value: 28, color: '#14b8a6' },
  { name: 'F20-F29 (Psychotic)', value: 8, color: '#0f766e' },
  { name: 'F10-F19 (Substance)', value: 12, color: '#5eead4' },
  { name: 'Others (F00-F99)', value: 10, color: '#ccfbf1' },
];

const economicData = [
  { category: 'Mental Health Crisis (L0)', inaction: 245000, intervention: 45000, savings: 200000 },
  { category: 'Productivity Loss', inaction: 850000, intervention: 120000, savings: 730000 },
  { category: 'Chronic Care (F30-F48)', inaction: 420000, intervention: 95000, savings: 325000 },
];

export const OrganizationAnalytics: React.FC = () => {
  const exchangeRate = 17002; // JISDOR April 1, 2026

  return (
    <div className="space-y-8 pb-12 overflow-x-hidden">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organization Health Economics</h1>
          <p className="text-sm text-gray-500">Predictive Surveillance & ROI Analysis (JISDOR: Rp{exchangeRate.toLocaleString()}/USD)</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            ICD-10 Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
            <Download className="w-4 h-4" />
            Export Health Economic Report
          </button>
        </div>
      </div>

      {/* Macro Hook Banner */}
      <div className="bg-teal-900 text-white p-6 rounded-[32px] relative overflow-hidden shadow-xl shadow-teal-900/20">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-teal-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400">Global Burden Context</span>
            </div>
            <h2 className="text-xl font-bold mb-2">Mental health issues cause US$1 Trillion loss annually.</h2>
            <p className="text-teal-100/70 text-sm leading-relaxed">
              Equivalent to ~Rp17 Quadrillion per year. Safespace utilizes WHO-standard 1:4 ROI modeling to mitigate this burden through early ICD-10 prognostic detection.
            </p>
          </div>
          <div className="text-center md:text-right">
            <div className="text-3xl font-black text-teal-400">1:4</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-teal-100/50">Investment Return Ratio</div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <TrendingUp className="w-48 h-48" />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Workforce', value: '1,248', icon: Users, trend: '+12%', trendUp: true },
          { label: 'Screening Positive', value: '18.4%', icon: CheckCircle2, trend: 'L2/L3 Cases', trendUp: true },
          { label: 'Red-Flag (L0)', value: '12', icon: AlertCircle, trend: 'Actionable', trendUp: false },
          { label: 'Mean Claim/Case', value: 'Rp4.2M', icon: TrendingUp, trend: 'INA-CBG Avg', trendUp: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-50 rounded-xl">
                <stat.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {stat.trend}
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-xs text-gray-400 font-mono uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hierarchical Risk Stratification */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm min-w-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold">Hierarchical Risk Stratification</h3>
              <p className="text-sm text-gray-500">Based on psychiatric emergency hierarchy (L0 - L3)</p>
            </div>
            <div className="flex gap-4 text-[10px] font-mono uppercase tracking-widest">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Emergency</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Syndromic</div>
            </div>
          </div>
          <div className="h-[300px] w-full relative min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData} layout="vertical" margin={{ left: 40, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 600 }}
                  width={120}
                />
                <Tooltip 
                  cursor={{ fill: '#f8f9fa' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={32}>
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {riskData.map((item, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="text-[10px] font-bold uppercase tracking-tighter mb-1" style={{ color: item.color }}>{item.name}</div>
                <div className="text-[9px] text-gray-400 leading-tight">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Burden Clusters (ICD-10) */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm min-w-0">
          <h3 className="text-lg font-bold mb-2">Top Burden Clusters</h3>
          <p className="text-xs text-gray-400 mb-8 uppercase font-mono tracking-widest">ICD-10 Chapter V Mapping</p>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={icdData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {icdData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-3xl font-bold">42%</div>
              <div className="text-[8px] font-mono text-gray-400 uppercase">Anxiety/Stress</div>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            {icdData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[10px] text-gray-600 font-medium">{item.name}</span>
                </div>
                <span className="text-[10px] font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Economic Evaluation Section */}
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm min-w-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h3 className="text-lg font-bold">Health Economic Evaluation (HEE)</h3>
              <p className="text-sm text-gray-500">Comparative analysis of INA-CBG claims vs. Preventive Intervention ROI</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
              <TrendingUp className="w-3 h-3" />
              Net Benefit: +Rp1.25B
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* KPI Metrics */}
            <div className="space-y-4">
              {[
                { label: 'Mean Claim (INA-CBG)', value: 'Rp12.4M', desc: 'Average cost per psychiatric admission' },
                { label: 'Medication Cost/Case', value: 'Rp1.8M', desc: 'Monthly average for F30-F48 maintenance' },
                { label: 'Median LOS', value: '8.4 Days', desc: 'Length of Stay for L0/L1 emergency cases' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">{item.label}</div>
                  <div className="text-xl font-bold text-gray-900">{item.value}</div>
                  <div className="text-[9px] text-gray-500 mt-1">{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Economic Evaluation Chart */}
            <div className="lg:col-span-2 min-w-0">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Cost of Inaction vs. Intervention</h4>
                <div className="flex gap-3 text-[9px] font-mono uppercase">
                  <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div> Inaction</div>
                  <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div> Intervention</div>
                  <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div> Savings</div>
                </div>
              </div>
              <div className="h-[250px] w-full relative min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={economicData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <Tooltip 
                      cursor={{ fill: '#f8f9fa' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="inaction" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="Cost of Inaction" />
                    <Bar dataKey="intervention" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Intervention Cost" />
                    <Bar dataKey="savings" fill="#34d399" radius={[4, 4, 0, 0]} name="Net Savings" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Medicine Utilization Review */}
      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h3 className="text-lg font-bold">Community Medicine Utilization Review</h3>
            <p className="text-sm text-gray-500">Resource allocation and facility utilization across the network</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-teal-100">
            <Users className="w-3 h-3" />
            Active Facilities: 42
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Facility Distribution */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 text-center">Facility Type Distribution</h4>
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Puskesmas (Primary)', value: 45, color: '#0d9488' },
                      { name: 'RSUD (Secondary)', value: 30, color: '#14b8a6' },
                      { name: 'Private Clinics', value: 15, color: '#5eead4' },
                      { name: 'Specialist Centers', value: 10, color: '#ccfbf1' },
                    ]}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {[0, 1, 2, 3].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#0d9488', '#14b8a6', '#5eead4', '#ccfbf1'][index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-2xl font-black">45%</div>
                <div className="text-[8px] font-mono text-gray-400 uppercase">Primary Care</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Puskesmas', val: '45%', color: 'bg-[#0d9488]' },
                { label: 'RSUD', val: '30%', color: 'bg-[#14b8a6]' },
                { label: 'Private', val: '15%', color: 'bg-[#5eead4]' },
                { label: 'Specialist', val: '10%', color: 'bg-[#ccfbf1]' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", item.color)}></div>
                  <span className="text-[10px] text-gray-500 font-medium">{item.label}: {item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Medication Utilization */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 text-center">Medication Category Utilization</h4>
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Antidepressants (F32)', value: 40, color: '#0f172a' },
                      { name: 'Anxiolytics (F41)', value: 35, color: '#334155' },
                      { name: 'Antipsychotics (F20)', value: 15, color: '#64748b' },
                      { name: 'Mood Stabilizers', value: 10, color: '#94a3b8' },
                    ]}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {[0, 1, 2, 3].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#0f172a', '#334155', '#64748b', '#94a3b8'][index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-2xl font-black">40%</div>
                <div className="text-[8px] font-mono text-gray-400 uppercase">Antidepressants</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Antidepressants', val: '40%', color: 'bg-[#0f172a]' },
                { label: 'Anxiolytics', val: '35%', color: 'bg-[#334155]' },
                { label: 'Antipsychotics', val: '15%', color: 'bg-[#64748b]' },
                { label: 'Stabilizers', val: '10%', color: 'bg-[#94a3b8]' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", item.color)}></div>
                  <span className="text-[10px] text-gray-500 font-medium">{item.label}: {item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wellness Trends & AI Forecast */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm min-w-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold">Prognostic Surveillance & AI Forecast</h3>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase tracking-widest">AI Powered</span>
            </div>
            <p className="text-sm text-gray-500">Predictive modeling for absenteeism and relapse risk (90-day window)</p>
          </div>
          <div className="flex gap-4 text-[10px] font-mono uppercase tracking-widest">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Stress</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Anxiety</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 border border-dashed border-gray-400 rounded-full"></div> AI Forecast</div>
          </div>
        </div>
        <div className="h-[400px] w-full relative min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAnxiety" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.05}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#9ca3af' }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="stress" 
                stroke="#ef4444" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorStress)" 
                connectNulls
              />
              <Area 
                type="monotone" 
                dataKey="anxiety" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAnxiety)" 
                connectNulls
              />
              <Area 
                type="monotone" 
                dataKey="forecast" 
                stroke="#94a3b8" 
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1} 
                fill="url(#colorForecast)" 
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 p-4 bg-teal-50 rounded-2xl border border-teal-100 flex items-start gap-4">
          <div className="p-2 bg-teal-100 rounded-lg">
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-teal-900">AI Prognostic Insight: ROI Optimization</h4>
            <p className="text-xs text-teal-700/80 leading-relaxed">
              Current model predicts that scaling up L2/L3 interventions for F40-F48 clusters will yield a 3.8x return in productivity restoration, avoiding approximately Rp850M in projected absenteeism costs.
            </p>
          </div>
        </div>
      </div>

      {/* Intervention Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black text-white p-8 rounded-3xl shadow-xl shadow-black/10">
          <h3 className="text-lg font-bold mb-2">Outcome Evaluation</h3>
          <p className="text-gray-400 text-sm mb-8">Business & Clinical Endpoint Metrics</p>
          <div className="space-y-6">
            {[
              { label: 'Suicide Risk Reduction', value: '72%', desc: 'L0 cases successfully stabilized' },
              { label: 'Work Function Restoration', value: '88%', desc: 'Return-to-work rate after F30-F39 episodes' },
              { label: 'Presenteeism Recovery', value: '+24%', desc: 'Increase in focus and output at work' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xl font-bold text-teal-400">{item.value}</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-500 rounded-full" 
                    style={{ width: item.value.replace('+', '') }}
                  ></div>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Recent Anomaly Alerts (Red Flags)</h3>
          <div className="space-y-4">
            {[
              { dept: 'Sales', alert: 'L0 Risk: Sudden spike in suicidal ideation markers', time: '2h ago', severity: 'high' },
              { dept: 'Engineering', alert: 'L2 Cluster: High F41.0 (Panic) trend detected', time: '5h ago', severity: 'medium' },
              { dept: 'Operations', alert: 'L1 Risk: Suspected F10-F19 escalation in Night Shift', time: '1d ago', severity: 'high' },
            ].map((alert, i) => (
              <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className={`w-1 h-auto rounded-full ${alert.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold">{alert.dept}</span>
                    <span className="text-[10px] text-gray-400">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{alert.alert}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
            View Full Surveillance Log
          </button>
        </div>
      </div>
    </div>
  );
};
