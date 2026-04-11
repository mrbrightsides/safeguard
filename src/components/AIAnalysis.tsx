import React, { useState } from 'react';
import { analyzeBehavioralRisk } from '../services/geminiService';
import { generateFHIRPayload } from '../services/fhirService';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Search, Loader2, ShieldCheck, FileText, ExternalLink, Info, Phone, UserPlus, X, Download, Database, CheckCircle2 } from 'lucide-react';
import { ICD_DESCRIPTIONS, ICD_MAPPING } from '../lib/constants';
import { cn } from '../lib/utils';

interface AIAnalysisProps {
  initialInput?: string;
  initialScores?: Record<string, number>;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ initialInput, initialScores }) => {
  const [input, setInput] = useState(initialInput || '');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showICDTooltip, setShowICDTooltip] = useState(false);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [showFHIRModal, setShowFHIRModal] = useState(false);
  const [fhirPayload, setFhirPayload] = useState<any>(null);

  // Auto-analyze if initialInput or initialScores is provided
  React.useEffect(() => {
    if (initialScores) {
      const calculateScoring = () => {
        const { depression, anxiety, stress } = initialScores;
        
        // DASS-21 Ranges (multiplied by 2 as per standard)
        const getDepressionLevel = (s: number) => {
          if (s >= 28) return 'extremely_severe';
          if (s >= 21) return 'severe';
          if (s >= 14) return 'moderate';
          if (s >= 10) return 'mild';
          return 'normal';
        };

        const getAnxietyLevel = (s: number) => {
          if (s >= 20) return 'extremely_severe';
          if (s >= 15) return 'severe';
          if (s >= 10) return 'moderate';
          if (s >= 8) return 'mild';
          return 'normal';
        };

        const getStressLevel = (s: number) => {
          if (s >= 34) return 'extremely_severe';
          if (s >= 26) return 'severe';
          if (s >= 19) return 'moderate';
          if (s >= 15) return 'mild';
          return 'normal';
        };

        const dLevel = getDepressionLevel(depression);
        const aLevel = getAnxietyLevel(anxiety);
        const sLevel = getStressLevel(stress);

        // Map to Risk Level
        const levels = [dLevel, aLevel, sLevel];
        let finalRisk = 'Normal';
        if (levels.includes('extremely_severe')) finalRisk = 'Emergency';
        else if (levels.includes('severe')) finalRisk = 'Severe';
        else if (levels.includes('moderate')) finalRisk = 'Moderate';
        else if (levels.includes('mild')) finalRisk = 'Mild';

        // Map to ICD
        const icd = dLevel !== 'normal' ? ICD_MAPPING.depression[dLevel as keyof typeof ICD_MAPPING.depression] :
                    aLevel !== 'normal' ? ICD_MAPPING.anxiety[aLevel as keyof typeof ICD_MAPPING.anxiety] :
                    sLevel !== 'normal' ? ICD_MAPPING.stress[sLevel as keyof typeof ICD_MAPPING.stress] : 'F32.9';

        setResult({
          summary: `DASS-21 structured assessment results indicate a ${finalRisk} risk profile. Depression: ${depression}, Anxiety: ${anxiety}, Stress: ${stress}.`,
          riskLevel: finalRisk,
          suggestedICD: icd,
          suggestedDSM: dLevel !== 'normal' ? 'Major Depressive Disorder' : aLevel !== 'normal' ? 'Generalized Anxiety Disorder' : 'Adjustment Disorder',
          detectedPatterns: [
            dLevel !== 'normal' ? 'Depressive symptoms' : null,
            aLevel !== 'normal' ? 'Anxiety markers' : null,
            sLevel !== 'normal' ? 'Stress indicators' : null
          ].filter(Boolean),
          recommendations: [
            finalRisk === 'Emergency' ? 'Immediate psychiatric evaluation' : null,
            finalRisk === 'Severe' ? 'Clinical consultation within 24h' : null,
            'Cognitive Behavioral Therapy (CBT)',
            'Mindfulness-based stress reduction',
            'SafeGuard EWS monitoring'
          ].filter(Boolean)
        });

        // Flag: Analysis Complete
        window.dispatchEvent(new CustomEvent('new-notification', {
          detail: {
            title: '[FLAG] AI Analysis Complete',
            message: `Risk Level: ${finalRisk}. Clinical recommendations have been generated.`,
            type: finalRisk === 'Emergency' || finalRisk === 'Severe' ? 'warning' : 'success'
          }
        }));
      };
      calculateScoring();
    } else if (initialInput) {
      setInput(initialInput);
      const triggerAnalysis = async () => {
        setLoading(true);
        try {
          const analysis = await analyzeBehavioralRisk(initialInput);
          setResult(analysis);
          
          // Flag: Analysis Complete
          window.dispatchEvent(new CustomEvent('new-notification', {
            detail: {
              title: '[FLAG] AI Analysis Complete',
              message: `Risk Level: ${analysis.riskLevel}. Clinical recommendations have been generated.`,
              type: analysis.riskLevel === 'Emergency' || analysis.riskLevel === 'Severe' ? 'warning' : 'success'
            }
          }));
        } catch (error) {
          console.error('Analysis failed:', error);
        } finally {
          setLoading(false);
        }
      };
      triggerAnalysis();
    }
  }, [initialInput, initialScores]);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const analysis = await analyzeBehavioralRisk(input);
      setResult(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!result) return;
    
    const reportContent = `
SAFEGUARD CLINICAL ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}
------------------------------------------

SUMMARY:
${result.summary}

RISK LEVEL: ${result.riskLevel?.toUpperCase()}

ICD-10 CLASSIFICATIONS:
${result.suggestedICD ? `- ${result.suggestedICD}: ${ICD_DESCRIPTIONS[result.suggestedICD as keyof typeof ICD_DESCRIPTIONS] || 'N/A'}` : 'N/A'}

DSM-5 CRITERIA MATCHED:
${result.suggestedDSM || 'N/A'}

RECOMMENDATIONS:
${result.recommendations?.map((r: string) => `- ${r}`).join('\n') || 'N/A'}

------------------------------------------
DISCLAIMER: This report is generated by AI for screening purposes only. 
It does not constitute a formal medical diagnosis.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    link.download = `SafeGuard_Report_${dateStr}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSyncSATUSEHAT = () => {
    if (!result) return;
    setSyncing(true);
    
    // Simulate API Latency
    setTimeout(() => {
      const payload = generateFHIRPayload(
        "P-8821-X", 
        result.riskLevel || "Moderate", 
        { icd: result.suggestedICD, dsm: result.suggestedDSM }
      );
      setFhirPayload(payload);
      setSyncing(false);
      setShowFHIRModal(true);
    }, 1500);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Emergency': return 'text-red-600 bg-red-50 border-red-200 font-black';
      case 'Severe': return 'text-orange-600 bg-orange-50 border-orange-200 font-extrabold';
      case 'Moderate': return 'text-yellow-700 bg-yellow-50 border-yellow-200 font-bold';
      case 'Mild': return 'text-blue-600 bg-blue-50 border-blue-200 font-semibold';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-200 font-medium';
    }
  };

  const getRiskIndicator = (level: string) => {
    switch (level) {
      case 'Emergency': return '🔴';
      case 'Severe': return '🟠';
      case 'Moderate': return '🟡';
      case 'Mild': return '🔵';
      default: return '🟢';
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-black rounded-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Behavioral AI Detector</h2>
            <p className="text-sm text-gray-500">NLP-based Psychosocial Early Warning System</p>
          </div>
        </div>

        <div className="relative flex flex-col">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe behavioral patterns, fatigue levels, or incidents for AI-driven risk stratification..."
            className="w-full h-40 p-6 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black transition-all resize-none text-gray-700"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            className="md:absolute md:bottom-4 md:right-4 mt-4 md:mt-0 px-6 py-3 md:py-2 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 transition-all w-full md:w-auto"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Analyze Risk
          </button>
        </div>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="hidden md:block absolute top-0 right-0 p-4">
                <a 
                  href="https://safespace.elpeef.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-black text-white text-[10px] font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg shadow-black/10"
                >
                  <UserPlus className="w-3 h-3" />
                  Consult Professional
                </a>
              </div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-gray-400 mb-4">Clinical Summary</h3>
              <p className="text-gray-700 leading-relaxed">{result.summary}</p>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[10px] font-mono uppercase text-gray-400 mb-2">Detected Patterns</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.detectedPatterns?.map((p: string) => (
                      <span key={p} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">{p}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-mono uppercase text-gray-400 mb-2">Recommendations</h4>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {result.recommendations?.map((r: string) => (
                      <li key={r} className="flex items-start gap-2">
                        <ShieldCheck className="w-3 h-3 mt-0.5 text-emerald-500" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <a 
                  href="https://safespace.elpeef.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Consult a Professional
                </a>
                <button 
                  onClick={downloadReport}
                  className="px-6 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-2 border border-emerald-100"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
              </div>

              {(result.riskLevel === 'Emergency' || result.riskLevel === 'Severe') && (
                <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-600 rounded-lg">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-red-900">Urgent Support Required</div>
                      <div className="text-xs text-red-700">Immediate professional consultation is recommended.</div>
                    </div>
                  </div>
                  <a 
                    href="https://safespace.elpeef.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Get Help Now
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className={cn(
              "p-8 rounded-3xl border shadow-sm flex flex-col items-center justify-center text-center",
              getRiskColor(result.riskLevel)
            )}>
              <div className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-2">Risk Stratification</div>
              <div className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
                <span>{getRiskIndicator(result.riskLevel)}</span>
                {result.riskLevel}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                <div className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-bold rounded uppercase tracking-tighter border border-blue-100">
                  CDSS v2.4
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Clinical Mapping</h3>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center group relative">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    ICD-10 Coding
                    <button 
                      onMouseEnter={() => setShowICDTooltip(true)}
                      onMouseLeave={() => setShowICDTooltip(false)}
                      className="text-gray-300 hover:text-gray-500"
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  </span>
                  <span className="font-mono font-bold text-gray-900">{result.suggestedICD || 'F32.x'}</span>
                  
                  <AnimatePresence>
                    {showICDTooltip && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-black text-white text-[10px] rounded-xl shadow-xl z-50"
                      >
                        <p className="font-bold mb-1">{result.suggestedICD}</p>
                        <p className="opacity-80">
                          {ICD_DESCRIPTIONS[result.suggestedICD] || "Diagnostic code for mental health disorders."}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">DSM-5 Criteria</span>
                  <span className="text-xs font-medium text-gray-900">{result.suggestedDSM || 'Probable MDD'}</span>
                </div>
                <div className="pt-4 border-t border-gray-50 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-2">
                    <CheckCircle2 className="w-3 h-3" />
                    Evidence-Based CDSS
                  </div>
                  <button 
                    onClick={handleSyncSATUSEHAT}
                    disabled={syncing}
                    className="w-full flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-blue-600 hover:text-blue-700 disabled:opacity-50"
                  >
                    {syncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <ExternalLink className="w-3 h-3" />}
                    {syncing ? 'Syncing...' : 'Sync to SATUSEHAT'}
                  </button>
                  <a 
                    href="https://safespace.elpeef.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-600 hover:text-black"
                  >
                    <UserPlus className="w-3 h-3" />
                    Consult a Professional
                  </a>
                  <button 
                    onClick={downloadReport}
                    className="w-full flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-emerald-600 hover:text-emerald-700"
                  >
                    <Download className="w-3 h-3" />
                    Download Clinical Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Consult Modal */}
      <AnimatePresence>
        {showConsultModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConsultModal(false)}
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
                <button onClick={() => setShowConsultModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
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
                    className="block w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors text-center"
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

      {/* FHIR Payload Modal */}
      <AnimatePresence>
        {showFHIRModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFHIRModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[40px] shadow-2xl z-[110] p-10 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-xl">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">SATUSEHAT FHIR Payload</h3>
                    <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">HL7 FHIR R4 Standard Integration</p>
                  </div>
                </div>
                <button onClick={() => setShowFHIRModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <p className="text-sm text-emerald-900 font-medium">Data successfully mapped to national health record standards.</p>
                </div>

                <div className="relative">
                  <div className="absolute top-4 right-4 text-[10px] font-mono text-gray-400 uppercase tracking-widest">JSON Payload</div>
                  <pre className="w-full h-80 p-6 bg-gray-900 text-teal-400 rounded-3xl overflow-auto text-[10px] font-mono custom-scrollbar leading-relaxed">
                    {JSON.stringify(fhirPayload, null, 2)}
                  </pre>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowFHIRModal(false)}
                    className="flex-1 py-4 bg-black text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition-all"
                  >
                    Close Viewer
                  </button>
                  <button 
                    className="px-8 py-4 bg-gray-100 text-gray-600 text-sm font-bold rounded-2xl hover:bg-gray-200 transition-all"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(fhirPayload, null, 2));
                      alert("Payload copied to clipboard!");
                    }}
                  >
                    Copy JSON
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
