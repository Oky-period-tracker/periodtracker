import { calendarTranslations, defaultLocale } from '../resources/translations'
import { useLocale } from './useLocale'

export const useMonths = () => {
  const locale = useLocale()
  const defaultMonths = calendarTranslations[defaultLocale]?.monthNames
  const months = calendarTranslations[locale]?.monthNames ?? defaultMonths

  const monthOptions = months.map((item) => ({
    label: item,
    value: item,
  }))

  return { months, monthOptions }
}
