export const cmsTranslations = {
  en: require('./translations/en.json'),
  fr: require('./translations/fr.json'),
  pt: require('./translations/pt.json'),
  ru: require('./translations/ru.json'),
  id: require('./translations/id.json'),
  mn: require('./translations/mn.json'),
}

export const cmsLanguages = [
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
    name: 'Indonesian',
    locale: 'id',
  },
  {
    name: 'Монгол',
    locale: 'mn',
  },
]

export const cmsLocales = cmsLanguages.map((lang) => lang.locale)
