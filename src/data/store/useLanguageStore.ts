import { create } from 'zustand';
import { LOCALSTORAGE_KEYS } from '../constants/localstorage.constant';

export type Language = 'en' | 'te';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  initializeLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en',
  
  setLanguage: (language: Language) => {
    localStorage.setItem(LOCALSTORAGE_KEYS.LANGUAGE, language);
    set({ language });
  },

  initializeLanguage: () => {
    const savedLanguage = localStorage.getItem(
      LOCALSTORAGE_KEYS.LANGUAGE
    ) as Language | null;
    const language = savedLanguage || ('en' as Language);
    set({ language });
  },
}));
