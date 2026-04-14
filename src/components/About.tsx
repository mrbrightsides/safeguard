import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  Shield, 
  Target, 
  Users, 
  Globe, 
  Award, 
  Heart,
  Sparkles,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Zap,
  CheckCircle2,
  Mail,
  ClipboardCheck,
  BrainCircuit,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

import { IncidentPyramid } from './IncidentPyramid';

interface AboutProps {
  onGetStarted: () => void;
}

export const About: React.FC<AboutProps> = ({ onGetStarted }) => {
  return (
    <div className="w-full space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[40px] bg-teal-900 p-12 text-white">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-800 text-teal-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
            Our Mission
          </div>
          <h1 className="text-4xl font-bold mb-6 tracking-tight">
            Pioneering the Future of <span className="text-teal-400">Psychosocial Surveillance</span>
          </h1>
          <p className="text-teal-100/70 text-lg leading-relaxed mb-8">
            SafeGuard was born from a simple but powerful vision: to transform invisible psychosocial hazards into visible, actionable, and preventable insights. As a <b>High-Value Health System</b>, we combine clinical precision with AI-driven prognostic modeling to protect the world's most valuable asset—human capital.
          </p>
          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            <p className="text-xs font-mono text-teal-400 uppercase tracking-widest mb-2">Master Hook</p>
            <p className="text-xl font-bold italic leading-tight">
              "1 fatality is not 1 event — it is the visible tip of hundreds of ignored psychosocial signals."
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </section>

      {/* Prompt Opinion Integration Section */}
      <section className="p-12 bg-white rounded-[40px] border border-teal-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
            Prompt Opinion Integration
          </div>
          <h2 className="text-2xl font-bold mb-4">A SHARP-Compliant Clinical Agent</h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl">
            SafeGuard is a specialized clinical agent integrated into the <b>Prompt Opinion</b> ecosystem. We leverage the <b>SHARP Extension Specs</b> and <b>A2A Protocol</b> to provide seamless, evidence-based decision support directly within the clinician's workflow.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <Globe className="w-64 h-64" />
        </div>
      </section>

      {/* Clinical Pathway Section (For Dr. Andry) */}
      <section className="p-12 bg-white rounded-[40px] border border-gray-100 shadow-sm">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
            Clinical Pathway
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Evidence-Based Clinical Journey</h2>
          <p className="text-gray-500 mt-2">SafeGuard is not a chatbot; it is a Clinical Decision Support System (CDSS).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {[
            { step: '01', title: 'Digital Anamnesis', desc: 'ICD-10 & DASS-21 based screening.', icon: ClipboardCheck },
            { step: '02', title: 'AI Triage', desc: 'L0-L3 risk stratification & pattern detection.', icon: BrainCircuit },
            { step: '03', title: 'Clinical Referral', desc: 'Direct link to psychologists & psychiatrists.', icon: UserCheck },
            { step: '04', title: 'MERP Activation', desc: 'Emergency response for high-risk (L3) cases.', icon: AlertTriangle }
          ].map((item, i) => (
            <div key={i} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 relative z-10">
              <div className="text-4xl font-black text-gray-200 mb-4">{item.step}</div>
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
                <item.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -translate-y-1/2 z-0" />
        </div>
      </section>

      {/* Human-Centered Design Section (For Ibu Ilma) */}
      <section className="p-12 bg-teal-50 rounded-[40px] border border-teal-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Inclusive Innovation
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Designing for Human Behavior</h2>
            <p className="text-gray-600 leading-relaxed">
              We believe that <b>"AI yang bagus bukan yang pintar, tapi yang dipakai manusia."</b> SafeGuard is designed with empathy first, ensuring accessibility for all users.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Inclusivity', desc: 'High-contrast & Tremor-friendly modes.' },
                { title: 'Simplicity', desc: '1-minute screening, 1-click action.' },
                { title: 'Voice Assist', desc: 'Empathetic audio feedback for low vision.' },
                { title: 'Behavioral UX', desc: 'Gamified wellness adherence loops.' }
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 mt-1" />
                  <div>
                    <p className="font-bold text-sm text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-teal-50">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">UX Accessibility Test</span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">PASSED</span>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                <div className="h-4 bg-gray-100 rounded-full w-1/2" />
                <div className="h-12 bg-teal-600 rounded-2xl w-full flex items-center justify-center text-white font-bold text-sm">
                  Simplicity in Action
                </div>
              </div>
              <p className="text-[10px] text-gray-400 text-center italic">
                "Kami tidak hanya membuat AI, kami mendesain perilaku sehat."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Incident Pyramid Section */}
      <section className="scroll-mt-32">
        <IncidentPyramid />
      </section>

      {/* Hardware Innovation Section */}
      <section className="p-12 bg-indigo-900 rounded-[40px] text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-800 text-indigo-300 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
              Hardware Innovation
            </div>
            <h2 className="text-3xl font-bold mb-6 tracking-tight">The IoT Companion Tool</h2>
            <p className="text-indigo-100/70 leading-relaxed mb-8">
              Beyond digital screens, SafeGuard is expanding into physical touchpoints. Our team is developing proprietary <b>Arduino-based IoT hardware</b> designed to be integrated into companion dolls and interactive tools.
            </p>
            <ul className="space-y-4">
              {[
                { title: 'Interactive TTS', desc: 'Integrated Text-to-Speech for empathetic, voice-driven engagement.' },
                { title: 'Multi-Age Design', desc: 'Tailored for school-age children to university students.' },
                { title: 'Biometric Sensing', desc: 'Future-ready sensors for real-time physiological feedback.' }
              ].map((item) => (
                <li key={item.title} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{item.title}</p>
                    <p className="text-xs text-indigo-200/60">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-square bg-indigo-800/50 rounded-[60px] flex items-center justify-center border border-indigo-700/50 relative group">
              <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full"></div>
              <div className="text-center space-y-4 relative z-10">
                <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform">
                  <Zap className="w-12 h-12 text-white" />
                </div>
                <p className="text-xs font-mono text-indigo-300 uppercase tracking-widest">Arduino-Powered</p>
                <p className="text-2xl font-bold">Companion AI v1.0</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: 'Clinical Integrity',
            desc: 'Rooted in WHO-standard ROI modeling and ICD-10 clinical frameworks.',
            icon: Shield,
            color: 'bg-blue-50 text-blue-600'
          },
          {
            title: 'Human-Centric AI',
            desc: 'AI that accelerates clinical detection without replacing human judgment.',
            icon: Sparkles,
            color: 'bg-teal-50 text-teal-600'
          },
          {
            title: 'Privacy First',
            desc: 'End-to-end encryption and anonymized reporting for maximum safety.',
            icon: Heart,
            color: 'bg-rose-50 text-rose-600'
          }
        ].map((value, i) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 ${value.color} rounded-2xl flex items-center justify-center mb-6`}>
              <value.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">{value.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{value.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* The Team / Leadership */}
      <section>
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Leadership & Vision</h2>
          <p className="text-gray-500 mt-2">The multidisciplinary team driving the SafeGuard ecosystem.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: 'Akhmad Khudri',
              role: 'Team Lead & Product Owner',
              focus: 'Strategy & SWOT',
              desc: 'Orchestrating the strategic alignment of SafeGuard with global health economics and high-value health system frameworks.',
              initials: 'AK',
              color: 'bg-teal-50 text-teal-600',
              linkedin: 'https://www.linkedin.com/in/akhmad-khudri',
              github: 'https://github.com/mrbrightsides'
            },
            {
              name: 'Stanley Nathanael Wijaya',
              role: 'Lead AI & Product Engineer',
              focus: 'Front-end & Integration',
              desc: 'Architecting the seamless integration of AI-driven insights into a production-grade, responsive user experience.',
              initials: 'SW',
              color: 'bg-blue-50 text-blue-600',
              linkedin: 'https://www.linkedin.com/in/stanley-nathanael-wijaya',
              github: 'https://github.com/StyNW7'
            },
            {
              name: 'Dwiki Aulia Rahman',
              role: 'Health Data & Predictive Insight',
              focus: 'AI Architecture & Epidemiology',
              desc: 'Designing robust predictive models and epidemiological frameworks to ensure data-driven psychosocial surveillance.',
              initials: 'DR',
              color: 'bg-indigo-50 text-indigo-600'
            },
            {
              name: 'dr. M. Rifki Al Ikhsan',
              role: 'Clinical & Occupational Health Advisor',
              focus: 'Policy, MCU, HRA & Intervention',
              desc: 'Ensuring clinical excellence and occupational health compliance through evidence-based psychosocial intervention strategies.',
              initials: 'RI',
              color: 'bg-emerald-50 text-emerald-600',
              linkedin: 'https://www.linkedin.com/in/m-rifki-al-ikhsan-02703295/'
            }
          ].map((member, i) => (
            <motion.div 
              key={member.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:border-teal-200 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner", member.color)}>
                    {member.initials}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{member.name}</h4>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400">{member.role}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href="mailto:safeguard@elpeef.com" className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                    <Mail className="w-4 h-4 text-gray-400 hover:text-teal-600" />
                  </a>
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                      <Linkedin className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                    </a>
                  )}
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                      <Github className="w-4 h-4 text-gray-400 hover:text-black" />
                    </a>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 text-gray-500 rounded-md text-[9px] font-bold uppercase tracking-wider border border-gray-100">
                  <Target className="w-3 h-3" />
                  {member.focus}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {member.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats / Impact */}
      <section className="p-12 bg-gray-50 rounded-[40px] border border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">1:4</div>
            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">WHO ROI Ratio</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">L0-L3</div>
            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Risk Levels</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">90d</div>
            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Prognostic Window</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">2026</div>
            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Prompt Opinion Hackathon</div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Ready to secure your organization?</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Join the leading enterprises already using SafeGuard to protect their workforce.</p>
        <button 
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
        >
          Get Started Now
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Footer */}
      <footer className="pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-teal-600" />
          <span className="font-bold text-gray-900">SafeGuard EWS</span>
        </div>
        <div className="flex items-center gap-8">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-compliance'))}
            className="text-sm text-gray-500 hover:text-teal-600 transition-colors"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-compliance'))}
            className="text-sm text-gray-500 hover:text-teal-600 transition-colors"
          >
            Terms of Service
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-compliance'))}
            className="text-sm text-gray-500 hover:text-teal-600 transition-colors"
          >
            AI Ethics
          </button>
        </div>
        <p className="text-xs text-gray-400 font-mono">© 2026 SafeGuard. All Rights Reserved.</p>
      </footer>
    </div>
  );
};
