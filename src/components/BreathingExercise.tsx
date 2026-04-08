import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wind, Play, Pause, RotateCcw } from 'lucide-react';

interface BreathingExerciseProps {
  isOpen: boolean;
  onClose: () => void;
}

type BreathingPhase = 'Inhale' | 'Hold' | 'Exhale' | 'Hold (Empty)';

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('Inhale');
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            // Switch phase
            setPhase((currentPhase) => {
              switch (currentPhase) {
                case 'Inhale': return 'Hold';
                case 'Hold': return 'Exhale';
                case 'Exhale': return 'Hold (Empty)';
                case 'Hold (Empty)': return 'Inhale';
                default: return 'Inhale';
              }
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const reset = () => {
    setIsActive(false);
    setPhase('Inhale');
    setSeconds(4);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl relative p-8 sm:p-12 flex flex-col items-center text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-all"
          >
            <X size={20} />
          </button>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <Wind className="w-4 h-4" />
              Box Breathing
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">1-Minute De-stress</h2>
            <p className="text-gray-500 text-sm mt-2">Follow the circle to regulate your nervous system.</p>
          </div>

          {/* Breathing Circle */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center mb-12">
            {/* Background Circle */}
            <div className="absolute inset-0 border-4 border-emerald-50 rounded-full" />
            
            {/* Animated Circle */}
            <motion.div
              animate={{
                scale: phase === 'Inhale' ? 1.2 : phase === 'Exhale' ? 0.8 : phase === 'Hold' ? 1.2 : 0.8,
              }}
              transition={{
                duration: 4,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-emerald-500/10 rounded-full border-2 border-emerald-500/30"
            />

            {/* Core Circle */}
            <motion.div
              animate={{
                scale: phase === 'Inhale' ? 1.1 : phase === 'Exhale' ? 0.9 : phase === 'Hold' ? 1.1 : 0.9,
                backgroundColor: phase === 'Inhale' ? '#10b981' : phase === 'Exhale' ? '#059669' : '#047857',
              }}
              transition={{
                duration: 4,
                ease: "easeInOut"
              }}
              className="w-48 h-48 sm:w-56 sm:h-56 rounded-full flex flex-col items-center justify-center text-white shadow-2xl shadow-emerald-500/20 z-10"
            >
              <div className="text-sm font-mono uppercase tracking-[0.2em] mb-2 opacity-80">
                {phase}
              </div>
              <div className="text-5xl font-black">
                {seconds}
              </div>
            </motion.div>

            {/* Orbiting Dot */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
            </motion.div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsActive(!isActive)}
              className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
            >
              {isActive ? <Pause size={20} /> : <Play size={20} />}
              {isActive ? 'Pause' : 'Start Session'}
            </button>
            <button
              onClick={reset}
              className="p-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
            >
              <RotateCcw size={20} />
            </button>
          </div>

          <p className="mt-8 text-xs text-gray-400 max-w-xs">
            Inhale for 4s, Hold for 4s, Exhale for 4s, Hold for 4s. 
            Repeat until you feel calm.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
