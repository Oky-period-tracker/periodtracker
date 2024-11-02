import { AppTranslations } from '../core/types/translations/app'
import { getLocales } from 'expo-localization'
import {
  Locale,
  appTranslations,
  defaultLocale,
  localeTranslations,
  themeTranslations,
} from '../resources/translations'
import { ENV } from '../config/env'
import { useLocale } from './useLocale'

let initLocale = defaultLocale

try {
  const deviceLocale = getLocales()[0]?.languageCode
  const locales = Object.keys(appTranslations)
  if (deviceLocale && locales.includes(deviceLocale)) {
    initLocale = deviceLocale as Locale
  }
} catch (e) {
  //
}

export const initialLocale = initLocale

type TranslationObject = Record<Locale, Record<string, string>>

const combineTranslations = (translations: TranslationObject[]) => {
  return translations.reduce((acc, translation) => {
    if (!translation) {
      return acc
    }

    for (const locale in translation) {
      // @ts-expect-error TODO:
      if (translation[locale]) {
        // @ts-expect-error TODO:
        if (acc[locale]) {
          // @ts-expect-error TODO:
          acc[locale] = { ...acc[locale], ...translation[locale] }
        } else {
          // @ts-expect-error TODO:
          acc[locale] = translation[locale]
        }
      }
    }
    return acc
  }, {})
}

// TODO: fix typecasting
export const allTranslations = combineTranslations([
  (appTranslations as unknown) as TranslationObject,
  (localeTranslations as unknown) as TranslationObject,
  (themeTranslations as unknown) as TranslationObject,
  // flowerTranslations,
  // customComponentsTranslations,
])

const capitalizeFirstLetter = (text: string): string => {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const useTranslate = () => {
  const locale = useLocale()

  // Also remember when creating account, assign them whatever the app locale is when they create the account

  return (key: string): string => {
    if (!key) {
      return key
    }

    const currentLocale: Locale = (locale || initialLocale) as Locale

    const translation =
      // @ts-expect-error TODO:
      allTranslations?.[currentLocale]?.[key as keyof AppTranslations]

    if (ENV === 'development') {
      return capitalizeFirstLetter(translation || `[Missing translation: ${key}]`)
    }

    return capitalizeFirstLetter(translation || key)
  }
}
