import { AppTranslations } from '../../../types'
import { Locale } from '../'

import { en } from './en'
import { fil } from './fil'

export const appTranslations: Record<Locale, AppTranslations> = {
  en,
  fil,
}

export const availableAppLocales = Object.keys(appTranslations) as Locale[]
