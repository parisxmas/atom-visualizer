import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources
import enTranslations from './locales/en.json';
import trTranslations from './locales/tr.json';
import bgTranslations from './locales/bg.json';

// Build complete translation resources
const resources = {
    en: {
        translation: enTranslations
    },
    tr: {
        translation: trTranslations
    },
    bg: {
        translation: bgTranslations
    }
};

i18next
    .use(LanguageDetector)
    .init({
        resources,
        fallbackLng: 'en',
        detection: {
            order: ['navigator'],
            caches: []
        },
        interpolation: {
            escapeValue: false
        }
    });

export default i18next;
