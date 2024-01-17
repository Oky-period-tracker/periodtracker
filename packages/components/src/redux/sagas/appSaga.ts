import _ from 'lodash'
import { all, delay, fork, put, select, takeLatest } from 'redux-saga/effects'
import { httpClient } from '../../services/HttpClient'
import { fetchNetworkConnectionStatus } from '../../services/network'
import { extractReducerState } from '../sync'
import { ReduxState, exportReducerNames } from '../reducers'
import { version as storeVersion } from '../store'
import * as actions from '../actions'
import * as selectors from '../selectors'
import messaging from '@react-native-firebase/messaging'

function* syncAppState() {
  let lastAppState

  while (true) {
    // process queue every minute
    yield delay(60 * 1000)

    const appToken = yield select(selectors.appTokenSelector)
    if (!appToken) {
      // not logged
      continue
    }

    const state: ReduxState = yield select()
    const appState = extractReducerState(state, exportReducerNames)

    if (_.isEqual(appState, lastAppState)) {
      // bailout, nothing changed from last sync
      continue
    }

    if (!(yield fetchNetworkConnectionStatus())) {
      // no internet connection
      continue
    }

    try {
      yield httpClient.replaceStore({
        storeVersion,
        appState,
        appToken,
      })

      const temp = yield put(actions.syncStore())

      lastAppState = appState
    } catch (err) {
      // ignore error, we'll try later
    }
  }
}

function* onRequestStoreFirebaseKey() {
  if (yield fetchNetworkConnectionStatus()) {
    // no internet connection
    const firebaseToken = yield messaging().getToken()
    yield put(actions.storeFirebaseKey(firebaseToken))
  }
}

export function* appSaga() {
  yield all([
    fork(syncAppState),
    takeLatest('REQUEST_STORE_FIREBASE_KEY', onRequestStoreFirebaseKey),
  ])
}
