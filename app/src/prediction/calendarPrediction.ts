// app/src/prediction/calendarPrediction.ts
import moment from 'moment'
import { PredictionState } from './PredictionState'
import { CycleRange } from './calendarMarks'

// honey: the app discards the server's bounds today (brief §3.3), so the calendar uses the
// agreed baseline ±3 (direction 2b). Replace with the cached server bounds when the
// algorithm work lands (brief §4.1). Only this file should change then.
export const TEMPORARY_HALF_WIDTH = 3

export function getCalendarInputs(state: PredictionState): {
  cycle: CycleRange | null
  averagePeriodLength: number | null
  fallbackAnchor: string | null
} {
  const mean = state.smartPrediction?.smaCycleLength || state.currentCycle?.cycleLength
  const start = state.currentCycle?.startDate
  return {
    cycle: mean
      ? { mean, lower: mean - TEMPORARY_HALF_WIDTH, upper: mean + TEMPORARY_HALF_WIDTH }
      : null,
    averagePeriodLength: state.smartPrediction?.smaPeriodLength || null,
    fallbackAnchor: start && moment(start).isValid() ? moment(start).format('YYYY-MM-DD') : null,
  }
}
