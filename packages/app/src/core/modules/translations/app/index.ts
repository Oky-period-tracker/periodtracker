import { AppTranslations } from '../../../types'
import { Locale } from '../'

import { en } from './en'
import { ph } from './ph'

export const appTranslations: Record<Locale, AppTranslations> = {
  en,
  ph,
}

export const availableAppLocales = Object.keys(appTranslations) as Locale[]
