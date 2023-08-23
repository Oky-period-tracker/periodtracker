import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { RehydrateAction, REHYDRATE } from 'redux-persist'
import { ExtractActionFromActionType } from '../types'

import { httpClient } from '../../services/HttpClient'
import { liveContent as staleContent } from '@oky/core'

import * as selectors from '../selectors'
import * as actions from '../actions'
import _ from 'lodash'
import { PredictionState } from '../../prediction'
import { fetchNetworkConnectionStatus } from '../../services/network'

function* onRehydrate(action: RehydrateAction) {
  const locale = yield select(selectors.currentLocaleSelector)

  const hasPreviousContentFromStorage = action.payload && action.payload.content

  if (!hasPreviousContentFromStorage) {
    yield put(actions.initStaleContent(staleContent[locale]))
  }
  yield put(actions.fetchContentRequest(locale))
}

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
    yield put(actions.setPredictionEngineState(stateToSet))
    yield put(
      actions.updateFuturePrediction(futurePredictionStatus, predictionFullState.currentCycle),
    )
  } catch (error) {
    yield put(actions.setSmartPredictionFailure(error))
  }
}

export function* smartPredictionbSaga() {
  yield all([
    takeLatest(REHYDRATE, onRehydrate),
    takeLatest('SMART_PREDICTION_REQUEST', onFetchUpdatedPredictedCycles),
  ])
}
