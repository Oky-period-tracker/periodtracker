import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { configureStore } from './store'
import { config } from './config'
import { commonRootReducer } from './common/reducers'
import { commonRootSaga } from './common/sagas'
import { REHYDRATE } from 'redux-persist'
import { commonActions } from './common/actions'

interface Keys {
  key: string
  secretKey: string
}

interface Context {
  switchStore: (keys: Keys) => void
  switchToCommonStore: () => void
}

const StoreCoordinatorContext = React.createContext<Context>({
  switchStore: () => {
    //
  },
  switchToCommonStore: () => {
    //
  },
})

const commonStore = configureStore({
  key: 'primary',
  secretKey: config.REDUX_ENCRYPT_KEY,
  rootReducer: commonRootReducer,
  rootSaga: commonRootSaga,
})

export function StoreCoordinator({ children }) {
  const [{ persistor, store }, setStore] = React.useState(commonStore)

  const hasTimedOut = React.useRef(false)

  const [state, setState] = React.useState(undefined)
  const [keys, setKeys] = React.useState<Keys | undefined>(undefined)
  const [shouldSwitch, setShouldSwitch] = React.useState(false)
  const [shouldMigrate, setShouldMigrate] = React.useState(false)

  const switchToCommonStore = () => {
    setStore(commonStore)
  }

  const switchStore = ({ key, secretKey }: Keys) => {
    setStore(
      configureStore({
        key,
        secretKey,
        rootReducer: commonRootReducer,
        rootSaga: commonRootSaga,
      }),
    )
  }

  React.useEffect(() => {
    if (hasTimedOut.current) {
      return
    }

    hasTimedOut.current = true

    setTimeout(() => {
      store.dispatch(commonActions.setStoreKeys({ key: 'test', secretKey: 'test' }))
    }, 20000)
  })

  // ===== Step 1: Detect key change ===== //
  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const commonState = store.getState()
      // TODO:
      // @ts-ignore
      const currentKeys = commonState.access.keys

      if (currentKeys && currentKeys !== keys) {
        setKeys(currentKeys)
        setState(commonState)
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
        switchToCommonStore,
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
