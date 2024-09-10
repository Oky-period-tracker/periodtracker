import { useSelector } from '../redux/useSelector'
import { currentLocaleSelector } from '../redux/selectors'
import { Locale, calendarTranslations, defaultLocale } from '../resources/translations'

export const useMonths = () => {
  const locale = useSelector(currentLocaleSelector) as Locale
  const defaultMonths = calendarTranslations[defaultLocale]?.monthNames
  const months = calendarTranslations[locale]?.monthNames ?? defaultMonths

  const monthOptions = months.map((item) => ({
    label: item,
    value: item,
  }))

  return { months, monthOptions }
}
