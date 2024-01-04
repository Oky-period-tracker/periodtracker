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
}

const StoreCoordinatorContext = React.createContext<Context>({
  switchStore: () => {
    //
  },
  switchComplete: false,
})

const primaryStore = configureStore({
  key: 'primary',
  secretKey: config.REDUX_ENCRYPT_KEY,
  rootReducer,
  rootSaga,
})

interface State {
  redux: ReturnType<typeof configureStore>
  storeStateSnapshot: ReduxPersistState | undefined
  shouldMigrate: boolean
  switchComplete: boolean
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

const initialState: State = {
  redux: primaryStore,
  storeStateSnapshot: undefined,
  shouldMigrate: false,
  switchComplete: false,
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
  }
}

export function StoreCoordinator({ children }) {
  const [
    {
      redux: { store, persistor },
      storeStateSnapshot,
      shouldMigrate,
      switchComplete,
    },
    dispatch,
  ] = React.useReducer(reducer, initialState)

  const switchStore = () => {
    const primaryState = store.getState() as ReduxPersistState
    const keys = primaryState?.keys?.keys
    const shouldMigrateData = primaryState?.keys?.shouldMigrateData

    if (!keys) {
      return // ERROR
    }

    const userStore = configureStore({
      key: keys.key,
      secretKey: keys.secretKey,
      rootReducer,
      rootSaga,
    })

    dispatch({
      type: 'switch_store',
      payload: {
        redux: userStore,
        storeStateSnapshot: primaryState,
        shouldMigrate: shouldMigrateData,
        switchComplete: !shouldMigrateData,
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
      const migrationComplete = currentState?.keys.migrationComplete

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

  return (
    <StoreCoordinatorContext.Provider
      value={{
        switchStore,
        switchComplete,
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
