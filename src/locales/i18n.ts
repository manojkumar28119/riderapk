import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './en.json';
import teTranslations from './tel.json';
import { LOCALSTORAGE_KEYS } from '@/data/constants/localstorage.constant';

const resources = {
  en: {
    translation: enTranslations,
  },
  te: {
    translation: teTranslations,
  },
};

const savedLanguage = localStorage.getItem(LOCALSTORAGE_KEYS.LANGUAGE);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: savedLanguage || 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
