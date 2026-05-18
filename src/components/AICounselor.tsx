import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, User, Loader2, AlertCircle, Heart, Quote, ExternalLink, GraduationCap, MessageSquareHeart, Zap, Activity, Cpu, Eye, EyeOff, Camera, Mic, MicOff } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { getVaultData } from '@/src/lib/vaultUtils';

import { generateGemmaResponse } from '@/src/services/gemmaService';
import { speakResponse, hardwareBridge } from '@/src/services/hardwareBridge';
import { LiveAudioService } from '@/src/services/liveAudioService';

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
  const [isVisionActive, setIsVisionActive] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [liveService, setLiveService] = useState<LiveAudioService | null>(null);
  const [liveTranscription, setLiveTranscription] = useState("");
  const [visionStream, setVisionStream] = useState<MediaStream | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkOllama = async () => {
      try {
        const res = await fetch('http://localhost:11434/api/tags');
        if (res.ok) {
          const data = await res.json();
          const hasGemma4 = data.models?.some((m: any) => m.name.includes('gemma4'));
          setOllamaStatus(hasGemma4 ? 'online' : 'offline');
        } else {
          setOllamaStatus('offline');
        }
      } catch {
        setOllamaStatus('offline');
      }
    };
    
    if (executionMode === 'local') {
      checkOllama();
      const interval = setInterval(checkOllama, 3000); // Poll status every 3 seconds
      return () => clearInterval(interval);
    }
  }, [executionMode]);

  const toggleVision = async () => {
    if (isVisionActive) {
      visionStream?.getTracks().forEach(track => track.stop());
      setVisionStream(null);
      setIsVisionActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        setVisionStream(stream);
        setIsVisionActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setMessages(prev => [...prev, { role: 'model', text: "I can't access your camera. Please check your permissions if you want me to see through my 'AI Eye'." }]);
      }
    }
  };

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.6).split(',')[1];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const vaultData = getVaultData();
      const name = vaultData.nickname && !vaultData.isAnonymous ? vaultData.nickname : 'Friend';
      const welcomeMsg = initialMessage || `Hello ${name}, I am your SafeGuard AI Counselor. I'm here to provide 24/7 support and help you navigate any psychosocial challenges. How are you feeling today?`;
      setMessages([{ role: 'model', text: welcomeMsg }]);
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      hardwareBridge.sendToDoll("CMD:LISTEN_STOP");
    } else {
      if (recognitionRef.current) {
        // Detect language markers for better recognition
        const hasIndo = /saya|kamu|halo|apa|kabar/i.test(input);
        recognitionRef.current.lang = hasIndo ? 'id-ID' : 'id-ID'; 
        recognitionRef.current.start();
        setIsListening(true);
        hardwareBridge.sendToDoll("CMD:LISTEN_START");
      } else {
        alert("Speech Recognition is not supported in this browser.");
      }
    }
  };

  const toggleLiveMode = async () => {
    if (isLiveMode) {
      liveService?.stop();
      setLiveService(null);
      setIsLiveMode(false);
      setMessages(prev => [...prev, { role: 'model', text: "Live session ended." }]);
    } else {
      const service = new LiveAudioService({
        sampleRate: 24000,
        gain: 1.8,
        voiceName: 'Zephyr'
      });
      
      try {
        await service.connect(
          () => { /* Audio chunk started playing */ },
          () => { /* Interrupted */ },
          (text) => {
            setLiveTranscription(text);
          }
        );
        setLiveService(service);
        setIsLiveMode(true);
        setMessages(prev => [...prev, { role: 'model', text: "Live Counselor session started! (Seamless Voice Active)" }]);
      } catch (err) {
        console.error("Live Mode Error:", err);
        alert("Failed to start Live Mode. Check server connection.");
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (isLiveMode && liveService) {
      const userMsg = input.trim();
      setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
      liveService.sendText(userMsg);
      setInput('');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    }

    const userMessage = input.trim();
    const imageData = isVisionActive ? captureFrame() : null;
    
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
        const model = "gemini-3.1-flash-lite";
        
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
  
  [VISION SYSTEM]:
  ${isVisionActive ? 'Vision is ACTIVE. You can see the user through the camera. Analyze their facial expressions, surroundings, and non-verbal cues from the image part provided to provide deeper psychosocial insights.' : 'Vision is OFFLINE. Rely on text interaction.'}
  
  CORE PROTOCOLS:
  1. Crisis Triaging (L0-L3): If Suicidal Ideation detected, trigger MERP SOS resources immediately.
  2. Indonesian Clinical Context: Apply DASS-21 & SRQ-20 logic.
  3. Boundary: You are an AI. Advise professional consultation for diagnosis.
  4. Language: Respond in the user's primary language (Indonesian/English) but maintain professional medical empathy.
  `;

        const userParts: any[] = [{ text: userMessage }];
        if (imageData) {
          userParts.push({
            inlineData: {
              data: imageData,
              mimeType: 'image/jpeg'
            }
          });
        }

        const response = await ai.models.generateContent({
          model,
          contents: [...chatHistory, { role: 'user', parts: userParts }],
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

  useEffect(() => {
    if (liveTranscription) {
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.role === 'model') {
          return [...prev.slice(0, -1), { role: 'model', text: liveTranscription }];
        }
        return [...prev, { role: 'model', text: liveTranscription }];
      });
    }
  }, [liveTranscription]);

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
                    {executionMode === 'local' ? 'Local Gemma 4 (Offline Frontier)' : 'Cloud Gemini 3.1 (Live Seamless)'}
                  </span>
                  {executionMode === 'local' && (
                    <div className={cn(
                      "flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded-full border text-[8px] font-bold",
                      ollamaStatus === 'online' ? "bg-amber-500/10 text-amber-600 border-amber-200" : "bg-red-500/10 text-red-600 border-red-200"
                    )}>
                      <Zap size={8} className={cn("fill-current", ollamaStatus === 'online' && "animate-pulse")} />
                      {ollamaStatus === 'online' ? "GEMMA 4 ACTIVE (OLLAMA)" : "OLLAMA OFFLINE"}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {executionMode === 'local' && ollamaStatus === 'online' && (
              <div className="absolute top-16 left-0 right-0 px-4 py-1 bg-amber-50 text-[9px] text-amber-700 border-b border-amber-100 flex justify-between items-center z-10">
                <span>Verification: Data stays on your machine via 127.0.0.1:11434</span>
                <span className="opacity-60 flex items-center gap-1"><Zap size={8} /> Check F12 Network for proof</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              {/* Live Mode Toggle */}
              <button
                onClick={toggleLiveMode}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border",
                  isLiveMode 
                    ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-100" 
                    : "bg-white border-purple-100 text-purple-600 hover:bg-purple-50"
                )}
                title={isLiveMode ? "End Live Session" : "Start Live Session (Seamless Voice)"}
              >
                <Zap size={12} className={cn(isLiveMode && "animate-pulse")} />
                {isLiveMode ? "LIVE ACTIVE" : "GO LIVE"}
              </button>

              {/* Vision Mode Toggle */}
              <button
                onClick={toggleVision}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border",
                  isVisionActive 
                    ? "bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-100" 
                    : "bg-white border-teal-100 text-teal-600 hover:bg-teal-50"
                )}
                title={isVisionActive ? "Deactivate AI Eye" : "Activate AI Eye (Vision Sensor)"}
              >
                {isVisionActive ? <Eye size={12} className="animate-pulse" /> : <EyeOff size={12} />}
                {isVisionActive ? "VISION ACTIVE" : "ACTIVATE VISION"}
              </button>

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
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-teal-50/10 relative">
            {/* Camera Overlay for Vision Mode */}
            {isVisionActive && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed bottom-32 right-8 w-40 h-40 rounded-3xl overflow-hidden border-4 border-teal-500 shadow-2xl z-20 group"
              >
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted
                  className="w-full h-full object-cover grayscale brightness-110"
                />
                <div className="absolute inset-0 bg-teal-500/10 pointer-events-none" />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-teal-600 text-[8px] text-white font-bold rounded-full flex items-center gap-1">
                  <span className="w-1 h-1 bg-white rounded-full animate-ping" />
                  AI VISION SENSOR
                </div>
                <div className="absolute bottom-2 right-2 p-1.5 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={12} />
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </motion.div>
            )}

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
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isListening ? "Listening..." : "Type or speak your message..."}
                  className={cn(
                    "w-full p-3 pr-24 bg-teal-50/50 border border-teal-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-teal-900 placeholder-teal-400",
                    isListening && "border-teal-500 ring-2 ring-teal-200"
                  )}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    onClick={toggleListening}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      isListening 
                        ? "bg-red-500 text-white animate-pulse" 
                        : "text-teal-600 hover:bg-teal-100"
                    )}
                    title={isListening ? "Stop Recording" : "Start Voice Input"}
                  >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600 transition-colors shadow-md shadow-teal-100"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
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
