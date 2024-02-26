// tslint:disable:no-var-requires
export const cmsTranslations = {
  en: require('./translations/en.json'),
  fr: require('./translations/fr.json'),
  pt: require('./translations/pt.json'),
  ru: require('./translations/ru.json'),
  es: require('./translations/es.json'),
  ph: require('./translations/ph.json'),
}

let chosenLocales = Object.keys(cmsTranslations)
try {
  chosenLocales = require('@oky/core/src/modules/translations/cms').cmsLocales
} catch (e) {
  //
}

export const cmsLocales = chosenLocales

const allCmsLanguages = [
  {
    name: 'English',
    locale: 'en',
  },
  {
    name: 'Français',
    locale: 'fr',
  },
  {
    name: 'Português',
    locale: 'pt',
  },
  {
    name: 'Русский',
    locale: 'ru',
  },
  {
    name: 'Español',
    locale: 'es',
  },
  {
    name: 'Pilipino',
    locale: 'ph',
  },
]

export const cmsLanguages = allCmsLanguages.filter((lang) => cmsLocales.includes(lang.locale))
