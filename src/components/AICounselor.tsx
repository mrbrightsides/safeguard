import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, User, Loader2, AlertCircle, Heart, Quote, ExternalLink, GraduationCap, MessageSquareHeart, Zap, Activity, Cpu } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { getVaultData } from '@/src/lib/vaultUtils';

import { generateGemmaResponse } from '@/src/services/gemmaService';
import { speakResponse, hardwareBridge } from '@/src/services/hardwareBridge';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AICounselorProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

const AICounselor: React.FC<AICounselorProps> = ({ isOpen, onClose, initialMessage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'analyst' | 'companion'>('companion');
  const [executionMode, setExecutionMode] = useState<'cloud' | 'local'>('cloud');
  const [isHardwareMode, setIsHardwareMode] = useState(false);
  const [isHardwareConnecting, setIsHardwareConnecting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const vault = getVaultData();

  const handleHardwareConnect = async () => {
    setIsHardwareConnecting(true);
    const success = await hardwareBridge.connect();
    if (success) {
      setIsHardwareMode(true);
      setMessages(prev => [...prev, { role: 'model', text: "SafeGuard Doll hardware connected! I will now speak through the companion doll." }]);
    }
    setIsHardwareConnecting(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg = initialMessage || "Hello, I am your SafeGuard AI Counselor. I'm here to provide 24/7 support and help you navigate any psychosocial challenges. How are you feeling today?";
      setMessages([{ role: 'model', text: welcomeMsg }]);
    }
  }, [isOpen, initialMessage]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      if (executionMode === 'local') {
        const gemmaResponse = await generateGemmaResponse([...messages, { role: 'user', text: userMessage }], selectedMode);
        setMessages(prev => [...prev, { role: 'model', text: gemmaResponse.text }]);
        
        if (isHardwareMode) {
          speakResponse(gemmaResponse.text);
          hardwareBridge.sendToDoll(gemmaResponse.text.substring(0, 32));
        }
      } else {
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
        const model = "gemini-3-flash-preview";
        
        const chatHistory = messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

        const isCompanionMode = selectedMode === 'companion';
        
        const dynamicInstruction = `
  You are the SafeGuard AI Counselor. 
  [USER CONTEXT FROM SAFE-VAULT]:
  - User Name/Alias: ${vault.nickname || 'Friend'}
  - Tone Preference: ${vault.companionTone || 'Empathetic'}
  - Anonymity Status: ${vault.isAnonymous ? 'Strict Privacy' : 'Personalized'}
  
  [CURRENT OPERATIONAL MODE]: 
  ${isCompanionMode 
    ? 'MODE: AI COMPANION. Focus on empathy, use the user\'s name, be warm, and provide psychosocial support. Temperature is set higher for human-like warmth.' 
    : 'MODE: CLINICAL ANALYST. Focus on precision, ICD-10 mapping, and DASS-21/SRQ-20 scoring. Be concise, professional, and data-driven.'
  }
  
  CORE PROTOCOLS:
  1. Crisis Triaging (L0-L3): If Suicidal Ideation detected, trigger MERP SOS resources immediately.
  2. Indonesian Clinical Context: Apply DASS-21 & SRQ-20 logic.
  3. Boundary: You are an AI. Advise professional consultation for diagnosis.
  4. Language: Respond in the user's primary language (Indonesian/English) but maintain professional medical empathy.
  `;

        const response = await ai.models.generateContent({
          model,
          contents: [...chatHistory, { role: 'user', parts: [{ text: userMessage }] }],
          config: {
            systemInstruction: dynamicInstruction,
            temperature: isCompanionMode ? 0.8 : 0.2,
            topK: 40,
            topP: 0.95,
          }
        });

        const aiText = response.text || "I'm sorry, I'm having trouble processing that right now. Please try again or contact a professional if you're in distress.";
        setMessages(prev => [...prev, { role: 'model', text: aiText }]);
        
        // Handle Hardware Response (TTS and Serial)
        if (isHardwareMode) {
          speakResponse(aiText);
          hardwareBridge.sendToDoll(aiText.substring(0, 32)); // Send snippet to Arduino display/LEDs
        }
      }
    } catch (error) {
      console.error("AI Counselor Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I encountered an error. Please check your connection or try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden border border-teal-100"
        >
          {/* Header */}
          <div className="p-4 border-b border-teal-50 bg-teal-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-200 relative">
                <Bot size={24} />
                {executionMode === 'local' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center" title="Local Gemma Active">
                    <Zap size={10} className="text-white fill-current" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-teal-900">SafeGuard AI Counselor</h3>
                <div className="flex items-center gap-1.5">
                  <span className={cn("w-2 h-2 rounded-full animate-pulse", executionMode === 'local' ? "bg-amber-400" : "bg-green-500")} />
                  <span className="text-xs text-teal-600 font-medium">
                    {executionMode === 'local' ? 'Local Gemma (Disconnected Mode)' : 'Cloud Gemini (High Precision)'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Hardware Doll Toggle */}
              <button
                onClick={handleHardwareConnect}
                disabled={isHardwareConnecting || isHardwareMode}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border",
                  isHardwareMode 
                    ? "bg-amber-100 border-amber-200 text-amber-700" 
                    : "bg-white border-teal-100 text-teal-600 hover:bg-teal-50"
                )}
              >
                {isHardwareConnecting ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Activity size={12} className={cn(isHardwareMode && "animate-pulse")} />
                )}
                {isHardwareMode ? "DOLL CONNECTED" : "CONNECT DOLL"}
              </button>

              {/* Execution Mode Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl mr-2">
                <button
                  onClick={() => setExecutionMode('cloud')}
                  className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-bold transition-all",
                    executionMode === 'cloud' ? "bg-white text-teal-600 shadow-sm" : "text-gray-400"
                  )}
                >
                  CLOUD
                </button>
                <button
                  onClick={() => setExecutionMode('local')}
                  className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1",
                    executionMode === 'local' ? "bg-amber-400 text-white shadow-sm" : "text-gray-400"
                  )}
                >
                  <Cpu size={10} />
                  LOCAL
                </button>
              </div>

              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setSelectedMode('companion')}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    selectedMode === 'companion' ? "bg-white text-teal-600 shadow-sm" : "text-gray-400"
                  )}
                  title="Companion Mode"
                >
                  <MessageSquareHeart size={16} />
                </button>
                <button
                  onClick={() => setSelectedMode('analyst')}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    selectedMode === 'analyst' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400"
                  )}
                  title="Analyst Mode"
                >
                  <GraduationCap size={16} />
                </button>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-teal-100 rounded-full transition-colors text-teal-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>


          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-teal-50/10">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${
                    m.role === 'user' ? 'bg-teal-100 text-teal-700' : 'bg-teal-600 text-white'
                  }`}>
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-teal-600 text-white rounded-tr-none' 
                      : 'bg-white text-teal-900 border border-teal-50 rounded-tl-none'
                  }`}>
                    <div className="prose prose-sm max-w-none prose-teal">
                      <Markdown>{m.text}</Markdown>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 items-center text-teal-600 bg-white p-3 rounded-2xl border border-teal-50 shadow-sm">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm font-medium italic">Counselor is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Crisis Warning */}
          <div className="px-4 py-2 bg-red-50 border-y border-red-100 flex items-center gap-2 text-red-700">
            <AlertCircle size={14} className="flex-shrink-0" />
            <p className="text-[10px] leading-tight font-medium">
              If you are in immediate danger or experiencing a life-threatening emergency, please use the <strong>SOS Button</strong> or call local emergency services immediately.
            </p>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-teal-50 bg-white">
            <div className="relative flex items-center gap-2 mb-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message here..."
                className="flex-1 p-3 pr-12 bg-teal-50/50 border border-teal-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-teal-900 placeholder-teal-400"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600 transition-colors shadow-md shadow-teal-100"
              >
                <Send size={18} />
              </button>
            </div>

            {/* Specialized Companions footer */}
            <div className="flex items-center justify-center gap-6 pt-2 border-t border-gray-50">
              <a 
                href="https://halo-ayah.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-emerald-600 transition-colors"
              >
                <Heart size={12} />
                Halo Ayah
                <ExternalLink size={10} />
              </a>
              <div className="w-1 h-1 bg-gray-200 rounded-full" />
              <a 
                href="https://unsaid.elpeef.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-purple-600 transition-colors"
              >
                <Quote size={12} />
                Unsaid
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AICounselor;
