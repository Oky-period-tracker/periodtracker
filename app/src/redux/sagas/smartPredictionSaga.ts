import { all, put, takeLatest } from 'redux-saga/effects'
import { ExtractActionFromActionType } from '../types'

import { httpClient } from '../../services/HttpClient'

import * as actions from '../actions'
import { PredictionState } from '../../prediction'

function* onFetchUpdatedPredictedCycles(
  action: ExtractActionFromActionType<'SMART_PREDICTION_REQUEST'>,
) {
  try {
    const {
      age,
      period_lengths,
      cycle_lengths,
      predictionFullState,
      futurePredictionStatus,
    } = action.payload
    let predictionResult = null
    // @ts-expect-error TODO:
    predictionResult = yield httpClient.getPeriodCycles({
      age,
      period_lengths,
      cycle_lengths,
    })
    
    const stateToSet = PredictionState.fromData({
      isActive: predictionFullState.isActive,
      startDate: predictionFullState.currentCycle.startDate,
      periodLength: predictionFullState.currentCycle.periodLength,
      cycleLength: predictionFullState.currentCycle.cycleLength,
      smaCycleLength: predictionResult.predicted_cycles[0],
      smaPeriodLength: predictionResult.predicted_periods[0],
      history: predictionFullState.history,
      actualCurrentStartDate: predictionFullState.currentCycle,
    })
    yield put(actions.setPredictionEngineState(stateToSet))
    yield put(
      actions.updateFuturePrediction(futurePredictionStatus, predictionFullState.currentCycle),
    )
  } catch (error) {
    // @ts-expect-error TODO:
    yield put(actions.setSmartPredictionFailure(error))
  }
}

export function* smartPredictionbSaga() {
  yield all([takeLatest('SMART_PREDICTION_REQUEST', onFetchUpdatedPredictedCycles)])
}
