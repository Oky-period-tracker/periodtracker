import { all, delay, fork, put, select, takeLatest } from 'redux-saga/effects'
import uuidv4 from 'uuid/v4'
import moment from 'moment'
import { fetchNetworkConnectionStatus } from '../../services/network'
import { httpClient } from '../../services/HttpClient'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { ActionTypes } from '../types'

const ACTIONS_TO_TRACK: ActionTypes[] = [
  // app
  'SET_THEME',
  'SET_LOCALE',
  // answers
  'ANSWER_SURVEY',
  'ANSWER_QUIZ',
  'SHARE_APP',
  // 'ANSWER_DAILY_CARD', // removed for privacy
  // prediction
  'ADJUST_PREDICTION',
]

function* onTrackAction(action) {
  const currentUser = yield select(selectors.currentUserSelector)
  yield put(
    actions.queueEvent({
      id: uuidv4(),
      type: action.type,
      payload: action.payload || {},
      metadata: {
        date: moment.utc(),
        user: currentUser && currentUser.id ? currentUser.id : null,
      },
    }),
  )
}

function* processEventQueue() {
  while (true) {
    // process queue every minute
    yield delay(60 * 1000)

    const appToken = yield select(selectors.appTokenSelector)
    const events = yield select(selectors.allAnalyticsEventsSelector)

    const isQueueEmpty = events.length === 0
    if (isQueueEmpty) {
      // nothing to send
      continue
    }

    if (!(yield fetchNetworkConnectionStatus())) {
      // no internet connection
      continue
    }

    try {
      yield httpClient.appendEvents({ events, appToken })
      yield put(actions.resetQueue())
    } catch (err) {
      // ignore error, we'll try later
    }
  }
}

export function* analyticsSaga() {
  yield all([fork(processEventQueue), takeLatest(ACTIONS_TO_TRACK, onTrackAction)])
}
