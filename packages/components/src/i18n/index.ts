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
import { customComponentsTranslations } from '../optional/CustomComponents'

type TranslationObject = Record<Locale, Record<string, string>>

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
  customComponentsTranslations,
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

    return {
      languageTag: defaultLocale,
      isRTL: false,
    }
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
