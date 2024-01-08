import { all, call, put, select, takeLatest, delay } from 'redux-saga/effects'
import { REHYDRATE } from 'redux-persist'
import { Alert } from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import { ExtractActionFromActionType } from '../types'
import { httpClient } from '../../services/HttpClient'
import { ReduxState, exportReducerNames } from '../reducers'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { navigateAndReset } from '../../services/navigationService'
import { PredictionState } from '../../prediction'
import moment from 'moment'
import { closeOutTTs } from '../../services/textToSpeech'
import { fetchNetworkConnectionStatus } from '../../services/network'
import _ from 'lodash'
import { formatPassword, hash } from '../../services/auth'

// unwrap promise
type Await<T> = T extends Promise<infer U> ? U : T

function* onRehydrate() {
  const state: ReduxState = yield select()

  const appToken = selectors.appTokenSelector(state)
  const user = selectors.currentUserSelector(state)

  // convert guest account
  if (!appToken && user && user.isGuest) {
    yield put(actions.convertGuestAccount(user))
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
  } = action.payload

  yield put(
    actions.createAccountRequest({
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
    }),
  )
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
          id: user.id,
          name,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          location: user.location,
          country: user.country,
          province: user.province,
          secretQuestion: user.secretQuestion,
          secretAnswer: user.secretAnswer,
          password,
          isGuest: false,
        },
      }),
    )

    if (store && store.storeVersion && store.appState) {
      const newAppState = exportReducerNames.reduce((state, reducerName) => {
        if (store.appState[reducerName]) {
          return {
            ...state,
            [reducerName]: store.appState[reducerName],
            app: { ...store.appState.app, appLocale: localeapp, locale: localeapp },
          }
        }

        return state
      }, {})

      // @TODO: execute migration based on storeVersion
      yield put(actions.refreshStore(newAppState))
    }

    yield delay(5000) // !!! THis is here for a bug on slower devices that cause the app to crash on sign up. Did no debug further. Note only occurs on much older phones
    yield call(navigateAndReset, 'StoreSwitchStack', null)
  } catch (error) {
    let errorMessage = 'request_fail'
    if (error && error.response && error.response.data) {
      if (error.response.data.name === 'BadRequestError') {
        errorMessage = 'login_failed'
      }
      if (error.response.data.name !== 'BadRequestError') {
        errorMessage = error.response.data.message
      }
    }

    // Attempt offline login
    const usernameHash = hash(name)
    const storeCredentials = yield select(selectors.storeCredentialsSelector)
    const credential = storeCredentials[usernameHash]

    if (credential) {
      yield put(
        actions.initiateStoreSwitch({
          keys: {
            key: usernameHash,
            secretKey: hash(password + credential.storeSalt),
          },
        }),
      )
    } else {
      yield put(
        actions.loginFailure({
          error: errorMessage,
        }),
      )
    }
  }
}

function* onLoginSuccess(action: ExtractActionFromActionType<'LOGIN_SUCCESS'>) {
  let storeCredentials = yield select(selectors.storeCredentialsSelector)
  const usernameHash = hash(action.payload.user.name)

  if (!storeCredentials[usernameHash]) {
    // Can occur when the account was created online via a different device
    yield put(actions.saveLocalCredentials(action.payload))
    storeCredentials = yield select(selectors.storeCredentialsSelector)
    return
  }

  const salt = storeCredentials[usernameHash].storeSalt
  const password = formatPassword(action.payload.user.password)

  const keys = {
    key: usernameHash,
    secretKey: hash(password + salt),
  }

  yield put(actions.initiateStoreSwitch({ keys }))
}

function* onCreateAccountRequest(action: ExtractActionFromActionType<'CREATE_ACCOUNT_REQUEST'>) {
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
      },
    )
    if (!appToken || !user || !user.id) {
      throw new Error(`Invalid data`)
    }

    yield put(
      actions.createAccountSuccess({
        appToken,
        user: {
          id: user.id,
          name,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          location: user.location,
          country: user.country,
          province: user.province,
          secretQuestion: user.secretQuestion,
          secretAnswer: user.secretAnswer,
          password,
          isGuest: false,
        },
      }),
    )
  } catch (error) {
    const errorStatusCode =
      error && error.response && error.response.status ? error.response.status : null // to check various error codes and respond accordingly
    yield put(actions.setAuthError({ error: errorStatusCode }))
    yield put(actions.createAccountFailure())

    // Check username is not already taken
    const usernameHash = hash(name)
    const storeCredentials = yield select(selectors.storeCredentialsSelector)
    const credential = storeCredentials[usernameHash]

    if (credential) {
      // username already taken
      // yield put(secureActions.setAuthError({ error: errorStatusCode }))
      return
    }

    // CREATE OFFLINE GUEST ACCOUNT
    yield put(
      actions.createAccountSuccess({
        appToken: null,
        user: {
          id: id || uuidv4(),
          name,
          dateOfBirth,
          gender,
          location,
          country,
          province,
          password,
          secretAnswer,
          secretQuestion,
          isGuest: true,
        },
      }),
    )
  }
}

function* onCreateAccountSuccess(action: ExtractActionFromActionType<'CREATE_ACCOUNT_SUCCESS'>) {
  const { appToken, user } = action.payload
  // Is this even necessary ????
  // Because we already update the redux state when account is created, so why the extra log in step?
  yield put(
    actions.loginSuccess({
      appToken,
      user: {
        id: user.id,
        name: user.name,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        location: user.location,
        country: user.country,
        province: user.province,
        password: user.password,
        secretQuestion: user.secretQuestion,
        secretAnswer: user.secretAnswer,
        isGuest: user.isGuest,
      },
    }),
  )
}

function* onDeleteAccountRequest(action: ExtractActionFromActionType<'DELETE_ACCOUNT_REQUEST'>) {
  const { setLoading } = action.payload
  const state: ReduxState = yield select()
  const user = selectors.currentUserSelector(state)
  setLoading(true)
  try {
    const { name, password } = action.payload
    yield httpClient.deleteUserFromPassword({
      name,
      password,
    })
    yield put(actions.updateAllSurveyContent([])) // TODO_ALEX
    yield put(actions.updateCompletedSurveys([])) // TODO_ALEX
    yield put(
      actions.fetchSurveyContentSuccess({
        surveys: null,
      }), // TODO_ALEX
    )
    yield call(navigateAndReset, 'LoginStack', null)

    if (user) {
      yield put(actions.logout())
    }
  } catch (err) {
    setLoading(false)
    Alert.alert('Error', 'Unable to delete the account')
  }
}

function* onLogoutRequest() {
  const isTtsActive = yield select(selectors.isTtsActiveSelector)

  if (isTtsActive) {
    yield call(closeOutTTs)
    yield put(actions.setTtsActive(false))
    yield put(actions.verifyPeriodDayByUser([])) // TODO_ALEX: survey
  }
  yield put(actions.updateAllSurveyContent([])) // TODO_ALEX: survey
  yield put(
    actions.fetchSurveyContentSuccess({
      surveys: null,
    }),
  )
  yield put(actions.updateCompletedSurveys([])) // TODO_ALEX: survey
  yield call(navigateAndReset, 'LoginStack', null)
  yield put(actions.logout())
}

function* onClearLastLogin() {
  yield call(navigateAndReset, 'LoginStack', null)
}

function* onJourneyCompletion(action: ExtractActionFromActionType<'JOURNEY_COMPLETION'>) {
  const { data } = action.payload
  const currentUser = yield select(selectors.currentUserSelector)
  let periodResult = null
  if (yield fetchNetworkConnectionStatus()) {
    try {
      periodResult = yield httpClient.getPeriodCycles({
        age: moment().diff(moment(currentUser.dateOfBirth), 'years'),
        period_lengths: [0, 0, 0, 0, 0, 0, 0, 0, 0, data[2].answer + 1],
        cycle_lengths: [0, 0, 0, 0, 0, 0, 0, 0, 0, (data[3].answer + 1) * 7 + data[2].answer + 1],
      })
    } catch (error) {
      // console.log( error);
    }
  }
  const stateToSet = PredictionState.fromData({
    isActive: data[0].answer === 'Yes' ? true : false,
    startDate: moment(data[1].answer, 'DD-MMM-YYYY'),
    periodLength: data[2].answer + 1,
    cycleLength: (data[3].answer + 1) * 7 + data[2].answer + 1,
    smaCycleLength: periodResult
      ? periodResult.predicted_cycles[0]
      : (data[3].answer + 1) * 7 + data[2].answer + 1,
    smaPeriodLength: periodResult ? periodResult.predicted_periods[0] : data[2].answer + 1,
    history: [],
  })

  yield put(actions.setPredictionEngineState(stateToSet))
  yield put(actions.updateFuturePrediction(true, null))
  yield put(actions.setTutorialOneActive(true))
  yield put(actions.setTutorialTwoActive(true))
  yield delay(5000) // !!! THis is here for a bug on slower devices that cause the app to crash on sign up. Did no debug further. Note only occurs on much older phones
  yield call(navigateAndReset, 'StoreSwitchStack', null)
}

export function* authSaga() {
  yield all([
    takeLatest(REHYDRATE, onRehydrate),
    takeLatest('LOGOUT_REQUEST', onLogoutRequest),
    takeLatest('CLEAR_LAST_LOGIN', onClearLastLogin),
    takeLatest('LOGIN_REQUEST', onLoginRequest),
    takeLatest('LOGIN_SUCCESS', onLoginSuccess),
    takeLatest('DELETE_ACCOUNT_REQUEST', onDeleteAccountRequest),
    takeLatest('CREATE_ACCOUNT_REQUEST', onCreateAccountRequest),
    takeLatest('CREATE_ACCOUNT_SUCCESS', onCreateAccountSuccess),
    takeLatest('CONVERT_GUEST_ACCOUNT', onConvertGuestAccount),
    takeLatest('JOURNEY_COMPLETION', onJourneyCompletion),
  ])
}
