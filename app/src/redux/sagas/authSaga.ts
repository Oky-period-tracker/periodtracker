import { all, delay, fork, put, select, takeLatest } from 'redux-saga/effects'
import { Alert } from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import { ExtractActionFromActionType } from '../types'
import { httpClient } from '../../services/HttpClient'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { resetToAuth } from '../../services/navigationService'
// import { navigateAndReset } from "../../services/navigationService";
import { PredictionState } from '../../prediction'
import moment from 'moment'
// import { closeOutTTs } from "../../services/textToSpeech";
import { fetchNetworkConnectionStatus } from '../../services/network'
import { PartialStateSnapshot } from '../types/partialStore'
import { ReduxState } from '../reducers'
import { analytics } from '../../services/firebase'
import { userRepository } from '../../services/sqlite/userRepository'
import { getDeviceId } from '../../services/deviceId'
import { verifyDatabaseData } from '../../services/sqlite/database'
import { verifySecret } from '../../services/sqlite/hashUtils'
import { getSecurePassword, deleteSecurePassword, getSecureSecretAnswer, deleteSecureSecretAnswer } from '../../services/sqlite/secureStorage'

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

function* syncPendingAccounts() {
  while (true) {
    try {
      // Check every 60 seconds
      yield delay(60 * 1000)
      
      // Check internet status
      let isOnline: any = false
      try {
        isOnline = yield fetchNetworkConnectionStatus()
      } catch (netError) {
        console.warn('[Auth] Network detection failed:', netError)
        isOnline = false
      }

      if (!isOnline) {
        continue
      }

      // Get all accounts with pending sync
      const pendingAccounts: any = yield userRepository.getUsersWithPendingSync()

      if (pendingAccounts.length === 0) {
        continue
      }

      // Sync each pending account
      for (const account of pendingAccounts) {
        try {
          if (!account.id) {
            console.error('[Auth] Missing account id for secure storage lookup:', account.name)
            continue
          }

          // Read plain password from Keychain (never stored in SQLite)
          const plainPassword: string | null = yield getSecurePassword(account.id)
          if (!plainPassword) {
            console.error('[SecureStore] ❌ No password in Keychain for:', account.name, '- skipping sync')
            continue
          }

          // Read plain secret answer from Keychain — fall back to SQLite for legacy accounts
          // created before this security update
          const plainSecretAnswer: string | null =
            (yield getSecureSecretAnswer(account.id)) ?? account.secretAnswer ?? null

          // Call signup API with account details
          const signupPayload = {
            name: account.name,
            password: plainPassword,
            dateOfBirth: account.dateOfBirth,
            gender: account.gender,
            location: account.location,
            country: account.country,
            province: account.province,
            secretQuestion: account.secretQuestion,
            secretAnswer: plainSecretAnswer,
            dateSignedUp: account.dateSignedUp,
            metadata: account.metadata,
            preferredId: account.id,
            deviceId: account.deviceId,
          }
          
          const { appToken, user } = yield httpClient.signup(signupPayload)

          // Update account with appToken and mark as synced
          yield userRepository.updateUser({
            ...account,
            appToken,
            id: user.id || account.id,
            isPendingSync: 0,
            syncedAt: moment.utc().toISOString(),
          })

          // Credentials no longer needed on device — delete from secure storage
          yield deleteSecurePassword(account.id)
          yield deleteSecureSecretAnswer(account.id)

        } catch (syncError) {
          console.warn('[Auth] Failed to sync account:', account.name)
          if (syncError && syncError.response) {
            console.error('[Auth] API Response Error:', syncError.response.status, syncError.response.data)
          } else if (syncError && syncError.message) {
            console.error('[Auth] Error Details:', syncError.message)
            console.error('[Auth] Full Error:', syncError)
          } else {
            console.error('[Auth] Error:', syncError)
          }
          // Continue with next account instead of failing
        }
      }
    } catch (err) {
      console.error('[Auth] syncPendingAccounts error:', err)
      // Continue the loop even if there's an error
    }
  }
}

function* onConvertGuestAccount(action: ExtractActionFromActionType<'CONVERT_GUEST_ACCOUNT'>) {
  const payload = action.payload
  // Only attempt conversion if still a guest
  const state: ReduxState = yield select()
  const currentUser = selectors.currentUserSelector(state)
  
  if (currentUser && !currentUser.isGuest) {
    return
  }
  
  yield put(actions.createAccountRequest(payload))
}

function* onLoginRequest(action: ExtractActionFromActionType<'LOGIN_REQUEST'>) {
  const { name, password } = action.payload
  const stateRedux: ReduxState = yield select()
  const localeapp = selectors.currentLocaleSelector(stateRedux)
  yield actions.setLocale(localeapp)

  try {
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
    } catch (apiError) {
      // API failed - try to login from SQLite (offline account)
      const deviceId: any = yield getDeviceId()
      const offlineUser: any = yield userRepository.getUserByName(name, deviceId)
      
      if (!offlineUser) {
        throw new Error('login_failed')
      }

      // Verify password — use PBKDF2 hash if available, plain fallback for legacy accounts
      let passwordMatch = false
      if (offlineUser.passwordHash && offlineUser.passwordSalt) {
        passwordMatch = yield verifySecret(password, offlineUser.passwordHash, offlineUser.passwordSalt)
      } else {
        // Legacy account created before hashing was added
        passwordMatch = offlineUser.password === password
      }
      if (!passwordMatch) {
        throw new Error('login_failed')
      }
      
      yield put(
        actions.loginSuccess({
          appToken: offlineUser.appToken || undefined,
          user: {
            id: offlineUser.id,
            name: offlineUser.name,
            password, // use the user-entered password, not the blank '' stored in SQLite
            dateOfBirth: offlineUser.dateOfBirth,
            gender: offlineUser.gender,
            location: offlineUser.location,
            country: offlineUser.country,
            province: offlineUser.province,
            isGuest: false,
          } as any,
        }),
      )
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
    } else if (error instanceof Error) {
      errorMessage = error.message
    }
    
    console.error('[Auth] Login error:', errorMessage)
    yield put(
      actions.loginFailure({
        error: errorMessage,
      }),
    )
  }
}

function* onCreateAccountRequest(action: ExtractActionFromActionType<'CREATE_ACCOUNT_REQUEST'>): any {
  const dateSignedUp = moment.utc().toISOString()
  const { id, name, password } = action.payload

  try {
    // Check if user is already logged in with this name (prevent duplicate signup)
    const state: ReduxState = yield select()
    const currentUser = selectors.currentUserSelector(state)
    if (currentUser && currentUser.name === name) {
      yield put(actions.createAccountSuccess({
        appToken: currentUser.appToken,
        user: currentUser,
      }))
      return
    }

    let isOnline: any = false
    try {
      isOnline = yield fetchNetworkConnectionStatus()
    } catch (netError) {
      isOnline = false
    }

    if (!isOnline) {
      const deviceId: any = yield getDeviceId()

      const existingUser: any = yield userRepository.getUserByName(name, deviceId)
      if (existingUser) {
        throw new Error('Username already taken on this device')
      }

      const userCount: any = yield userRepository.getUserCount(deviceId)
      if (userCount >= 3) {
        throw new Error('Maximum 3 accounts allowed per device, Try to delete a account before creating a new account')
      }

      // Create user in SQLite with pending sync flag
      const userId = id || uuidv4()
      
      // Final check before creating - prevent race condition
      const finalUserCount: any = yield userRepository.getUserCount(deviceId)
      if (finalUserCount >= 3) {
        throw new Error('Maximum 3 accounts allowed per device, Try to delete a account before creating a new account')
      }
      
      yield userRepository.createUser({
        id: userId,
        deviceId,
        name,
        password,
        gender: action.payload.gender || undefined,
        location: action.payload.location || undefined,
        country: action.payload.country || undefined,
        province: action.payload.province || undefined,
        dateOfBirth: action.payload.dateOfBirth || undefined,
        secretQuestion: action.payload.secretQuestion || undefined,
        secretAnswer: action.payload.secretAnswer || undefined,
        dateSignedUp,
        isPendingSync: true, // Mark for sync when online
        isActive: true,
        isGuest: false,
      })

      // Dispatch success with local ID (no appToken yet)
      yield put(
        actions.createAccountSuccess({
          appToken: undefined,
          user: {
            id: userId,
            name,
            password,
            dateOfBirth: action.payload.dateOfBirth,
            gender: action.payload.gender,
            location: action.payload.location,
            country: action.payload.country,
            province: action.payload.province,
            secretQuestion: action.payload.secretQuestion,
            secretAnswer: action.payload.secretAnswer,
            dateSignedUp,
            isGuest: false,
          } as any,
        }),
      )
    } else {
      // Check device limit BEFORE calling API
      const deviceId: any = yield getDeviceId()
      const userCount: any = yield userRepository.getUserCount(deviceId)
      if (userCount >= 3) {
        throw new Error('Maximum 3 accounts allowed per device, Try to delete a account before creating a new account')
      }
      
      try {
        const { appToken, user }: Await<ReturnType<typeof httpClient.signup>> = yield httpClient.signup(
          {
            ...action.payload,
            preferredId: id || null,
            deviceId,
          },
        )
        if (!appToken || !user || !user.id) {
          throw new Error(`Invalid response from server`)
        }

        // Final check before saving - prevent race condition
        const finalUserCount: any = yield userRepository.getUserCount(deviceId)
        if (finalUserCount >= 3) {
          throw new Error('Maximum 3 accounts allowed per device, Try to delete a account before creating a new account')
        }

        // Save to SQLite (savePasswordSecurely is called inside createUser)
        yield userRepository.createUser({
          id: user.id,
          deviceId,
          name,
          password,
          gender: action.payload.gender || undefined,
          location: action.payload.location || undefined,
          country: action.payload.country || undefined,
          province: action.payload.province || undefined,
          dateOfBirth: action.payload.dateOfBirth || undefined,
          secretQuestion: action.payload.secretQuestion || undefined,
          secretAnswer: action.payload.secretAnswer || undefined,
          dateSignedUp,
          appToken,
          isPendingSync: false, // Already synced
          isActive: true,
          isGuest: false,
        })

        // Verify data was saved to database
        yield verifyDatabaseData()
        
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
      } catch (apiError) {
        // API call failed - fallback to offline mode
        console.warn('[Auth] API call failed, falling back to offline mode:', apiError)
        const deviceId: any = yield getDeviceId()

        // Check if username already exists on this device
        const existingUser: any = yield userRepository.getUserByName(name, deviceId)
        if (existingUser) {
          throw new Error('Username already taken on this device')
        }

        // Check if device already has max 3 users
        const userCount: any = yield userRepository.getUserCount(deviceId)
        if (userCount >= 3) {
          throw new Error('Maximum 3 accounts allowed per device, Try to delete a account before creating a new account')
        }

        // Create user in SQLite with pending sync flag
        const userId = id || uuidv4()
        
        // Final check before creating - prevent race condition
        const finalUserCount: any = yield userRepository.getUserCount(deviceId)
        if (finalUserCount >= 3) {
          throw new Error('Maximum 3 accounts allowed per device, Try to delete a account before creating a new account')
        }
        
        yield userRepository.createUser({
          id: userId,
          deviceId,
          name,
          password,
          gender: action.payload.gender || undefined,
          location: action.payload.location || undefined,
          country: action.payload.country || undefined,
          province: action.payload.province || undefined,
          dateOfBirth: action.payload.dateOfBirth || undefined,
          secretQuestion: action.payload.secretQuestion || undefined,
          secretAnswer: action.payload.secretAnswer || undefined,
          dateSignedUp,
          isPendingSync: true, // Mark for sync when online
          isActive: true,
          isGuest: false,
        })

        // Verify data was actually saved to database
        yield verifyDatabaseData()

        // Dispatch success with local ID
        yield put(
          actions.createAccountSuccess({
            appToken: undefined,
            user: {
              id: userId,
              name,
              password,
              dateOfBirth: action.payload.dateOfBirth,
              gender: action.payload.gender,
              location: action.payload.location,
              country: action.payload.country,
              province: action.payload.province,
              secretQuestion: action.payload.secretQuestion,
              secretAnswer: action.payload.secretAnswer,
              dateSignedUp,
              isGuest: false,
            } as any,
          }),
        )
      }
    }
  } catch (error) {
    const errorStatusCode =
      // @ts-expect-error TODO:
      error && error.response && error.response.status
        ? // @ts-expect-error TODO:
          error.response.status
        : null // to check various error codes and respond accordingly
    
    const errorMessage = error instanceof Error ? error.message : 'Signup failed'
    console.error('[Auth] Signup error:', errorMessage, error)

    const isNameTaken =
      errorMessage.includes('already taken') || errorMessage.includes('already exists')
    const isMaxAccounts = errorMessage.includes('Maximum')

    if (isNameTaken) {
      yield put(actions.setAuthError({ error: 'name_taken' }))
    } else if (isMaxAccounts) {
      Alert.alert('Signup Failed', errorMessage, [
        {
          text: 'OK',
          onPress: () => resetToAuth(),
        },
      ])
    } else {
      // For other errors, log but don't show - offline fallback should have handled it
      console.warn('[Auth] Signup failed silently (will retry when online):', errorMessage)
    }

    yield put(actions.createAccountFailure())
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
  const state: ReduxState = yield select()
  const currentUser = selectors.currentUserSelector(state)
  const appToken = selectors.appTokenSelector(state)

  try {
    const { name, password } = action.payload

    // Look up the user by name in SQLite - this works whether called from the
    // signup page (no currentUser) or the settings page (currentUser exists).
    const deviceId: any = yield getDeviceId()
    const userByName: any = yield userRepository.getUserByName(name, deviceId)

    // Prefer the SQLite look-up; fall back to currentUser (settings page)
    const user = userByName || currentUser

    let isOnline: any = false
    try {
      isOnline = yield fetchNetworkConnectionStatus()
    } catch (netError) {
      console.warn('[Auth] Network detection failed:', netError)
      isOnline = false
    }

    if (isOnline) {
      // Try to delete from server
      try {
        yield httpClient.deleteUserFromPassword({
          name,
          password,
        })
      } catch (apiError) {
        console.error('[Auth] Server delete failed:', apiError)
        throw apiError
      }

      // Delete from SQLite
      if (user?.id) {
        try {
          yield userRepository.deleteUser(user.id)
        } catch (sqlError) {
          console.error('[Auth] SQLite delete error:', sqlError)
          throw new Error('Failed to delete account from local database')
        }
      }
    } else {
      const sqliteUserAppToken = user?.appToken

      if (sqliteUserAppToken) {
        throw new Error('unable to process your request, as there is no internet')
      }

      // Pure offline account - delete from SQLite
      if (user?.id) {
        try {
          yield userRepository.deleteUser(user.id)
        } catch (sqlError) {
          console.error('[Auth] SQLite delete error:', sqlError)
          throw new Error('Failed to delete account')
        }
      } else {
        throw new Error('delete_account_fail')
      }
    }

    analytics?.().logEvent('deleteAccount')

    yield put(actions.updateAllSurveyContent([])) // TODO: ?
    yield put(actions.updateCompletedSurveys([])) // TODO: ?

    if (currentUser) {
      // User was logged in (settings page) - logout handles navigation
      yield put(actions.logout())
    } else {
      // Called from signup page - no active session to log out, navigate manually
      Alert.alert('delete_account', 'delete_account_completed')
      resetToAuth()
    }
  } catch (err) {    
    const errorMessage = err instanceof Error ? err.message : 'delete_account_fail'
    console.error('[Auth] Delete account error:', errorMessage)
    Alert.alert('error', errorMessage)
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
      // ignore prediction error
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
    fork(syncPendingAccounts),
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
