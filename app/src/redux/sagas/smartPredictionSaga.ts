import { all, put, select, takeLatest } from 'redux-saga/effects'
import { ExtractActionFromActionType } from '../types'

import { httpClient } from '../../services/HttpClient'

import * as actions from '../actions'
import * as selectors from '../selectors'
import { PredictionState } from '../../prediction'
import { cachedAnswerUsable, cycleEntries } from '../../prediction/serverCache'

// Offline the phone predicts from the average of her last cycles (brief: last 6)
const LOCAL_WINDOW = 6

// What a prediction is based on: her past cycles and when the current one started
const cyclesKey = (state: { history: unknown; currentCycle: { startDate: unknown } }) =>
  JSON.stringify([state.history, state.currentCycle.startDate])

function localCycleLength(predictionFullState: PredictionState) {
  const lengths = (predictionFullState.history || [])
    .slice(0, LOCAL_WINDOW)
    .map((h) => h.cycleLength)
    .filter((l) => l > 15)
  return lengths.length > 0
    ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
    : predictionFullState.smartPrediction.smaCycleLength
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

    const requestedFor = cyclesKey(predictionFullState.toJSON())
    // @ts-expect-error TODO:
    const currentUser = yield select(selectors.currentUserSelector)
    const userId = currentUser?.id || 'anonymous'

    // Include most recent completed cycle so the model learns from it
    const mostRecentCycle = predictionFullState.history?.[0]
    const new_observation = mostRecentCycle
      ? {
          cycle_start_date: new Date(
            mostRecentCycle.startDate || mostRecentCycle.cycleStartDate,
          ).toISOString(),
          observed_cycle_length: mostRecentCycle.cycleLength,
        }
      : undefined

    let predictionResponse = null
    try {
      // @ts-expect-error TODO:
      predictionResponse = yield httpClient.getPeriodCycles({
        user_id: userId,
        age,
        period_lengths,
        cycle_lengths,
        new_observation,
      })
      // A NaN length would be persisted as null and freeze the engine on next launch
      if (!Number.isFinite(Math.round(predictionResponse.predictedCycleLength))) {
        throw new Error('Prediction response has no cycle length')
      }
    } catch (error) {
      // @ts-expect-error TODO:
      yield put(actions.setSmartPredictionFailure(error))
      predictionResponse = null
    }

    // getPeriodCycles normalises both engine versions into
    // { predictedCycleLength, predictedPeriodLength }.
    // Round the (Bayesian, v2) posterior mean - it is almost never an integer
    // and the app displays this value directly to users (e.g. "28.437 days").
    // Without a fresh answer, keep the saved one while it is still usable (re-anchored to her
    // new start); after an edit, or once it is stale, the phone calculates from her own cycles.
    const savedRange = predictionFullState.smartPrediction?.serverRange
    const reuseSaved =
      !predictionResponse && cachedAnswerUsable(savedRange, predictionFullState.history)
    const serverRange = predictionResponse
      ? predictionResponse.serverRange && {
          ...predictionResponse.serverRange,
          basedOn: cycleEntries(predictionFullState.history),
        }
      : reuseSaved
      ? savedRange
      : undefined
    const smaCycleLength = predictionResponse
      ? Math.round(predictionResponse.predictedCycleLength)
      : reuseSaved
      ? Math.round(savedRange.mean)
      : localCycleLength(predictionFullState)
    if (!Number.isFinite(smaCycleLength)) {
      return
    }
    // She edited her cycles while this answer was on its way: it is for old data
    // @ts-expect-error TODO:
    const saved = yield select((state) => state.prediction)
    if (saved?.currentCycle && cyclesKey(saved) !== requestedFor) {
      return
    }

    // v1 returns a predicted period length; v2 does not, so we fall back to
    // computing it from actual history (not the stale period_lengths array).
    const historyPeriods = (predictionFullState.history || [])
      .map((h: any) => h.periodLength)
      .filter((p: number) => p >= 2)
    const allPeriods = [
      ...(predictionFullState.currentCycle.periodLength >= 2
        ? [predictionFullState.currentCycle.periodLength]
        : []),
      ...historyPeriods,
    ]
    const smaPeriodLength =
      predictionResponse?.predictedPeriodLength != null
        ? Math.round(predictionResponse.predictedPeriodLength)
        : allPeriods.length > 0
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
      serverRange,
    })
    // fromData starts with empty six-cycle buffers; keep the ones the engine already has
    for (const key of ['circularPeriodLength', 'circularCycleLength'] as const) {
      predictionFullState.smartPrediction?.[key]?.toarray().forEach((v: number) => {
        stateToSet.smartPrediction[key].push(v)
      })
    }
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
