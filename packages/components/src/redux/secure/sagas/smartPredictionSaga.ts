import { all, put, takeLatest } from 'redux-saga/effects'
import { ExtractActionFromActionType } from '../types'

import { httpClient } from '../../../services/HttpClient'

import { secureActions } from '../actions'
import _ from 'lodash'
import { PredictionState } from '../../../prediction'

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
    yield put(secureActions.setPredictionEngineState(stateToSet))
    yield put(
      secureActions.updateFuturePrediction(
        futurePredictionStatus,
        predictionFullState.currentCycle,
      ),
    )
  } catch (error) {
    yield put(secureActions.setSmartPredictionFailure(error))
  }
}

export function* smartPredictionbSaga() {
  yield all([takeLatest('SMART_PREDICTION_REQUEST', onFetchUpdatedPredictedCycles)])
}
