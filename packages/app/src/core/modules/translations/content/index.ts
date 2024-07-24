import { StaticContent } from '../../../types'
import { Locale } from '../'
import { en } from './en'

export const content: Record<Locale, StaticContent> = {
  en,
}

export const availableContentLocales = Object.keys(content)
