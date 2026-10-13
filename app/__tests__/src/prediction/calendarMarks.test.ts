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

const annexB: Partial<CalendarMarksInput> = {
  confirmedDays: ['2026-10-01', '2026-10-02', '2026-10-03'],
  averagePeriodLength: 4,
}

describe('prediction (direction paper Annex B)', () => {
  it('none: no anchor and no cycle shows nothing predicted', () => {
    const m = buildCalendarMarks({ ...base })
    expect(m.status).toEqual({ kind: 'none' })
    expect(m.days).toEqual({})
  })

  it('none: a cycle length of 0 never loops', () => {
    const m = buildCalendarMarks({ ...base, ...annexB, cycle: { mean: 0, lower: 0, upper: 0 } })
    expect(m.status).toEqual({ kind: 'none' })
  })

  it('example 1, low variability: ±1', () => {
    const m = buildCalendarMarks({ ...base, ...annexB, cycle: { mean: 30, lower: 29, upper: 31 } })
    expect(m.status).toEqual({
      kind: 'shown',
      likelyStart: '2026-10-31',
      rangeStart: '2026-10-30',
      rangeEnd: '2026-11-01',
      ovulationStart: '2026-10-16',
      ovulationEnd: '2026-10-19',
    })
    expect(m.days['2026-10-04']).toEqual(['possiblePeriod'])
    expect(m.days['2026-10-31']).toEqual(['likelyStart'])
    expect(m.days['2026-10-30']).toEqual(['possiblePeriod'])
    expect(m.days['2026-11-01']).toEqual(['possiblePeriod'])
    expect(m.days['2026-10-16']).toEqual(['ovulation'])
    expect(m.days['2026-10-19']).toEqual(['ovulation'])
    expect(m.days['2026-10-20']).toBeUndefined()
  })

  it('example 2, medium variability: ±3 is shown', () => {
    const m = buildCalendarMarks({ ...base, ...annexB, cycle: { mean: 30, lower: 27, upper: 33 } })
    expect(m.status).toMatchObject({
      kind: 'shown',
      rangeStart: '2026-10-28',
      rangeEnd: '2026-11-03',
      ovulationStart: '2026-10-14',
      ovulationEnd: '2026-10-21',
    })
  })

  it('example 3, high variability: ±7 is paused, only her period days remain', () => {
    const m = buildCalendarMarks({ ...base, ...annexB, cycle: { mean: 30, lower: 23, upper: 37 } })
    expect(m.status).toEqual({ kind: 'paused' })
    const all = Object.values(m.days).flat()
    expect(all).not.toContain('likelyStart')
    expect(all).not.toContain('ovulation')
    expect(m.days['2026-10-04']).toEqual(['possiblePeriod'])
  })

  it('fractional: a 28.4-day mean at the cap draws 7 days, not 8', () => {
    const m = buildCalendarMarks({
      ...base,
      ...annexB,
      cycle: { mean: 28.4, lower: 25.4, upper: 31.4 },
    })
    expect(m.status.kind).toBe('shown')
    if (m.status.kind !== 'shown') return
    expect(toDayIndex(m.status.rangeEnd) - toDayIndex(m.status.rangeStart) + 1).toBe(7)
  })

  it('confirmed inside range: a confirmed day in the ovulation window stays only confirmed', () => {
    // 1 and 3 Oct are one episode; ovulation window is 3–10 Oct
    const m = buildCalendarMarks({
      ...base,
      confirmedDays: ['2026-10-01', '2026-10-03'],
      averagePeriodLength: 5,
      cycle: { mean: 19, lower: 16, upper: 22 },
    })
    expect(m.days['2026-10-03']).toEqual(['confirmed'])
    expect(m.days['2026-10-02']).toEqual(expect.arrayContaining(['possiblePeriod']))
  })

  it('overlap: a possible period day can also be an ovulation day', () => {
    const m = buildCalendarMarks({
      ...base,
      confirmedDays: ['2026-10-01'],
      averagePeriodLength: 5,
      cycle: { mean: 19, lower: 16, upper: 22 },
    })
    expect(m.days['2026-10-04']).toEqual(expect.arrayContaining(['possiblePeriod', 'ovulation']))
  })

  it('later cycles repeat the same range; nothing is drawn past the horizon', () => {
    const m = buildCalendarMarks({
      ...base,
      ...annexB,
      cycle: { mean: 30, lower: 29, upper: 31 },
      config: { capDays: 3, lutealDays: 14, ovulationExtraDay: true, maxGapDays: 1, defaultPeriodLength: 5, horizonDays: 60 },
    })
    expect(m.days['2026-11-30']).toEqual(['likelyStart'])
    expect(Object.keys(m.days).every((k) => k <= '2026-12-05')).toBe(true) // today + 60
  })

  it('uses fallbackAnchor when she has confirmed nothing', () => {
    const m = buildCalendarMarks({
      ...base,
      fallbackAnchor: '2026-10-01',
      cycle: { mean: 30, lower: 29, upper: 31 },
    })
    expect(m.status).toMatchObject({ kind: 'shown', likelyStart: '2026-10-31' })
  })
})
