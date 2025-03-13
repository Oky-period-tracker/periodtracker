import moment from 'moment'
import {
  asUTC,
  asLocal,
  toShortISO,
  calculateAge,
  toAge,
  isFutureDate,
} from '../../../src/services/dateUtils'

describe('asUTC', () => {
  it('converts a valid local moment to UTC', () => {
    const localTime = moment('2025-01-20T12:00:00')
    const utcTime = asUTC(localTime)
    expect(utcTime.isUTC()).toBe(true)
    expect(utcTime.format()).toBe(localTime.clone().utc().format())
  })

  it('returns the input if already in UTC', () => {
    const utcTime = moment('2025-01-20T12:00:00Z')
    expect(asUTC(utcTime).toISOString()).toEqual(utcTime.toISOString())
  })

  it('returns the input if it is invalid', () => {
    const invalidTime = moment.invalid()
    expect(asUTC(invalidTime)).toBe(invalidTime)
  })
})

describe('asLocal', () => {
  it('converts a valid UTC moment to local time', () => {
    const utcTime = moment('2025-01-20T12:00:00Z')
    const localTime = asLocal(utcTime)
    expect(localTime.isLocal()).toBe(true)
    expect(localTime.format()).toBe(utcTime.clone().local().format())
  })

  it('returns the input if already in local time', () => {
    const localTime = moment('2025-01-20T12:00:00')
    expect(asLocal(localTime)).toBe(localTime)
  })

  it('returns the input if it is invalid', () => {
    const invalidTime = moment.invalid()
    expect(asLocal(invalidTime)).toBe(invalidTime)
  })
})

describe('toShortISO', () => {
  it('formats a moment object as YYYYMMDD', () => {
    const time = moment('2025-01-20T12:00:00')
    expect(toShortISO(time)).toBe('20250120')
  })
})

describe('calculateAge', () => {
  it('calculates the age in years and months from a given birthday', () => {
    const birthday = moment().subtract(25, 'years').subtract(3, 'months')
    const { years, months } = calculateAge(birthday)
    expect(years).toBe(25)
    expect(months).toBe(3)
  })

  it('handles a birthday on the current date correctly', () => {
    const birthday = moment()
    const { years, months } = calculateAge(birthday)
    expect(years).toBe(0)
    expect(months).toBe(0)
  })
})

describe('toAge', () => {
  it('calculates the age in years from a given birthday', () => {
    const birthday = moment().subtract(30, 'years')
    expect(toAge(birthday)).toBe(30)
  })

  it('returns 0 for a birthday on the current date', () => {
    const birthday = moment()
    expect(toAge(birthday)).toBe(0)
  })
})

describe('isFutureDate', () => {
  it('returns true for a future date', () => {
    const futureDate = moment().add(1, 'day')
    expect(isFutureDate(futureDate)).toBe(true)
  })

  it('returns false for a past date', () => {
    const pastDate = moment().subtract(1, 'day')
    expect(isFutureDate(pastDate)).toBe(false)
  })

  it('returns false for the current date', () => {
    const currentDate = moment()
    expect(isFutureDate(currentDate)).toBe(false)
  })
})
