import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  ArrowLeft, 
  Download, 
  TrendingUp, 
  AlertCircle, 
  ShieldCheck, 
  Globe, 
  Users,
  BarChart3,
  Stethoscope,
  BookOpen,
  Scale,
  Building2,
  Target,
  Activity,
  Heart,
  Coins,
  Database,
  CheckCircle2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { cn } from '../lib/utils';

import { IncidentPyramid } from './IncidentPyramid';

interface WhitepaperProps {
  onBack: () => void;
}

export const Whitepaper: React.FC<WhitepaperProps> = ({ onBack }) => {
  const downloadWhitepaper = () => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    
    // Title
    doc.setFontSize(22);
    doc.setTextColor(13, 148, 136); // Teal-600
    doc.text('SafeGuard Strategic Whitepaper', 20, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`v1.0 / Focus: Tourism & Hospitality / Generated: ${timestamp}`, 20, 38);
    
    // Line
    doc.setDrawColor(230, 230, 230);
    doc.line(20, 45, 190, 45);
    
    // Section 1: Executive Summary
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('1. Executive Summary', 20, 60);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    const summary = 'SafeGuard is a digital psychosocial early warning system employing a dual-tier strategy: Tier S (Tourism & Hospitality) for high-risk clinical impact, and Tier A (Startups & IT) for rapid tech-native adoption. It transforms fragmented mental health complaints into accountable economic interventions.';
    const splitSummary = doc.splitTextToSize(summary, 170);
    doc.text(splitSummary, 20, 70);
    
    // Section 2: Strategic Market Valuation
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('2. Strategic Market Valuation (Dual-Tier)', 20, 95);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text('- Tier S (Tourism): Rp 500-800 Billion TAM (1M+ Workers).', 25, 105);
    doc.text('- Tier A (Startups/IT): Rp 300-500 Billion TAM (Tech Ecosystem).', 25, 112);
    doc.text('- Combined SOM: Rp 120-180 Billion (Bali, Jakarta, & Tech Hubs).', 25, 119);
    
    // Section 3: SWOT Analysis
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('3. SWOT Analysis', 20, 135);
    
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text('Strengths: Clinical-Grade AI, Dual-Tier Strategy, IoT Hardware Ecosystem.', 25, 145);
    doc.text('Weaknesses: Ethical Clearance Requirements, Early Stage Data Validation.', 25, 151);
    doc.text('Opportunities: Hospitality Wellness Mandate, Subscription-Based SaaS Revenue.', 25, 157);
    doc.text('Threats: High Turnover in FnB, Persistent Mental Health Stigma.', 25, 163);

    // Section 4: Operational Costs
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('4. Operational Cost Analysis (Per 1000 Users)', 20, 180);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text('- AI API (Gemini 1.5 Flash): ~$5 - $10 / month.', 25, 190);
    doc.text('- Cloud Database (Firebase Blaze): ~$15 - $25 / month.', 25, 197);
    doc.text('- Maintenance & Support: Rp 5 - 10 Million / year.', 25, 204);
    doc.text('- Subscription Revenue: Rp 50k - 100k / employee / year.', 25, 211);

    // Section 5: Economic Case
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('5. The Economic Case for Intervention', 20, 230);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text('- System Implementation: < Rp 1 Billion.', 25, 240);
    doc.text('- Single Fatal Incident Cost: Up to Rp 20 Billion.', 25, 247);
    doc.text('- WHO ROI Standard: 1:4 (Rp 1 invested = Rp 4 return).', 25, 254);

    // Section 6: Incident Pyramid
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('6. The Psychosocial Incident Pyramid', 20, 30);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text('- 1 Fatality is preceded by 600+ Unsafe Acts (Bullying).', 25, 40);
    doc.text('- SafeGuard detects leading indicators before lagging fatalities.', 25, 47);

    // Section 7: Sector Analysis
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('7. Dual-Tier Sector Risk Profiles', 20, 65);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text('- Tier S: Hotels & FnB (High Stress, Job Insecurity).', 25, 75);
    doc.text('- Tier A: Startups & IT (Cognitive Load, Burnout).', 25, 82);

    // Section 8: Ethical Clearance
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('8. Ethical Clearance & Compliance', 20, 100);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    const ethical = 'SafeGuard is committed to obtaining formal ethical clearance from recognized Institutional Review Boards (IRB) to ensure clinical validity and data privacy compliance for corporate deployment. This process includes informed consent protocols and anonymized data handling.';
    const splitEthical = doc.splitTextToSize(ethical, 170);
    doc.text(splitEthical, 20, 110);

    // Section 9: Leadership
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('9. The Leadership Team', 20, 140);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text('- Akhmad Khudri: Team Lead & Product Owner', 25, 150);
    doc.text('- Stanley Nathanael Wijaya: Lead AI & Product Engineer', 25, 157);
    doc.text('- Dwiki Aulia Rahman: Health Data & Predictive Insight', 25, 164);
    doc.text('- dr. M. Rifki Al Ikhsan: Clinical & Occupational Health Advisor', 25, 171);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(180, 180, 180);
    doc.text('Prepared for HSIL Hackathon 2026 - Harvard T.H. Chan School of Public Health.', 20, 285);
    
    doc.save(`SafeGuard_Strategic_Whitepaper_${new Date().getTime()}.pdf`);
  };

  const sections = [
    { id: 'executive', title: 'Executive Summary', icon: FileText },
    { id: 'economic', title: 'Strategic Market Valuation', icon: TrendingUp },
    { id: 'swot', title: 'SWOT Analysis', icon: Target },
    { id: 'costs', title: 'Operational Cost Analysis', icon: Coins },
    { id: 'impact', title: 'Economic Case for Intervention', icon: BarChart3 },
    { id: 'pyramid', title: 'Incident Pyramid', icon: Activity },
    { id: 'sectors', title: 'Sector Analysis', icon: Building2 },
    { id: 'compliance', title: 'Ethical Clearance', icon: ShieldCheck },
    { id: 'team', title: 'Leadership Team', icon: Users },
  ];

  return (
    <div className="w-full max-w-6xl pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-12 sticky top-0 bg-[#F8F9FA]/80 backdrop-blur-md py-4 z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to System</span>
        </button>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">v1.0 / April 2026</span>
          <button 
            onClick={downloadWhitepaper}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all"
          >
            <Download className="w-4 h-4" />
            Download Whitepaper
          </button>
        </div>
      </div>

      {/* Title Section */}
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
          Strategic Whitepaper
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]">
          SafeGuard: Strategic AI/ML Digitalization for <span className="text-teal-600">Inclusive Psychosocial Hazard Intervention</span>
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed max-w-3xl">
          "Invisible psychosocial hazard can become visible business loss." A comprehensive baseline for bullying, suicide, and psychiatric emergency prevention in modern organizations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-32 space-y-1">
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-4 px-4">Contents</p>
            {sections.map((s) => (
              <a 
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
              >
                <s.icon className="w-4 h-4" />
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-24">
          {/* Executive Summary */}
          <section id="executive" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
              <FileText className="w-6 h-6 text-teal-600" />
              1. Executive Summary
            </h2>
            <div className="prose prose-teal max-w-none text-gray-600 leading-relaxed space-y-6">
              <p className="font-medium text-gray-900 text-lg italic border-l-4 border-teal-500 pl-6 py-2">
                "From Symptom to System: Transforming fragmented mental health complaints into accountable, boardroom-ready economic interventions."
              </p>
              <p>
                SafeGuard is a digital psychosocial early warning system designed to bridge the gap between clinical risk and corporate productivity. By leveraging AI and interoperable health data (FHIR), SafeGuard provides a "High-Value" solution for modern health systems, ensuring that invisible psychosocial hazards are detected and mitigated before they manifest as significant economic losses.
              </p>
            </div>
          </section>

          {/* Strategic Market Valuation */}
          <section id="economic" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
              <TrendingUp className="w-6 h-6 text-teal-600" />
              2. Strategic Market Valuation (Dual-Tier Strategy)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-8 bg-teal-50 rounded-[32px] border border-teal-100">
                <div className="text-[10px] font-bold uppercase tracking-widest text-teal-600 mb-2">Tier S: Tourism & Hospitality</div>
                <div className="text-2xl font-bold text-gray-900 mb-2">Rp 500-800B TAM</div>
                <p className="text-xs text-gray-600 leading-relaxed">High-risk clinical impact with 1M+ workers in Hotels & FnB.</p>
              </div>
              <div className="p-8 bg-indigo-50 rounded-[32px] border border-indigo-100">
                <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-2">Tier A: Startups & IT</div>
                <div className="text-2xl font-bold text-gray-900 mb-2">Rp 300-500B TAM</div>
                <p className="text-xs text-gray-600 leading-relaxed">High-adoption tech-native ecosystem with high burnout rates.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Combined TAM', value: 'Rp 800B+', desc: 'Total market across both high-stress sectors.' },
                { label: 'Combined SAM', value: 'Rp 350-550B', desc: 'Serviceable market in star-rated hotels & tech hubs.' },
                { label: 'Combined SOM', value: 'Rp 120-180B', desc: 'Targeted initial pilot in Bali, Jakarta, & Tech Hubs.' },
              ].map((m) => (
                <div key={m.label} className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{m.label}</div>
                  <div className="text-2xl font-bold text-teal-600 mb-2">{m.value}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SWOT Analysis */}
          <section id="swot" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
              <Target className="w-6 h-6 text-teal-600" />
              3. SWOT Analysis: Strategic Positioning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { 
                  title: 'Strengths', 
                  items: [
                    'Clinical-Grade AI (ICD-10 Chapter V)', 
                    'Dual-Tier Market Strategy (Tier S & A)', 
                    'Economic ROI 1:4 Modeling', 
                    'Proprietary IoT Hardware Ecosystem (Arduino)',
                    'Multidisciplinary Expert Leadership'
                  ],
                  color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
                },
                { 
                  title: 'Weaknesses', 
                  items: [
                    'Ethical Clearance Requirements (IRB)', 
                    'Early-Stage Data Validation Requirements', 
                    'High Turnover in Target Sector (FnB)'
                  ],
                  color: 'bg-amber-50 text-amber-700 border-amber-100'
                },
                { 
                  title: 'Opportunities', 
                  items: [
                    'Hospitality Wellness Mandate', 
                    'Subscription-Based SaaS Revenue Model', 
                    'Hardware-as-a-Service (HaaS) Revenue Model',
                    'Health Insurance & Premium Reduction Partnerships',
                    'Alignment with Indonesia Emas 2045 Human Capital Goals'
                  ],
                  color: 'bg-blue-50 text-blue-700 border-blue-100'
                },
                { 
                  title: 'Threats', 
                  items: [
                    'Strict Data Privacy Regulations (PDP Law)', 
                    'Persistent Mental Health Stigma in Workforce', 
                    'Competition from Global EAP Vendors',
                    'Economic Volatility in Tourism Sector'
                  ],
                  color: 'bg-red-50 text-red-700 border-red-100'
                },
              ].map((s) => (
                <div key={s.title} className={cn("p-8 rounded-[32px] border", s.color)}>
                  <h4 className="font-bold mb-4 uppercase tracking-widest text-xs">{s.title}</h4>
                  <ul className="space-y-2">
                    {s.items.map((item, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Operational Cost Analysis */}
          <section id="costs" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
              <Coins className="w-6 h-6 text-teal-600" />
              4. Operational Cost & Subscription Model
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white rounded-[40px] border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-600" />
                  Cloud & AI Infrastructure (Per 1000 Users)
                </h3>
                <div className="space-y-6">
                  {[
                    { label: 'AI API (Gemini 1.5 Flash)', cost: '~$5 - $10 / month', desc: 'Based on 10,000 scans/month.' },
                    { label: 'Cloud Database (Firebase)', cost: '~$15 - $25 / month', desc: 'Blaze Plan (Pay-as-you-go) usage.' },
                    { label: 'Maintenance & Support', cost: 'Rp 5 - 10M / year', desc: 'Technical updates and server monitoring.' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-start border-b border-gray-50 pb-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item.label}</p>
                        <p className="text-[10px] text-gray-500">{item.desc}</p>
                      </div>
                      <div className="text-sm font-mono font-bold text-teal-600">{item.cost}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 bg-teal-900 text-white rounded-[40px] shadow-xl shadow-teal-900/10">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-400" />
                  Subscription Model (B2B SaaS)
                </h3>
                <div className="space-y-8">
                  <div className="text-center p-6 bg-white/5 rounded-3xl border border-white/10">
                    <p className="text-xs font-mono text-teal-400 uppercase tracking-widest mb-2">Standard Rate</p>
                    <p className="text-3xl font-bold">Rp 50.000 - 100.000</p>
                    <p className="text-xs text-teal-200/60 mt-1">per Employee / Year</p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs text-teal-100/70 leading-relaxed">
                      For a typical hotel with 200 staff, the annual investment is approximately <b>Rp 10M - 20M</b>. 
                    </p>
                    <div className="p-4 bg-teal-800/50 rounded-2xl border border-teal-700/50">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-teal-400 mb-1">ROI Justification</p>
                      <p className="text-xs leading-relaxed">
                        Preventing just <b>one</b> burnout-related resignation (recruitment cost ~Rp 15M) covers the entire annual subscription cost.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Economic Case for Intervention */}
          <section id="impact" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
              <BarChart3 className="w-6 h-6 text-teal-600" />
              5. The Economic Case for Intervention
            </h2>
            <div className="bg-gray-900 text-white p-10 rounded-[40px] relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-8 italic">"Preventing one case is enough to justify the entire system."</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-xs text-gray-400 uppercase tracking-widest">System Implementation</span>
                      <span className="text-xl font-bold text-teal-400">&lt; Rp 1 Billion</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 w-[5%]"></div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-xs text-gray-400 uppercase tracking-widest">Single Fatal Incident Cost</span>
                      <span className="text-xl font-bold text-red-400">Up to Rp 20 Billion</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 w-full"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-12 flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-3xl font-black text-teal-400">1:4</div>
                  <div className="text-xs text-gray-400 leading-relaxed">
                    WHO ROI Standard: For every Rp 1 invested in scaled mental health interventions, there is a Rp 4 return in improved health and productivity.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Incident Pyramid */}
          <section id="pyramid" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
              <TrendingUp className="w-6 h-6 text-teal-600" />
              6. The Psychosocial Incident Pyramid
            </h2>
            <IncidentPyramid />
            <div className="mt-8 p-8 bg-teal-50 rounded-[32px] border border-teal-100">
              <h4 className="font-bold text-teal-900 mb-4">Harvard Style Strategic Insight</h4>
              <p className="text-sm text-teal-800 leading-relaxed">
                "1 major injury is preceded by 29 minor injuries and 300 near misses." (Heinrich, 1931). 
                In the modern psychosocial context, 1 fatality (suicide/CVD) is preceded by 600+ unsafe acts (bullying, toxic culture). 
                SafeGuard detects these leading indicators before they escalate into lagging fatalities.
              </p>
            </div>
          </section>

          {/* Sector Analysis */}
          <section id="sectors" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
              <Building2 className="w-6 h-6 text-teal-600" />
              7. Dual-Tier Sector Risk Profiles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { 
                  sector: 'Tier S: Hotels & Hospitality', 
                  risk: 'High Stress + Long Hours', 
                  desc: '24/7 operations, emotional labor, and physically demanding shifts lead to chronic fatigue and burnout.' 
                },
                { 
                  sector: 'Tier S: Food & Beverage (FnB)', 
                  risk: 'Job Insecurity', 
                  desc: 'High prevalence of non-permanent staff, risk of termination without severance, and wages often below minimum standards.' 
                },
                { 
                  sector: 'Tier A: Startups & IT', 
                  risk: 'Cognitive Load & Burnout', 
                  desc: 'High-velocity work, "crunch culture," and tight deadlines lead to cognitive fatigue and presenteeism.' 
                },
                { 
                  sector: 'Tier A: Digital Agencies', 
                  risk: 'Performance Anxiety', 
                  desc: 'High-pressure client targets and constant rejection in high-velocity growth environments.' 
                },
              ].map((s) => (
                <div key={s.sector} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className={cn(
                    "text-xs font-bold uppercase tracking-widest mb-2",
                    s.sector.includes('Tier S') ? "text-teal-600" : "text-indigo-600"
                  )}>{s.sector}</div>
                  <div className="font-bold text-gray-900 mb-2">{s.risk}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Ethical Clearance */}
          <section id="compliance" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
              <ShieldCheck className="w-6 h-6 text-teal-600" />
              8. Ethical Clearance & Clinical Compliance
            </h2>
            <div className="p-10 bg-gray-50 rounded-[40px] border border-gray-100">
              <div className="max-w-3xl space-y-6">
                <p className="text-gray-600 leading-relaxed">
                  SafeGuard recognizes that corporate deployment of psychosocial surveillance requires the highest level of ethical scrutiny. We are committed to the following compliance roadmap:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: 'IRB Approval', desc: 'Obtaining ethical clearance from Institutional Review Boards for clinical data handling.' },
                    { title: 'Informed Consent', desc: 'Transparent user agreements ensuring workers understand how their data is used.' },
                    { title: 'Data Anonymization', desc: 'Strict protocols to ensure aggregate reporting never exposes individual identities.' },
                    { title: 'PDP Law Compliance', desc: 'Alignment with Indonesian Personal Data Protection (PDP) regulations.' },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Leadership Team */}
          <section id="team" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
              <Users className="w-6 h-6 text-teal-600" />
              9. The Leadership Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Akhmad Khudri', role: 'Team Lead & Product Owner' },
                { name: 'Stanley Nathanael Wijaya', role: 'Lead AI & Product Engineer' },
                { name: 'Dwiki Aulia Rahman', role: 'Health Data & Predictive Insight' },
                { name: 'dr. M. Rifki Al Ikhsan', role: 'Clinical & Occupational Health Advisor' },
              ].map((m) => (
                <div key={m.name} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="font-bold text-gray-900">{m.name}</div>
                  <div className="text-xs text-gray-500 font-mono uppercase tracking-widest mt-1">{m.role}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer Quote */}
          <div className="pt-20 border-t border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-900 mb-4 italic">
              "SafeGuard is not a cost center; it is a risk control system."
            </p>
            <p className="text-gray-400 text-sm">
              Prepared for the HSIL Hackathon 2026 - Harvard T.H. Chan School of Public Health. All data based on WHO, ILO, UNESCO, and Kemenkes official reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
