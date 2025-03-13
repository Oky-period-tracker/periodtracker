import { renderHook } from '@testing-library/react-hooks'
import { useFormatDate } from '../../../src/hooks/useFormatDate'
import moment from 'moment'
import { useSelector } from '../../../src/redux/useSelector'

jest.mock('../../../src/redux/useSelector', () => ({
  useSelector: jest.fn(),
}))

jest.mock('../../../src/resources/translations', () => ({
  calendarTranslations: {
    en: {
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    fr: {
      monthNamesShort: ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
    },
  },
}))

describe('useFormatDate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('formats a date into "DD\\nMMM" format for day and month', () => {
    (useSelector as jest.Mock).mockReturnValue('en')
    const { result } = renderHook(() => useFormatDate())
    const { formatMomentDayMonth } = result.current

    const date = moment('2025-01-20')
    expect(formatMomentDayMonth(date)).toBe('20\nJan')
  })

  it('formats a date into "MMM YYYY" format for month and year', () => {
    (useSelector as jest.Mock).mockReturnValue('en')
    const { result } = renderHook(() => useFormatDate())
    const { formatMonthYear } = result.current

    const date = '2025-01-20'
    expect(formatMonthYear(date)).toBe('Jan 2025')
  })

  it('formats a date into "DD MMM YYYY" format for day, month, and year', () => {
    (useSelector as jest.Mock).mockReturnValue('en')
    const { result } = renderHook(() => useFormatDate())
    const { formatDayMonthYear } = result.current

    const date = moment('2025-01-20')
    expect(formatDayMonthYear(date)).toBe('20 Jan 2025')
  })

  it('handles French locale translations', () => {
    (useSelector as jest.Mock).mockReturnValue('fr')
    const { result } = renderHook(() => useFormatDate())
    const { formatMomentDayMonth, formatMonthYear, formatDayMonthYear } = result.current

    const date = moment('2025-01-20')
    expect(formatMomentDayMonth(date)).toBe('20\nJanv')
    expect(formatMonthYear('2025-01-20')).toBe('Janv 2025')
    expect(formatDayMonthYear(date)).toBe('20 Janv 2025')
  })

  it('returns empty string for undefined or null dates', () => {
    (useSelector as jest.Mock).mockReturnValue('en')
    const { result } = renderHook(() => useFormatDate())
    const { formatMomentDayMonth, formatMonthYear, formatDayMonthYear } = result.current

    expect(formatMomentDayMonth(undefined)).toBe('')
    expect(formatMonthYear(undefined)).toBe('')
    expect(formatDayMonthYear(undefined)).toBe('')
  })
})
