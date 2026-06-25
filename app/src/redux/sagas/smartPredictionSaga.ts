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

    // Compute days_since_menarche from earliest cycle in history
    let days_since_menarche: number | undefined
    if (predictionFullState.history && predictionFullState.history.length > 0) {
      const firstCycleStart = predictionFullState.history[predictionFullState.history.length - 1]?.startDate
      if (firstCycleStart) {
        const firstDate = new Date(firstCycleStart)
        const now = new Date()
        days_since_menarche = Math.floor((now.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24))
      }
    }

    // @ts-expect-error TODO:
    const predictionResponse = yield httpClient.getPeriodCycles({
      user_id: userId,
      age,
      period_lengths,
      cycle_lengths,
      days_since_menarche,
    })

    // Map new API response to the format PredictionState.fromData expects
    const smaCycleLength = predictionResponse.prediction.predicted_cycle_length
    const validPeriods = period_lengths ? period_lengths.filter((p: number) => p > 0) : []
    const smaPeriodLength =
      validPeriods.length > 0
        ? validPeriods.reduce((a: number, b: number) => a + b, 0) / validPeriods.length
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
