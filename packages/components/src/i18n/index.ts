import { I18nManager } from 'react-native'
import * as RNLocalize from 'react-native-localize'
import Tts from 'react-native-tts'
import i18n from 'i18n-js'
import {
  Locale,
  appTranslations,
  defaultLocale,
  localeTranslations,
  themeTranslations,
} from '@oky/core'
import _ from 'lodash'
import { flowerTranslations } from '../optional/Flower'

type TranslationObject = Record<Locale, Record<string, string>>

const customSignUpTranslations = {
  en: {
    seeing: 'Paningin (kahit nakasuot ng salamin)',
    hearing: 'Pandinig (kahit nakasuot ng hearing aid)',
    mobility: 'Paglalakad o pag-akyat sa hagdan',
    self_care: 'Pag-aalaga sa sarili (pagligo, pagsuot ng damit)',
    communication: 'Pakikipag-usap (pag-intindi o naiintindihan ang iyong pananalita)',
    no_difficulty: 'Hindi ako nahihirapan sa mga ito',
    your_gender: 'Ano ang kasarian mo?',
    your_gender_identity: 'Miyembro ka ba ng LGBTIQ+ community?',
    disability_question: 'Sa aling gawain ka nahihirapan o hindi mo kayang gawin?',
    undisclosed_religion: 'Hindi ko gustong ilagay',
    religion_question: 'Ano ang iyong relihiyon?',
    encyclopedia_version_question:
      'Gusto mo bang ma-access ang ilang informative na content ni Oky, na tulad ng encyclopedia, did you know, at quizzes, na may Islamic perspective?',
    religion_perspective_heading: 'Relihiyon',
    religion_perspective_content:
      'Sa pagsagot ng ‘Islam’, makikita mo ang Encyclopedia na ayon sa turo ng Islam ang laman',
    islamic_perspective_heading: 'Disclaimer',
    islamic_perspective_content:
      'Ang mga informative na content na mababasa mo ay nai-konsulta at na-validate ng Bangsamoro Darul-Ifta (BDI),  Ministry of Basic, Higher, and Technical Education (MBHTE), Ministry of Health (MOH), at Bangsamoro Youth Council (BYC). Ang ilan sa mga impormasyon na ito ay ayon sa katuruan ng Islam.',
  },
  ph: {
    seeing: 'Paningin (kahit nakasuot ng salamin)',
    hearing: 'Pandinig (kahit nakasuot ng hearing aid)',
    mobility: 'Paglalakad o pag-akyat sa hagdan',
    self_care: 'Pag-aalaga sa sarili (pagligo, pagsuot ng damit)',
    communication: 'Pakikipag-usap (pag-intindi o naiintindihan ang iyong pananalita)',
    no_difficulty: 'Hindi ako nahihirapan sa mga ito',
    //
    your_gender: 'Ano ang kasarian mo?',
    your_gender_identity: 'Miyembro ka ba ng LGBTIQ+ community?',
    disability_question: 'Sa aling gawain ka nahihirapan o hindi mo kayang gawin?',
    undisclosed_religion: 'Hindi ko gustong ilagay',
    religion_question: 'Ano ang iyong relihiyon?',
    encyclopedia_version_question:
      'Gusto mo bang ma-access ang ilang informative na content ni Oky, na tulad ng encyclopedia, did you know, at quizzes, na may Islamic perspective?',
    religion_perspective_heading: 'Relihiyon',
    religion_perspective_content:
      'Sa pagsagot ng ‘Islam’, makikita mo ang Encyclopedia na ayon sa turo ng Islam ang laman',
    islamic_perspective_heading: 'Disclaimer',
    islamic_perspective_content:
      'Ang mga informative na content na mababasa mo ay nai-konsulta at na-validate ng Bangsamoro Darul-Ifta (BDI),  Ministry of Basic, Higher, and Technical Education (MBHTE), Ministry of Health (MOH), at Bangsamoro Youth Council (BYC). Ang ilan sa mga impormasyon na ito ay ayon sa katuruan ng Islam.',
  },
}

const combineTranslations = (translations: TranslationObject[]) => {
  return translations.reduce((acc, translation) => {
    if (translation) {
      for (const locale in translation) {
        if (translation[locale]) {
          if (acc[locale]) {
            acc[locale] = { ...acc[locale], ...translation[locale] }
          } else {
            acc[locale] = translation[locale]
          }
        }
      }
    }
    return acc
  }, {})
}

// TODO_ALEX fix typecasting
export const allTranslations = combineTranslations([
  (appTranslations as unknown) as TranslationObject,
  (localeTranslations as unknown) as TranslationObject,
  (themeTranslations as unknown) as TranslationObject,
  flowerTranslations,
  customSignUpTranslations,
])

export function translate(key) {
  return i18n.t(key)
}

export const capitalizeFLetter = (inputString): string => {
  if (inputString.length === 0) return ''
  return inputString[0].toUpperCase() + inputString.slice(1)
}

export function currentLocale() {
  return i18n.locale
}

export function configureI18n(locale?: string, rtl = false) {
  function findBestLanguage() {
    if (locale && allTranslations[locale]) {
      return {
        languageTag: locale,
        isRTL: rtl,
      }
    }

    return (
      RNLocalize.findBestAvailableLanguage(Object.keys(allTranslations)) || {
        languageTag: defaultLocale,
        isRTL: false,
      }
    )
  }

  const { languageTag, isRTL } = findBestLanguage()

  // update layout direction
  I18nManager.forceRTL(isRTL)

  // set i18n-js config
  i18n.translations = { [languageTag]: allTranslations[languageTag] }
  i18n.locale = languageTag

  // on production, we fallback to the translation key instead of missing translation
  if (!__DEV__) {
    i18n.missingTranslation = (id) => id
  }

  // tslint:disable-next-line: no-floating-promises
  configureTts(languageTag)
}

async function configureTts(locale) {
  await Tts.getInitStatus()

  const voices = await Tts.voices()
  const availableVoices = voices
    .filter((voice) => !voice.notInstalled)
    .map((voice) => {
      return { id: voice.id, name: voice.name, language: voice.language }
    })

  const allMyLocalVoices = availableVoices.filter((voice) => {
    return voice.language && voice.language.startsWith(`${locale}-`)
  })

  if (allMyLocalVoices.length === 0) {
    return
  }

  const preferableVoice = allMyLocalVoices.find((voice) => {
    return voice.name && voice.name.includes('female')
  })

  const chosenVoice = preferableVoice || allMyLocalVoices[0]

  return Promise.all([
    Tts.setDefaultLanguage(chosenVoice.language),
    Tts.setDefaultVoice(chosenVoice.id),
  ])
}
