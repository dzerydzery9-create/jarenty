import { create } from 'zustand';

interface StoreState {
  openaiApiKey: string;
  claudeApiKey: string;
  setApiKey: (provider: 'openai' | 'claude', key: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  openaiApiKey: localStorage.getItem('openaiApiKey') || '',
  claudeApiKey: localStorage.getItem('claudeApiKey') || '',
  setApiKey: (provider, key) => {
    set(state => ({
      ...state,
      [provider === 'openai' ? 'openaiApiKey' : 'claudeApiKey']: key
    }));
    localStorage.setItem(`${provider}ApiKey`, key);
  },
}));