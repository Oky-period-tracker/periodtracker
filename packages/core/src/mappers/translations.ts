import { TranslationsResponse } from '../api/types'

export interface Translations {
  [key: string]: string
}

export type TranslationsResult = ReturnType<typeof fromTranslations>

export function fromTranslations(response: TranslationsResponse) {
  const translations: Translations = {}
  
  response.forEach((item) => {
    translations[item.key] = item.label
  })
  
  return { translations }
}

