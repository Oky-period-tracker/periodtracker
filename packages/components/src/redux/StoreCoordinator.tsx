import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { configureStore } from './store'
import { config } from './config'
import { ReduxState, rootReducer } from './reducers'
import { rootSaga } from './sagas'
import * as actions from './actions'
import { PersistPartial } from 'redux-persist'

type ReduxPersistState = ReduxState & PersistPartial

interface Context {
  switchStore: () => void
  switchComplete: boolean
  logout: () => void
  loggedOut: boolean
}

const StoreCoordinatorContext = React.createContext<Context>({
  switchStore: () => {
    //
  },
  switchComplete: false,
  logout: () => {
    //
  },
  loggedOut: true,
})

const primaryStoreBlacklist = [
  'storeSwitch', // Not persisted for security
  'content', // Moved to async storage
  'auth', // Persisted in secure userStore
  'prediction', // Persisted in secure userStore
]
const userStoreBlacklist = [
  'storeSwitch', // Not persisted for security
  'content', // Moved to async storage
  'access', // Not required after store switch
]

const primaryStore = () =>
  configureStore({
    key: 'primary',
    secretKey: config.REDUX_ENCRYPT_KEY,
    blacklist: primaryStoreBlacklist,
    rootReducer,
    rootSaga,
  })

interface State {
  redux: ReturnType<typeof configureStore>
  storeStateSnapshot: ReduxPersistState | undefined
  shouldMigrate: boolean
  switchComplete: boolean
  loggedOut: boolean
}

type Action =
  | {
      type: 'switch_store'
      payload: {
        redux: ReturnType<typeof configureStore>
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
    }
  | {
      type: 'complete_logout'
    }

const initialState: State = {
  redux: primaryStore(),
  storeStateSnapshot: undefined,
  shouldMigrate: false,
  switchComplete: false,
  loggedOut: true,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
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
        redux: primaryStore(),
        loggedOut: false,
      }

    case 'complete_logout':
      return {
        ...state,
        loggedOut: true,
      }
  }
}

export function StoreCoordinator({ children }) {
  const [
    {
      redux: { store, persistor },
      storeStateSnapshot,
      shouldMigrate,
      switchComplete,
      loggedOut,
    },
    dispatch,
  ] = React.useReducer(reducer, initialState)

  // ===== Switch store ===== //
  const switchStore = () => {
    const primaryState = store.getState() as ReduxPersistState
    const keys = primaryState?.storeSwitch?.keys
    const accessState = primaryState?.access

    if (!keys) {
      return // ERROR
    }

    const usernameHash = keys.key
    const storeExists = accessState.storeCredentials?.[usernameHash]?.storeExists

    if (!storeExists) {
      store.dispatch(actions.setStoreExists({ usernameHash }))
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

    const attemptMigration = () => {
      store.dispatch(
        actions.migrateStore({
          auth: storeStateSnapshot?.auth,
        }),
      )

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

      const currentState = store.getState() as ReduxPersistState
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
  const logout = () => dispatch({ type: 'logout_request' })

  React.useEffect(() => {
    if (loggedOut) {
      return
    }

    setTimeout(() => {
      // TODO: confirm store is ready
      store.dispatch(actions.clearLastLogin())
      dispatch({ type: 'complete_logout' })
    }, 2000)
  }, [loggedOut])

  return (
    <StoreCoordinatorContext.Provider
      value={{
        switchStore,
        switchComplete,
        logout,
        loggedOut,
      }}
    >
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </ReduxProvider>
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
