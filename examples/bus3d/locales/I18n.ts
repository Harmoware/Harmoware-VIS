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
    },

    // react-i18next special options (optional)
    react: {
      wait: true, // true: wait for loaded in every translated hoc
    }
  });

export default i18n;
