import { all, delay, fork, put, select, takeLatest } from 'redux-saga/effects'
import { ExtractActionFromActionType } from '../types'
import { httpClient } from '../../services/HttpClient'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { PredictionState } from '../../prediction'
import moment from 'moment'
import { fetchNetworkConnectionStatus } from '../../services/network'
import { Await } from '../../types'

function* periodicallyAttemptConvertGuestAccount() {
  let userSaved = false
  let attempts = 0
  const maxAttempts = 10

  while (!userSaved && attempts <= maxAttempts) {
    const duration = 1000 * 60 // 1 minute
    yield delay(duration)

    // @ts-expect-error TODO:
    const appToken = yield select(selectors.appTokenSelector)
    // @ts-expect-error TODO:
    const user = yield select(selectors.currentUserSelector)

    if (!user) {
      return
    }

    if (appToken && !user.isGuest) {
      userSaved = true
      return
    }

    yield put(actions.convertGuestAccount(user))
    attempts++
  }
}

function* onConvertGuestAccount(action: ExtractActionFromActionType<'CONVERT_GUEST_ACCOUNT'>) {
  const {
    id,
    name,
    dateOfBirth,
    gender,
    location,
    country,
    province,
    password,
    secretAnswer,
    secretQuestion,
    dateSignedUp,
  } = action.payload
  try {
    const { appToken, user }: Await<ReturnType<typeof httpClient.signup>> = yield httpClient.signup(
      {
        name,
        password,
        dateOfBirth,
        gender,
        location,
        country,
        province,
        secretAnswer,
        secretQuestion,
        preferredId: id || null,
        dateSignedUp,
      },
    )

    if (!appToken || !user || !user.id) {
      throw new Error(`Invalid data`)
    }

    yield put(actions.setAppToken(appToken))
  } catch (error) {
    console.log('*** ERROR', error)
    const errorStatusCode =
      // @ts-expect-error TODO:
      error && error?.response && error.response.status ? error.response.status : null // to check various error codes and respond accordingly
    yield put(actions.setAuthError({ error: errorStatusCode }))
    yield put(actions.createAccountFailure())
  }
}

function* onJourneyCompletion(action: ExtractActionFromActionType<'JOURNEY_COMPLETION'>) {
  const { isActive, startDate, periodLength, cycleLength } = action.payload
  // @ts-expect-error TODO:
  const currentUser = yield select(selectors.currentUserSelector)
  const periodResult = null
  // @ts-expect-error TODO:
  if (yield fetchNetworkConnectionStatus()) {
    try {
      // @ts-expect-error TODO:
      periodResult = yield httpClient.getPeriodCycles({
        age: moment().diff(moment(currentUser.dateOfBirth), 'years'),
        period_lengths: [0, 0, 0, 0, 0, 0, 0, 0, 0, periodLength],
        cycle_lengths: [0, 0, 0, 0, 0, 0, 0, 0, 0, cycleLength],
      })
    } catch (error) {
      // console.log( error);
    }
  }

  const stateToSet = PredictionState.fromData({
    isActive,
    startDate,
    periodLength,
    cycleLength,
    smaCycleLength: periodResult
      ? // @ts-expect-error TODO:
        periodResult.predicted_cycles[0]
      : cycleLength,
    smaPeriodLength: periodResult
      ? // @ts-expect-error TODO:
        periodResult.predicted_periods[0]
      : periodLength,
    history: [],
  })

  yield put(actions.setPredictionEngineState(stateToSet))
}

function* onSyncStoresRequest(action: ExtractActionFromActionType<'SYNC_STORES_REQUEST'>) {
  if (!action.payload) {
    return
  }

  const lastModifiedOnline = action.payload?.lastModified
  // @ts-expect-error TODO:
  const lastModifiedLocal = yield select((s) => s.private.lastModified)

  yield put(
    actions.syncPrivateStores({
      onlinePrivateStore: action.payload,
      isNewer: lastModifiedOnline > lastModifiedLocal,
    }),
  )
}

// Carry across the app locale to the user who just created their account
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function* onInitUser(action: ExtractActionFromActionType<'INIT_USER'>) {
  // @ts-expect-error TODO:
  const appLocale = yield select(selectors.appLocaleSelector)
  yield put(actions.setLocale(appLocale))
}

export function* authSaga() {
  yield all([
    fork(periodicallyAttemptConvertGuestAccount),
    takeLatest('CONVERT_GUEST_ACCOUNT', onConvertGuestAccount),
    takeLatest('JOURNEY_COMPLETION', onJourneyCompletion),
    takeLatest('SYNC_STORES_REQUEST', onSyncStoresRequest),
    takeLatest('INIT_USER', onInitUser),
  ])
}
