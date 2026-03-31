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

const riskData = [
  { name: 'Engineering', low: 45, med: 12, high: 3 },
  { name: 'Sales', low: 30, med: 25, high: 8 },
  { name: 'Marketing', low: 38, med: 15, high: 4 },
  { name: 'Operations', low: 52, med: 10, high: 2 },
  { name: 'HR', low: 20, med: 5, high: 1 },
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

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export const OrganizationAnalytics: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organization Analytics</h1>
          <p className="text-sm text-gray-500">Aggregate psychosocial health insights for Q1 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Employees', value: '1,248', icon: Users, trend: '+12%', trendUp: true },
          { label: 'Participation Rate', value: '84.2%', icon: CheckCircle2, trend: '+5.4%', trendUp: true },
          { label: 'High Risk Cases', value: '18', icon: AlertCircle, trend: '-4', trendUp: false },
          { label: 'Avg. Wellbeing', value: '7.8/10', icon: TrendingUp, trend: '+0.2', trendUp: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-50 rounded-xl">
                <stat.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.trend}
                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-xs text-gray-400 font-mono uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution by Department */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold">Risk Stratification by Department</h3>
            <div className="flex gap-4 text-[10px] font-mono uppercase tracking-widest">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Low</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-amber-500 rounded-full"></div> Medium</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-500 rounded-full"></div> High</div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8f9fa' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="low" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={20} />
                <Bar dataKey="med" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="high" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overall Risk Pie */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-8">Overall Risk Profile</h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Low', value: 75 },
                    { name: 'Medium', value: 20 },
                    { name: 'High', value: 5 },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-3xl font-bold">5%</div>
              <div className="text-[10px] font-mono text-gray-400 uppercase">High Risk</div>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            {[
              { label: 'Low Risk', value: '75%', color: 'bg-emerald-500' },
              { label: 'Medium Risk', value: '20%', color: 'bg-amber-500' },
              { label: 'High Risk', value: '5%', color: 'bg-red-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                  <span className="text-xs text-gray-600">{item.label}</span>
                </div>
                <span className="text-xs font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wellness Trends & AI Forecast */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold">Wellness Trends & AI Forecast</h3>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase tracking-widest">AI Powered</span>
            </div>
            <p className="text-sm text-gray-500">Historical psychosocial indicators with 90-day predictive modeling</p>
          </div>
          <div className="flex gap-4 text-[10px] font-mono uppercase tracking-widest">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Stress</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Anxiety</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 border border-dashed border-gray-400 rounded-full"></div> AI Forecast</div>
          </div>
        </div>
        <div className="h-[400px] w-full">
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
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-900">AI Insight: Positive Trajectory</h4>
            <p className="text-xs text-blue-700/80 leading-relaxed">
              Based on current intervention participation rates (92%), the model predicts a 15% further reduction in organization-wide stress levels over the next 90 days.
            </p>
          </div>
        </div>
      </div>

      {/* Intervention Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black text-white p-8 rounded-3xl shadow-xl shadow-black/10">
          <h3 className="text-lg font-bold mb-2">Intervention Impact</h3>
          <p className="text-gray-400 text-sm mb-8">Effectiveness of psychosocial support programs</p>
          <div className="space-y-6">
            {[
              { label: 'Risk Reduction', value: '64%', desc: 'High-risk individuals moved to lower categories' },
              { label: 'Engagement', value: '92%', desc: 'Employees utilizing counseling services' },
              { label: 'Productivity', value: '+18%', desc: 'Estimated increase in focus and output' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xl font-bold text-emerald-400">{item.value}</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: item.value.replace('+', '') }}
                  ></div>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Recent Anomaly Alerts</h3>
          <div className="space-y-4">
            {[
              { dept: 'Sales', alert: 'Sudden 40% spike in stress levels', time: '2h ago', severity: 'high' },
              { dept: 'Engineering', alert: 'Low participation in weekly check-in', time: '5h ago', severity: 'medium' },
              { dept: 'Operations', alert: 'Consistent high anxiety in Night Shift', time: '1d ago', severity: 'high' },
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
            View All Alerts
          </button>
        </div>
      </div>
    </div>
  );
};
