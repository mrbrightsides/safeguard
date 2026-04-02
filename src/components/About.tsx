import React from 'react';
import { motion } from 'motion/react';
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
  Linkedin
} from 'lucide-react';

interface AboutProps {
  onGetStarted: () => void;
}

export const About: React.FC<AboutProps> = ({ onGetStarted }) => {
  return (
    <div className="w-full max-w-4xl space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[40px] bg-teal-900 p-12 text-white">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-800 text-teal-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
            Our Mission
          </div>
          <h1 className="text-4xl font-bold mb-6 tracking-tight">
            Pioneering the Future of <span className="text-teal-400">Psychosocial Surveillance</span>
          </h1>
          <p className="text-teal-100/70 text-lg leading-relaxed">
            SafeGuard was born from a simple but powerful vision: to transform invisible psychosocial hazards into visible, actionable, and preventable insights. We combine clinical precision with AI-driven prognostic modeling to protect the world's most valuable asset—human capital.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Leadership & Vision</h2>
            <p className="text-sm text-gray-500">The minds behind the SafeGuard ecosystem.</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Twitter className="w-4 h-4 text-gray-400" /></button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Linkedin className="w-4 h-4 text-gray-400" /></button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Github className="w-4 h-4 text-gray-400" /></button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group relative bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:border-teal-200 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-100 rounded-3xl overflow-hidden border border-gray-100">
                <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-600 font-bold text-xl">DR</div>
              </div>
              <div>
                <h4 className="text-xl font-bold">Dr. Rifki</h4>
                <p className="text-sm text-teal-600 font-mono uppercase tracking-widest">Chief Medical Strategist</p>
              </div>
            </div>
            <p className="mt-6 text-sm text-gray-500 leading-relaxed">
              Leading the clinical integration of SafeGuard with national health systems like SATUSEHAT, ensuring every AI insight is grounded in evidence-based medicine.
            </p>
          </div>

          <div className="group relative bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:border-teal-200 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-100 rounded-3xl overflow-hidden border border-gray-100">
                <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-xl">AI</div>
              </div>
              <div>
                <h4 className="text-xl font-bold">SafeGuard AI Team</h4>
                <p className="text-sm text-blue-600 font-mono uppercase tracking-widest">Engineering & ML</p>
              </div>
            </div>
            <p className="mt-6 text-sm text-gray-500 leading-relaxed">
              A multidisciplinary collective of data scientists and behavioral experts dedicated to building the world's most accurate psychosocial prognostic models.
            </p>
          </div>
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
            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">HSIL Hackathon</div>
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
    </div>
  );
};
