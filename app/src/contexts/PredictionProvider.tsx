// TODO:
// eslint-disable-next-line
// @ts-nocheck
import React from 'react'
import moment, { Moment } from 'moment'
import _ from 'lodash'
import { PredictionState, PredictionEngine } from '../prediction'

import { useDispatch } from 'react-redux'
import * as actions from '../redux/actions'
import { useSelector } from '../redux/useSelector'

type PredictionDispatch = typeof PredictionEngine.prototype.userInputDispatch

const PredictionEngineContext = React.createContext<PredictionEngine | undefined>(undefined)
const PredictionDispatchContext = React.createContext<PredictionDispatch | undefined>(undefined)
// @ts-expect-error TODO:
const UndoPredictionStateContext = React.createContext<() => void>(undefined)

const defaultState = PredictionState.fromData({
  isActive: true,
  startDate: moment().startOf('day'),
  periodLength: 5,
  cycleLength: 30,
  history: [],
})

// @ts-expect-error TODO:
export function PredictionProvider({ children }) {
  const reduxDispatch = useDispatch()
  const predictionState = useSelector((state) => state.prediction)

  const [predictionSnapshots, setPredictionSnapshots] = React.useState([])

  const predictionEngine = React.useMemo(() => {
    const state = predictionState?.currentCycle
      ? PredictionState.fromJSON(predictionState)
      : defaultState

    return PredictionEngine.fromState(state)
  }, [predictionState])

  const predictionDispatch: PredictionDispatch = React.useCallback(
    (action) => {
      // @ts-expect-error TODO:
      setPredictionSnapshots((snapshots) => snapshots.concat(predictionState))
      predictionEngine.userInputDispatch(action)
      reduxDispatch(actions.adjustPrediction(action))
    },
    [predictionState, reduxDispatch, predictionEngine],
  )

  React.useEffect(() => {
    return predictionEngine.subscribe((nextPredictionState) => {
      reduxDispatch(actions.setPredictionEngineState(nextPredictionState))
    })
  }, [reduxDispatch, predictionEngine])

  const undo = React.useCallback(() => {
    if (predictionSnapshots.length > 0) {
      const lastSnapshot = _.last(predictionSnapshots)
      reduxDispatch(
        // @ts-expect-error TODO:
        actions.setPredictionEngineState(PredictionState.fromJSON(lastSnapshot)),
      )
      setPredictionSnapshots((snapshots) => snapshots.slice(0, -1))
    }
  }, [predictionSnapshots])

  return (
    <PredictionEngineContext.Provider value={predictionEngine}>
      <PredictionDispatchContext.Provider value={predictionDispatch}>
        <UndoPredictionStateContext.Provider value={undo}>
          {children}
        </UndoPredictionStateContext.Provider>
      </PredictionDispatchContext.Provider>
    </PredictionEngineContext.Provider>
  )
}

export function usePredictionDispatch() {
  const context = React.useContext(PredictionDispatchContext)
  if (context === undefined) {
    throw new Error(`usePredictionDispatch must be used within a PredictionProvider`)
  }
  return context
}

export function usePredictionEngine() {
  const context = React.useContext(PredictionEngineContext)
  if (context === undefined) {
    throw new Error(`usePredictionEngine must be used within a PredictionProvider`)
  }
  return context
}

export function useUndoPredictionEngine() {
  const context = React.useContext(UndoPredictionStateContext)
  if (context === undefined) {
    throw new Error(`useUndoPredictionEngine must be used within a PredictionProvider`)
  }
  return context
}

export function useCalculateFullInfoForDateRange(startDate: Moment, endDate: Moment) {
  const predictionEngine = usePredictionEngine()
  // TODO: should memoise?
  // return React.useMemo(() => {
  return predictionEngine.calculateFullInfoForDateRange(startDate, endDate)
  // }, [predictionEngine, startDate, endDate]);
}

export function useCalculateStatusForDateRange(
  startDate: Moment,
  endDate: Moment,
  // TODO:
  // eslint-disable-next-line
  verifiedPeriodsData: any,
  hasFuturePredictionActive: boolean,
) {
  const predictionEngine = usePredictionEngine()

  return React.useMemo(() => {
    return predictionEngine.calculateStatusForDateRange(
      startDate,
      endDate,
      verifiedPeriodsData,
      hasFuturePredictionActive,
    )
  }, [predictionEngine, startDate, endDate, verifiedPeriodsData, hasFuturePredictionActive])
}

export function useCalculatePeriodDates() {
  const predictionEngine = usePredictionEngine()

  return React.useMemo(() => {
    const periodDates: PeriodDate[] = []

    // Helper function to add multiple period days
    const addPeriodDays = (startDate: string, days: number) => {
      for (let i = 0; i < days; i++) {
        periodDates.push({
          date: moment(startDate).add(i, 'days').format('DD-MM-YYYY'),
          'ML-generated': true,
          'user-verified': null,
        })
      }
    }

    // Ensure history is available and add its dates
    if (predictionEngine.state.history?.length) {
      predictionEngine.state.history.forEach((cycle) => {
        addPeriodDays(cycle.cycleStartDate._i, cycle.periodLength)
      })
    }

    // Sort history dates in ascending order
    periodDates.sort((a, b) => moment(a.date, 'DD-MM-YYYY').diff(moment(b.date, 'DD-MM-YYYY')))

    // Add current cycle period days
    if (predictionEngine.state.currentCycle?.startDate) {
      addPeriodDays(
        predictionEngine.state.currentCycle.startDate._i,
        predictionEngine.state.currentCycle.periodLength,
      )
    }

    // Predict future period cycles for the next 12 months
    if (predictionEngine.state.currentCycle?.startDate) {
      let lastDate = moment(predictionEngine.state.currentCycle.startDate._i)
      const cycleLength = predictionEngine.state.smartPrediction.smaCycleLength || 28 // Default cycle length
      const periodDays = predictionEngine.state.smartPrediction.smaPeriodLength || 5 // Default period days

      for (let i = 0; i < 12; i++) {
        lastDate = lastDate.add(cycleLength, 'days') // Predict next cycle
        addPeriodDays(lastDate.format('YYYY-MM-DD'), periodDays)
      }
    }

    // Sort final array to ensure chronological order
    periodDates.sort((a, b) => moment(a.date, 'DD-MM-YYYY').diff(moment(b.date, 'DD-MM-YYYY')))
    return periodDates
  }, [predictionEngine])
}

export function useTodayPrediction() {
  const predictionEngine = usePredictionEngine()

  return React.useMemo(() => {
    const today = moment().startOf('day')
    return predictionEngine.predictDay(today)
  }, [predictionEngine])
}

export function usePredictDay(inputDay: Moment) {
  const predictionEngine = usePredictionEngine()

  return React.useMemo(() => {
    return predictionEngine.predictDay(inputDay)
  }, [predictionEngine, inputDay])
}

export function usePredictionEngineState() {
  const predictionEngine = usePredictionEngine()

  return React.useMemo(() => {
    return predictionEngine.getPredictorState()
  }, [predictionEngine])
}

export function useHistoryPrediction() {
  const predictionEngine = usePredictionEngine()

  return React.useMemo(() => {
    return predictionEngine.getPredictorState().history
  }, [predictionEngine])
}

export function useIsActiveSelector() {
  const predictionEngine = usePredictionEngine()

  return React.useMemo(() => {
    return predictionEngine.getPredictorState().isActive
  }, [predictionEngine])
}

export function useActualCurrentStartDateSelector() {
  const predictionEngine = usePredictionEngine()

  return React.useMemo(() => {
    return predictionEngine.getPredictorState().actualCurrentStartDate
  }, [predictionEngine])
}

export function useIsVerifySelector() {
  const predictionEngine = usePredictionEngine()

  return React.useMemo(() => {
    return predictionEngine.getPredictorState()
  }, [predictionEngine])
}
