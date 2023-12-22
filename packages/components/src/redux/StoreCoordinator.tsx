import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { configureStore } from './store'
import { config } from './config'
import { commonRootReducer } from './common/reducers'
import { commonRootSaga } from './common/sagas'
import { secureRootReducer } from './secure/reducers'
import { secureRootSaga } from './secure/sagas'

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

  const switchToCommonStore = () => {
    setStore(commonStore)
  }

  const switchStore = ({ key, secretKey }: Keys) => {
    setStore(
      configureStore({
        key,
        secretKey,
        rootReducer: secureRootReducer,
        rootSaga: secureRootSaga,
      }),
    )
  }

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
