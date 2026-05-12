import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, User, Heart, X, Save, Trash2, Lock, Eye, EyeOff } from 'lucide-react';
import { getVaultData, saveVaultData, UserVaultData, clearVaultData } from '@/src/lib/vaultUtils';
import { cn } from '@/src/lib/utils';

interface SafeVaultProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafeVault: React.FC<SafeVaultProps> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<UserVaultData>(getVaultData());
  const [showSensitivityWarning, setShowSensitivityWarning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setData(getVaultData());
    }
  }, [isOpen]);

  const handleSave = () => {
    saveVaultData(data);
    window.dispatchEvent(new CustomEvent('new-notification', {
      detail: {
        title: 'Vault Updated',
        message: 'Your personal preferences are saved securely on this device.',
        type: 'success'
      }
    }));
    onClose();
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your local vault? This cannot be undone.")) {
      clearVaultData();
      setData(getVaultData());
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[40px] shadow-2xl z-[110] overflow-hidden border border-gray-100"
          >
            <div className="bg-black p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Shield className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Safe-Vault</h2>
                  <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Local-Only Memory</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Privacy Mode</span>
                  <button 
                    onClick={() => setData({ ...data, isAnonymous: !data.isAnonymous })}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all",
                      data.isAnonymous ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                    )}
                  >
                    {data.isAnonymous ? <EyeOff size={12} /> : <Eye size={12} />}
                    {data.isAnonymous ? 'Anonymous' : 'Personalized'}
                  </button>
                </div>

                {!data.isAnonymous && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nickname</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text"
                          value={data.nickname}
                          onChange={(e) => setData({ ...data, nickname: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black text-sm"
                          placeholder="What should SafeGuard call you?"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Tone Preference</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['soft', 'direct', 'clinical'] as const).map((tone) => (
                          <button
                            key={tone}
                            onClick={() => setData({ ...data, companionTone: tone })}
                            className={cn(
                              "py-2 text-[10px] font-bold uppercase rounded-xl border transition-all",
                              data.companionTone === tone 
                                ? "bg-black text-white border-black" 
                                : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
                            )}
                          >
                            {tone}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl flex items-start gap-3">
                <Lock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-teal-800 leading-relaxed font-medium">
                  This data is stored encrypted in your browser's local storage. It is never sent to our servers. Only the AI Agent sees this to provide personalized care.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={handleSave}
                  className="flex-1 py-4 bg-black text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
                >
                  <Save size={16} />
                  Save Vault
                </button>
                <button 
                  onClick={handleClear}
                  className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-red-50"
                  title="Wipe Vault"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
