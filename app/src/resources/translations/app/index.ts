import { AppTranslations } from '../../../types'
import { Locale } from '../'

import { en } from './en'

export const appTranslations: Record<Locale, AppTranslations> = {
  en,
}

export const availableAppLocales = Object.keys(appTranslations) as Locale[]
