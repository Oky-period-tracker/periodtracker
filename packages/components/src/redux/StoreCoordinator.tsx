import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { configureStore } from './store'
import { config } from './config'
import { rootReducer } from './reducers'
import { rootSaga } from './sagas'
import { REHYDRATE } from 'redux-persist'

interface Keys {
  key: string
  secretKey: string
}

interface Context {
  switchStore: (keys: Keys) => void
  switchToPrimaryStore: () => void
}

const StoreCoordinatorContext = React.createContext<Context>({
  switchStore: () => {
    //
  },
  switchToPrimaryStore: () => {
    //
  },
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
  const [keys, setKeys] = React.useState<Keys | undefined>(undefined)
  const [shouldSwitch, setShouldSwitch] = React.useState(false)
  const [shouldMigrate, setShouldMigrate] = React.useState(false)

  const switchToPrimaryStore = () => {
    setStore(primaryStore)
  }

  const switchStore = ({ key, secretKey }: Keys) => {
    if (!key || !secretKey) {
      return
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

  // ===== Step 1: Detect key change ===== //
  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const primaryState = store.getState()
      // TODO:
      // @ts-ignore
      const currentKeys = primaryState?.keys.keys

      if (currentKeys && currentKeys !== keys) {
        setKeys(currentKeys)
        setState(primaryState)
        setShouldSwitch(true)
      }
    })

    return () => unsubscribe()
  }, [store])

  // ===== Step 2: Switch stores ===== //
  React.useEffect(() => {
    if (!shouldSwitch) {
      return
    }

    switchStore(keys)
    setShouldMigrate(true)
  }, [shouldSwitch])

  // ===== Step 3: Migrate state ===== //
  React.useEffect(() => {
    if (!shouldMigrate) {
      return
    }

    store.dispatch({ type: REHYDRATE, payload: state })

    setShouldSwitch(false)
    setShouldMigrate(false)
    setState(undefined)
  }, [shouldMigrate])

  return (
    <StoreCoordinatorContext.Provider
      value={{
        switchStore,
        switchToPrimaryStore,
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
