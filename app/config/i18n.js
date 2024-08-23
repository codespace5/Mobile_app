import { AsyncStorage } from 'react-native';
import I18n from 'react-native-i18n';
// import moment from 'moment';

// Import all locales
import en from '../../locales/en.json'; 

// Define the supported translations
I18n.translations = {
  en,
};

AsyncStorage.getItem('transData', (err, result) => {
  if (result !== null) {
    try {
      const enTrans = JSON.parse(result);
      I18n.translations = {
        en: enTrans,
      };
    } catch (cerr) {
      console.log(cerr);
    }
  }
});


// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// const currentLocale = I18n.currentLocale();
// console.log(`currentLocale => ${currentLocale}`);

// // Is it a RTL language?
// export const isRTL = currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;

// // Allow RTL alignment in RTL languages
// ReactNative.I18nManager.allowRTL(isRTL);

// // Localizing momentjs to Hebrew or English
// if (currentLocale.indexOf('he') === 0) {
//   require('moment/locale/he.js');
//   moment.locale('he');
// } else if (currentLocale.indexOf('hi') === 0) {
//   require('moment/locale/hi.js');
//   moment.locale('hi');
// } else if (currentLocale.indexOf('gu') === 0) {
//   require('moment/locale/gu.js');
//   moment.locale('gu');
// } else if (currentLocale.indexOf('de') === 0) {
//   require('moment/locale/de.js');
//   moment.locale('de');
// } else if (currentLocale.indexOf('fr') === 0) {
//   require('moment/locale/fr.js');
//   moment.locale('fr');
// } else if (currentLocale.indexOf('it') === 0) {
//   require('moment/locale/it.js');
//   moment.locale('it');
// } else if (currentLocale.indexOf('ru') === 0) {
//   require('moment/locale/ru.js');
//   moment.locale('ru');
// } else {
//   moment.locale('en');
// }

// // The method we'll use instead of a regular string
// export const trans = (name, params = {}) => I18n.t(name, params);

export default I18n;
