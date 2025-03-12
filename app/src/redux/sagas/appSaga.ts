import _ from 'lodash'
import { all, delay, fork, select, takeLatest } from 'redux-saga/effects'
import { httpClient } from '../../services/HttpClient'
import { fetchNetworkConnectionStatus } from '../../services/network'
import * as selectors from '../selectors'
// import messaging from "@react-native-firebase/messaging"; TODO:
import { PartialStateSnapshot } from '../types/partialStore'
import { ReduxState } from '../reducers'
import { reduxStoreVersion } from '../../optional/reduxMigrations'

function* syncAppState() {
  let lastAppState

  while (true) {
    // process queue every minute
    yield delay(60 * 1000)

    // @ts-expect-error TODO:
    const appToken = yield select(selectors.appTokenSelector)
    // @ts-expect-error TODO:
    const currentUser = yield select(selectors.currentUserSelector)

    if (!appToken || !currentUser) {
      // not logged
      continue
    }

    const state: ReduxState = yield select()
    const appState: PartialStateSnapshot = {
      app: state.app,
      prediction: state.prediction,
      verifiedDates: state.answer[currentUser?.id]?.verifiedDates,
      // optional
      helpCenters: state.helpCenters,
    }

    if (_.isEqual(appState, lastAppState)) {
      // bailout, nothing changed from last sync
      continue
    }

    // @ts-expect-error TODO:
    if (!(yield fetchNetworkConnectionStatus())) {
      // no internet connection
      continue
    }

    try {
      yield httpClient.replaceStore({
        storeVersion: reduxStoreVersion,
        appState,
        appToken,
      })

      lastAppState = appState
    } catch (err) {
      // ignore error, we'll try later
    }
  }
}

function* onRequestStoreFirebaseKey() {
  // TODO:
  // try {
  //   if (yield fetchNetworkConnectionStatus()) {
  //     // no internet connection
  //     const firebaseToken = yield messaging().getToken();
  //     yield put(actions.storeFirebaseKey(firebaseToken));
  //   }
  // } catch (e) {
  //   console.error(e);
  // }
}

export function* appSaga() {
  yield all([
    fork(syncAppState),
    takeLatest('REQUEST_STORE_FIREBASE_KEY', onRequestStoreFirebaseKey),
  ])
}
