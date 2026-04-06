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
  Heart
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
    doc.text(`v1.0 / Generated: ${timestamp}`, 20, 38);
    
    // Line
    doc.setDrawColor(230, 230, 230);
    doc.line(20, 45, 190, 45);
    
    // Section 1: Executive Summary
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('1. Executive Summary', 20, 60);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    const summary = 'SafeGuard is a digital psychosocial early warning system designed to transform fragmented mental health complaints into accountable, boardroom-ready economic interventions. By leveraging AI and FHIR, SafeGuard bridges the gap between clinical risk and corporate productivity.';
    const splitSummary = doc.splitTextToSize(summary, 170);
    doc.text(splitSummary, 20, 70);
    
    // Section 2: Strategic Market Valuation
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('2. Strategic Market Valuation', 20, 95);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text('- TAM (Total Addressable Market): Rp 300-500 Billion.', 25, 105);
    doc.text('- SAM (Serviceable Available Market): Rp 150-250 Billion.', 25, 112);
    doc.text('- SOM (Serviceable Obtainable Market): Rp 50-80 Billion.', 25, 119);
    
    // Section 3: SWOT Analysis
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('3. SWOT Analysis', 20, 135);
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text('Strengths: National Alignment (SATUSEHAT), Proactive OSHA Framework, ROI Modeling.', 25, 145);
    doc.text('Weaknesses: Reporting Bias, Cultural Friction, Scaling Requirements.', 25, 152);
    doc.text('Opportunities: Industrial Expansion (BUMN), HRIS Integration, Global Standards.', 25, 159);
    doc.text('Threats: Regulatory Evolution (PDP Law), Generic EAP Competition, Stigma.', 25, 166);

    // Section 4: Economic Case
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('4. The Economic Case for Intervention', 20, 185);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text('- System Implementation Cost: < Rp 1 Billion.', 25, 195);
    doc.text('- Single Fatal Incident Cost: Up to Rp 20 Billion.', 25, 202);
    doc.text('- ROI Ratio: 1:4 (WHO Standard).', 25, 209);
    
    // Section 5: Incident Pyramid
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('5. The Psychosocial Incident Pyramid', 20, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text('1 Fatality (Suicide/CVD) = 600 Unsafe Acts (Bullying/Toxic Culture).', 25, 40);
    doc.text('Eliminating 300 unsafe acts is more powerful than reacting to 1 fatality.', 25, 47);
    
    // Section 6: Sector Analysis
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('6. Sector-Specific Risk Profiles', 20, 65);
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text('- Oil & Gas: High stress, isolation, high consequence operations.', 25, 75);
    doc.text('- Mining: Remote area, harsh environment, heat stress amplification.', 25, 82);
    doc.text('- Plantation: Informal leadership, low reporting culture.', 25, 89);
    doc.text('- Office/Service: High cognitive load, invisible burnout hazards.', 25, 96);

    // Section 7: Team
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('7. The Leadership Team', 20, 115);
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text('- Akhmad Khudri: Team Lead & Product Owner', 25, 125);
    doc.text('- Stanley Nathanael Wijaya: Lead AI & Product Engineer', 25, 132);
    doc.text('- Dwiki Aulia Rahman: Health Data & Predictive Insight', 25, 139);
    doc.text('- dr. M. Rifki Al Ikhsan: Clinical & Occupational Health Advisor', 25, 146);
    
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
    { id: 'impact', title: 'Economic Case for Intervention', icon: BarChart3 },
    { id: 'pyramid', title: 'Incident Pyramid', icon: Activity },
    { id: 'sectors', title: 'Sector Analysis', icon: Building2 },
    { id: 'populations', title: 'Special Populations', icon: Heart },
    { id: 'ai-mitigation', title: 'AI/ML Mitigations', icon: ShieldCheck },
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
              2. Strategic Market Valuation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'TAM', value: 'Rp 300-500B', desc: 'Total Addressable Market: 250,000+ workers facing productivity loss.' },
                { label: 'SAM', value: 'Rp 150-250B', desc: 'Serviceable Available Market: Hospitals, Universities, and BUMN.' },
                { label: 'SOM', value: 'Rp 50-80B', desc: 'Serviceable Obtainable Market: 10-20 early-adopter institutions.' },
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
                  items: ['National Alignment (SATUSEHAT/FHIR)', 'Proactive OSHA Framework', 'Economic ROI Modeling', 'Expert Leadership'],
                  color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
                },
                { 
                  title: 'Weaknesses', 
                  items: ['Reporting Bias Dependency', 'Cultural Friction in Adoption', 'Scaling Requirements'],
                  color: 'bg-amber-50 text-amber-700 border-amber-100'
                },
                { 
                  title: 'Opportunities', 
                  items: ['Industrial Expansion (BUMN)', 'HRIS/ERP Integration', 'Global WHO/ILO Standards'],
                  color: 'bg-blue-50 text-blue-700 border-blue-100'
                },
                { 
                  title: 'Threats', 
                  items: ['Regulatory Evolution (PDP Law)', 'Generic EAP Competition', 'Mental Health Stigma'],
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

          {/* Economic Case for Intervention */}
          <section id="impact" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
              <BarChart3 className="w-6 h-6 text-teal-600" />
              4. The Economic Case for Intervention
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
              5. The Psychosocial Incident Pyramid
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
              6. Sector-Specific Risk Profiles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { 
                  sector: 'Oil & Gas', 
                  risk: 'High Stress + High Risk', 
                  desc: 'Long shifts, isolation, and high-consequence operations lead to sleep disturbance and sudden death risk.' 
                },
                { 
                  sector: 'Mining', 
                  risk: 'Harsh Environments', 
                  desc: 'Remote areas and heat stress amplify psychosocial hazards, creating a synergy of physical and mental risk.' 
                },
                { 
                  sector: 'Plantation', 
                  risk: 'Informal Leadership', 
                  desc: 'Low reporting culture means UA/UC are often undetected until they escalate into medical emergencies.' 
                },
                { 
                  sector: 'Office / Service', 
                  risk: 'Cognitive Load', 
                  desc: 'Invisible hazards like burnout and anxiety lead to presenteeism and hidden productivity loss.' 
                },
              ].map((s) => (
                <div key={s.sector} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">{s.sector}</div>
                  <div className="font-bold text-gray-900 mb-2">{s.risk}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Special Populations */}
          <section id="populations" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
              <Heart className="w-6 h-6 text-teal-600" />
              7. Special Population Vulnerabilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Young Workers', desc: 'Higher bullying vulnerability, immature coping.' },
                { label: 'Geriatric', desc: 'High comorbidities; stress triggers CVD fatality.' },
                { label: 'Pregnant', desc: 'Stress increases cortisol; risk of preterm birth.' },
                { label: 'Disabled', desc: 'Higher discrimination risk; underreported UA/UC.' },
              ].map((p) => (
                <div key={p.label} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="font-bold text-gray-900 text-sm mb-2">{p.label}</div>
                  <p className="text-[10px] text-gray-500 leading-tight">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* AI/ML Mitigations */}
          <section id="ai-mitigation" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
              <ShieldCheck className="w-6 h-6 text-teal-600" />
              5. AI/ML Mitigations
            </h2>
            <div className="overflow-hidden rounded-[40px] border border-gray-100 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-6 text-xs font-bold uppercase tracking-widest text-gray-400 font-mono">Risk Factor</th>
                    <th className="p-6 text-xs font-bold uppercase tracking-widest text-gray-400 font-mono">Mitigation Strategy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { risk: 'AI Hallucination', mitigation: 'Human-in-the-loop validation (mandatory)' },
                    { risk: 'Data Bias', mitigation: 'Multi-source data (Survey + Behavior)' },
                    { risk: 'Privacy Risk', mitigation: 'End-to-end encryption + Consent' },
                    { risk: 'Alert Fatigue', mitigation: 'Risk-based smart prioritization' },
                  ].map((row) => (
                    <tr key={row.risk} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-6 font-bold text-sm text-gray-900">{row.risk}</td>
                      <td className="p-6 text-sm text-gray-500">{row.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Leadership Team */}
          <section id="team" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
              <Users className="w-6 h-6 text-teal-600" />
              6. The Leadership Team
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
