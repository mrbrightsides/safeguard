import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, Volume2, VolumeX, BrainCircuit } from 'lucide-react';
import { DASS21_QUESTIONS } from '../lib/constants';
import { cn } from '../lib/utils';

interface AssessmentProps {
  onComplete: (scores: Record<string, number>) => void;
}

export const Assessment: React.FC<AssessmentProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
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
        nextQueue = [...nextQueue, ...additionalQuestions];
        setQuestionQueue(nextQueue);
      }
    }

    if (currentIndex < nextQueue.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsTransitioning(true);
      
      // Calculate final scores
      const scores = {
        depression: 0,
        anxiety: 0,
        stress: 0,
      };
      
      const categoryCounts: Record<string, number> = { depression: 0, anxiety: 0, stress: 0 };
      
      Object.entries(newAnswers).forEach(([id, val]) => {
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
        onComplete(finalScores);
      }, 2500);
    }
  };

  const progress = ((currentIndex + 1) / questionQueue.length) * 100;

  if (isTransitioning) {
    return (
      <div className="max-w-2xl mx-auto p-12 bg-white rounded-3xl shadow-xl border border-gray-100 text-center space-y-8">
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
          <h2 className="text-2xl font-bold text-gray-900">Diagnostic Phase Complete</h2>
          <p className="text-gray-500 max-w-sm mx-auto">
            SafeGuard AI is now analyzing your psychosocial profile to generate a personalized therapeutic roadmap.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-teal-600 uppercase tracking-widest animate-pulse">
          <BrainCircuit className="w-4 h-4" />
          Transitioning to Virtual Therapeutic Mode...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Adaptive Anamnesis Engine</span>
            <span className="text-[10px] text-teal-600 font-bold uppercase tracking-tighter">AI-Driven Branching Active</span>
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
          <h2 className="text-2xl font-serif italic text-gray-900 mb-8 leading-tight">
            "{currentQuestion.text}"
          </h2>

          <div className="grid gap-3">
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
                  "w-full p-4 text-left rounded-xl border transition-all duration-200 group",
                  "hover:border-teal-600 hover:bg-gray-50",
                  "border-gray-200 text-gray-600"
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
