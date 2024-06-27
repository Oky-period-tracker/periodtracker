import { StaticContent } from '../../../types'
import { Locale } from '../'
import { en } from './en'
import { ph } from './ph'

export const content: Record<Locale, StaticContent> = {
  en,
  ph,
}

export const availableContentLocales = Object.keys(content)
