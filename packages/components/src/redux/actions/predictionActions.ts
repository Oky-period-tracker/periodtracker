import { createAction } from '../helpers'
import { PredictionState } from '../../prediction'
import { Moment } from 'moment'

export function setPredictionEngineState(predictionState: PredictionState) {
  return createAction('SET_PREDICTION_ENGINE_STATE', { predictionState })
}

export function smartPredictionRequest({
  cycle_lengths,
  period_lengths,
  age,
  predictionFullState,
  futurePredictionStatus,
}) {
  return createAction('SMART_PREDICTION_REQUEST', {
    cycle_lengths,
    period_lengths,
    age,
    predictionFullState,
    futurePredictionStatus,
  })
}

export function updateActualCurrentStartDate() {
  return createAction('SET_ACTUAL_STARTDATE')
}

export function setSmartPredictionFailure({ error }) {
  return createAction('SMART_PREDICTION_FAILURE', { error })
}

export function adjustPrediction(action) {
  return createAction('ADJUST_PREDICTION', action)
}
export function updateFuturePrediction(isFuturePredictionActive: boolean, currentStartDate: any) {
  return createAction('SET_FUTURE_PREDICTION_STATE_ACTIVE', {
    isFuturePredictionActive,
    currentStartDate,
  })
}
