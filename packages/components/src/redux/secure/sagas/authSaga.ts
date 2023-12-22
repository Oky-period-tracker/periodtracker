import { all, call, put, select, takeLatest, delay } from 'redux-saga/effects'
import { REHYDRATE } from 'redux-persist'
import { Alert } from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import { ExtractActionFromActionType } from '../types'
import { httpClient } from '../../../services/HttpClient'
import { SecureReduxState, exportReducerNames } from '../reducers'
import { secureActions } from '../actions'
import { secureSelectors } from '../selectors'
import { navigateAndReset } from '../../../services/navigationService'
import { PredictionState } from '../../../prediction'
import moment from 'moment'
import { closeOutTTs } from '../../../services/textToSpeech'
import { fetchNetworkConnectionStatus } from '../../../services/network'

// unwrap promise
type Await<T> = T extends Promise<infer U> ? U : T

function* onRehydrate() {
  const state: SecureReduxState = yield select()

  const appToken = secureSelectors.appTokenSelector(state)
  const user = secureSelectors.currentUserSelector(state)

  // convert guest account
  if (!appToken && user && user.isGuest) {
    yield put(secureActions.convertGuestAccount(user))
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
    secureActions.createAccountRequest({
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
  const stateRedux: SecureReduxState = yield select()
  const localeapp = secureSelectors.currentLocaleSelector(stateRedux)
  yield secureActions.setLocale(localeapp)

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
      secureActions.loginSuccess({
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
      yield put(secureActions.refreshStore(newAppState))
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
    yield put(
      secureActions.loginFailure({
        error: errorMessage,
      }),
    )
  }
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
      secureActions.createAccountSuccess({
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
    yield put(secureActions.setAuthError({ error: errorStatusCode }))
    yield put(secureActions.createAccountFailure())

    yield put(
      secureActions.loginSuccessAsGuestAccount({
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
    secureActions.loginSuccess({
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
  const state: SecureReduxState = yield select()
  const user = secureSelectors.currentUserSelector(state)
  setLoading(true)
  try {
    const { name, password } = action.payload
    yield httpClient.deleteUserFromPassword({
      name,
      password,
    })
    yield put(secureActions.updateAllSurveyContent([])) // TODO_ALEX
    yield put(secureActions.updateCompletedSurveys([])) // TODO_ALEX
    yield put(
      secureActions.fetchSurveyContentSuccess({
        surveys: null,
      }), // TODO_ALEX
    )
    yield call(navigateAndReset, 'LoginStack', null)

    if (user) {
      yield put(secureActions.logout())
    }
  } catch (err) {
    setLoading(false)
    Alert.alert('Error', 'Unable to delete the account')
  }
}

function* onLogoutRequest() {
  const isTtsActive = yield select(secureSelectors.isTtsActiveSelector)

  if (isTtsActive) {
    yield call(closeOutTTs)
    yield put(secureActions.setTtsActive(false))
    yield put(secureActions.verifyPeriodDayByUser([])) // TODO_ALEX: survey
  }
  yield put(secureActions.updateAllSurveyContent([])) // TODO_ALEX: survey
  yield put(
    secureActions.fetchSurveyContentSuccess({
      surveys: null,
    }),
  )
  yield put(secureActions.updateCompletedSurveys([])) // TODO_ALEX: survey
  yield call(navigateAndReset, 'LoginStack', null)
  yield put(secureActions.logout())
}

function* onJourneyCompletion(action: ExtractActionFromActionType<'JOURNEY_COMPLETION'>) {
  const { data } = action.payload
  const currentUser = yield select(secureSelectors.currentUserSelector)
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

  yield put(secureActions.setPredictionEngineState(stateToSet))
  yield put(secureActions.updateFuturePrediction(true, null))
  yield put(secureActions.setTutorialOneActive(true))
  yield put(secureActions.setTutorialTwoActive(true))
  yield delay(5000) // !!! THis is here for a bug on slower devices that cause the app to crash on sign up. Did no debug further. Note only occurs on much older phones
  yield call(navigateAndReset, 'MainStack', null)
}

export function* authSaga() {
  yield all([
    takeLatest(REHYDRATE, onRehydrate),
    takeLatest('LOGOUT_REQUEST', onLogoutRequest),
    takeLatest('LOGIN_REQUEST', onLoginRequest),
    takeLatest('DELETE_ACCOUNT_REQUEST', onDeleteAccountRequest),
    takeLatest('CREATE_ACCOUNT_REQUEST', onCreateAccountRequest),
    takeLatest('CREATE_ACCOUNT_SUCCESS', onCreateAccountSuccess),
    takeLatest('CONVERT_GUEST_ACCOUNT', onConvertGuestAccount),
    takeLatest('JOURNEY_COMPLETION', onJourneyCompletion),
  ])
}
