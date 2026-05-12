/**
 * Safe-Vault: Utilities for managing personalized local memory.
 * This ensures data remains on the donor's device, reinforcing privacy.
 */

export interface UserVaultData {
  nickname: string;
  primaryConcerns: string[];
  lastSessionDate: string | null;
  companionTone: 'soft' | 'direct' | 'clinical';
  isAnonymous: boolean;
}

const VAULT_KEY = 'safeguard_vault_data';

export const getVaultData = (): UserVaultData => {
  const data = localStorage.getItem(VAULT_KEY);
  if (!data) {
    return {
      nickname: 'Guest',
      primaryConcerns: [],
      lastSessionDate: null,
      companionTone: 'soft',
      isAnonymous: true
    };
  }
  return JSON.parse(data);
};

export const saveVaultData = (data: UserVaultData) => {
  localStorage.setItem(VAULT_KEY, JSON.stringify(data));
};

export const clearVaultData = () => {
  localStorage.removeItem(VAULT_KEY);
};

export const updateLastSession = () => {
  const data = getVaultData();
  data.lastSessionDate = new Date().toISOString();
  saveVaultData(data);
};
