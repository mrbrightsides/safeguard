import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone } from 'lucide-react';

interface ConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultModal: React.FC<ConsultModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[110] p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Professional Consultation</h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="text-sm font-bold text-blue-900 mb-1">Telemedicine Service</div>
                <div className="text-xs text-blue-700 mb-3">Connect with a licensed psychologist within 15 minutes.</div>
                <a 
                  href="https://safespace.elpeef.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-blue-600 text-white text-center text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Start Virtual Session
                </a>
              </div>

              <div className="space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Emergency Helplines</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="text-[10px] text-gray-500 uppercase">National Hotline</div>
                    <div className="text-sm font-bold">119 Ext 8</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="text-[10px] text-gray-500 uppercase">Crisis Center</div>
                    <div className="text-sm font-bold">0811-1111-111</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
