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
  Building2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { cn } from '../lib/utils';

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
    const summary = 'SafeGuard AI is an inclusive psychosocial hazard intelligence system. It detects early warning signals of bullying, burnout, and organizational dysfunction, mapping them into clinical, occupational, and legal risk layers.';
    const splitSummary = doc.splitTextToSize(summary, 170);
    doc.text(splitSummary, 20, 70);
    
    // Section 2: Global & National Burden
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('2. Global & National Burden', 20, 95);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text('- Global Suicide: 727,000 deaths/year.', 25, 105);
    doc.text('- Workplace Harassment: 17.9% of global workers.', 25, 112);
    doc.text('- Indonesia School Signal: 36.31% students potentially bullied.', 25, 119);
    doc.text('- Indonesia Youth: 61% with depression had suicidal thoughts.', 25, 126);
    
    // Section 3: Strategic Market Valuation (TAM/SAM/SOM)
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('3. Strategic Market Valuation', 20, 145);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text('- TAM (Total Addressable Market): Rp 300-500 Billion.', 25, 155);
    doc.text('- SAM (Serviceable Available Market): Rp 150-250 Billion.', 25, 162);
    doc.text('- SOM (Serviceable Obtainable Market): Rp 50-80 Billion.', 25, 169);

    // Section 4: Economic Case for Intervention
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('4. The Economic Case for Intervention', 20, 185);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text('- System Implementation Cost: < Rp 1 Billion.', 25, 195);
    doc.text('- Single Fatal Incident Cost: Up to Rp 20 Billion.', 25, 202);
    doc.text('- "Preventing one case is enough to justify the entire system."', 25, 209);
    
    // Section 5: The SAFE Framework
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('5. The SAFE Framework', 20, 225);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text('- Sense: Real-time biometric and digital anamnesis data collection.', 25, 235);
    doc.text('- Analyze: AI-driven risk stratification and prognostic modeling.', 25, 242);
    doc.text('- Flag: Automated alerting for Level 0-L2 clinical risks.', 25, 249);
    doc.text('- Engage: Personalized wellness roadmaps and clinical escalation.', 25, 256);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(180, 180, 180);
    doc.text('Prepared for HSIL Hackathon 2026 - Harvard T.H. Chan School of Public Health.', 20, 285);
    
    doc.save(`SafeGuard_Strategic_Whitepaper_${new Date().getTime()}.pdf`);
  };

  const sections = [
    { id: 'executive', title: 'Executive Summary', icon: FileText },
    { id: 'problem', title: 'Global & National Burden', icon: Globe },
    { id: 'economic', title: 'Strategic Market Valuation', icon: TrendingUp },
    { id: 'impact', title: 'Economic Case for Intervention', icon: BarChart3 },
    { id: 'clinical', title: 'Clinical & ICD-10 Framework', icon: Stethoscope },
    { id: 'ai-mitigation', title: 'AI/ML Mitigations', icon: ShieldCheck },
  ];

  return (
    <div className="w-full max-w-4xl pb-20">
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
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <FileText className="w-6 h-6 text-teal-600" />
              Executive Summary
            </h2>
            <div className="prose prose-teal max-w-none text-gray-600 leading-relaxed space-y-6">
              <p className="font-medium text-gray-900 text-lg italic border-l-4 border-teal-500 pl-6 py-2">
                "Bullying is not a soft issue; it is a leading indicator of mental-health failure."
              </p>
              <p>
                SafeGuard AI is an inclusive psychosocial hazard intelligence system. It detects early warning signals of bullying, burnout, and organizational dysfunction, mapping them into clinical, occupational, and legal risk layers.
              </p>
              <div className="grid grid-cols-2 gap-4 not-prose">
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="text-3xl font-bold text-teal-600 mb-1">12B</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Workdays Lost Annually</div>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="text-3xl font-bold text-teal-600 mb-1">$1T</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Global Productivity Loss</div>
                </div>
              </div>
            </div>
          </section>

          {/* Global & National Burden */}
          <section id="problem" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Globe className="w-6 h-6 text-teal-600" />
              Global & National Burden
            </h2>
            <div className="space-y-8">
              <div className="bg-gray-900 text-white p-8 rounded-[40px] relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-6">Key Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="text-4xl font-bold text-teal-400 mb-2">727,000</div>
                      <p className="text-sm text-gray-400">Global suicide deaths per year. 73% occur in low-middle income countries.</p>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-teal-400 mb-2">17.9%</div>
                      <p className="text-sm text-gray-400">Workers worldwide have experienced psychological violence or harassment.</p>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-teal-400 mb-2">36.31%</div>
                      <p className="text-sm text-gray-400">Indonesian students potentially experience bullying (Asesmen Nasional 2022).</p>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-teal-400 mb-2">61%</div>
                      <p className="text-sm text-gray-400">Indonesian youth with depression had suicidal thoughts in the last month.</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              </div>
              
              <div className="prose prose-teal max-w-none text-gray-600">
                <p>
                  In Indonesia, suicide signals are critical. Sample Registration System (2016) estimates 1,800 deaths/year (5 per day), with 47.7% of victims aged 10–39 years. Bullying is often the "upstream" trigger for these "downstream" psychiatric emergencies.
                </p>
              </div>
            </div>
          </section>

          {/* Sectoral Epidemiology */}
          <section id="sector" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Users className="w-6 h-6 text-teal-600" />
              Sectoral Epidemiology
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { 
                  title: 'Education', 
                  desc: 'High official data baseline. 36.31% bullying potential. Primary target for SAM due to standardized intervention systems.',
                  icon: BookOpen
                },
                { 
                  title: 'Healthcare', 
                  desc: 'High risk for workplace violence. Up to 62% of health workers experience violence; verbal abuse is most common.',
                  icon: Stethoscope
                },
                { 
                  title: 'Office / Formal', 
                  desc: '17.9% psychological violence rate. Poor working environments (overload, low control) are key mental health hazards.',
                  icon: Building2
                },
                { 
                  title: 'Extractive Industries', 
                  desc: 'Hazard recognized (Migas, Mining, Agriculture) but data fragmented. Focus on psychosocial hazard prevention.',
                  icon: Scale
                }
              ].map((sector) => (
                <div key={sector.title} className="p-8 bg-white rounded-3xl border border-gray-100 hover:border-teal-200 transition-all group">
                  <sector.icon className="w-8 h-8 text-teal-600 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-lg mb-2">{sector.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{sector.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Strategic Market Valuation */}
          <section id="economic" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-teal-600" />
              Strategic Market Valuation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">TAM</div>
                <div className="text-2xl font-bold text-teal-600 mb-2">Rp 300-500B</div>
                <p className="text-xs text-gray-500">Total Addressable Market: 250,000+ workers facing productivity loss.</p>
              </div>
              <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">SAM</div>
                <div className="text-2xl font-bold text-teal-600 mb-2">Rp 150-250B</div>
                <p className="text-xs text-gray-500">Serviceable Available Market: Hospitals, Universities, and BUMN.</p>
              </div>
              <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">SOM</div>
                <div className="text-2xl font-bold text-teal-600 mb-2">Rp 50-80B</div>
                <p className="text-xs text-gray-500">Serviceable Obtainable Market: 10-20 early-adopter institutions.</p>
              </div>
            </div>
          </section>

          {/* Economic Case for Intervention */}
          <section id="impact" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-teal-600" />
              The Economic Case for Intervention
            </h2>
            <div className="bg-gray-900 text-white p-10 rounded-[40px] relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-4 italic">"Preventing one case is enough to justify the entire system."</h3>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                      SafeGuard transforms fragmented mental health complaints into accountable, boardroom-ready economic interventions.
                    </p>
                    <div className="space-y-6">
                      <div className="flex justify-between items-end">
                        <span className="text-sm text-gray-400 uppercase tracking-widest">System Implementation</span>
                        <span className="text-xl font-bold text-teal-400">&lt; Rp 1 Billion</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 w-[5%]"></div>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <span className="text-sm text-gray-400 uppercase tracking-widest">Single Fatal Incident Cost</span>
                        <span className="text-xl font-bold text-red-400">Up to Rp 20 Billion</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -mb-48 -mr-48"></div>
            </div>
          </section>

          {/* AI/ML Mitigations */}
          <section id="ai-mitigation" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-teal-600" />
              AI/ML Limitations & Mitigations
            </h2>
            <div className="overflow-hidden rounded-[40px] border border-gray-100 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-6 text-xs font-bold uppercase tracking-widest text-gray-400 font-mono">Risk Factor</th>
                    <th className="p-6 text-xs font-bold uppercase tracking-widest text-gray-400 font-mono">Impact</th>
                    <th className="p-6 text-xs font-bold uppercase tracking-widest text-gray-400 font-mono">Mitigation Strategy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { risk: 'AI Hallucination', impact: 'Misclassification', mitigation: 'Human-in-the-loop validation (mandatory)' },
                    { risk: 'Data Bias', impact: 'Wrong Insight', mitigation: 'Multi-source data (Survey + Behavior)' },
                    { risk: 'Privacy Risk', impact: 'Legal Issue', mitigation: 'End-to-end encryption + Consent' },
                    { risk: 'Alert Fatigue', impact: 'Ignored System', mitigation: 'Risk-based smart prioritization' },
                    { risk: 'Cultural Barrier', impact: 'Underreporting', mitigation: 'Anonymous mode + Leadership endorsement' },
                  ].map((row) => (
                    <tr key={row.risk} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-6 font-bold text-sm text-gray-900">{row.risk}</td>
                      <td className="p-6 text-sm text-red-600">{row.impact}</td>
                      <td className="p-6 text-sm text-gray-500">{row.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-3xl flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong>Strategic Note:</strong> AI does not replace clinicians—AI accelerates detection for clinicians. Every limitation is a design requirement for a safer, more ethical, and more accurate system.
              </p>
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
