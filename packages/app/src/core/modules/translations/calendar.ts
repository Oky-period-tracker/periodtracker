import { Locale } from '.'
import { CalendarTranslations } from '../../types/translations/calendar'

export const calendarTranslations: Record<Locale, CalendarTranslations> = {
  en: {
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    monthNamesShort: [
      'Jan',
      'Feb',
      'Ma',
      'Ap',
      'Ma',
      'Ju',
      'Jul',
      'Au',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    dayNames: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
  },
}

export const availableCalendarLocales = Object.keys(calendarTranslations)
