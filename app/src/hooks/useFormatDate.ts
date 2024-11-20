import moment, { Moment } from 'moment'
import { calendarTranslations } from '../resources/translations'
import { useLocale } from './useLocale'

export const useFormatDate = () => {
  const locale = useLocale()
  const translations = calendarTranslations[locale]

  const formatMomentDayMonth = (date?: Moment) => {
    // `DD MMM`
    if (!date) {
      return ''
    }
    const monthNumber = parseInt(date.format('M')) - 1
    const monthName = translations.monthNamesShort[monthNumber]
    return `${date.format('DD')}\n${monthName}`
  }

  const formatMonthYear = (date?: string) => {
    if (!date) {
      return ''
    }
    const momentDate = moment(date)
    const monthNumber = parseInt(momentDate.format('M')) - 1
    const monthName = translations.monthNamesShort[monthNumber]
    return monthName + ' ' + momentDate.format('YYYY')
  }

  const formatDayMonthYear = (date?: Moment) => {
    if (!date) {
      return ''
    }
    const momentDate = moment(date)
    const monthNumber = parseInt(momentDate.format('M')) - 1
    const monthName = translations.monthNamesShort[monthNumber]
    return `${date.format('DD')} ${monthName} ${momentDate.format('YYYY')}`
  }

  return { formatMomentDayMonth, formatMonthYear, formatDayMonthYear }
}
