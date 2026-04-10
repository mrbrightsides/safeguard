import React, { useState, useEffect, useRef } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { Bluetooth, BluetoothOff, Activity, Zap, ShieldAlert, CheckCircle2, RefreshCw, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface WearableSyncProps {
  onDataUpdate?: (bpm: number, hrv: number) => void;
  onConnectionChange?: (isConnected: boolean, deviceName: string | null) => void;
}

export const WearableSync: React.FC<WearableSyncProps> = ({ onDataUpdate, onConnectionChange }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [bpm, setBpm] = useState(72);
  const [hrv, setHrv] = useState(45);
  const [history, setHistory] = useState<{ time: string, bpm: number }[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize history
  useEffect(() => {
    const initialHistory = Array.from({ length: 20 }, (_, i) => ({
      time: i.toString(),
      bpm: 70 + Math.floor(Math.random() * 10)
    }));
    setHistory(initialHistory);
  }, []);

  const updateHistory = (newBpm: number) => {
    setHistory(prev => {
      const newHistory = [...prev.slice(1), { time: new Date().toLocaleTimeString(), bpm: newBpm }];
      return newHistory;
    });
  };

  const startSimulation = () => {
    setIsSimulating(true);
    setIsConnected(true);
    setDeviceName("Simulated Smartwatch v2");
    onConnectionChange?.(true, "Simulated Smartwatch v2");

    simulationInterval.current = setInterval(() => {
      const baseBpm = 72;
      const noise = Math.floor(Math.random() * 6) - 3;
      const newBpm = baseBpm + noise;
      const newHrv = 40 + Math.floor(Math.random() * 15);
      
      setBpm(newBpm);
      setHrv(newHrv);
      updateHistory(newBpm);
      onDataUpdate?.(newBpm, newHrv);

      // Trigger high stress alert randomly for demo
      if (Math.random() > 0.95) {
        const spikeBpm = 115 + Math.floor(Math.random() * 10);
        setBpm(spikeBpm);
        updateHistory(spikeBpm);
        onDataUpdate?.(spikeBpm, newHrv);
        
        window.dispatchEvent(new CustomEvent('new-notification', {
          detail: {
            id: Date.now().toString(),
            title: '[FLAG] Acute Stress Detected',
            message: `Heart rate spike detected (${spikeBpm} BPM). Initiating Safespace protocol.`,
            type: 'alert',
            time: 'Just now'
          }
        }));
      }
    }, 2000);
  };

  const stopSimulation = () => {
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
    }
    setIsSimulating(false);
    setIsConnected(false);
    setDeviceName(null);
    onConnectionChange?.(false, null);
  };

  const connectBluetooth = async () => {
    if (!(navigator as any).bluetooth) {
      setError("Bluetooth is not supported in this browser or environment. Please try using Chrome or Edge on a supported device.");
      return;
    }
    setIsConnecting(true);
    setError(null);
    
    try {
      // @ts-ignore - Web Bluetooth API
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }]
      });

      setDeviceName(device.name || "Unknown Wearable");
      
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('heart_rate');
      const characteristic = await service.getCharacteristic('heart_rate_measurement');

      await characteristic.startNotifications();
      
      characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const value = event.target.value;
        const flags = value.getUint8(0);
        const rate16Bits = flags & 0x1;
        let heartRate;
        if (rate16Bits) {
          heartRate = value.getUint16(1, true);
        } else {
          heartRate = value.getUint8(1);
        }
        
        setBpm(heartRate);
        updateHistory(heartRate);
        onDataUpdate?.(heartRate, hrv);
      });

      setIsConnected(true);
      onConnectionChange?.(true, device.name || "Unknown Wearable");
      
      device.addEventListener('gattserverdisconnected', () => {
        setIsConnected(false);
        setDeviceName(null);
        onConnectionChange?.(false, null);
      });

    } catch (err: any) {
      console.error("Bluetooth Error:", err);
      setError(err.message || "Failed to connect. Make sure Bluetooth is enabled.");
      // Fallback to simulation if user wants for demo
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    if (isSimulating) {
      stopSimulation();
    } else {
      // In a real app, we'd disconnect the GATT server here
      setIsConnected(false);
      setDeviceName(null);
      onConnectionChange?.(false, null);
    }
  };

  return (
    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-50">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                isConnected ? "bg-emerald-500" : "bg-gray-300"
              )} />
              <h3 className="text-xl font-bold">Wearable Live Sync</h3>
            </div>
            <p className="text-sm text-gray-500">
              {isConnected 
                ? `Connected to ${deviceName}` 
                : "Sync biometric data for real-time risk flagging"}
            </p>
          </div>
          <div className="flex gap-2">
            {!isConnected ? (
              <>
                <button
                  onClick={startSimulation}
                  className="px-4 py-2 bg-teal-50 text-teal-700 rounded-xl text-xs font-bold hover:bg-teal-100 transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-3 h-3" />
                  Demo Mode
                </button>
                <button
                  onClick={connectBluetooth}
                  disabled={isConnecting}
                  className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isConnecting ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Bluetooth className="w-3 h-3" />
                  )}
                  {isConnecting ? "Searching..." : "Connect Device"}
                </button>
              </>
            ) : (
              <button
                onClick={disconnect}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all flex items-center gap-2"
              >
                <BluetoothOff className="w-3 h-3" />
                Disconnect
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-xs">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Activity className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Heart Rate</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-900">{bpm}</span>
                  <span className="text-xs font-bold text-gray-400">BPM</span>
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">HRV (Stress)</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-900">{hrv}</span>
                  <span className="text-xs font-bold text-gray-400">ms</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-teal-900 text-white rounded-3xl shadow-lg shadow-teal-900/20">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-4 h-4 text-teal-400" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400">Prognostic Status</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">
                    {bpm > 100 ? "Acute Stress Detected" : "Stable Biometrics"}
                  </p>
                  <p className="text-xs text-teal-100/60">
                    {bpm > 100 ? "Elevated HR pattern detected." : "Current metrics within normal range."}
                  </p>
                </div>
                {bpm <= 100 ? (
                  <CheckCircle2 className="w-8 h-8 text-teal-400" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-red-500 animate-ping" />
                )}
              </div>
            </div>
          </div>

          <div className="h-48 bg-gray-50 rounded-3xl border border-gray-100 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="time" hide />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="bpm" 
                  stroke="#0d9488" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorBpm)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="px-8 py-4 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Web Bluetooth API</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">GATT Heart Rate Service</span>
          </div>
        </div>
        <div className="text-[10px] font-mono text-gray-400">
          SECURE_SYNC_ACTIVE
        </div>
      </div>
    </div>
  );
};
