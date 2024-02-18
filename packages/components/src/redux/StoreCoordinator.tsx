import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { configureStore } from './store'
import { config } from './config'
import { ReduxState, ReduxStateProperties, rootReducer } from './reducers'
import { rootSaga } from './sagas'
import * as actions from './actions'
import { PersistPartial } from 'redux-persist'
import { hash } from '../services/auth'
import { SimpleSplashScreen } from '../screens/SplashScreen'
import _ from 'lodash'
import AsyncStorage from '@react-native-async-storage/async-storage'

type ReduxPersistState = ReduxState & PersistPartial

type ReduxInstance = ReturnType<typeof configureStore>

interface Context {
  switchStore: () => void
  switchComplete: boolean
  logout: () => void
  logoutComplete: boolean
  deleteStore: () => void
}

const StoreCoordinatorContext = React.createContext<Context>({
  switchStore: () => {
    //
  },
  switchComplete: false,
  logout: () => {
    //
  },
  logoutComplete: true,
  deleteStore: () => {
    //
  },
})

const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys()
  } catch (e) {
    // error reading value
    return []
  }
}

const checkStoreExists = async (usernameHash: string) => {
  const keys = await getAllKeys()
  return keys.includes(`persist:${usernameHash}`)
}

const hasMigrated = async () => {
  const keys = await getAllKeys()
  const persistKeys = keys.filter((key) => {
    return key.startsWith('persist:')
  })
  return persistKeys.length > 1
}

const migrationBlacklist: ReduxStateProperties[] = [
  '_persist',
  'access',
  'analytics', // TODO:?
  'content',
]

const initialPrimaryBlacklist: ReduxStateProperties[] = [
  'storeSwitch', // Not persisted for security
  'content', // Moved to async storage
]

const postMigrationBlacklist: ReduxStateProperties[] = [
  'auth', //
  'prediction', //
]

const fullPrimaryBlacklist = [...initialPrimaryBlacklist, ...postMigrationBlacklist]

const userStoreBlacklist = [
  'storeSwitch', // Not persisted for security
  'content', // Moved to async storage
  'access', // Not required after store switch
]

const primaryStore = (blacklist: ReduxStateProperties[]) =>
  configureStore({
    key: 'primary',
    secretKey: config.REDUX_ENCRYPT_KEY,
    blacklist,
    rootReducer,
    rootSaga,
  })

interface State {
  redux: ReduxInstance | undefined
  storeStateSnapshot: ReduxPersistState | undefined
  shouldMigrate: boolean
  switchComplete: boolean
  logoutComplete: boolean
  userToDelete?: string // nameHash
}

type Action =
  | {
      type: 'initialise'
      payload: {
        redux: ReduxInstance
      }
    }
  | {
      type: 'switch_store'
      payload: {
        redux: ReduxInstance
        storeStateSnapshot: ReduxPersistState
        shouldMigrate: boolean
        switchComplete: boolean
      }
    }
  | {
      type: 'complete_migration'
    }
  | {
      type: 'logout_request'
      payload?: {
        userToDelete: string
      }
    }
  | {
      type: 'complete_logout'
    }

const initialState: State = {
  redux: undefined,
  storeStateSnapshot: undefined,
  shouldMigrate: false,
  switchComplete: false,
  logoutComplete: true,
  userToDelete: undefined,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'initialise':
      return {
        ...state,
        redux: action.payload.redux,
      }

    case 'switch_store':
      return {
        ...state,
        redux: action.payload.redux,
        storeStateSnapshot: action.payload.storeStateSnapshot,
        shouldMigrate: action.payload.shouldMigrate,
        switchComplete: action.payload.switchComplete,
      }

    case 'complete_migration':
      return {
        ...state,
        storeStateSnapshot: undefined,
        shouldMigrate: false,
        switchComplete: true,
      }

    case 'logout_request':
      return {
        ...initialState,
        redux: primaryStore(fullPrimaryBlacklist),
        userToDelete: action.payload?.userToDelete,
        logoutComplete: false,
      }

    case 'complete_logout':
      return {
        ...state,
        logoutComplete: true,
      }
  }
}

export function StoreCoordinator({ children }) {
  const [
    { redux, storeStateSnapshot, shouldMigrate, switchComplete, logoutComplete, userToDelete },
    dispatch,
  ] = React.useReducer(reducer, initialState)

  React.useEffect(() => {
    let ignore = false
    if (redux) {
      return
    }

    ;(async () => {
      const canUseFullBlacklist = await hasMigrated()

      if (ignore) {
        return
      }

      const blacklist = canUseFullBlacklist ? fullPrimaryBlacklist : initialPrimaryBlacklist
      const initialStore = primaryStore(blacklist)
      dispatch({ type: 'initialise', payload: { redux: initialStore } })
    })()

    return () => {
      ignore = true
    }
  }, [redux])

  // ===== Switch store ===== //
  const switchStore = async () => {
    if (!redux) {
      return
    }

    const primaryState = redux.store.getState() as ReduxPersistState
    const keys = primaryState?.storeSwitch?.keys

    if (!keys) {
      return // ERROR
    }

    const usernameHash = keys.key
    const storeExists = await checkStoreExists(usernameHash)

    if (!storeExists && !primaryState?.auth.user) {
      // TODO:
      // Need to migrate but have no user data, something went wrong
    }

    const userStore = configureStore({
      key: keys.key,
      secretKey: keys.secretKey,
      blacklist: userStoreBlacklist,
      rootReducer,
      rootSaga,
    })

    dispatch({
      type: 'switch_store',
      payload: {
        redux: userStore,
        storeStateSnapshot: primaryState,
        shouldMigrate: !storeExists,
        switchComplete: storeExists,
      },
    })
  }

  // ===== Migrate state ===== //
  const interval = 500
  const maxAttempts = 10
  let attempts = 0

  React.useEffect(() => {
    let ignore = false
    if (!shouldMigrate) {
      return
    }

    if (!redux) {
      return
    }

    const attemptMigration = () => {
      const stateToMigrate = _.omit(
        { ...storeStateSnapshot },
        migrationBlacklist,
      ) as ReduxPersistState

      redux.store.dispatch(actions.migrateStore(stateToMigrate))

      setTimeout(onTimeout, interval)
      attempts++
    }

    const onTimeout = () => {
      if (ignore) {
        return
      }

      if (attempts > maxAttempts) {
        return // ERROR
      }

      if (attempts === 0) {
        attemptMigration()
        return
      }

      const currentState = redux.store.getState() as ReduxPersistState
      const migrationComplete = currentState?.storeSwitch.migrationComplete

      if (migrationComplete) {
        dispatch({ type: 'complete_migration' })
        return
      }

      attemptMigration()
    }

    setTimeout(onTimeout, interval)

    return () => {
      ignore = true
    }
  }, [shouldMigrate])

  // ===== Log out ===== //
  const logout = (usernameHash?: string) =>
    dispatch({ type: 'logout_request', payload: { userToDelete: usernameHash } })

  React.useEffect(() => {
    if (logoutComplete) {
      return
    }

    if (!redux) {
      return
    }

    setTimeout(() => {
      // TODO: confirm store is ready
      redux.store.dispatch(actions.clearLastLogin())
      if (userToDelete) {
        redux.store.dispatch(actions.deleteUserAccess({ usernameHash: userToDelete }))
      }
      dispatch({ type: 'complete_logout' })
    }, 2000)
  }, [logoutComplete])

  // ===== Delete store ===== //
  const deleteStore = () => {
    if (!redux) {
      return
    }

    const currentState = redux.store.getState() as ReduxPersistState
    const username = currentState?.auth?.user.name
    const usernameHash = hash(username)

    redux.persistor.purge().then(() => {
      logout(usernameHash)
    })
  }

  return (
    <StoreCoordinatorContext.Provider
      value={{
        switchStore,
        switchComplete,
        logout,
        logoutComplete,
        deleteStore,
      }}
    >
      {redux ? (
        <ReduxProvider store={redux.store}>
          <PersistGate loading={null} persistor={redux.persistor}>
            {children}
          </PersistGate>
        </ReduxProvider>
      ) : (
        <SimpleSplashScreen />
      )}
    </StoreCoordinatorContext.Provider>
  )
}

export function useStoreCoordinator() {
  const storeCoordinatorContext = React.useContext(StoreCoordinatorContext)
  if (storeCoordinatorContext === undefined) {
    throw new Error(`useStoreCoordinator must be used within a StoreCoordinator`)
  }

  return storeCoordinatorContext
}
