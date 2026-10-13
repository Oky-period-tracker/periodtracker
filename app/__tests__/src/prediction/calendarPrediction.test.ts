// app/__tests__/src/prediction/calendarPrediction.test.ts
import moment from 'moment'
import { getCalendarInputs, toCalendarDays } from '../../../src/prediction/calendarPrediction'
import { PredictionState } from '../../../src/prediction/PredictionState'

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
