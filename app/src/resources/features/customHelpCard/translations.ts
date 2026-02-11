import { Locale } from '../../translations'

type CustomHelpTranslations = {
  you_are_not_alone: string
  find_help_center: string
}

const en = {
  you_are_not_alone: 'Hindi ka nag-iisa!',
  find_help_center: 'Maghanap ng service provider',
}

const ph = {
  you_are_not_alone: 'Hindi ka nag-iisa!',
  find_help_center: 'Maghanap ng service provider',
}

export const customHelpTranslations: Record<Locale, CustomHelpTranslations> = {
  en,
  es: ph,
  fr: ph,
  pt: ph,
  ru: ph,
}
