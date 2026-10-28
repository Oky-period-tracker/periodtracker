// app/__tests__/src/prediction/calendarPrediction.test.ts
import moment from 'moment'
import { getCalendarInputs, toCalendarDays } from '../../../src/prediction/calendarPrediction'
import { PredictionState } from '../../../src/prediction/PredictionState'
import { buildCalendarMarks } from '../../../src/prediction/calendarMarks'

const state = (s: object) => s as unknown as PredictionState

describe('getCalendarInputs', () => {
  it('uses the six-cycle averages with a temporary ±3 range', () => {
    expect(
      getCalendarInputs(
        state({
          smartPrediction: { smaCycleLength: 30, smaPeriodLength: 4 },
          currentCycle: { startDate: moment('2026-10-01'), cycleLength: 28 },
        }),
      ),
    ).toEqual({
      cycle: { mean: 30, lower: 27, upper: 33 },
      averagePeriodLength: 4,
      fallbackAnchor: '2026-10-01',
    })
  })

  it('falls back to the current cycle length', () => {
    const r = getCalendarInputs(
      state({ smartPrediction: {}, currentCycle: { startDate: moment('2026-10-01'), cycleLength: 28 } }),
    )
    expect(r.cycle).toEqual({ mean: 28, lower: 25, upper: 31 })
    expect(r.averagePeriodLength).toBeNull()
  })

  describe('no period logged yet (isActive false)', () => {
    const inactive = state({
      isActive: false,
      smartPrediction: { smaCycleLength: 28, smaPeriodLength: 5 },
      currentCycle: { startDate: moment('2026-11-03'), cycleLength: 28 },
    })
    const marks = (confirmedDays: string[]) =>
      buildCalendarMarks({
        confirmedDays,
        deniedDays: [],
        today: '2026-11-03',
        ...getCalendarInputs(inactive),
      })

    it('does not use the start the engine made up', () => {
      expect(getCalendarInputs(inactive).fallbackAnchor).toBeNull()
    })

    it('no confirmed days: no marks, so the calendar shows the message', () => {
      const m = marks([])
      expect(m.days).toEqual({})
      expect(m.status.kind).toBe('none')
    })

    it('confirmed days: predicts from them', () => {
      const m = marks(['2026-11-01'])
      expect(m.status.kind).toBe('shown')
      expect(m.days['2026-11-29']).toContain('likelyStart')
    })
  })

  it('empty state: returns nulls instead of throwing', () => {
    expect(getCalendarInputs(state({}))).toEqual({
      cycle: null,
      averagePeriodLength: null,
      fallbackAnchor: null,
    })
  })
})

it('splits card answers into confirmed and denied days, ignoring unanswered ones', () => {
  expect(
    toCalendarDays({
      '20261003': { periodDay: true },
      '20261004': { periodDay: false },
      '20261005': { periodDay: null },
      '20261006': {},
    }),
  ).toEqual({ confirmedDays: ['2026-10-03'], deniedDays: ['2026-10-04'] })
})

describe('getCalendarInputs guards (final review)', () => {
  it('no saved prediction state: nothing to predict from', () => {
    expect(getCalendarInputs(null)).toEqual({ cycle: null, averagePeriodLength: null, fallbackAnchor: null })
  })

  it('predictions switched off in Settings: no range, period length kept', () => {
    const r = getCalendarInputs(
      state({
        smartPrediction: { smaCycleLength: 30, smaPeriodLength: 4 },
        currentCycle: { startDate: moment('2026-10-01'), cycleLength: 28 },
      }),
      false,
    )
    expect(r).toEqual({ cycle: null, averagePeriodLength: 4, fallbackAnchor: null })
  })
})

describe('getCalendarInputs with a v2 server answer (brief §6.2, §6.6)', () => {
  const withServer = (serverRange: object, smaCycleLength = 30) =>
    state({
      smartPrediction: { smaCycleLength, smaPeriodLength: 4, serverRange },
      currentCycle: { startDate: moment('2026-10-01'), cycleLength: 28 },
    })

  it('uses the server displayed range', () => {
    const r = getCalendarInputs(
      withServer({ mean: 30.2, lower: 28.5, upper: 31.9, useBaseline: false, samplesTrained: 5 }),
    )
    expect(r.cycle).toEqual({ mean: 30.2, lower: 28.5, upper: 31.9 })
    expect(r.irregular).toBeUndefined()
  })

  it('ignores a stale answer whose length no longer matches', () => {
    const r = getCalendarInputs(
      withServer({ mean: 26, lower: 24, upper: 28, useBaseline: false, samplesTrained: 5 }),
    )
    expect(r.cycle).toEqual({ mean: 30, lower: 27, upper: 33 })
  })


  it('fewer than 3 trained cycles: the generic range is shown', () => {
    const r = getCalendarInputs(
      withServer({ mean: 28, lower: 25, upper: 31, useBaseline: true, samplesTrained: 2 }, 28),
    )
    expect(r.cycle).toEqual({ mean: 28, lower: 25, upper: 31 })
  })
})
