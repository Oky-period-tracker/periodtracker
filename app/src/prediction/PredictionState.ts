// TODO:
//@ts-nocheck
import moment, { Moment } from 'moment'
import { AppState } from '../redux/reducers/appReducer'
import CircularBuffer from 'circular-buffer'

interface CurrentCycle {
  startDate: Moment
  periodLength: number
  cycleLength: number
}
// fpr  user verified period dtaes
interface UserVerified {
  periodDate: Moment
  mlGenerated: boolean
  userVerified: boolean | null
}

interface SmartPrediction {
  circularPeriodLength: any // CircularBuffer number[] array of number of days
  circularCycleLength: any // CircularBuffer number[] array of number of days
  smaPeriodLength: number
  smaCycleLength: number
}

type History = Array<{
  cycleStartDate: Moment
  cycleEndDate: Moment
  periodLength: number
  cycleLength: number
}>

export class PredictionState {
  public isActive: boolean
  public currentCycle: CurrentCycle
  public smartPrediction: SmartPrediction
  public history: History
  public futurePredictionStatus: boolean
  public actualCurrentStartDate: any
 // ----- for verified dates
 public userVerifiedDates: UserVerified[]
  private constructor() {}

  public static fromData({
    startDate = moment(),
    periodLength = 5,
    isActive = true,
    cycleLength = 28,
    smaPeriodLength = 5,
    smaCycleLength = 28,
    history = [],
    futurePredictionStatus = true,
    actualCurrentStartDate = null,
  }: {
    startDate?: Moment
    isActive?: boolean
    periodLength?: number
    cycleLength?: number
    smaPeriodLength?: number
    smaCycleLength?: number
    history?: History
    futurePredictionStatus?: boolean
    actualCurrentStartDate?: any
  }) {
    const state = new PredictionState()
    state.currentCycle = {
      startDate,
      periodLength,
      cycleLength,
    }
    state.smartPrediction = {
      circularPeriodLength: new CircularBuffer(6),
      circularCycleLength: new CircularBuffer(6),
      smaPeriodLength,
      smaCycleLength,
    }

    state.isActive = isActive
    state.history = history
    state.futurePredictionStatus = futurePredictionStatus
    state.actualCurrentStartDate = actualCurrentStartDate
    return state
  }

  public static fromJSON({
    currentCycle,
    smartPrediction,
    history,
    isActive,
    futurePredictionStatus,
    actualCurrentStartDate,
  }: PredictionSerializableState) {
    const { startDate, periodLength, cycleLength } = currentCycle
    const { smaPeriodLength, smaCycleLength } = smartPrediction
    const state = PredictionState.fromData({
      startDate: moment(startDate),
      isActive,
      periodLength,
      cycleLength,
      smaPeriodLength,
      smaCycleLength,
      history: (history || []).map((entry) => ({
        cycleStartDate: moment(entry.cycleStartDate),
        cycleEndDate: moment(entry.cycleEndDate),
        periodLength: entry.periodLength,
        cycleLength: entry.cycleLength,
      })),
      futurePredictionStatus,
      actualCurrentStartDate,
    })

    for (const circularBufferKey in ['circularPeriodLength', 'circularCycleLength']) {
      if (!(circularBufferKey in state.smartPrediction)) {
        continue
      }

      const circularBuffer = state.smartPrediction[circularBufferKey]
      const serializedState = smartPrediction[circularBufferKey] || []
      serializedState.forEach((value) => {
        circularBuffer.push(value)
      })
    }

    return state
  }

  public toJSON() {
    const {
      currentCycle,
      smartPrediction,
      history,
      isActive,
      futurePredictionStatus,
      actualCurrentStartDate,
    } = this

    return {
      isActive,
      currentCycle: {
        ...currentCycle,
        startDate: currentCycle.startDate.toISOString(),
      },
      smartPrediction: {
        ...smartPrediction,
        circularPeriodLength: smartPrediction.circularPeriodLength.toarray(),
        circularCycleLength: smartPrediction.circularCycleLength.toarray(),
      },
      futurePredictionStatus,
      history: history.map((entry) => ({
        ...entry,
        cycleStartDate: entry.cycleStartDate.toISOString(),
        cycleEndDate: entry.cycleEndDate.toISOString(),
      })),
      actualCurrentStartDate,
    }
  }
}

export type PredictionSerializableState = ReturnType<typeof PredictionState.prototype.toJSON>
