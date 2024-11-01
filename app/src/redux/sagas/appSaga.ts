import _ from 'lodash'
import { all, delay, fork, select } from 'redux-saga/effects'
import { httpClient } from '../../services/HttpClient'
import { fetchNetworkConnectionStatus } from '../../services/network'
import { version as storeVersion } from '../version'
import * as selectors from '../selectors'
// import messaging from "@react-native-firebase/messaging"; TODO:
import { PartialStateSnapshot } from '../types/partialStore'
import { ReduxState } from '../reducers'
import { privateSnapshotSelector } from '../selectors/private/privateSelectors'

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
      private: privateSnapshotSelector(state),
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
        storeVersion,
        appState,
        appToken,
      })

      lastAppState = appState
    } catch (err) {
      // ignore error, we'll try later
    }
  }
}

export function* appSaga() {
  yield all([fork(syncAppState)])
}
