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
  console.log('[Auth] syncPendingAccounts: Starting sync check')
  
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
        console.log('[Auth] syncPendingAccounts: No internet - skipping sync')
        continue
      }

      console.log('[Auth] syncPendingAccounts: Internet available - checking for pending accounts')

      // Get all accounts with pending sync
      const pendingAccounts: any = yield userRepository.getUsersWithPendingSync()
      console.log('[Auth] syncPendingAccounts: Found', pendingAccounts.length, 'accounts pending sync')

      if (pendingAccounts.length === 0) {
        continue
      }

      // Sync each pending account
      for (const account of pendingAccounts) {
        try {
          console.log('[Auth] Syncing account:', account.name)
          console.log('[Auth] Full Account data:', {
            name: account.name,
            password: account.password ? 'SET' : 'MISSING',
            dateOfBirth: account.dateOfBirth,
            gender: account.gender,
            location: account.location,
            country: account.country,
            province: account.province,
            secretQuestion: account.secretQuestion ? 'SET' : 'MISSING',
            secretAnswer: account.secretAnswer ? 'SET' : 'MISSING',
            dateSignedUp: account.dateSignedUp,
            metadata: account.metadata,
          })

          if (!account.password) {
            console.error('[Auth] Missing password for account:', account.name)
            continue
          }

          // Call signup API with account details (including device info for tracking)
          const { appToken, user } = yield httpClient.signup({
            name: account.name,
            password: account.password,
            dateOfBirth: account.dateOfBirth,
            gender: account.gender,
            location: account.location,
            country: account.country,
            province: account.province,
            secretQuestion: account.secretQuestion,
            secretAnswer: account.secretAnswer,
            dateSignedUp: account.dateSignedUp,
            metadata: account.metadata,
            preferredId: account.id, // Use existing ID
            deviceId: account.deviceId, // Track which device this account came from
          })

          console.log('[Auth] Account synced successfully:', account.name)
          console.log('[Auth] Received appToken:', appToken ? 'YES' : 'NO')

          // Update account with appToken and mark as synced
          yield userRepository.updateUser({
            ...account,
            appToken,
            id: user.id || account.id,
            isPendingSync: 0,
            syncedAt: moment.utc().toISOString(),
          })

          console.log('[Auth] Account updated in SQLite:', account.name)
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
  
  console.log('[Auth] onConvertGuestAccount: Current user isGuest:', currentUser?.isGuest, 'Payload isGuest:', payload?.isGuest)
  
  if (currentUser && !currentUser.isGuest) {
    console.log('[Auth] User is no longer guest, skipping conversion attempt')
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
    // First try to login with API
    console.log('[Auth] Login: Trying API first')
    try {
      const {
        appToken,
        user,
        store,
      }: Await<ReturnType<typeof httpClient.login>> = yield httpClient.login({
        name,
        password,
      })

      console.log('[Auth] API login successful')
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
      console.warn('[Auth] API login failed, trying offline login:', apiError)
      const deviceId: any = yield getDeviceId()
      console.log('[Auth] Device ID:', deviceId)
      console.log('[Auth] Looking for user:', name)
      
      const offlineUser: any = yield userRepository.getUserByName(name, deviceId)
      console.log('[Auth] Found offline user:', offlineUser)
      
      if (!offlineUser) {
        console.error('[Auth] User not found in SQLite')
        throw new Error('login_failed')
      }
      
      // Verify password matches
      console.log('[Auth] Comparing passwords')
      console.log('[Auth] Input password:', password)
      console.log('[Auth] Stored password:', offlineUser.password)
      
      if (offlineUser.password !== password) {
        console.error('[Auth] Password incorrect')
        throw new Error('login_failed')
      }
      
      console.log('[Auth] Offline login successful')
      yield put(
        actions.loginSuccess({
          appToken: offlineUser.appToken || undefined,
          user: {
            id: offlineUser.id,
            name: offlineUser.name,
            password: offlineUser.password,
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
      console.log('[Auth] Signup: User already logged in with this name, skipping:', name)
      yield put(actions.createAccountSuccess({
        appToken: currentUser.appToken,
        user: currentUser,
      }))
      return
    }

    // Check network status
    console.log('[Auth] Signup: Checking network status...')
    let isOnline: any = false
    try {
      isOnline = yield fetchNetworkConnectionStatus()
      console.log('[Auth] Signup: Network status =', isOnline ? 'ONLINE' : 'OFFLINE')
    } catch (netError) {
      console.warn('[Auth] Network detection failed, assuming offline:', netError)
      isOnline = false
    }

    if (!isOnline) {
      // OFFLINE MODE: Save account to SQLite
      console.log('[Auth] Signup: OFFLINE MODE - saving to SQLite')
      const deviceId: any = yield getDeviceId()
      console.log('[Auth] DeviceId:', deviceId)

      // Check if username already exists on this device
      const existingUser: any = yield userRepository.getUserByName(name, deviceId)
      console.log('[Auth] getUserByName returned:', existingUser ? 'USER FOUND' : 'NO USER', existingUser?.name)
      if (existingUser) {
        console.log('[Auth] THROWING: Username already taken for:', name, 'Found user:', existingUser.name)
        throw new Error('Username already taken on this device')
      }

      // Check if device already has max 3 users
      const userCount: any = yield userRepository.getUserCount(deviceId)
      console.log('[Auth] User count on device:', userCount)
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

      // Log offline signup
      console.log('[Auth] Offline account created:', { name, deviceId, userId })

      // Dispatch success with local ID (no appToken yet)
      yield put(
        actions.createAccountSuccess({
          appToken: undefined,
          user: {
            id: userId,
            name,
            password,
            dateSignedUp,
            isGuest: false,
          } as any,
        }),
      )
    } else {
      // ONLINE MODE: Call API
      console.log('[Auth] Signup: ONLINE MODE - calling API')
      
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

        // Save to SQLite
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

        console.log('[Auth] Online signup successful, saved to SQLite')
        
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

        console.log('[Auth] Offline account created (API fallback):', { name, deviceId, userId })

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
    
    // Check if this is a validation error that should navigate back
    const shouldNavigateBack = 
      errorMessage.includes('already taken') || 
      errorMessage.includes('Maximum') || 
      errorMessage.includes('already exists')
    
    // Only show error if it's a validation error (not network-related)
    if (shouldNavigateBack) {
      // Show loading and then navigate back
      yield put(actions.setLoading(true))
      
      // Show validation error to user
      Alert.alert('Signup Failed', errorMessage, [
        {
          text: 'OK',
          onPress: () => {
            console.log('[Auth] User acknowledged error - resetting to auth screen')
            resetToAuth()
          },
        },
      ])
    } else {
      // For other errors, log but don't show - offline fallback should have handled it
      console.warn('[Auth] Signup failed silently (will retry when online):', errorMessage)
    }
    
    // IMPORTANT: Always dispatch failure - don't allow navigation to succeed
    yield put(actions.setAuthError({ error: errorStatusCode }))
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
  const user = selectors.currentUserSelector(state)
  const appToken = selectors.appTokenSelector(state)

  try {
    const { name, password } = action.payload
    
    // Check if internet is available
    console.log('[Auth] Delete account - checking internet...')
    let isOnline: any = false
    try {
      isOnline = yield fetchNetworkConnectionStatus()
    } catch (netError) {
      console.warn('[Auth] Network detection failed:', netError)
      isOnline = false
    }

    if (isOnline) {
      // Internet available - delete from BOTH server and SQLite
      console.log('[Auth] Internet available - deleting from both server and SQLite')
      
      // Try to delete from server
      try {
        yield httpClient.deleteUserFromPassword({
          name,
          password,
        })
        console.log('[Auth] Account deleted from server')
      } catch (apiError) {
        console.error('[Auth] Server delete failed:', apiError)
        throw apiError
      }

      // Delete from SQLite
      try {
        yield userRepository.deleteUser(user?.id)
        console.log('[Auth] Account deleted from SQLite')
      } catch (sqlError) {
        console.error('[Auth] SQLite delete error:', sqlError)
        throw new Error('Failed to delete account from local database')
      }
    } else {
      // No internet - can only delete from SQLite if it's pure offline
      console.log('[Auth] No internet - checking if account can be deleted locally')
      
      const isPendingSyncFlag = user?.isPendingSync || 0
      console.log('[Auth] isPendingSync flag:', isPendingSyncFlag)
      
      if (isPendingSyncFlag || appToken) {
        // Account is synced or has appToken - cannot delete without internet
        console.log('[Auth] Account is synced/online - needs internet to delete')
        throw new Error('unable to process your request, as there is no internet')
      }

      // Pure offline account - delete from SQLite
      try {
        console.log('[Auth] Pure offline account - deleting from SQLite')
        yield userRepository.deleteUser(user?.id)
        console.log('[Auth] Offline account deleted from SQLite')
      } catch (sqlError) {
        console.error('[Auth] SQLite delete error:', sqlError)
        throw new Error('Failed to delete account')
      }
    }

    analytics?.().logEvent('deleteAccount')

    yield put(actions.updateAllSurveyContent([])) // TODO: ?
    yield put(actions.updateCompletedSurveys([])) // TODO: ?

    if (user) {
      yield put(actions.logout())
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
