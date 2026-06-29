import moment, { Moment } from 'moment'
import { PredictionState, PredictionSerializableState } from './PredictionState'
import { VerifiedDates } from '../redux/reducers/answerReducer'

const MAX_INTRA_PERIOD_GAP_DAYS = 2
const DEFAULT_CYCLE_LENGTH = 28
const MIN_CLUSTERS_FOR_REBUILD = 2

interface PeriodCluster {
  start: Moment
  end: Moment
  length: number
}

export function detectPeriodClusters(verifiedDates: VerifiedDates | undefined): PeriodCluster[] {
  if (!verifiedDates) {
    return []
  }

  const periodDates: Moment[] = []
  for (const [dateKey, data] of Object.entries(verifiedDates)) {
    if (data && data.periodDay === true) {
      const parsed = moment(dateKey, 'YYYYMMDD', true).startOf('day')
      if (parsed.isValid()) {
        periodDates.push(parsed)
      }
    }
  }

  if (periodDates.length === 0) {
    return []
  }

  periodDates.sort((a, b) => a.valueOf() - b.valueOf())

  const clusters: PeriodCluster[] = []
  let clusterStart = periodDates[0]
  let clusterEnd = periodDates[0]

  for (let i = 1; i < periodDates.length; i++) {
    const daysDiff = periodDates[i].diff(periodDates[i - 1], 'days')
    if (daysDiff <= MAX_INTRA_PERIOD_GAP_DAYS) {
      clusterEnd = periodDates[i]
    } else {
      clusters.push({
        start: clusterStart,
        end: clusterEnd,
        length: clusterEnd.diff(clusterStart, 'days') + 1,
      })
      clusterStart = periodDates[i]
      clusterEnd = periodDates[i]
    }
  }
  clusters.push({
    start: clusterStart,
    end: clusterEnd,
    length: clusterEnd.diff(clusterStart, 'days') + 1,
  })

  return clusters
}

export function shouldReconcileHistory(
  currentState: Pick<PredictionSerializableState, 'history'> | null | undefined,
  verifiedDates: VerifiedDates | undefined,
): boolean {
  const clusters = detectPeriodClusters(verifiedDates)
  if (clusters.length < MIN_CLUSTERS_FOR_REBUILD) {
    return false
  }
  const historyCount = currentState && currentState.history ? currentState.history.length : 0
  return clusters.length > historyCount + 1
}

export function buildPredictionFromVerifiedDates(
  verifiedDates: VerifiedDates | undefined,
  existingState?: Partial<
    Pick<
      PredictionSerializableState,
      'isActive' | 'futurePredictionStatus' | 'actualCurrentStartDate'
    >
  >,
): PredictionState | null {
  const clusters = detectPeriodClusters(verifiedDates)
  if (clusters.length < MIN_CLUSTERS_FOR_REBUILD) {
    return null
  }

  const cycleLengths: number[] = []
  for (let i = 0; i < clusters.length - 1; i++) {
    cycleLengths.push(clusters[i + 1].start.diff(clusters[i].start, 'days'))
  }

  const periodLengths = clusters.map((c) => c.length)

  const history = []
  for (let i = 0; i < clusters.length - 1; i++) {
    history.push({
      cycleStartDate: clusters[i].start.clone(),
      cycleEndDate: clusters[i + 1].start.clone().subtract(1, 'days'),
      periodLength: clusters[i].length,
      cycleLength: cycleLengths[i],
    })
  }
  // Engine convention: history ordered newest first
  history.reverse()

  const lastCluster = clusters[clusters.length - 1]
  const avgCycleLength = cycleLengths.length
    ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
    : DEFAULT_CYCLE_LENGTH
  const avgPeriodLength = Math.round(
    periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length,
  )

  const state = PredictionState.fromData({
    isActive: existingState && existingState.isActive !== undefined ? existingState.isActive : true,
    startDate: lastCluster.start.clone(),
    periodLength: lastCluster.length,
    cycleLength: avgCycleLength,
    smaPeriodLength: avgPeriodLength,
    smaCycleLength: avgCycleLength,
    history,
    futurePredictionStatus:
      existingState && existingState.futurePredictionStatus !== undefined
        ? existingState.futurePredictionStatus
        : true,
    actualCurrentStartDate:
      existingState && existingState.actualCurrentStartDate !== undefined
        ? existingState.actualCurrentStartDate
        : null,
  })

  // Match the engine's circular buffer size of 6
  const tailPeriods = periodLengths.slice(-6)
  const tailCycles = cycleLengths.slice(-6)
  for (const v of tailPeriods) {
    state.smartPrediction.circularPeriodLength.push(v)
  }
  for (const v of tailCycles) {
    state.smartPrediction.circularCycleLength.push(v)
  }

  return state
}

export function reconcileHistoryWithVerifiedDates(
  currentState: PredictionSerializableState | null | undefined,
  verifiedDates: VerifiedDates | undefined,
): PredictionState | null {
  if (!shouldReconcileHistory(currentState, verifiedDates)) {
    return null
  }
  return buildPredictionFromVerifiedDates(verifiedDates, currentState || undefined)
}
