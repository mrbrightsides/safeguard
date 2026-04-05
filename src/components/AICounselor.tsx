import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const chatHistory = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model,
        contents: [...chatHistory, { role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: `You are the SafeGuard AI Counselor, a specialized mental health support assistant. 
          Your goals are:
          1. Provide empathetic, 24/7 initial support for psychosocial health.
          2. Perform crisis triaging based on clinical hierarchy (L0-L3).
          3. If a user expresses suicidal ideation or extreme distress (Level 0), immediately provide emergency resources and advise them to use the MERP SOS button or call local emergency services.
          4. Use Indonesian clinical frameworks (DASS-21, SRQ-20) context where appropriate.
          5. Be supportive, non-judgmental, and professional.
          6. IMPORTANT: You are an AI, not a human doctor. Always advise professional consultation for clinical diagnosis.
          7. Keep responses concise and actionable.`,
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
        }
      });

      const aiText = response.text || "I'm sorry, I'm having trouble processing that right now. Please try again or contact a professional if you're in distress.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
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
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-200">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-teal-900">SafeGuard AI Counselor</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-teal-600 font-medium">Online 24/7 Support</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-teal-100 rounded-full transition-colors text-teal-600"
            >
              <X size={20} />
            </button>
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
            <div className="relative flex items-center gap-2">
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
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AICounselor;
