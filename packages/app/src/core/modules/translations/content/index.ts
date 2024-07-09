import { StaticContent } from '../../../types'
import { Locale } from '../'
import { en } from './en'
import { fil } from './fil'

export const content: Record<Locale, StaticContent> = {
  en,
  fil,
}

export const availableContentLocales = Object.keys(content)
