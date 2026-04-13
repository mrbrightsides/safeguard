import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Bot, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  Globe, 
  Link2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

export const AgentWorkspace: React.FC = () => {
  const [mcpStatus, setMcpStatus] = useState<'online' | 'offline' | 'connecting'>('connecting');
  const [sharpContext, setSharpContext] = useState<any>(null);
  const [logs, setLogs] = useState<{time: string, msg: string, type: 'info' | 'success' | 'warn'}[]>([]);

  useEffect(() => {
    // Simulate MCP Connection
    const timer = setTimeout(() => {
      setMcpStatus('online');
      addLog('MCP Server initialized at /mcp/sse', 'success');
      addLog('SHARP Protocol handshake complete', 'info');
      addLog('A2A Discovery service active', 'info');
    }, 1500);

    // Check for SHARP headers (simulated)
    const mockSharp = {
      patientId: "P-8821-X",
      fhirBase: "https://api.satusehat.kemkes.go.id/fhir-r4/v1",
      tenantId: "T-990-SAFEGUARD"
    };
    setSharpContext(mockSharp);

    return () => clearTimeout(timer);
  }, []);

  const addLog = (msg: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }].slice(-10));
  };

  return (
    <div className="w-full space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Agent Status</h3>
              <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">A2A / MCP Protocol</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium">MCP Server</span>
              </div>
              <span className={cn(
                "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                mcpStatus === 'online' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
              )}>
                {mcpStatus}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">A2A Discovery</span>
              </div>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-teal-500" />
                <span className="text-sm font-medium">SHARP Specs</span>
              </div>
              <span className="px-2 py-1 bg-teal-50 text-teal-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Compliant
              </span>
            </div>
          </div>
        </div>

        {/* SHARP Context Card */}
        <div className="md:col-span-2 bg-black p-8 rounded-[40px] text-white space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Database className="w-32 h-32" />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <Zap className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold">SHARP Context Propagation</h3>
              <p className="text-xs text-teal-400/50 font-mono uppercase tracking-widest">Active EHR Session Data</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-2">
              <div className="text-[10px] font-mono uppercase text-teal-400/50 tracking-widest">Patient ID (SHARP)</div>
              <div className="text-lg font-mono font-bold">{sharpContext?.patientId || 'Waiting for context...'}</div>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-2">
              <div className="text-[10px] font-mono uppercase text-teal-400/50 tracking-widest">FHIR Base URL</div>
              <div className="text-xs font-mono truncate">{sharpContext?.fhirBase || 'N/A'}</div>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-2">
              <div className="text-[10px] font-mono uppercase text-teal-400/50 tracking-widest">Tenant Identifier</div>
              <div className="text-lg font-mono font-bold">{sharpContext?.tenantId || 'N/A'}</div>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-2">
              <div className="text-[10px] font-mono uppercase text-teal-400/50 tracking-widest">Auth Protocol</div>
              <div className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                SHARP-Bearer
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools & Marketplace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-bold">Exposed MCP Tools</h3>
            </div>
            <span className="text-[10px] font-mono text-gray-400">3 TOOLS ACTIVE</span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'analyze_psychosocial_notes', desc: 'AI-powered risk detection from clinical text.', type: 'AI Tool' },
              { name: 'get_risk_stratification', desc: 'Clinical triage based on DASS-21 scores.', type: 'Clinical' },
              { name: 'get_economic_impact', desc: 'ROI and claim estimates for interventions.', type: 'Economic' }
            ].map(tool => (
              <div key={tool.name} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-indigo-600 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <code className="text-xs font-bold text-indigo-600">{tool.name}</code>
                  <span className="text-[8px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded uppercase">{tool.type}</span>
                </div>
                <p className="text-xs text-gray-500">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Link2 className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-bold">Marketplace Integration</h3>
          </div>

          <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <img src="/images/logo.png" className="w-8 h-8" alt="SafeGuard" />
              </div>
              <div>
                <div className="font-bold text-indigo-900">SafeGuard Clinical Agent</div>
                <div className="text-xs text-indigo-700">Published to Prompt Opinion Marketplace</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600">
                <CheckCircle2 className="w-3 h-3" />
                A2A DISCOVERABLE
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600">
                <CheckCircle2 className="w-3 h-3" />
                SHARP VERIFIED
              </div>
            </div>

            <button className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all">
              View in Marketplace
            </button>
          </div>

          <div className="bg-gray-900 rounded-2xl p-4 font-mono text-[10px] text-teal-400 overflow-hidden">
            <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-2">
              <span className="text-white/50 uppercase tracking-widest">Protocol Logs</span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            </div>
            <div className="space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-white/30">[{log.time}]</span>
                  <span className={cn(
                    log.type === 'success' ? 'text-emerald-400' : 
                    log.type === 'warn' ? 'text-orange-400' : 'text-teal-400'
                  )}>{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
