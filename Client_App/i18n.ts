// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import rw from './locales/rw.json';
import en from './locales/en.json';
import fr from './locales/fr.json';

export const resources = {
  rw: { translation: rw },
  en: { translation: en },
  fr: { translation: fr },
} as const;

export type Language = keyof typeof resources;

const LANGUAGE_KEY = 'user-language';

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'rw',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export const languageReady = (async () => {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
    let lng: Language = 'rw';

    if (saved && resources[saved as Language]) {
      lng = saved as Language;
    } else {
      const device = Localization.getLocales()[0]?.languageCode;
      lng = ['en', 'fr', 'rw'].includes(device!) ? (device as Language) : 'en';
    }

    await i18n.changeLanguage(lng);
  } catch (e) {
    console.error(e);
  }
})();

i18n.on('languageChanged', lng => {
  AsyncStorage.setItem(LANGUAGE_KEY, lng).catch(console.error);
});

export default i18n;