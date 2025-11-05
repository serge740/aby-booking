// i18n.js or similar
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rw from './locales/rw.json';
import en from './locales/en.json';
import fr from './locales/fr.json';

// Resources
export const resources = {
  rw: { translation: rw },
  fr: { translation: fr },
  en: { translation: en },
} as const;

export type Language = keyof typeof resources;

const LANGUAGE_KEY = 'user-language';

// Initialize i18n synchronously with fallback
i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'rw',
    interpolation: { escapeValue: false },
  });

// Async language setup
const initializeLanguage = async () => {
  try {
    let lng: Language = 'rw';
    const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLang && resources[savedLang as Language]) {
      lng = savedLang as Language;
    } else {
    
          lng = 'en';
        
      
    }
    await i18n.changeLanguage(lng);
    console.log('Language set to:', i18n.language);
  } catch (error) {
    console.error('Failed to set language:', error);
  }
};

initializeLanguage();

// Save language when changed
i18n.on('languageChanged', (lng) => {
  AsyncStorage.setItem(LANGUAGE_KEY, lng).catch((err) =>
    console.error('Failed to save language', err)
  );
});

export default i18n;