// app/__tests__/src/prediction/calendarMarks.test.ts
import {
  buildCalendarMarks,
  CalendarMarksInput,
  fromDayIndex,
  groupEpisodes,
  toDayIndex,
} from '../../../src/prediction/calendarMarks'

const base: CalendarMarksInput = {
  confirmedDays: [],
  deniedDays: [],
  averagePeriodLength: 3,
  cycle: null,
  fallbackAnchor: null,
  today: '2026-10-06',
}
const kinds = (input: Partial<CalendarMarksInput>) => buildCalendarMarks({ ...base, ...input }).days

describe('date index helpers', () => {
  it('round-trips and ignores time zones', () => {
    expect(fromDayIndex(toDayIndex('2026-10-31'))).toBe('2026-10-31')
    expect(toDayIndex('2026-11-01') - toDayIndex('2026-10-31')).toBe(1)
    expect(toDayIndex('2027-03-29') - toDayIndex('2027-03-27')).toBe(2) // across DST
  })
})

describe('groupEpisodes', () => {
  it('joins days with at most maxGapDays unmarked days between them', () => {
    expect(groupEpisodes([3, 5], 1)).toEqual([{ start: 3, end: 5 }])
    expect(groupEpisodes([3, 6], 1)).toEqual([
      { start: 3, end: 3 },
      { start: 6, end: 6 },
    ])
    expect(groupEpisodes([6, 3, 4, 4], 1)).toEqual([{ start: 3, end: 6 }])
  })
})

describe('possible period days (brief §6.4)', () => {
  it('base rule: first Yes on 3 Oct paints 4 and 5 Oct as possible', () => {
    const d = kinds({ confirmedDays: ['2026-10-03'] })
    expect(d['2026-10-03']).toEqual(['confirmed'])
    expect(d['2026-10-04']).toEqual(['possiblePeriod'])
    expect(d['2026-10-05']).toEqual(['possiblePeriod'])
    expect(d['2026-10-06']).toBeUndefined()
  })

  it('scenario 1: Yes on 3 and 4 Oct leaves only 5 Oct possible', () => {
    const d = kinds({ confirmedDays: ['2026-10-03', '2026-10-04'] })
    expect(d['2026-10-04']).toEqual(['confirmed'])
    expect(d['2026-10-05']).toEqual(['possiblePeriod'])
  })

  it('scenario 2: Yes on 3 and 5 Oct fills 4 Oct back in', () => {
    const d = kinds({ confirmedDays: ['2026-10-03', '2026-10-05'] })
    expect(d['2026-10-04']).toEqual(['possiblePeriod'])
    expect(d['2026-10-06']).toBeUndefined()
  })

  it('scenario 3: adding 2 Oct keeps 3 Oct confirmed, 4 Oct possible', () => {
    const d = kinds({ confirmedDays: ['2026-10-03', '2026-10-02'] })
    expect(d['2026-10-02']).toEqual(['confirmed'])
    expect(d['2026-10-03']).toEqual(['confirmed'])
    expect(d['2026-10-04']).toEqual(['possiblePeriod'])
    expect(d['2026-10-05']).toBeUndefined()
  })

  it('denied: a No inside the episode is never possible', () => {
    const d = kinds({ confirmedDays: ['2026-10-03'], deniedDays: ['2026-10-04'] })
    expect(d['2026-10-04']).toBeUndefined()
    expect(d['2026-10-05']).toEqual(['possiblePeriod'])
  })

  it('a gap wider than maxGapDays starts a new episode; only the last is filled', () => {
    const d = kinds({ confirmedDays: ['2026-10-03', '2026-10-06'] })
    expect(d['2026-10-04']).toBeUndefined()
    expect(d['2026-10-07']).toEqual(['possiblePeriod'])
    expect(d['2026-10-08']).toEqual(['possiblePeriod'])
  })

  it('falls back to 5 days when she has no average yet', () => {
    const d = kinds({ confirmedDays: ['2026-10-01'], averagePeriodLength: null })
    expect(d['2026-10-05']).toEqual(['possiblePeriod'])
    expect(d['2026-10-06']).toBeUndefined()
  })
})
