import { all, delay, fork, put, select, takeLatest } from 'redux-saga/effects'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { httpClient } from '../../services/HttpClient'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { ActionTypes } from '../types'
import { fetchNetworkConnectionStatus } from '../../services/network'

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
  'USER_SET_FUTURE_PREDICTION_STATE_ACTIVE',
  // Usage
  'SCREEN_VIEWED',
  'CATEGORY_VIEWED',
  'SUBCATEGORY_VIEWED',
  'DAILY_CARD_USED',
]

// @ts-expect-error TODO:
function* onTrackAction(action) {
  // @ts-expect-error TODO:
  const currentUser = yield select(selectors.currentUserSelector)
  // @ts-expect-error TODO:
  const deviceId = yield select(selectors.currentDeviceId)
  yield put(
    actions.queueEvent({
      id: uuidv4(),
      type: action.type,
      payload: action.payload || {},
      metadata: {
        date: moment.utc(),
        user: currentUser && currentUser.id ? currentUser.id : null,
        deviceId,
      },
    }),
  )
}

function* processEventQueue() {
  while (true) {
    // process queue every minute
    yield delay(60 * 1000)
    // @ts-expect-error TODO:
    const appToken = yield select(selectors.appTokenSelector)
    // @ts-expect-error TODO:
    const events = yield select(selectors.allAnalyticsEventsSelector)

    const isQueueEmpty = events.length === 0
    if (isQueueEmpty) {
      // nothing to send
      continue
    }

    // @ts-expect-error TODO:
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
