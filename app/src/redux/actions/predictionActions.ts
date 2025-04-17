import { createAction } from '../helpers'
import { PredictionState } from '../../prediction'

export function setPredictionEngineState(predictionState: PredictionState) {
  return createAction('SET_PREDICTION_ENGINE_STATE', { predictionState })
}

export function smartPredictionRequest({
  // @ts-expect-error TODO:
  cycle_lengths,
  // @ts-expect-error TODO:
  period_lengths,
  // @ts-expect-error TODO:
  age,
  // @ts-expect-error TODO:
  predictionFullState,
  // @ts-expect-error TODO:
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

// @ts-expect-error TODO:
export function setSmartPredictionFailure({ error }) {
  return createAction('SMART_PREDICTION_FAILURE', { error })
}

// @ts-expect-error TODO:
export function adjustPrediction(action) {
  return createAction('ADJUST_PREDICTION', action)
}

export function updateFuturePrediction(
  isFuturePredictionActive: boolean,
  // TODO:
  // eslint-disable-next-line
  currentStartDate: any,
) {
  return createAction('SET_FUTURE_PREDICTION_STATE_ACTIVE', {
    isFuturePredictionActive,
    currentStartDate,
  })
}

export function userUpdateFuturePrediction(
  isFuturePredictionActive: boolean,
  // TODO:
  // eslint-disable-next-line
  currentStartDate: any,
) {
  return createAction('USER_SET_FUTURE_PREDICTION_STATE_ACTIVE', {
    isFuturePredictionActive,
    currentStartDate,
  })
}



/// for user verified period dates 
export function updateUserConfirmedDates() {
  
}