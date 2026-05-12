import { all, put, select, takeLatest } from 'redux-saga/effects'
import { ExtractActionFromActionType } from '../types'

import { httpClient } from '../../services/HttpClient'

import * as actions from '../actions'
import * as selectors from '../selectors'
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

    // @ts-expect-error TODO:
    const currentUser = yield select(selectors.currentUserSelector)
    const userId = currentUser?.id || 'anonymous'

    // @ts-expect-error TODO:
    const predictionResponse = yield httpClient.getPeriodCycles({
      user_id: userId,
      age,
      period_lengths,
      cycle_lengths,
    })

    console.log('[PredictionEngine] API response:', JSON.stringify(predictionResponse))

    // Map new API response to the format PredictionState.fromData expects
    const smaCycleLength = predictionResponse.prediction.predicted_cycle_length
    const smaPeriodLength =
      period_lengths && period_lengths.length > 0
        ? period_lengths.reduce((a: number, b: number) => a + b, 0) / period_lengths.length
        : predictionFullState.currentCycle.periodLength

    const stateToSet = PredictionState.fromData({
      isActive: predictionFullState.isActive,
      startDate: predictionFullState.currentCycle.startDate,
      periodLength: predictionFullState.currentCycle.periodLength,
      cycleLength: predictionFullState.currentCycle.cycleLength,
      smaCycleLength,
      smaPeriodLength,
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
