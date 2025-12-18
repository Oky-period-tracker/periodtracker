import { TranslationsResponse } from '../core/api'

export interface Translations {
  [key: string]: string
}

export type TranslationsResult = ReturnType<typeof fromTranslations>

export function fromTranslations(response: TranslationsResponse) {
  const translations: Translations = {}
  
  response.forEach((item) => {
    if (item.live !== false) {
      translations[item.key] = item.label
    }
  })
  
  return { translations }
}

