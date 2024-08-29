import { AppTranslations } from '../../../types'
import { Locale } from '../'

import { en } from './en'
import { fr } from './fr'
import { ru } from './ru'
import { pt } from './pt'
import { es } from './es'

export const appTranslations: Record<Locale, AppTranslations> = {
  en,
  fr,
  ru,
  pt,
  es,
}

export const availableAppLocales = Object.keys(appTranslations) as Locale[]
