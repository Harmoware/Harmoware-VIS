import * as i18next from 'i18next';

const i18n = i18next
  .init({
    resources: {
      ja: {
        general: {
          langId: 'ja',
          langName: '日本語',
          locales: 'ja-JP',
          movedData: '運行データ',
          depotsData: '停留所データ',
          mapData: 'マップデータ',
          elapsedTime: '経過時間',
          speed: 'スピード',
          play: '開始',
          pause: '一時停止',
          forward: '正再生',
          reverse: '逆再生',
          sec: '秒',
          minute: '分',
          hour: '時',
          permission: 'サンプルプログラムで「つつじバスロケーションWEB API」で取得したデータを使用しています。',
          link: 'リンク',
        }
      },
      en: {
        general: {
          langId: 'en',
          langName: 'English',
          locales: 'en-US',
          movedData: 'Moved Data',
          depotsData: 'Depots Data',
          mapData: 'Map Data',
          elapsedTime: 'Elapsed Time',
          speed: 'Speed',
          play: 'PLAY',
          pause: 'PAUSE',
          forward: 'FORWARD',
          reverse: 'REVERSE',
          sec: 'sec',
          minute: 'min',
          hour: 'hour',
          permission: 'We use the data acquired by "Tutuji Bus Location WEB API" in the sample program.',
          link: 'LINK',
        }
      }
    },

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
      wait: true,  // true: wait for loaded in every translated hoc
    }
  });

export default i18n;
