import { all, call, put, select, takeLatest, delay } from 'redux-saga/effects'
import { REHYDRATE } from 'redux-persist'
import { Alert } from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import { ExtractActionFromActionType } from '../types'
import { httpClient } from '../../services/HttpClient'
import { CommonReduxState, exportReducerNames } from '../reducers'
import { commonActions } from '../actions'
import { commonSelectors } from '../selectors'
import { navigateAndReset } from '../../services/navigationService'
import { PredictionState } from '../../prediction'
import moment from 'moment'
import { closeOutTTs } from '../../services/textToSpeech'
import { fetchNetworkConnectionStatus } from '../../services/network'
import { hash } from '../../services/hash'

// unwrap promise
type Await<T> = T extends Promise<infer U> ? U : T

function* onRehydrate() {
  const state: CommonReduxState = yield select()

  const appToken = commonSelectors.appTokenSelector(state)
  const user = commonSelectors.currentUserSelector(state)

  // convert guest account
  if (!appToken && user && user.isGuest) {
    yield put(commonActions.convertGuestAccount(user))
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
    commonActions.createAccountRequest({
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
  const stateRedux: CommonReduxState = yield select()
  const localeapp = commonSelectors.currentLocaleSelector(stateRedux)
  yield commonActions.setLocale(localeapp)

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
      commonActions.loginSuccess({
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
      yield put(commonActions.refreshStore(newAppState))
    }

    yield delay(5000) // !!! THis is here for a bug on slower devices that cause the app to crash on sign up. Did no debug further. Note only occurs on much older phones
    yield call(navigateAndReset, 'MainStack', null)
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
    const credentials = yield select((s) => s.access.credentials)
    const credential = credentials[usernameHash]

    if (credential) {
      // ???????????????
      // Switch stores here ?
      // Change boolean to trigger switch in coordinator ?
      // Somehow need to pass the keys to the coordinator though
      // yield put(
      //   commonActions.loginOfflineSuccess({
      //     appToken: null,
      //     user: {
      //       id: user.id,
      //       name,
      //       dateOfBirth: user.dateOfBirth,
      //       gender: user.gender,
      //       location: user.location,
      //       country: user.country,
      //       province: user.province,
      //       secretQuestion: user.secretQuestion,
      //       secretAnswer: user.secretAnswer,
      //       password,
      //     },
      //   }),
      // )
      // return
    }

    yield put(
      commonActions.loginFailure({
        error: errorMessage,
      }),
    )
  }
}

function* onLoginSuccess(action: ExtractActionFromActionType<'LOGIN_SUCCESS'>) {
  const credentials = yield select((s) => s.access.credentials)
  const usernameHash = hash(action.payload.user.name)
  const salt = credentials[usernameHash]?.passwordSalt

  if (!salt) {
    // TODO_ALEX ???
    // Cant just return because they could have online account from another device that they're logging in to
  }

  const keys = {
    key: usernameHash,
    secretKey: hash(action.payload.user.password + salt),
  }

  yield put(commonActions.setStoreKeys(keys))
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
      commonActions.createAccountSuccess({
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
        },
      }),
    )
  } catch (error) {
    const errorStatusCode =
      error && error.response && error.response.status ? error.response.status : null // to check various error codes and respond accordingly
    yield put(commonActions.setAuthError({ error: errorStatusCode }))
    yield put(commonActions.createAccountFailure())

    // Check username is not already taken
    const usernameHash = hash(name)
    const credentials = yield select((s) => s.access.credentials)
    const credential = credentials[usernameHash]

    if (credential) {
      // username already taken
      // yield put(secureActions.setAuthError({ error: errorStatusCode }))
      return
    }

    yield put(
      commonActions.createGuestAccountSuccess({
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
      }),
    )
  }
}

function* onCreateAccountSuccess(action: ExtractActionFromActionType<'CREATE_ACCOUNT_SUCCESS'>) {
  const { appToken, user } = action.payload
  yield put(
    commonActions.loginSuccess({
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
      },
    }),
  )
}

function* onDeleteAccountRequest(action: ExtractActionFromActionType<'DELETE_ACCOUNT_REQUEST'>) {
  const { setLoading } = action.payload
  const state: CommonReduxState = yield select()
  const user = commonSelectors.currentUserSelector(state)
  setLoading(true)
  try {
    const { name, password } = action.payload
    yield httpClient.deleteUserFromPassword({
      name,
      password,
    })
    yield put(commonActions.updateAllSurveyContent([])) // TODO_ALEX
    yield put(commonActions.updateCompletedSurveys([])) // TODO_ALEX
    yield put(
      commonActions.fetchSurveyContentSuccess({
        surveys: null,
      }), // TODO_ALEX
    )
    yield call(navigateAndReset, 'LoginStack', null)

    if (user) {
      yield put(commonActions.logout())
    }
  } catch (err) {
    setLoading(false)
    Alert.alert('Error', 'Unable to delete the account')
  }
}

function* onLogoutRequest() {
  const isTtsActive = yield select(commonSelectors.isTtsActiveSelector)

  if (isTtsActive) {
    yield call(closeOutTTs)
    yield put(commonActions.setTtsActive(false))
    yield put(commonActions.verifyPeriodDayByUser([])) // TODO_ALEX: survey
  }
  yield put(commonActions.updateAllSurveyContent([])) // TODO_ALEX: survey
  yield put(
    commonActions.fetchSurveyContentSuccess({
      surveys: null,
    }),
  )
  yield put(commonActions.updateCompletedSurveys([])) // TODO_ALEX: survey
  yield call(navigateAndReset, 'LoginStack', null)
  yield put(commonActions.logout())
}

function* onJourneyCompletion(action: ExtractActionFromActionType<'JOURNEY_COMPLETION'>) {
  const { data } = action.payload
  const currentUser = yield select(commonSelectors.currentUserSelector)
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

  yield put(commonActions.setPredictionEngineState(stateToSet))
  yield put(commonActions.updateFuturePrediction(true, null))
  yield put(commonActions.setTutorialOneActive(true))
  yield put(commonActions.setTutorialTwoActive(true))
  yield delay(5000) // !!! THis is here for a bug on slower devices that cause the app to crash on sign up. Did no debug further. Note only occurs on much older phones
  yield call(navigateAndReset, 'MainStack', null)
}

export function* authSaga() {
  yield all([
    takeLatest(REHYDRATE, onRehydrate),
    takeLatest('LOGOUT_REQUEST', onLogoutRequest),
    takeLatest('LOGIN_REQUEST', onLoginRequest),
    takeLatest('LOGIN_SUCCESS', onLoginSuccess),
    takeLatest('DELETE_ACCOUNT_REQUEST', onDeleteAccountRequest),
    takeLatest('CREATE_ACCOUNT_REQUEST', onCreateAccountRequest),
    takeLatest('CREATE_ACCOUNT_SUCCESS', onCreateAccountSuccess),
    takeLatest('CONVERT_GUEST_ACCOUNT', onConvertGuestAccount),
    takeLatest('JOURNEY_COMPLETION', onJourneyCompletion),
  ])
}
