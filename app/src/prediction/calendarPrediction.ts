// app/src/prediction/calendarPrediction.ts
import moment from 'moment'
import { PredictionState } from './PredictionState'
import { CycleRange } from './calendarMarks'

// honey: the app discards the server's bounds today (brief §3.3), so the calendar uses the
// agreed baseline ±3 (direction 2b). Replace with the cached server bounds when the
// algorithm work lands (brief §4.1). Only this file should change then.
export const TEMPORARY_HALF_WIDTH = 3

// state is null when nothing was ever saved (the provider then runs on a made-up default);
// predictionsEnabled is the Settings switch for future predictions.
export function getCalendarInputs(
  state: PredictionState | null,
  predictionsEnabled = true,
): {
  cycle: CycleRange | null
  averagePeriodLength: number | null
  fallbackAnchor: string | null
} {
  if (!state) return { cycle: null, averagePeriodLength: null, fallbackAnchor: null }
  const averagePeriodLength = state.smartPrediction?.smaPeriodLength || null
  if (!predictionsEnabled) return { cycle: null, averagePeriodLength, fallbackAnchor: null }
  const mean = state.smartPrediction?.smaCycleLength || state.currentCycle?.cycleLength
  // isActive false (no period logged yet): the saved start is a default or today, never hers
  const start = state.isActive === false ? null : state.currentCycle?.startDate
  return {
    cycle: mean
      ? { mean, lower: mean - TEMPORARY_HALF_WIDTH, upper: mean + TEMPORARY_HALF_WIDTH }
      : null,
    averagePeriodLength,
    fallbackAnchor: start && moment(start).isValid() ? moment(start).format('YYYY-MM-DD') : null,
  }
}

const isoFromShort = (k: string) => `${k.slice(0, 4)}-${k.slice(4, 6)}-${k.slice(6, 8)}`

// Card answers are keyed 'YYYYMMDD'; Yes = confirmed, No = denied, unanswered ignored.
export function toCalendarDays(answers: Record<string, { periodDay?: boolean | null }>) {
  const entries = Object.entries(answers)
  return {
    confirmedDays: entries.filter(([, a]) => a?.periodDay === true).map(([k]) => isoFromShort(k)),
    deniedDays: entries.filter(([, a]) => a?.periodDay === false).map(([k]) => isoFromShort(k)),
  }
}
