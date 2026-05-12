import React, { useState, useEffect } from 'react';
import { Cpu, Wifi, WifiOff, RefreshCw, Radio, Zap, AlertCircle, Music, Mic, Activity } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const IoTBridge: React.FC = () => {
  const [bridgeStatus, setBridgeStatus] = useState<'offline' | 'searching' | 'connected'>('offline');
  const [bridgePort, setBridgePort] = useState<string | null>(null);

  const checkBridge = async () => {
    setBridgeStatus('searching');
    try {
      // Attempting to talk to the local Python bridge
      const response = await fetch('http://localhost:5001/api/status', {
        mode: 'cors'
      });
      if (response.ok) {
        const data = await response.json();
        setBridgeStatus(data.status === 'connected' ? 'connected' : 'searching');
        setBridgePort(data.port || 'COM3');
      } else {
        setBridgeStatus('offline');
      }
    } catch (e) {
      setBridgeStatus('offline');
    }
  };

  useEffect(() => {
    checkBridge();
  }, []);

  return (
    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-3 rounded-2xl transition-all",
            bridgeStatus === 'connected' ? "bg-emerald-600 shadow-lg shadow-emerald-200" : "bg-gray-100"
          )}>
            <Cpu className={cn("w-6 h-6", bridgeStatus === 'connected' ? "text-white" : "text-gray-400")} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Hardware Hub</h3>
            <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">IoT / Arduino Bridge</p>
          </div>
        </div>
        <button 
          onClick={checkBridge}
          className="p-2 hover:bg-gray-50 rounded-xl transition-all"
          title="Refresh connection"
        >
          <RefreshCw className={cn("w-4 h-4 text-gray-400", bridgeStatus === 'searching' && "animate-spin")} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="p-6 bg-gray-50 rounded-3xl space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Radio className="w-16 h-16" />
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Connection</span>
            <div className="flex items-center gap-2">
              {bridgeStatus === 'connected' ? (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">
                  <Wifi size={12} />
                  BRIDGE_ACTIVE
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold">
                  <WifiOff size={12} />
                  BRIDGE_OFFLINE
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-black text-gray-900">
              {bridgeStatus === 'connected' ? 'Arduino Client' : 'No Hardware'}
            </div>
            <div className="text-[10px] font-mono text-gray-400">
              {bridgeStatus === 'connected' ? `PORT: ${bridgePort} | BAUD: 9600` : 'RUNNING_SIMULATION_MODE'}
            </div>
          </div>
        </div>

        {bridgeStatus !== 'connected' && (
          <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[10px] text-orange-800 font-bold uppercase tracking-tight">Setup Required</p>
              <p className="text-[10px] text-orange-700 leading-normal">
                To connect real Arduino devices, run the Python Bridge using `python safeguard_bridge.py`. 
                Check the <strong>hardware-integration-guide.md</strong> for setup steps.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="text-[8px] font-bold text-gray-400 uppercase mb-1">Latency</div>
            <div className="text-sm font-bold text-gray-900">
              {bridgeStatus === 'connected' ? '12ms' : '--'}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="text-[8px] font-bold text-gray-400 uppercase mb-1">Signals</div>
            <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Zap size={14} className="text-teal-500" />
              {bridgeStatus === 'connected' ? 'RX/TX' : 'SIM'}
            </div>
          </div>
        </div>

        {/* Companion Doll Integration */}
        <div className="p-5 bg-teal-50/30 border border-teal-100 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-teal-600" />
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Doll Companion Status</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          </div>
          <div className="flex items-center justify-around py-2">
            <div className="flex flex-col items-center gap-1 opacity-50">
              <Mic size={18} className="text-gray-400" />
              <span className="text-[8px] font-bold text-gray-400">INPUT</span>
            </div>
            <div className="h-4 w-px bg-teal-100" />
            <div className="flex flex-col items-center gap-1">
              <RefreshCw size={18} className="text-teal-600" />
              <span className="text-[8px] font-bold text-teal-600">TTS_READY</span>
            </div>
            <div className="h-4 w-px bg-teal-100" />
            <div className="flex flex-col items-center gap-1 opacity-50">
              <Cpu size={18} className="text-gray-400" />
              <span className="text-[8px] font-bold text-gray-400">SERIAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
