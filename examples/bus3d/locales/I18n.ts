import i18next from 'i18next';
import * as ja from './I18nJa';
import * as en from './I18nEn';
import { initReactI18next } from "react-i18next";

const i18n = i18next.use(initReactI18next);

i18n.init({
    lng: "ja",
    resources: {
      ja: {
        general: ja.general,
      },
      en: {
        general: en.general,
      }
    },
    initImmediate: false,
    fallbackLng: 'ja',

    // string or array of namespaces to load
    ns: ['general'],

    defaultNS: 'general',

    interpolation: {
      escapeValue: false, // not needed for react
      formatSeparator: ',',
    }
  },()=>{});

export default i18n;
