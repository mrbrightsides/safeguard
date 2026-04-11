import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, Volume2, VolumeX, BrainCircuit, Wifi, WifiOff } from 'lucide-react';
import { DASS21_QUESTIONS } from '../lib/constants';
import { cn } from '../lib/utils';

interface AssessmentProps {
  onComplete: (data: {
    scores: Record<string, number>;
    anamnesisType: 'auto' | 'allo';
    freeFormInput: string;
    medicalHistory: string;
    medicationHistory: string;
  }) => void;
  isAccessibilityMode?: boolean;
}

export const Assessment: React.FC<AssessmentProps> = ({ onComplete, isAccessibilityMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [anamnesisType, setAnamnesisType] = useState<'auto' | 'allo' | null>(null);
  const [isFreeFormStep, setIsFreeFormStep] = useState(false);
  const [freeFormInput, setFreeFormInput] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [medicationHistory, setMedicationHistory] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [questionQueue, setQuestionQueue] = useState<number[]>(() => {
    // Initial queue: one representative question from each category
    const depression = DASS21_QUESTIONS.find(q => q.category === 'depression')!;
    const anxiety = DASS21_QUESTIONS.find(q => q.category === 'anxiety')!;
    const stress = DASS21_QUESTIONS.find(q => q.category === 'stress')!;
    return [depression.id, anxiety.id, stress.id];
  });

  const currentQuestionId = questionQueue[currentIndex];
  const currentQuestion = DASS21_QUESTIONS.find(q => q.id === currentQuestionId)!;

  // TTS Effect
  useEffect(() => {
    if (isTtsEnabled && currentQuestion) {
      const utterance = new SpeechSynthesisUtterance(currentQuestion.text);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, [currentIndex, isTtsEnabled, currentQuestion]);

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [currentQuestionId]: value };
    setAnswers(newAnswers);
    
    let nextQueue = [...questionQueue];
    
    // Adaptive logic: if response indicates concern (>= 2), delve deeper into that category
    if (value >= 2) {
      const additionalQuestions = DASS21_QUESTIONS.filter(q => 
        q.category === currentQuestion.category && 
        !nextQueue.includes(q.id) && 
        newAnswers[q.id] === undefined
      ).slice(0, 3).map(q => q.id);
      
      if (additionalQuestions.length > 0) {
        // Insert additional questions right after the current index
        const updatedQueue = [...nextQueue];
        updatedQueue.splice(currentIndex + 1, 0, ...additionalQuestions);
        nextQueue = updatedQueue;
        setQuestionQueue(nextQueue);
      }
    }

    if (currentIndex < nextQueue.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFreeFormStep(true);
    }
  };

  const handleFinalSubmit = () => {
    setIsTransitioning(true);
    
    // Calculate final scores
    const scores = {
      depression: 0,
      anxiety: 0,
      stress: 0,
    };
    
    const categoryCounts: Record<string, number> = { depression: 0, anxiety: 0, stress: 0 };
    
    Object.entries(answers).forEach(([id, val]) => {
      const q = DASS21_QUESTIONS.find(q => q.id === parseInt(id));
      if (q) {
        scores[q.category] += val;
        categoryCounts[q.category]++;
      }
    });

    const finalScores = {
      depression: Math.round((scores.depression / (categoryCounts.depression || 1)) * 7 * 2),
      anxiety: Math.round((scores.anxiety / (categoryCounts.anxiety || 1)) * 7 * 2),
      stress: Math.round((scores.stress / (categoryCounts.stress || 1)) * 7 * 2),
    };
    
    // Artificial delay for "therapeutic transition" effect
    setTimeout(() => {
      onComplete({
        scores: finalScores,
        anamnesisType: anamnesisType || 'auto',
        freeFormInput,
        medicalHistory,
        medicationHistory
      });
    }, 2500);
  };

  const toggleListening = () => {
    if (!isListening) {
      // Simulate Speech-to-Text start
      setIsListening(true);
      const msg = new SpeechSynthesisUtterance("Listening mode active. Please speak your concerns.");
      window.speechSynthesis.speak(msg);
      
      // Simulated STT result after 3 seconds
      setTimeout(() => {
        if (isListening) {
          const simulatedText = "Saya merasa sangat lelah akhir-akhir ini dan sulit berkonsentrasi di kantor. Tidur juga tidak nyenyak.";
          setFreeFormInput(prev => prev + (prev ? " " : "") + simulatedText);
          setIsListening(false);
        }
      }, 4000);
    } else {
      setIsListening(false);
    }
  };

  const progress = anamnesisType 
    ? ((currentIndex + 1) / (questionQueue.length + 1)) * 100 
    : 0;

  if (!anamnesisType) {
    return (
      <div className={cn(
        "w-full max-w-2xl p-12 rounded-[40px] border text-center space-y-8",
        isAccessibilityMode ? "bg-black border-gray-800" : "bg-white border-gray-100 shadow-2xl"
      )}>
        <div className="space-y-4">
          <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto">
            <BrainCircuit className="w-8 h-8 text-teal-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Digital Anamnesis Mode</h2>
          <p className="text-gray-500">Select how the assessment will be conducted.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => setAnamnesisType('auto')}
            className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-teal-600 transition-all group text-left"
          >
            <div className="font-bold text-gray-900 text-lg mb-1">Autoanamnesis</div>
            <p className="text-xs text-gray-500">I am performing this assessment for myself.</p>
          </button>
          <button 
            onClick={() => setAnamnesisType('allo')}
            className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-blue-600 transition-all group text-left"
          >
            <div className="font-bold text-gray-900 text-lg mb-1">Alloanamnesis</div>
            <p className="text-xs text-gray-500">I am assisting someone else with this assessment.</p>
          </button>
        </div>
      </div>
    );
  }

  if (isFreeFormStep) {
    return (
      <div className={cn(
        "w-full max-w-2xl p-8 rounded-3xl border transition-all",
        isAccessibilityMode ? "bg-black border-gray-800" : "bg-white border-gray-100 shadow-xl"
      )}>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Additional Context</h2>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">Provide more details for a deeper AI analysis.</p>
              {!isOnline && (
                <span className="text-[8px] font-bold bg-orange-50 text-orange-600 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  <WifiOff className="w-2 h-2" />
                  Offline
                </span>
              )}
            </div>
          </div>
          <div className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
            Step 2 of 2
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
              Your Story / Concerns
              <button 
                onClick={toggleListening}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-lg transition-all",
                  isListening ? "bg-red-50 text-red-600 animate-pulse" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >
                <Volume2 className="w-3 h-3" />
                <span className="text-[10px]">{isListening ? 'Listening...' : 'Speech-to-Text'}</span>
              </button>
            </label>
            <textarea 
              value={freeFormInput}
              onChange={(e) => setFreeFormInput(e.target.value)}
              placeholder="Tell us more about how you feel lately..."
              className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Medical History</label>
              <input 
                type="text"
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                placeholder="e.g. Hypertension, Diabetes"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Medication History</label>
              <input 
                type="text"
                value={medicationHistory}
                onChange={(e) => setMedicationHistory(e.target.value)}
                placeholder="e.g. Amlodipine, Metformin"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm"
              />
            </div>
          </div>

          <button 
            onClick={handleFinalSubmit}
            className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
          >
            Complete Anamnesis & Analyze
          </button>
        </div>
      </div>
    );
  }

  if (isTransitioning) {
    return (
      <div className="w-full p-12 bg-white rounded-3xl shadow-xl border border-gray-100 text-center space-y-8">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-4 border-teal-100 rounded-full"></div>
          <motion.div 
            className="absolute inset-0 border-4 border-teal-600 rounded-full border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <CheckCircle2 className="absolute inset-0 m-auto w-10 h-10 text-teal-600" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">Scan Phase Complete</h2>
          <p className="text-gray-500 max-w-sm mx-auto">
            SafeGuard AI is now analyzing your psychosocial profile to generate a personalized therapeutic roadmap.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-teal-600 uppercase tracking-widest animate-pulse">
          <BrainCircuit className="w-4 h-4" />
          Processing Scan Results...
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "w-full max-w-2xl p-8 rounded-3xl border transition-all",
      isAccessibilityMode ? "bg-black border-gray-800" : "bg-white border-gray-100 shadow-xl"
    )}>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Adaptive Anamnesis Scan Engine</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-teal-600 font-bold uppercase tracking-tighter">AI-Driven Scan Active</span>
              <span className={cn(
                "text-[8px] px-1.5 py-0.5 rounded font-bold uppercase flex items-center gap-1",
                isOnline ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
              )}>
                {isOnline ? <Wifi className="w-2 h-2" /> : <WifiOff className="w-2 h-2" />}
                {isOnline ? 'Online' : 'Offline Mode'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsTtsEnabled(!isTtsEnabled)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isTtsEnabled ? "bg-teal-900 text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              )}
              title={isTtsEnabled ? "Disable Voice Assistant" : "Enable Voice Assistant"}
            >
              {isTtsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <span className="text-xs font-mono text-gray-400">{currentIndex + 1} / {questionQueue.length}</span>
          </div>
        </div>
        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-teal-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-[200px]"
        >
          <h2 className={cn(
            "font-serif italic mb-8 leading-tight transition-all",
            isAccessibilityMode ? "text-4xl text-white" : "text-2xl text-gray-900"
          )}>
            "{currentQuestion.text}"
          </h2>

          <div className={cn(
            "grid gap-3",
            isAccessibilityMode ? "gap-6" : "gap-3"
          )}>
            {[
              { label: "Did not apply to me at all", value: 0 },
              { label: "Applied to me to some degree", value: 1 },
              { label: "Applied to me to a considerable degree", value: 2 },
              { label: "Applied to me very much", value: 3 },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={cn(
                  "w-full text-left rounded-xl border transition-all duration-200 group",
                  isAccessibilityMode 
                    ? "p-8 border-gray-700 bg-gray-900 text-white text-xl hover:border-teal-500" 
                    : "p-4 border-gray-200 text-gray-600 hover:border-teal-600 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-between items-center">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
          className="flex items-center text-sm font-medium text-gray-400 hover:text-black disabled:opacity-0 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>
        <div className="flex items-center text-[10px] text-gray-300 font-mono uppercase tracking-tighter">
          <AlertCircle className="w-3 h-3 mr-1" />
          Inclusivity Mode: {isTtsEnabled ? 'Voice Active' : 'Visual Only'}
        </div>
      </div>
    </div>
  );
};
