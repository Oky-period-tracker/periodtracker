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

    // Include most recent completed cycle so the model learns from it
    const mostRecentCycle = predictionFullState.history?.[0]
    const new_observation = mostRecentCycle
      ? {
          cycle_start_date: new Date(mostRecentCycle.startDate || mostRecentCycle.cycleStartDate).toISOString(),
          observed_cycle_length: mostRecentCycle.cycleLength,
        }
      : undefined

    // @ts-expect-error TODO:
    const predictionResponse = yield httpClient.getPeriodCycles({
      user_id: userId,
      age,
      period_lengths,
      cycle_lengths,
      new_observation,
    })

    // Map new API response to the format PredictionState.fromData expects
    // Round the Bayesian model's posterior mean - it is almost never an integer
    // and the app displays this value directly to users (e.g. "28.437 days").
    const smaCycleLength = Math.round(predictionResponse.prediction.predicted_cycle_length)

    // Compute period length from actual history (not the stale period_lengths array)
    const historyPeriods = (predictionFullState.history || [])
      .map((h: any) => h.periodLength)
      .filter((p: number) => p >= 2)
    const allPeriods = [
      ...(predictionFullState.currentCycle.periodLength >= 2 ? [predictionFullState.currentCycle.periodLength] : []),
      ...historyPeriods,
    ]
    const smaPeriodLength =
      allPeriods.length > 0
        ? Math.round(allPeriods.reduce((a: number, b: number) => a + b, 0) / allPeriods.length)
        : 5

    const stateToSet = PredictionState.fromData({
      isActive: predictionFullState.isActive,
      startDate: predictionFullState.currentCycle.startDate,
      periodLength: smaPeriodLength,
      cycleLength: smaCycleLength,
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
