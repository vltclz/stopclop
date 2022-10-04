import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from 'translations/en.json';
import fr from 'translations/fr.json';

const resources = {
  en,
  fr,
};

i18n.use(initReactI18next).init({
  resources,
  defaultNS: 'common',
  fallbackLng: 'fr',
});
