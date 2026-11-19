// app/src/prediction/predictionRequest.ts
type Cycle = { cycleLength: number; periodLength: number }

// The v1 engine expects ten entries, oldest first, padded with leading zeros
const REQUEST_LENGTH = 10
const padded = (lengths: number[]) => [
  ...Array(Math.max(0, REQUEST_LENGTH - lengths.length)).fill(0),
  ...lengths,
]

// Lengths sent with a prediction request: her current cycle, then her past cycles (newest first)
export function requestLengths(currentCycle: Cycle, history: Cycle[]) {
  const cycles = [currentCycle, ...history].reverse()
  return {
    cycle_lengths: padded(cycles.map((c) => c.cycleLength)),
    period_lengths: padded(cycles.map((c) => c.periodLength)),
  }
}
