import moment from 'moment'
import { AppState } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { REHYDRATE } from 'redux-persist'
import { EventChannel, eventChannel } from 'redux-saga'
import { all, call, debounce, fork, put, select, take, takeLatest } from 'redux-saga/effects'
import { ExtractActionFromActionType } from '../types'

import { PREDICTION_ENGINE_VERSION } from '../../config/env'
import { httpClient } from '../../services/HttpClient'
import { fetchNetworkConnectionStatus } from '../../services/network'

import * as actions from '../actions'
import * as selectors from '../selectors'
import { PredictionState } from '../../prediction'
import { requestLengths } from '../../prediction/predictionRequest'
import { cachedAnswerUsable, cycleEntries, cyclesKey } from '../../prediction/serverCache'

// The same cycles can be saved with their fields in another order: compare them rebuilt
const normalisedKey = (json: Parameters<typeof PredictionState.fromJSON>[0]) =>
  cyclesKey(PredictionState.fromJSON(json).toJSON())

// Offline the phone predicts from the average of her last cycles (brief: last 6)
const LOCAL_WINDOW = 6

// v2: her taps are saved at once; the server is asked once she pauses this long
export const SYNC_PAUSE_MS = 3000

// The last request failed, so it is retried when she is back online
let lastSyncFailed = false

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

    const requestedFor = normalisedKey(predictionFullState.toJSON())
    // @ts-expect-error TODO:
    const currentUser = yield select(selectors.currentUserSelector)
    const userId = currentUser?.id || 'anonymous'

    // Include most recent completed cycle so the model learns from it, unless the server's last
    // answer was already based on it unchanged (the app also asks on every open)
    const mostRecentCycle = predictionFullState.history?.[0]
    const alreadyLearned =
      !!mostRecentCycle &&
      cycleEntries([mostRecentCycle])[0] ===
        predictionFullState.smartPrediction?.serverRange?.basedOn?.[0]
    const new_observation = mostRecentCycle && !alreadyLearned
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
      lastSyncFailed = false
    } catch (error) {
      // @ts-expect-error TODO:
      yield put(actions.setSmartPredictionFailure(error))
      predictionResponse = null
      lastSyncFailed = true
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
    if (saved?.currentCycle && normalisedKey(saved) !== requestedFor) {
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

// Ask the server again from what is saved on the phone. Resending a cycle is safe:
// the server replaces a cycle it already has instead of counting it twice.
function* syncSavedPrediction() {
  // An error here must not stop the other sagas the root saga runs
  try {
    // @ts-expect-error TODO:
    if (!(yield call(fetchNetworkConnectionStatus))) return
    // @ts-expect-error TODO:
    const saved = yield select((state) => state.prediction)
    // @ts-expect-error TODO:
    const currentUser = yield select(selectors.currentUserSelector)
    if (!saved?.currentCycle || !currentUser) return
    const predictionFullState = PredictionState.fromJSON(saved)
    // @ts-expect-error TODO:
    const futurePredictionStatus = yield select(selectors.isFuturePredictionActiveSelector)
    yield put(
      actions.smartPredictionRequest({
        ...requestLengths(predictionFullState.currentCycle, predictionFullState.history),
        age: moment().diff(moment(currentUser.dateOfBirth), 'years'),
        predictionFullState,
        futurePredictionStatus,
      }),
    )
  } catch (error) {
    // @ts-expect-error TODO:
    yield put(actions.setSmartPredictionFailure(error))
  }
}

function* retryFailedSync() {
  if (lastSyncFailed) yield call(syncSavedPrediction)
}

const appOpened = () =>
  eventChannel<true>((emit) => {
    const subscription = AppState.addEventListener('change', (s) => s === 'active' && emit(true))
    return () => subscription.remove()
  })

const backOnline = () =>
  eventChannel<true>((emit) => NetInfo.addEventListener((s) => s.isConnected && emit(true)))

function* syncWhen(trigger: string | EventChannel<true>, sync: () => Generator) {
  while (true) {
    // @ts-expect-error take accepts a pattern or a channel
    yield take(trigger)
    yield call(sync)
  }
}

// v2 sync triggers: app open (start and return to the foreground), and back online after a failure
function* syncTriggers() {
  const opened: EventChannel<true> = yield call(appOpened)
  const online: EventChannel<true> = yield call(backOnline)
  try {
    yield all([
      call(syncWhen, REHYDRATE, syncSavedPrediction),
      call(syncWhen, opened, syncSavedPrediction),
      call(syncWhen, online, retryFailedSync),
    ])
  } finally {
    opened.close()
    online.close()
  }
}

export function* smartPredictionbSaga() {
  if (PREDICTION_ENGINE_VERSION !== 'v2') {
    yield all([takeLatest('SMART_PREDICTION_REQUEST', onFetchUpdatedPredictedCycles)])
    return
  }
  yield all([
    debounce(SYNC_PAUSE_MS, 'SMART_PREDICTION_REQUEST', onFetchUpdatedPredictedCycles),
    fork(syncTriggers),
  ])
}
