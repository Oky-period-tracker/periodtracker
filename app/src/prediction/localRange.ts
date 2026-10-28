// app/src/prediction/localRange.ts
import { CycleRange } from './calendarMarks'

// The phone's own possible start range, used when there is no usable server answer.
// Same levels as the server, so both engines draw comparable ranges.
// honey: Annex A weights are not agreed yet, so every interval counts fully for now.
export const LOCAL_RANGE = {
  baselineSd: 3, // generic spread: 28 ± 3
  baselineWeight: 3, // the baseline counts as about three cycles
  displayZ: 1.0, // ~68% displayed (90% is kept internally on the server)
  sdFloor: 1, // never imply certainty from a few identical intervals
  displayCapDays: 3, // wider than this: the message instead of a range
  minTrainedCycles: 3, // below this the generic range is shown, as on the server
}

export function localRange(
  mean: number,
  intervals: number[],
): { cycle: CycleRange; irregular?: undefined } | { cycle: null; irregular: true } {
  const n = intervals.length
  // Her own spread needs at least two intervals; until then it is the baseline's
  const ownWeight = n >= 2 ? n : 0
  const ownMean = n ? intervals.reduce((a, b) => a + b, 0) / n : 0
  const ownVariance = n >= 2 ? intervals.reduce((a, b) => a + (b - ownMean) ** 2, 0) / (n - 1) : 0
  const { baselineSd, baselineWeight, displayZ, sdFloor, displayCapDays } = LOCAL_RANGE
  const variance =
    (ownWeight * ownVariance + baselineWeight * baselineSd ** 2) / (ownWeight + baselineWeight)
  const halfWidth = displayZ * Math.max(Math.sqrt(variance), sdFloor)

  if (halfWidth > displayCapDays && n >= LOCAL_RANGE.minTrainedCycles) {
    return { cycle: null, irregular: true }
  }
  const half = Math.min(halfWidth, displayCapDays)
  return { cycle: { mean, lower: mean - half, upper: mean + half } }
}
