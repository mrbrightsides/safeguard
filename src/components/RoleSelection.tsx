import React from 'react';
import { motion } from 'motion/react';
import { User, Building2, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export type UserRole = 'personal' | 'corporate';

interface RoleSelectionProps {
  onSelect: (role: UserRole) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sage-100 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-4 h-4" />
            Welcome to SafeGuard
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            How would you like to <span className="text-teal-600">experience</span> SafeGuard?
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Select your perspective to tailor the dashboard and insights for your specific needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Role */}
          <motion.button
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('personal')}
            className="group relative bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50 text-left transition-all hover:border-teal-200"
          >
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-teal-600 transition-colors">
              <User className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Personal User</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Focus on your individual well-being, track personal biometrics, and access curated wellness resources.
            </p>
            <div className="flex items-center gap-2 text-teal-600 font-bold group-hover:gap-3 transition-all">
              Continue as Individual
              <ArrowRight className="w-5 h-5" />
            </div>
          </motion.button>

          {/* Corporate Role */}
          <motion.button
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('corporate')}
            className="group relative bg-teal-900 p-10 rounded-[40px] shadow-2xl shadow-teal-900/20 text-left transition-all hover:bg-teal-950"
          >
            <div className="w-16 h-16 bg-teal-800 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-teal-600 transition-colors">
              <Building2 className="w-8 h-8 text-teal-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Corporate Management</h3>
            <p className="text-teal-100/60 mb-8 leading-relaxed">
              Access organizational analytics, monitor population health trends, and manage psychosocial risk stratification.
            </p>
            <div className="flex items-center gap-2 text-teal-400 font-bold group-hover:gap-3 transition-all">
              Continue as Management
              <ArrowRight className="w-5 h-5" />
            </div>
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-mono uppercase tracking-widest">
            <Shield className="w-4 h-4" />
            Secure & Confidential Data Processing
          </div>
        </motion.div>
      </div>
    </div>
  );
};
