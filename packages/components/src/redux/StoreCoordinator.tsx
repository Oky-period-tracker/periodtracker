import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { configureStore } from './store'
import { config } from './config'
import { rootReducer } from './reducers'
import { rootSaga } from './sagas'
import * as actions from './actions'

interface Keys {
  key: string
  secretKey: string
}

interface Context {
  triggerStoreSwitch: () => void
  switchComplete: boolean
}

const StoreCoordinatorContext = React.createContext<Context>({
  triggerStoreSwitch: () => {
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

export function StoreCoordinator({ children }) {
  const [{ persistor, store }, setStore] = React.useState(primaryStore)

  const [state, setState] = React.useState(undefined)
  const [switchComplete, setSwitchComplete] = React.useState(false)
  const [shouldSwitch, setShouldSwitch] = React.useState(false)
  const [shouldMigrate, setShouldMigrate] = React.useState(false)

  const switchStore = ({ key, secretKey }: Keys) => {
    if (!key || !secretKey) {
      return // ERROR
    }
    setStore(
      configureStore({
        key,
        secretKey,
        rootReducer,
        rootSaga,
      }),
    )
  }

  const triggerStoreSwitch = () => {
    if (shouldSwitch) {
      return
    }
    setShouldSwitch(true)
    setShouldMigrate(false)
    setSwitchComplete(false)
  }

  // ===== Switch stores ===== //
  React.useEffect(() => {
    if (!shouldSwitch) {
      return
    }

    const primaryState = store.getState()
    // TODO:
    // @ts-ignore
    const keys = primaryState?.keys?.keys
    // @ts-ignore
    const shouldMigrateData = primaryState?.keys?.shouldMigrateData

    if (!keys) {
      return // ERROR
    }

    setState(primaryState)

    switchStore(keys)
    setShouldMigrate(shouldMigrateData)
    setShouldSwitch(false)

    if (!shouldMigrateData) {
      setSwitchComplete(true)
    }
  }, [shouldSwitch])

  // ===== Migrate state ===== //
  const interval = 500
  const maxAttempts = 10
  let attempts = 0

  React.useEffect(() => {
    if (!shouldMigrate) {
      return
    }

    let cleanup = false

    const attemptMigration = () => {
      store.dispatch(
        actions.migrateStore({
          auth: state.auth,
        }),
      )

      setTimeout(onTimeout, interval)
      attempts++
    }

    const onTimeout = () => {
      if (cleanup) {
        return
      }

      if (attempts > maxAttempts) {
        return // ERROR
      }

      if (attempts === 0) {
        attemptMigration()
        return
      }

      const currentState = store.getState()
      // @ts-ignore
      const migrationComplete = currentState?.keys.migrationComplete

      if (migrationComplete) {
        setShouldMigrate(false)
        setState(undefined)
        setSwitchComplete(true)
        return
      }

      attemptMigration()
    }

    setTimeout(onTimeout, interval)

    return () => {
      cleanup = true
    }
  }, [shouldMigrate])

  return (
    <StoreCoordinatorContext.Provider
      value={{
        triggerStoreSwitch,
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
