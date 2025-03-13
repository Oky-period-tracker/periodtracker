import { renderHook } from '@testing-library/react-hooks'
import { useMonths } from '../../../src/hooks/useMonths'
import { useSelector } from '../../../src/redux/useSelector'

jest.mock('../../../src/redux/useSelector', () => ({
  useSelector: jest.fn(),
}))

jest.mock('../../../src/resources/translations', () => ({
  calendarTranslations: {
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
    },
    fr: {
      monthNames: [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre',
      ],
    },
  },
  defaultLocale: 'en',
}))

describe('useMonths', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns months and monthOptions for the current locale', () => {
    ;(useSelector as jest.Mock).mockReturnValue('fr')
    const { result } = renderHook(() => useMonths())

    expect(result.current.months).toEqual([
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ])
    expect(result.current.monthOptions).toEqual([
      { label: 'Janvier', value: 'Janvier' },
      { label: 'Février', value: 'Février' },
      { label: 'Mars', value: 'Mars' },
      { label: 'Avril', value: 'Avril' },
      { label: 'Mai', value: 'Mai' },
      { label: 'Juin', value: 'Juin' },
      { label: 'Juillet', value: 'Juillet' },
      { label: 'Août', value: 'Août' },
      { label: 'Septembre', value: 'Septembre' },
      { label: 'Octobre', value: 'Octobre' },
      { label: 'Novembre', value: 'Novembre' },
      { label: 'Décembre', value: 'Décembre' },
    ])
  })

  it('falls back to default locale when translation for the current locale is missing', () => {
    ;(useSelector as jest.Mock).mockReturnValue('de') // Mock an unsupported locale
    const { result } = renderHook(() => useMonths())

    expect(result.current.months).toEqual([
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
    ])
    expect(result.current.monthOptions).toEqual([
      { label: 'January', value: 'January' },
      { label: 'February', value: 'February' },
      { label: 'March', value: 'March' },
      { label: 'April', value: 'April' },
      { label: 'May', value: 'May' },
      { label: 'June', value: 'June' },
      { label: 'July', value: 'July' },
      { label: 'August', value: 'August' },
      { label: 'September', value: 'September' },
      { label: 'October', value: 'October' },
      { label: 'November', value: 'November' },
      { label: 'December', value: 'December' },
    ])
  })

  it('handles missing translations gracefully', () => {
    ;(useSelector as jest.Mock).mockReturnValue(null) // No locale selected
    const { result } = renderHook(() => useMonths())

    expect(result.current.months).toEqual([
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
    ])
    expect(result.current.monthOptions).toEqual([
      { label: 'January', value: 'January' },
      { label: 'February', value: 'February' },
      { label: 'March', value: 'March' },
      { label: 'April', value: 'April' },
      { label: 'May', value: 'May' },
      { label: 'June', value: 'June' },
      { label: 'July', value: 'July' },
      { label: 'August', value: 'August' },
      { label: 'September', value: 'September' },
      { label: 'October', value: 'October' },
      { label: 'November', value: 'November' },
      { label: 'December', value: 'December' },
    ])
  })
})
