import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import pl from "./locales/pl.json"
import en from "./locales/en.json"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pl: { translation: pl },
      en: { translation: en },
    },
    lng: "pl",
    fallbackLng: "pl",
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n

