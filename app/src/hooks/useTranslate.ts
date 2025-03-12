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
import { useDispatch } from 'react-redux'
import { currentLocaleSelector } from '../redux/selectors'
import React from 'react'
import { setLocale } from '../redux/actions'
import { useSelector } from '../redux/useSelector'
import { customSignUpTranslations } from '../optional/customSignUp'
import { customHelpTranslations } from '../optional/customHelpCard'
import { miscTranslations } from '../optional/misc'

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
  (miscTranslations as unknown) as TranslationObject,
  // (chatTranslations as unknown) as TranslationObject,
  // (flowerTranslations as unknown) as TranslationObject,
  (customSignUpTranslations as unknown) as TranslationObject,
  (customHelpTranslations as unknown) as TranslationObject,
])

const capitalizeFirstLetter = (text: string): string => {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const useTranslate = () => {
  const locale = useSelector(currentLocaleSelector)

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

export const useAvailableLocaleEffect = () => {
  // Dont use currentLocaleSelector because that also has a safety mechanism
  const currentLocale = useSelector((s) => s.app.locale)
  const dispatch = useDispatch()

  React.useEffect(() => {
    const locales = Object.keys(appTranslations)
    if (!locales.includes(currentLocale)) {
      dispatch(setLocale(initialLocale))
    }
  }, [currentLocale])
}
