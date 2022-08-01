/* eslint-disable camelcase */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translation_en from './en';
import translation_zh from './zh';

const resources = {
    en: {
        translation: translation_en
    },
    zh: {
        translation: translation_zh
    }
};

let lang = 'en';
const type = navigator.appName;
if (type === 'Netscape') {
    lang = navigator.language;
} else {
    lang = navigator.userLanguage;
}
lang = lang.substring(0, 2) === 'zh' ? 'zh' : 'en';

i18n.use(initReactI18next).init({
    resources,
    lng: lang,
    interpolation: {
        escapeValue: false
    }
});

export default i18n;
