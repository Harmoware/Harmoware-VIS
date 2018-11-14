import * as i18next from 'i18next';
import * as ja from './I18nJa';
import * as en from './I18nEn';
var i18n = i18next
    .init({
    resources: {
        ja: {
            general: ja.general,
        },
        en: {
            general: en.general,
        }
    },
    fallbackLng: 'ja',
    // string or array of namespaces to load
    ns: ['general'],
    defaultNS: 'general',
    interpolation: {
        escapeValue: false,
        formatSeparator: ',',
    },
    // react-i18next special options (optional)
    react: {
        wait: true,
    }
});
export default i18n;
//# sourceMappingURL=I18n.js.map