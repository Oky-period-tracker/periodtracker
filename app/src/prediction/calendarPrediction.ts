// app/src/prediction/calendarPrediction.ts
import moment from 'moment'
import { PredictionState } from './PredictionState'
import { CycleRange } from './calendarMarks'
import { localRange } from './localRange'
import { cachedAnswerUsable } from './serverCache'

export const MIN_TRAINED_CYCLES = 3

// state is null when nothing was ever saved (the provider then runs on a made-up default);
// predictionsEnabled is the Settings switch for future predictions.
export function getCalendarInputs(
  state: PredictionState | null,
  predictionsEnabled = true,
): {
  cycle: CycleRange | null
  averagePeriodLength: number | null
  fallbackAnchor: string | null
  irregular?: boolean
} {
  if (!state) return { cycle: null, averagePeriodLength: null, fallbackAnchor: null }
  const averagePeriodLength = state.smartPrediction?.smaPeriodLength || null
  if (!predictionsEnabled) return { cycle: null, averagePeriodLength, fallbackAnchor: null }
  const mean = state.smartPrediction?.smaCycleLength || state.currentCycle?.cycleLength
  // isActive false (no period logged yet): the saved start is a default or today, never hers
  const start = state.isActive === false ? null : state.currentCycle?.startDate
  const fallbackAnchor =
    start && moment(start).isValid() ? moment(start).format('YYYY-MM-DD') : null
  // The server's displayed range, only while it still matches the cycle length in use
  const server = state.smartPrediction?.serverRange
  const usable = server && (!server.basedOn || cachedAnswerUsable(server, state.history))
  if (mean && usable && Math.round(server.mean) === Math.round(mean)) {
    // §6.6: trained but too irregular for a personal prediction -> the message, not 28 ± 3
    if (server.useBaseline && server.samplesTrained >= MIN_TRAINED_CYCLES) {
      return { cycle: null, averagePeriodLength, fallbackAnchor, irregular: true }
    }
    return {
      cycle: { mean: server.mean, lower: server.lower, upper: server.upper },
      averagePeriodLength,
      fallbackAnchor,
    }
  }
  // No usable server answer (v1 engine, offline, or a stale answer): the phone calculates
  if (!mean) return { cycle: null, averagePeriodLength, fallbackAnchor }
  const intervals = state.smartPrediction?.circularCycleLength?.toarray?.() ?? []
  const local = localRange(mean, intervals)
  return local.irregular
    ? { cycle: null, averagePeriodLength, fallbackAnchor, irregular: true }
    : { cycle: local.cycle, averagePeriodLength, fallbackAnchor }
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
