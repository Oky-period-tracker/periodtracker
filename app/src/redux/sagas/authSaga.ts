import { all, delay, fork, put, select, takeLatest } from 'redux-saga/effects'
import { Alert } from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import { ExtractActionFromActionType } from '../types'
import { httpClient } from '../../services/HttpClient'
import * as actions from '../actions'
import * as selectors from '../selectors'
// import { navigateAndReset } from "../../services/navigationService";
import { PredictionState } from '../../prediction'
import moment from 'moment'
// import { closeOutTTs } from "../../services/textToSpeech";
import { fetchNetworkConnectionStatus } from '../../services/network'
import { PartialStateSnapshot } from '../types/partialStore'
import { ReduxState } from '../reducers'
import { analytics } from '../../services/firebase'

// unwrap promise
type Await<T> = T extends Promise<infer U> ? U : T

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
  yield put(actions.createAccountRequest(action.payload))
}

function* onLoginRequest(action: ExtractActionFromActionType<'LOGIN_REQUEST'>) {
  const { name, password } = action.payload
  const stateRedux: ReduxState = yield select()
  const localeapp = selectors.currentLocaleSelector(stateRedux)
  yield actions.setLocale(localeapp)

  try {
    
    const {
      appToken,
      user,
      store,
    }: Await<ReturnType<typeof httpClient.login>> = yield httpClient.login({
      name,
      password,
    })

    yield put(
      actions.loginSuccess({
        appToken,
        user: {
          ...user,
          name,
          password,
          isGuest: false,
        },
      }),
    )

    if (store && store.storeVersion && store.appState) {
      const partialState: PartialStateSnapshot = {
        ...store.appState,
        app: {
          ...store.appState.app,
          locale: localeapp,
        },
      }

      // @TODO: execute migration based on storeVersion
      yield put(actions.refreshStore({ userID: user.id, ...partialState }))
    }
  } catch (error) {
    let errorMessage = 'request_fail'
    // @ts-expect-error TODO:
    if (error && error.response && error.response.data) {
      // @ts-expect-error TODO:
      if (error.response.data.name === 'BadRequestError') {
        errorMessage = 'login_failed'
      }
      // @ts-expect-error TODO:
      if (error.response.data.name !== 'BadRequestError') {
        // @ts-expect-error TODO:
        errorMessage = error.response.data.message
      }
    }
    yield put(
      actions.loginFailure({
        error: errorMessage,
      }),
    )
  }
}

function* onCreateAccountRequest(action: ExtractActionFromActionType<'CREATE_ACCOUNT_REQUEST'>) {
  const dateSignedUp = moment.utc().toISOString()
  const { id, name, password } = action.payload

  try {
    const { appToken, user }: Await<ReturnType<typeof httpClient.signup>> = yield httpClient.signup(
      {
        ...action.payload,
        preferredId: id || null,
      },
    )
    if (!appToken || !user || !user.id) {
      throw new Error(`Invalid data`)
    }

    yield put(
      actions.createAccountSuccess({
        appToken,
        user: {
          ...user,
          name,
          password,
          dateSignedUp,
          isGuest: false,
        },
      }),
    )
  } catch (error) {
    const errorStatusCode =
      // @ts-expect-error TODO:
      error && error.response && error.response.status
        ? // @ts-expect-error TODO:
          error.response.status
        : null // to check various error codes and respond accordingly
    yield put(actions.setAuthError({ error: errorStatusCode }))
    yield put(actions.createAccountFailure())

    yield put(
      actions.loginSuccessAsGuestAccount({
        ...action.payload,
        id: id || uuidv4(),
        isGuest: true,
      }),
    )
  }
}

function* onCreateAccountSuccess(action: ExtractActionFromActionType<'CREATE_ACCOUNT_SUCCESS'>) {
  const { appToken, user } = action.payload
  yield put(
    actions.loginSuccess({
      appToken,
      user: {
        ...user,
      },
    }),
  )
}
function* onDeleteAccountRequest(action: ExtractActionFromActionType<'DELETE_ACCOUNT_REQUEST'>) {
  // const { setLoading } = action.payload;
  const state: ReduxState = yield select()

  const user = selectors.currentUserSelector(state)

  // setLoading(true);
  // TODO: if guest & no app token, just log out to delete local redux state, no DB account to delete so dont send request
  try {
    const { name, password } = action.payload
    yield httpClient.deleteUserFromPassword({
      name,
      password,
    })

    analytics?.().logEvent('deleteAccount')

    yield put(actions.updateAllSurveyContent([])) // TODO: ?
    yield put(actions.updateCompletedSurveys([])) // TODO: ?

    if (user) {
      yield put(actions.logout())
    }
  } catch (err) {    
    Alert.alert('error', 'delete_account_fail')
  }
}

function* onLogoutRequest() {
  yield put(actions.updateAllSurveyContent([]))
  yield put(actions.updateCompletedSurveys([]))
  yield put(actions.logout())
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
      // console.log(error);
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
  yield put(actions.updateFuturePrediction(true, null))
  yield put(actions.setTutorialOneActive(true))
  yield put(actions.setTutorialTwoActive(true))

  // yield delay(5000); // !!! THis is here for a bug on slower devices that cause the app to crash on sign up. Did no debug further. Note only occurs on much older phones
  // yield call(navigateAndReset, "MainStack", null);
}

export function* authSaga() {
  yield all([
    fork(periodicallyAttemptConvertGuestAccount),
    takeLatest('LOGOUT_REQUEST', onLogoutRequest),
    takeLatest('LOGIN_REQUEST', onLoginRequest),
    takeLatest('DELETE_ACCOUNT_REQUEST', onDeleteAccountRequest),
    takeLatest('CREATE_ACCOUNT_REQUEST', onCreateAccountRequest),
    takeLatest('CREATE_ACCOUNT_SUCCESS', onCreateAccountSuccess),
    takeLatest('CONVERT_GUEST_ACCOUNT', onConvertGuestAccount),
    takeLatest('JOURNEY_COMPLETION', onJourneyCompletion),
  ])
}
