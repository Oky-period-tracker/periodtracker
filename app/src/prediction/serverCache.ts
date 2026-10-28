// app/src/prediction/serverCache.ts
import moment, { MomentInput } from 'moment'
import type { ServerRange } from '../services/HttpClient'

// A server answer is too old after this many completed cycles without a fresh one
export const STALE_AFTER_CYCLES = 2

type HistoryEntry = { cycleStartDate: MomentInput; cycleLength: number }

// The cycles an answer was based on, newest first
export const cycleEntries = (history: HistoryEntry[] = []) =>
  history.map((h) => `${moment(h.cycleStartDate).format('YYYY-MM-DD')}:${h.cycleLength}`)

// The saved answer can still be used (re-anchored to her latest start) when her history only
// grew by fewer than STALE_AFTER_CYCLES new cycles. An edit to any cycle it was based on
// invalidates it at once.
export function cachedAnswerUsable(range: ServerRange | undefined, history: HistoryEntry[] = []) {
  if (!range?.basedOn) return false
  const added = history.length - range.basedOn.length
  if (added < 0 || added >= STALE_AFTER_CYCLES) return false
  return cycleEntries(history.slice(added)).join() === range.basedOn.join()
}
