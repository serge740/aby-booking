import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import rw from "./locales/rw.json";

// Get saved language from localStorage or fallback to "rw"
const savedLanguage = localStorage.getItem("i18nextLng") || "rw";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      rw: { translation: rw },
    },
    lng: savedLanguage,
    fallbackLng: "rw",
    interpolation: {
      escapeValue: false,
    },
  });

export const changeLanguage = (lang) => {
  i18n.changeLanguage(lang);
  localStorage.setItem("i18nextLng", lang); // persist selected language
};

export default i18n;
