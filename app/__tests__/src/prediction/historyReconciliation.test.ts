import moment from 'moment'
import {
  detectPeriodClusters,
  shouldReconcileHistory,
  buildPredictionFromVerifiedDates,
  reconcileHistoryWithVerifiedDates,
} from '../../../src/prediction/historyReconciliation'

type VerifiedDates = Record<string, { periodDay: boolean }>

function makePeriods(options: {
  firstStart: string
  cycles: number
  cycleLength: number
  periodLength: number
}): VerifiedDates {
  const { firstStart, cycles, cycleLength, periodLength } = options
  const dates: VerifiedDates = {}
  const start = moment(firstStart, 'YYYYMMDD')
  for (let c = 0; c < cycles; c++) {
    const cycleStart = start.clone().add(c * cycleLength, 'days')
    for (let d = 0; d < periodLength; d++) {
      dates[cycleStart.clone().add(d, 'days').format('YYYYMMDD')] = { periodDay: true }
    }
  }
  return dates
}

describe('detectPeriodClusters', () => {
  it('returns nothing for empty input', () => {
    expect(detectPeriodClusters(undefined)).toEqual([])
    expect(detectPeriodClusters({})).toEqual([])
  })

  it('ignores periodDay false entries', () => {
    expect(detectPeriodClusters({ '20250101': { periodDay: false } })).toEqual([])
  })

  it('merges a 1 day intra-period gap into one cluster', () => {
    const clusters = detectPeriodClusters({
      '20250101': { periodDay: true },
      // 20250102 missing
      '20250103': { periodDay: true },
    })
    expect(clusters).toHaveLength(1)
    expect(clusters[0].length).toBe(3)
  })

  it('splits clusters when the gap exceeds the threshold', () => {
    const verified = makePeriods({
      firstStart: '20250101',
      cycles: 3,
      cycleLength: 28,
      periodLength: 4,
    })
    const clusters = detectPeriodClusters(verified)
    expect(clusters).toHaveLength(3)
    expect(clusters.every((c) => c.length === 4)).toBe(true)
  })
})

describe('shouldReconcileHistory and reconcileHistoryWithVerifiedDates', () => {
  it('does nothing when history already matches the verified dates', () => {
    const verified = makePeriods({
      firstStart: '20260101',
      cycles: 3,
      cycleLength: 28,
      periodLength: 4,
    })
    const matchingState = {
      isActive: true,
      currentCycle: {
        startDate: moment('20260225', 'YYYYMMDD').toISOString(),
        periodLength: 4,
        cycleLength: 28,
      },
      smartPrediction: {
        circularPeriodLength: [],
        circularCycleLength: [],
        smaPeriodLength: 4,
        smaCycleLength: 28,
      },
      futurePredictionStatus: true,
      history: [{}, {}],
      actualCurrentStartDate: null,
    }
    expect(shouldReconcileHistory(matchingState, verified)).toBe(false)
    expect(reconcileHistoryWithVerifiedDates(matchingState, verified)).toBeNull()
  })

  it('rebuilds the missing cycles when history is sparse', () => {
    const verified = makePeriods({
      firstStart: '20250101',
      cycles: 12,
      cycleLength: 30,
      periodLength: 5,
    })
    const sparseState = {
      isActive: true,
      currentCycle: {
        startDate: moment('20251127', 'YYYYMMDD').toISOString(),
        periodLength: 5,
        cycleLength: 30,
      },
      smartPrediction: {
        circularPeriodLength: [],
        circularCycleLength: [],
        smaPeriodLength: 5,
        smaCycleLength: 30,
      },
      futurePredictionStatus: true,
      history: [],
      actualCurrentStartDate: null,
    }
    expect(shouldReconcileHistory(sparseState, verified)).toBe(true)

    const rebuilt = reconcileHistoryWithVerifiedDates(sparseState, verified)
    expect(rebuilt).not.toBeNull()
    if (!rebuilt) return
    expect(rebuilt.history).toHaveLength(11)
    expect(rebuilt.currentCycle.startDate.format('YYYYMMDD')).toBe('20251127')
    expect(rebuilt.currentCycle.periodLength).toBe(5)
    expect(rebuilt.history[0].cycleStartDate.format('YYYYMMDD')).toBe('20251028')
    expect(rebuilt.history[rebuilt.history.length - 1].cycleStartDate.format('YYYYMMDD')).toBe(
      '20250101',
    )
  })

  it('does not rebuild with fewer than two clusters', () => {
    const verified = { '20250101': { periodDay: true }, '20250102': { periodDay: true } }
    expect(buildPredictionFromVerifiedDates(verified)).toBeNull()
  })

  it('preserves engine flags from the existing state', () => {
    const verified = makePeriods({
      firstStart: '20260101',
      cycles: 3,
      cycleLength: 28,
      periodLength: 3,
    })
    const rebuilt = buildPredictionFromVerifiedDates(verified, {
      isActive: true,
      futurePredictionStatus: false,
      actualCurrentStartDate: { foo: 'bar' },
    })
    expect(rebuilt).not.toBeNull()
    if (!rebuilt) return
    expect(rebuilt.futurePredictionStatus).toBe(false)
    expect(rebuilt.actualCurrentStartDate).toEqual({ foo: 'bar' })
  })
})
