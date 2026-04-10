import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileText, 
  Scale, 
  BrainCircuit, 
  Database, 
  UserCheck,
  ArrowLeft,
  Download,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ComplianceProps {
  onBack?: () => void;
}

export const Compliance: React.FC<ComplianceProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'ai-ethics'>('privacy');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    
    // Simulate a small delay for "generating" the document
    setTimeout(() => {
      const timestamp = new Date().toLocaleDateString();
      const content = `
SAFEGUARD EWS - ${activeTab.toUpperCase()} POLICY
Generated on: ${timestamp}
Last Updated: April 10, 2026
Version: 2.4.0 (PDP Compliant)

==================================================

${activeTab === 'privacy' ? privacySections.map(s => `[${s.title}]\n${s.content}\n`).join('\n') : ''}
${activeTab === 'terms' ? `[Terms of Service]
By using SafeGuard, you agree to provide accurate information for the purpose of psychosocial risk assessment. 
You understand that the system uses AI to analyze patterns and provide wellness recommendations.

1. User Eligibility: Users must be at least 18 years of age.
2. Subscription: Access is granted based on organization tier.
3. Liability: SafeGuard is not a medical diagnostic tool.` : ''}
${activeTab === 'ai-ethics' ? aiEthicsSections.map(s => `[${s.title}]\n${s.content}\n`).join('\n') : ''}

==================================================
This document is a digital copy of the SafeGuard ${activeTab} policy.
For the latest version, please visit the SafeGuard Trust Center.

© 2026 SafeGuard. All Rights Reserved.
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SafeGuard_${activeTab}_Policy.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsDownloading(false);
    }, 800);
  };

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: Lock },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'ai-ethics', label: 'AI Ethics & Compliance', icon: BrainCircuit },
  ];

  const privacySections = [
    {
      title: 'Data Collection & Usage',
      icon: Database,
      content: 'SafeGuard collects biometric data (via wearables), mood inputs, and digital anamnesis responses. This data is used exclusively for psychosocial risk stratification and personalized wellness recommendations.'
    },
    {
      title: 'Encryption & Security',
      icon: ShieldCheck,
      content: 'All data is encrypted at rest using AES-256 and in transit via TLS 1.3. We employ strict access controls and regular security audits to ensure your health information remains private.'
    },
    {
      title: 'Data Anonymization',
      icon: Eye,
      content: 'For corporate analytics, all individual data is anonymized and aggregated. Employers can see population-level trends but can never access individual health records or specific mood logs.'
    },
    {
      title: 'Your Rights (PDP Law)',
      icon: UserCheck,
      content: 'In compliance with Indonesia\'s PDP Law, you have the right to access, correct, and request the deletion of your data at any time. You can also export your health data in FHIR-compatible formats.'
    }
  ];

  const aiEthicsSections = [
    {
      title: 'Algorithmic Transparency',
      content: 'Our AI models (powered by Google Gemini) are used for prognostic modeling, not diagnostic labeling. The system identifies risk patterns based on ICD-10 Chapter V frameworks.'
    },
    {
      title: 'No Training on User Data',
      content: 'We use enterprise-grade AI protocols. Your personal health data is NEVER used to train public AI models or shared with third-party advertisers.'
    },
    {
      title: 'Human-in-the-Loop',
      content: 'SafeGuard is a decision-support tool. Critical interventions (Level 3 Risk) always require validation by a qualified clinical professional or occupational health advisor.'
    },
    {
      title: 'Bias Mitigation',
      content: 'We regularly audit our AI prompts and models to prevent cultural or demographic bias, ensuring equitable risk detection across diverse workforces.'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-12">
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>
        )}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
          Legal & Compliance
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]">
          Trust & <span className="text-blue-600">AI Compliance</span>
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed max-w-3xl">
          At SafeGuard, we believe that psychosocial safety starts with data trust. Our compliance framework is built on transparency, clinical integrity, and strict privacy standards.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-2xl mb-12 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
              activeTab === tab.id 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-12"
        >
          {activeTab === 'privacy' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {privacySections.map((section) => (
                  <div key={section.title} className="space-y-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                      <section.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">{section.content}</p>
                  </div>
                ))}
              </div>
              <div className="pt-12 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Last Updated: April 10, 2026</p>
                    <p className="text-xs text-gray-400">Version 2.4.0 (PDP Compliant)</p>
                  </div>
                  <button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {isDownloading ? 'Generating...' : 'Download PDF Policy'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="prose prose-blue max-w-none">
              <div className="flex items-center gap-3 mb-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-800">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium m-0">
                  <b>Medical Disclaimer:</b> SafeGuard is an early warning system, not a medical diagnostic tool. Always consult with a licensed professional for clinical diagnosis.
                </p>
              </div>
              <h3 className="text-2xl font-bold mb-6">Terms of Service</h3>
              <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
                <p>
                  By using SafeGuard, you agree to provide accurate information for the purpose of psychosocial risk assessment. You understand that the system uses AI to analyze patterns and provide wellness recommendations.
                </p>
                <h4 className="text-gray-900 font-bold">1. User Eligibility</h4>
                <p>Users must be at least 18 years of age or have explicit consent from their organization and legal guardians where applicable.</p>
                <h4 className="text-gray-900 font-bold">2. Subscription & Access</h4>
                <p>Access is granted based on your organization's subscription tier. Misuse of the platform or attempting to reverse-engineer the AI models is strictly prohibited.</p>
                <h4 className="text-gray-900 font-bold">3. Limitation of Liability</h4>
                <p>SafeGuard is not liable for outcomes resulting from the failure to seek professional medical advice. Our system provides "leading indicators" to help prevent incidents, but is not a guarantee of safety.</p>
              </div>
              <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                  {isDownloading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {isDownloading ? 'Preparing Document...' : 'Download Terms of Service'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ai-ethics' && (
            <div className="space-y-12">
              <div className="flex items-center gap-4 p-6 bg-indigo-900 rounded-3xl text-white">
                <BrainCircuit className="w-10 h-10 text-indigo-400" />
                <div>
                  <h3 className="text-xl font-bold">AI Transparency Manifesto</h3>
                  <p className="text-indigo-200 text-sm">We are committed to ethical AI that empowers human health without compromising dignity.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {aiEthicsSections.map((section) => (
                  <div key={section.title} className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      {section.title}
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-blue-50 rounded-[32px] border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Regulatory Alignment
                </h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  SafeGuard's AI implementation is designed to align with the <b>EU AI Act</b> (High-Risk Category requirements) and the <b>Indonesian Ministry of Communication and Informatics (Kominfo)</b> ethical guidelines for Artificial Intelligence.
                </p>
              </div>
              <div className="flex justify-center pt-4">
                <button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-3 px-8 py-4 bg-indigo-900 text-white rounded-2xl font-bold hover:bg-indigo-950 transition-all shadow-xl shadow-indigo-900/10 disabled:opacity-50"
                >
                  {isDownloading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  {isDownloading ? 'Generating Manifesto...' : 'Download AI Ethics Manifesto'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Trust Badges */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: 'PDP Compliant', desc: 'Indonesia Data Law' },
          { label: 'AES-256', desc: 'Military Grade Encryption' },
          { label: 'ISO 27001', desc: 'Information Security' },
          { label: 'GDPR Ready', desc: 'Global Privacy Standard' }
        ].map((badge) => (
          <div key={badge.label} className="text-center p-6 bg-white rounded-3xl border border-gray-100">
            <div className="text-lg font-bold text-gray-900 mb-1">{badge.label}</div>
            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{badge.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
