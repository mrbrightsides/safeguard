import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Navigation, 
  Shield, 
  X, 
  Activity,
  Loader2,
  CheckCircle2
} from 'lucide-react';

interface MERPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrigger?: (data: { location: string }) => void;
}

export const MERPModal: React.FC<MERPModalProps> = ({ isOpen, onClose, onTrigger }) => {
  const [status, setStatus] = useState<'idle' | 'triggering' | 'active'>('idle');
  const [location, setLocation] = useState<string>('Detecting...');

  useEffect(() => {
    if (isOpen) {
      // Simulate GPS detection
      setTimeout(() => setLocation('RFCC Unit - Sector 4 (Lat: -6.234, Long: 106.845)'), 1500);
    } else {
      setStatus('idle');
      setLocation('Detecting...');
    }
  }, [isOpen]);

  const triggerEmergency = () => {
    setStatus('triggering');
    setTimeout(() => {
      setStatus('active');
      const msg = new SpeechSynthesisUtterance("Emergency Protocol Activated. MERP Team notified. Stay where you are, help is on the way.");
      window.speechSynthesis.speak(msg);
      if (onTrigger) {
        onTrigger({ location });
      }
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-red-950/40 backdrop-blur-md z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[40px] shadow-2xl z-[110] overflow-hidden border-4 border-red-600"
          >
            <div className="bg-red-600 p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl animate-pulse">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">MERP Emergency</h2>
                  <p className="text-sm text-red-100 font-medium">Medical Emergency Response Plan Active</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {status === 'idle' && (
                <div className="space-y-6 text-center">
                  <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                    <p className="text-red-900 font-bold text-lg mb-2">Are you in immediate danger?</p>
                    <p className="text-sm text-red-600">Triggering this will alert the refinery medical team and broadcast your GPS location.</p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500 font-mono">
                    <MapPin className="w-4 h-4 text-red-500" />
                    {location}
                  </div>

                  <button 
                    onClick={triggerEmergency}
                    className="w-full py-6 bg-red-600 text-white rounded-3xl font-black text-xl uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95"
                  >
                    Trigger SOS
                  </button>
                </div>
              )}

              {status === 'triggering' && (
                <div className="py-12 flex flex-col items-center justify-center space-y-6">
                  <Loader2 className="w-16 h-16 text-red-600 animate-spin" />
                  <div className="text-center">
                    <h3 className="text-xl font-bold">Broadcasting Signal...</h3>
                    <p className="text-sm text-gray-500">Connecting to MERP Satellite & Local Security</p>
                  </div>
                </div>
              )}

              {status === 'active' && (
                <div className="space-y-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-emerald-900">Assistance Dispatched</h3>
                      <p className="text-sm text-emerald-700 font-medium">ETA: 4 Minutes 20 Seconds</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="text-[10px] font-mono text-gray-400 uppercase mb-1">First Responder</div>
                      <div className="text-sm font-bold">Unit 4 Medical Team</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="text-[10px] font-mono text-gray-400 uppercase mb-1">Status</div>
                      <div className="text-sm font-bold text-emerald-600">En Route</div>
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-600 rounded-xl">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-blue-900">Direct Link Open</div>
                      <div className="text-xs text-blue-700">Medical officer is monitoring your audio.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
