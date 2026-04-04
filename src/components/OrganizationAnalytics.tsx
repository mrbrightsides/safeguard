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
import { motion } from 'motion/react';
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  ShieldAlert,
  Activity,
  LayoutGrid,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  X,
  Search,
  ChevronRight,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { jsPDF } from 'jspdf';

const oshaPyramidData = [
  { level: 'Fatality Review', count: 0, color: 'bg-black', text: 'text-white', desc: 'Fatal psychosocial outcomes' },
  { level: 'RWDC / LTI', count: 4, color: 'bg-red-600', text: 'text-white', desc: 'Restricted Work / Lost Time Injury' },
  { level: 'MTC', count: 12, color: 'bg-orange-500', text: 'text-white', desc: 'Medical Treatment Cases' },
  { level: 'First Aid (FA)', count: 45, color: 'bg-amber-400', text: 'text-black', desc: 'Minor psychosocial incidents' },
  { level: 'UA / UC', count: 312, color: 'bg-emerald-400', text: 'text-black', desc: 'Unsafe Acts / Unsafe Conditions (The Battlefield)' },
];

const bowTieData = {
  threats: ['Workload Pressure', 'Lack of Support', 'Role Ambiguity', 'Incivility'],
  preventiveBarriers: ['Manager Training', 'Clear Policies', 'Weekly Pulse Check', 'Peer Support'],
  topEvent: 'Psychosocial Hazard / Bullying Incident',
  mitigativeBarriers: ['SafeGuard EWS', 'Clinical Triage', 'MERP Protocol', 'Modified Duty'],
  consequences: ['Burnout', 'Absenteeism', 'Legal Risk', 'Health Loss']
};

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
  { category: 'L0: Emergency', inaction: 20000, intervention: 1000, savings: 19000 },
  { category: 'Productivity Loss (TAM)', inaction: 500000, intervention: 80000, savings: 420000 },
  { category: 'Chronic Care (F30-F48)', inaction: 150000, intervention: 35000, savings: 115000 },
];

export const OrganizationAnalytics: React.FC = () => {
  const exchangeRate = 17002; // JISDOR April 1, 2026
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isLogOpen, setIsLogOpen] = React.useState(false);
  const [selectedICD, setSelectedICD] = React.useState<string[]>(['F30-F39', 'F40-F48', 'F20-F29', 'F10-F19']);

  const handleExportReport = () => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    // Header
    doc.setFillColor(13, 148, 136); // Teal-600
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('SafeGuard Health Economic Report', 20, 25);
    doc.setFontSize(10);
    doc.text(`Generated on: ${timestamp}`, 20, 32);

    // Summary Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Executive Summary', 20, 55);
    doc.setFontSize(11);
    doc.text([
      'SafeGuard predictive surveillance has identified significant ROI opportunities.',
      'By monitoring leading psychosocial indicators (UA/UC), the system mitigates',
      'the Rp 500 Billion productivity loss through early ICD-10 prognostic detection.',
      '',
      `Current ROI Standard: 1:4 (WHO Standard)`,
      `Exchange Rate: Rp ${exchangeRate.toLocaleString()}/USD`,
      `Net Benefit: +Rp 1.25B`
    ], 20, 65);

    // Economic Data Table
    doc.setFontSize(14);
    doc.text('Economic Evaluation (HEE)', 20, 110);
    doc.setFontSize(10);
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 115, 170, 8, 'F');
    doc.text('Category', 25, 120);
    doc.text('Inaction Cost', 80, 120);
    doc.text('Intervention', 120, 120);
    doc.text('Net Savings', 160, 120);

    economicData.forEach((item, i) => {
      const y = 128 + (i * 8);
      doc.text(item.category, 25, y);
      doc.text(`Rp ${item.inaction.toLocaleString()}`, 80, y);
      doc.text(`Rp ${item.intervention.toLocaleString()}`, 120, y);
      doc.text(`Rp ${item.savings.toLocaleString()}`, 160, y);
    });

    // ICD-10 Distribution
    doc.setFontSize(14);
    doc.text('ICD-10 Burden Clusters', 20, 165);
    icdData.forEach((item, i) => {
      const y = 175 + (i * 7);
      doc.text(`${item.name}: ${item.value}%`, 25, y);
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Confidential - SafeGuard Enterprise Psychosocial Surveillance', 105, 285, { align: 'center' });

    doc.save(`SafeGuard_HEE_Report_${new Date().getTime()}.pdf`);
  };

  const toggleICD = (id: string) => {
    setSelectedICD(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const surveillanceLogs = [
    { id: 'LOG-001', time: '2026-04-03 14:20', dept: 'Sales', level: 'L0', event: 'Suicidal ideation markers detected in pulse check', status: 'Escalated', action: 'MERP Triggered' },
    { id: 'LOG-002', time: '2026-04-03 11:45', dept: 'Engineering', level: 'L2', event: 'Cluster of F41.0 (Panic) symptoms in Site B', status: 'Active', action: 'Group Counseling' },
    { id: 'LOG-003', time: '2026-04-02 22:10', dept: 'Operations', level: 'L1', event: 'Suspected substance use pattern in night shift', status: 'Monitoring', action: 'Supervisor Briefed' },
    { id: 'LOG-004', time: '2026-04-02 16:30', dept: 'HR', level: 'L3', event: 'High burnout markers in recruitment team', status: 'Resolved', action: 'Workload Adjusted' },
    { id: 'LOG-005', time: '2026-04-02 09:15', dept: 'Finance', level: 'L2', event: 'Persistent anxiety reports during audit', status: 'Active', action: 'Peer Support' },
    { id: 'LOG-006', time: '2026-04-01 14:00', dept: 'IT', level: 'L3', event: 'Role ambiguity leading to stress cluster', status: 'Resolved', action: 'Role Definition Review' },
  ];

  return (
    <div className="space-y-8 pb-12 overflow-x-hidden">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organization Health Economics</h1>
          <p className="text-sm text-gray-500">Predictive Surveillance & ROI Analysis (JISDOR: Rp{exchangeRate.toLocaleString()}/USD)</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            ICD-10 Filter
          </button>
          <button 
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Health Economic Report
          </button>
        </div>
      </div>

      {/* Macro Hook Banner */}
      <div className="bg-teal-900 text-white p-8 rounded-[40px] relative overflow-hidden shadow-xl shadow-teal-900/20">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-teal-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400">Strategic Economic Case</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 leading-tight">"Preventing one case is enough to justify the entire system."</h2>
            <p className="text-teal-100/70 text-sm leading-relaxed">
              From Symptom to System: Transforming fragmented mental health complaints into accountable, boardroom-ready economic interventions. We mitigate the Rp 500 Billion productivity loss through early ICD-10 prognostic detection.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="text-4xl font-black text-teal-400">1:4</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-teal-100/50">WHO ROI Standard</div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <TrendingUp className="w-64 h-64" />
        </div>
      </div>

      {/* Strategic Market Valuation (TAM/SAM/SOM) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'TAM: Total Addressable Market', value: 'Rp 300-500B', desc: '250,000+ workers across healthcare & high-risk industries', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'SAM: Serviceable Available Market', value: 'Rp 150-250B', desc: 'Focused on hospitals, universities, and BUMN', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'SOM: Serviceable Obtainable Market', value: 'Rp 50-80B', desc: 'Targeted initial pilot (10-20 institutions)', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((item, i) => (
          <div key={i} className={cn("p-8 rounded-[32px] border border-transparent shadow-sm transition-all hover:shadow-md", item.bg)}>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">{item.label}</div>
            <div className={cn("text-3xl font-black mb-2", item.color)}>{item.value}</div>
            <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* OSHA Incident Pyramid & Bow Tie Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* OSHA Pyramid */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold">OSHA-Style Incident Pyramid</h3>
              <p className="text-sm text-gray-500">Psychosocial Hazard Stratification (UA/UC to Fatality)</p>
            </div>
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
          
          <div className="flex flex-col items-center space-y-1">
            {oshaPyramidData.map((item, i) => (
              <motion.div
                key={item.level}
                initial={{ opacity: 0, scaleX: 0.5 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "relative h-12 flex items-center justify-center rounded-lg transition-all hover:brightness-110 cursor-help group",
                  item.color,
                  item.text
                )}
                style={{ width: `${100 - (i * 15)}%` }}
              >
                <div className="text-xs font-bold uppercase tracking-tighter">{item.level}: {item.count}</div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-black text-white text-[10px] rounded-xl z-50 text-center shadow-xl">
                  {item.desc}
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl">
            <p className="text-xs text-red-700 font-medium text-center italic">
              "If you investigate only fatality, you are already too late. The real battlefield is at UA/UC."
            </p>
          </div>
        </div>

        {/* Bow Tie Analysis */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold">Bow Tie Risk Control</h3>
              <p className="text-sm text-gray-500">Barrier Integrity & Consequence Mitigation</p>
            </div>
            <Zap className="w-6 h-6 text-amber-500" />
          </div>

          <div className="grid grid-cols-3 gap-4 relative">
            {/* Threats to Top Event */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase text-gray-400 mb-2">Threats</div>
              {bowTieData.threats.map(t => (
                <div key={t} className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-medium text-gray-600">{t}</div>
              ))}
              <div className="h-4"></div>
              <div className="text-[10px] font-mono uppercase text-emerald-500 mb-2">Preventive Barriers</div>
              {bowTieData.preventiveBarriers.map(b => (
                <div key={b} className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {b}
                </div>
              ))}
            </div>

            {/* Top Event */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-full p-4 bg-red-600 text-white rounded-2xl text-center shadow-lg shadow-red-600/20 z-10">
                <div className="text-[10px] font-mono uppercase opacity-70 mb-1">Top Event</div>
                <div className="text-xs font-black leading-tight">{bowTieData.topEvent}</div>
              </div>
              <div className="w-0.5 h-full bg-gray-100 absolute top-0 left-1/3 -translate-x-1/2"></div>
              <div className="w-0.5 h-full bg-gray-100 absolute top-0 left-2/3 -translate-x-1/2"></div>
            </div>

            {/* Consequences */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase text-gray-400 mb-2 text-right">Consequences</div>
              {bowTieData.consequences.map(c => (
                <div key={c} className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-medium text-gray-600 text-right">{c}</div>
              ))}
              <div className="h-4"></div>
              <div className="text-[10px] font-mono uppercase text-blue-500 mb-2 text-right">Mitigative Barriers</div>
              {bowTieData.mitigativeBarriers.map(b => (
                <div key={b} className="p-2 bg-blue-50 border border-blue-100 rounded-lg text-[10px] font-bold text-blue-700 flex items-center justify-end gap-1">
                  {b} <ShieldCheck className="w-3 h-3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Community Medicine Report Section */}
      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black rounded-2xl">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Weekly Community Medicine Report</h3>
              <p className="text-sm text-gray-500">Week 14: Strategic Zero Bullying Campaign Autopilot</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
              Campaign Active: 92% Adoption
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'New UA/UC Reports', value: '42', icon: Activity, color: 'text-emerald-600' },
            { label: 'Avg Closure Time', value: '48h', icon: Clock, color: 'text-blue-600' },
            { label: 'Cluster Alerts', value: '3', icon: MapPin, color: 'text-orange-600' },
            { label: 'Barrier Failures', value: '8', icon: ShieldAlert, color: 'text-red-600' },
          ].map((item, i) => (
            <div key={i} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 group hover:bg-white hover:shadow-md transition-all">
              <div className={cn("p-2 rounded-xl bg-white w-fit mb-4 shadow-sm", item.color)}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-gray-900">{item.value}</div>
              <div className="text-[10px] font-mono uppercase text-gray-400 mt-1">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Visuospatiotemporal Action Tracking</h4>
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 h-64 flex items-center justify-center relative overflow-hidden">
              {/* Mock Heatmap Visualization */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 gap-2 p-4">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "rounded-lg transition-all",
                      Math.random() > 0.8 ? "bg-red-500/40 animate-pulse" : 
                      Math.random() > 0.6 ? "bg-orange-400/30" : "bg-emerald-400/20"
                    )}
                  />
                ))}
              </div>
              <div className="relative z-10 text-center">
                <div className="text-xs font-bold text-gray-900 bg-white/80 backdrop-blur px-4 py-2 rounded-xl shadow-sm">
                  Active Cluster: Engineering Site B (L2 Risk)
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Gamification Autopilot Status</h4>
            <div className="space-y-3">
              {[
                { label: 'Weekly Check-in Streak', progress: 85, badge: '🔥' },
                { label: 'Manager Action Closure', progress: 94, badge: '✅' },
                { label: 'Early Reporting Participation', progress: 62, badge: '🛡️' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.badge}</span>
                      <span className="text-xs font-bold text-gray-900">{item.label}</span>
                    </div>
                    <span className="text-xs font-mono text-teal-600">{item.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      className="h-full bg-teal-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
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
          <button 
            onClick={() => setIsLogOpen(true)}
            className="w-full mt-6 py-3 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
          >
            View Full Surveillance Log
          </button>
        </div>
      </div>

      {/* ICD-10 Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[40px] w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-teal-50/50">
              <div>
                <h3 className="text-xl font-bold">ICD-10 Filter</h3>
                <p className="text-xs text-gray-500">Select clusters for analysis</p>
              </div>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              {[
                { id: 'F30-F39', label: 'Mood/Depression', count: 145 },
                { id: 'F40-F48', label: 'Anxiety/Stress', count: 312 },
                { id: 'F20-F29', label: 'Psychotic Disorders', count: 24 },
                { id: 'F10-F19', label: 'Substance Use', count: 56 },
                { id: 'F00-F09', label: 'Organic Disorders', count: 12 },
              ].map((item) => (
                <label key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={selectedICD.includes(item.id)}
                      onChange={() => toggleICD(item.id)}
                      className="w-5 h-5 rounded-lg border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <div className="text-sm font-bold text-gray-900">{item.id}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">{item.label}</div>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-gray-400">{item.count} cases</div>
                </label>
              ))}
            </div>
            <div className="p-8 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Surveillance Log Modal */}
      {isLogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[40px] w-full max-w-5xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black rounded-2xl">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Full Surveillance Log</h3>
                  <p className="text-xs text-gray-500">Real-time psychosocial incident tracking</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search logs..." 
                    className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <button 
                  onClick={() => setIsLogOpen(false)}
                  className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-8">
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                    <th className="px-4 py-2">ID / Time</th>
                    <th className="px-4 py-2">Department</th>
                    <th className="px-4 py-2">Risk Level</th>
                    <th className="px-4 py-2">Incident Event</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Action Taken</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {surveillanceLogs.map((log) => (
                    <tr key={log.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 bg-gray-50 rounded-l-2xl border-y border-l border-gray-100">
                        <div className="text-xs font-bold text-gray-900">{log.id}</div>
                        <div className="text-[10px] text-gray-400">{log.time}</div>
                      </td>
                      <td className="px-4 py-4 bg-gray-50 border-y border-gray-100">
                        <div className="text-xs font-medium text-gray-600">{log.dept}</div>
                      </td>
                      <td className="px-4 py-4 bg-gray-50 border-y border-gray-100">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter",
                          log.level === 'L0' ? "bg-red-100 text-red-700" :
                          log.level === 'L1' ? "bg-orange-100 text-orange-700" :
                          log.level === 'L2' ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                        )}>
                          {log.level} Risk
                        </span>
                      </td>
                      <td className="px-4 py-4 bg-gray-50 border-y border-gray-100 max-w-xs">
                        <div className="text-xs text-gray-900 line-clamp-1">{log.event}</div>
                      </td>
                      <td className="px-4 py-4 bg-gray-50 border-y border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            log.status === 'Escalated' ? "bg-red-500" :
                            log.status === 'Active' ? "bg-blue-500" :
                            log.status === 'Resolved' ? "bg-emerald-500" : "bg-gray-400"
                          )} />
                          <span className="text-xs font-medium text-gray-600">{log.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 bg-gray-50 border-y border-gray-100">
                        <div className="flex items-center gap-2 text-xs font-bold text-teal-600">
                          <ShieldCheck className="w-3 h-3" />
                          {log.action}
                        </div>
                      </td>
                      <td className="px-4 py-4 bg-gray-50 rounded-r-2xl border-y border-r border-gray-100">
                        <button className="p-2 hover:bg-white rounded-lg transition-colors">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <div className="text-xs text-gray-500">Showing 6 of 142 total incidents</div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors">Previous</button>
                <button className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors">Next Page</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
