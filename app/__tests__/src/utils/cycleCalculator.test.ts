import moment from 'moment'
import {
  calculateCycles,
  isDateVerified,
  dateExistsInPeriodDates,
} from '../../../src/utils/cycleCalculator'
import { UserMetadata } from '../../../src/types'

describe('calculateCycles', () => {
  it('returns 0 cycles when metadata is null', () => {
    const result = calculateCycles(null)
    expect(result.cyclesNumber).toBe(0)
  })

  it('returns 0 cycles when metadata is undefined', () => {
    const result = calculateCycles(undefined)
    expect(result.cyclesNumber).toBe(0)
  })

  it('returns 0 cycles when periodDates is missing', () => {
    const metadata: UserMetadata = {
      periodDates: undefined as any,
    }
    const result = calculateCycles(metadata)
    expect(result.cyclesNumber).toBe(0)
  })

  it('returns 0 cycles when periodDates is empty', () => {
    const metadata: UserMetadata = {
      periodDates: [],
    }
    const result = calculateCycles(metadata)
    expect(result.cyclesNumber).toBe(0)
  })

  it('returns 0 cycles when no dates are verified', () => {
    const metadata: UserMetadata = {
      periodDates: [
        { date: '01/01/2024', userVerified: false, mlGenerated: false },
        { date: '02/01/2024', userVerified: null, mlGenerated: false },
      ],
    }
    const result = calculateCycles(metadata)
    expect(result.cyclesNumber).toBe(0)
  })

  it('calculates 1 cycle for consecutive verified dates', () => {
    const metadata: UserMetadata = {
      periodDates: [
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
        { date: '02/01/2024', userVerified: true, mlGenerated: false },
        { date: '03/01/2024', userVerified: true, mlGenerated: false },
      ],
    }
    const result = calculateCycles(metadata)
    expect(result.cyclesNumber).toBe(1)
  })

  it('calculates 1 cycle for dates with 2-day gap', () => {
    const metadata: UserMetadata = {
      periodDates: [
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
        { date: '03/01/2024', userVerified: true, mlGenerated: false }, // 2 days gap
      ],
    }
    const result = calculateCycles(metadata)
    expect(result.cyclesNumber).toBe(1)
  })

  it('calculates 2 cycles when gap is more than 2 days', () => {
    const metadata: UserMetadata = {
      periodDates: [
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
        { date: '02/01/2024', userVerified: true, mlGenerated: false },
        { date: '05/01/2024', userVerified: true, mlGenerated: false }, // 3 days gap
        { date: '06/01/2024', userVerified: true, mlGenerated: false },
      ],
    }
    const result = calculateCycles(metadata)
    expect(result.cyclesNumber).toBe(2)
  })

  it('handles dates in DD/MM/YYYY format', () => {
    const metadata: UserMetadata = {
      periodDates: [
        { date: '15/01/2024', userVerified: true, mlGenerated: false },
        { date: '16/01/2024', userVerified: true, mlGenerated: false },
      ],
    }
    const result = calculateCycles(metadata)
    expect(result.cyclesNumber).toBe(1)
  })

  it('handles dates in YYYY-MM-DD format', () => {
    const metadata: UserMetadata = {
      periodDates: [
        { date: '2024-01-15', userVerified: true, mlGenerated: false },
        { date: '2024-01-16', userVerified: true, mlGenerated: false },
      ],
    }
    const result = calculateCycles(metadata)
    expect(result.cyclesNumber).toBe(1)
  })

  it('handles mixed date formats', () => {
    const metadata: UserMetadata = {
      periodDates: [
        { date: '15/01/2024', userVerified: true, mlGenerated: false },
        { date: '2024-01-16', userVerified: true, mlGenerated: false },
      ],
    }
    const result = calculateCycles(metadata)
    expect(result.cyclesNumber).toBe(1)
  })

  it('filters out unverified dates', () => {
    const metadata: UserMetadata = {
      periodDates: [
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
        { date: '02/01/2024', userVerified: false, mlGenerated: false },
        { date: '03/01/2024', userVerified: true, mlGenerated: false },
        { date: '10/01/2024', userVerified: true, mlGenerated: false },
      ],
    }
    const result = calculateCycles(metadata)
    expect(result.cyclesNumber).toBe(2) // 01-03 is one cycle, 10 is another
  })

  it('handles single verified date as 1 cycle', () => {
    const metadata: UserMetadata = {
      periodDates: [
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
      ],
    }
    const result = calculateCycles(metadata)
    expect(result.cyclesNumber).toBe(1)
  })

  it('sorts dates correctly before grouping', () => {
    const metadata: UserMetadata = {
      periodDates: [
        { date: '05/01/2024', userVerified: true, mlGenerated: false },
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
        { date: '03/01/2024', userVerified: true, mlGenerated: false },
      ],
    }
    const result = calculateCycles(metadata)
    expect(result.cyclesNumber).toBe(1) // All should be in one cycle after sorting
  })

  it('ignores invalid date formats', () => {
    const metadata: UserMetadata = {
      periodDates: [
        { date: 'invalid-date', userVerified: true, mlGenerated: false },
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
      ],
    }
    const result = calculateCycles(metadata)
    expect(result.cyclesNumber).toBe(1) // Only valid date counts
  })

  it('calculates 3 cycles correctly', () => {
    const metadata: UserMetadata = {
      periodDates: [
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
        { date: '02/01/2024', userVerified: true, mlGenerated: false },
        { date: '10/01/2024', userVerified: true, mlGenerated: false },
        { date: '11/01/2024', userVerified: true, mlGenerated: false },
        { date: '20/01/2024', userVerified: true, mlGenerated: false },
        { date: '21/01/2024', userVerified: true, mlGenerated: false },
      ],
    }
    const result = calculateCycles(metadata)
    expect(result.cyclesNumber).toBe(3)
  })
})

describe('isDateVerified', () => {
  it('returns false when metadata is null', () => {
    expect(isDateVerified('01/01/2024', null)).toBe(false)
  })

  it('returns false when metadata is undefined', () => {
    expect(isDateVerified('01/01/2024', undefined)).toBe(false)
  })

  it('returns false when periodDates is missing', () => {
    const metadata: UserMetadata = {
      periodDates: undefined as any,
    }
    expect(isDateVerified('01/01/2024', metadata)).toBe(false)
  })

  it('returns true when date is verified', () => {
    const metadata: UserMetadata = {
      periodDates: [
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
      ],
    }
    expect(isDateVerified('01/01/2024', metadata)).toBe(true)
  })

  it('returns false when date is not verified', () => {
    const metadata: UserMetadata = {
      periodDates: [
        { date: '01/01/2024', userVerified: false, mlGenerated: false },
      ],
    }
    expect(isDateVerified('01/01/2024', metadata)).toBe(false)
  })

  it('returns false when date is null verified', () => {
    const metadata: UserMetadata = {
      periodDates: [
        { date: '01/01/2024', userVerified: null, mlGenerated: false },
      ],
    }
    expect(isDateVerified('01/01/2024', metadata)).toBe(false)
  })

  it('returns false when date does not exist', () => {
    const metadata: UserMetadata = {
      periodDates: [
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
      ],
    }
    expect(isDateVerified('02/01/2024', metadata)).toBe(false)
  })
})

describe('dateExistsInPeriodDates', () => {
  it('returns false when metadata is null', () => {
    expect(dateExistsInPeriodDates('01/01/2024', null)).toBe(false)
  })

  it('returns false when metadata is undefined', () => {
    expect(dateExistsInPeriodDates('01/01/2024', undefined)).toBe(false)
  })

  it('returns false when periodDates is missing', () => {
    const metadata: UserMetadata = {
      periodDates: undefined as any,
    }
    expect(dateExistsInPeriodDates('01/01/2024', metadata)).toBe(false)
  })

  it('returns true when date exists regardless of verification status', () => {
    const metadata: UserMetadata = {
      periodDates: [
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
        { date: '02/01/2024', userVerified: false, mlGenerated: false },
        { date: '03/01/2024', userVerified: null, mlGenerated: false },
      ],
    }
    expect(dateExistsInPeriodDates('01/01/2024', metadata)).toBe(true)
    expect(dateExistsInPeriodDates('02/01/2024', metadata)).toBe(true)
    expect(dateExistsInPeriodDates('03/01/2024', metadata)).toBe(true)
  })

  it('returns false when date does not exist', () => {
    const metadata: UserMetadata = {
      periodDates: [
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
      ],
    }
    expect(dateExistsInPeriodDates('02/01/2024', metadata)).toBe(false)
  })
})

