import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X, Shield, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface MERPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrigger: (data: any) => void;
}

export const MERPModal: React.FC<MERPModalProps> = ({ isOpen, onClose, onTrigger }) => {
  const [step, setStep] = useState<'confirm' | 'details' | 'success'>('confirm');
  const [location, setLocation] = useState('Main Office - Floor 4, Area B');
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep('confirm');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    setStep('details');
  };

  const handleTrigger = () => {
    onTrigger({
      type: 'Psychosocial Emergency',
      location: location,
      timestamp: new Date().toISOString(),
      status: 'Active'
    });
    setStep('success');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-red-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-red-900">MERP Emergency</h3>
                  <p className="text-[10px] font-mono text-red-600 uppercase tracking-widest">Medical Emergency Response Protocol</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-red-100 rounded-full transition-colors text-red-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              {step === 'confirm' && (
                <div className="space-y-6 text-center">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-10 h-10 text-red-600 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Trigger Emergency Response?</h4>
                    <p className="text-gray-500 text-sm">
                      This will immediately notify the on-site medical team, HR emergency contacts, and security personnel.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleConfirm}
                      className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                    >
                      Yes, Trigger Protocol
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <a 
                        href="tel:119"
                        className="flex items-center justify-center gap-2 py-3 bg-white border border-red-100 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 transition-all"
                      >
                        <Phone className="w-3 h-3" />
                        Call 119 (SPGDT)
                      </a>
                      <a 
                        href="tel:112"
                        className="flex items-center justify-center gap-2 py-3 bg-white border border-red-100 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 transition-all"
                      >
                        <Phone className="w-3 h-3" />
                        Call 112 (Emergency)
                      </a>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <a 
                        href="https://jaksehat.jakarta.go.id/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all"
                      >
                        <Shield className="w-3 h-3" />
                        JakSehat Portal
                      </a>
                    </div>

                    <button 
                      onClick={onClose}
                      className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {step === 'details' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2 block">Current Location</span>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
                        />
                        <button 
                          onClick={() => {
                            setIsLocating(true);
                            setTimeout(() => setIsLocating(false), 1500);
                          }}
                          className="absolute right-2 top-2 p-1.5 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <MapPin className={cn("w-4 h-4", isLocating && "animate-bounce text-red-600")} />
                        </button>
                      </div>
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                          <Shield className="w-3 h-3 text-emerald-500" />
                          <span className="text-[10px] font-mono text-gray-400 uppercase">Security</span>
                        </div>
                        <div className="text-xs font-bold">Alert Sent</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                          <Phone className="w-3 h-3 text-blue-500" />
                          <span className="text-[10px] font-mono text-gray-400 uppercase">Medical Team</span>
                        </div>
                        <div className="text-xs font-bold">Standby</div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleTrigger}
                    className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Emergency Signal
                  </button>
                </div>
              )}

              {step === 'success' && (
                <div className="space-y-6 text-center py-4">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Protocol Activated</h4>
                    <p className="text-gray-500 text-sm">
                      The emergency response team has been dispatched to your location. Please stay where you are.
                    </p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-left">
                    <div className="text-[10px] font-mono text-emerald-600 uppercase tracking-widest mb-2">Estimated Arrival</div>
                    <div className="text-lg font-bold text-emerald-900">3 - 5 Minutes</div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
