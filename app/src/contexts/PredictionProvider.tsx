// TODO:
// eslint-disable-next-line
// @ts-nocheck
import React from 'react'
import moment, { Moment } from 'moment'
import _ from 'lodash'
import { PredictionState, PredictionEngine, reconcileHistoryWithVerifiedDates } from '../prediction'

import { useDispatch } from 'react-redux'
import * as actions from '../redux/actions'
import { useSelector } from '../redux/useSelector'
import { allCardAnswersSelector } from '../redux/selectors/answerSelectors'

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
  const verifiedDates = useSelector(allCardAnswersSelector)
  const currentUserId = useSelector((state) => state?.auth?.user?.id ?? null)
  const reconciledUserRef = React.useRef<string | null>(null)

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

  // Rebuild missing cycle history from verified period dates.
  // Some users have many verified period days but a sparse history (data loss
  // after migration or sync issues). Run once per logged-in user.
  React.useEffect(() => {
    if (!currentUserId) return
    if (reconciledUserRef.current === currentUserId) return
    if (!predictionState?.currentCycle) return
    if (!verifiedDates || Object.keys(verifiedDates).length === 0) return

    const rebuilt = reconcileHistoryWithVerifiedDates(predictionState, verifiedDates)
    if (rebuilt) {
      reduxDispatch(actions.setPredictionEngineState(rebuilt))
    }
    reconciledUserRef.current = currentUserId
  }, [currentUserId, predictionState, verifiedDates, reduxDispatch])

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

    const parseDate = (d: any) => {
      if (!d) return null
      if (moment.isMoment(d)) return d.clone()
      if (typeof d === 'string') return moment(d)
      if (d._i) return moment(d._i)
      return moment(d)
    }

    // Helper function to add multiple period days
    const addPeriodDays = (startDateInput: any, days: number) => {
      const baseDate = parseDate(startDateInput)
      if (!baseDate || !baseDate.isValid()) return

      for (let i = 0; i < days; i++) {
        periodDates.push({
          date: baseDate.clone().add(i, 'days').format('DD-MM-YYYY'),
          'ML-generated': true,
          'user-verified': null,
        })
      }
    }

    // Ensure history is available and add its dates
    if (predictionEngine?.state?.history?.length) {
      predictionEngine.state.history.forEach((cycle) => {
        if (cycle) {
          addPeriodDays(cycle.cycleStartDate ?? cycle.startDate, cycle.periodLength || 5)
        }
      })
    }

    // Sort history dates in ascending order
    periodDates.sort((a, b) => moment(a.date, 'DD-MM-YYYY').diff(moment(b.date, 'DD-MM-YYYY')))

    // Add current cycle period days
    if (predictionEngine?.state?.currentCycle?.startDate) {
      addPeriodDays(
        predictionEngine.state.currentCycle.startDate,
        predictionEngine.state.currentCycle.periodLength || 5,
      )
    }

    // Predict future period cycles for the next 12 months
    if (predictionEngine?.state?.currentCycle?.startDate) {
      let lastDate = parseDate(predictionEngine.state.currentCycle.startDate)
      if (lastDate && lastDate.isValid()) {
        const cycleLength = predictionEngine.state.smartPrediction?.smaCycleLength || 28
        const periodDays = predictionEngine.state.smartPrediction?.smaPeriodLength || 5

        for (let i = 0; i < 12; i++) {
          lastDate = lastDate.clone().add(cycleLength, 'days')
          addPeriodDays(lastDate.format('YYYY-MM-DD'), periodDays)
        }
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
