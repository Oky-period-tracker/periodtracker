import { applyMiddleware, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from '@react-native-async-storage/async-storage'
import { encryptTransform } from 'redux-persist-transform-encrypt'
import createSagaMiddleware from 'redux-saga'
import { version } from './version'
import { config } from '../resources/redux'
import { createRootReducer } from './reducers'
import { rootSaga } from './sagas'
import { privateReducer } from './reducers/private/privateReducer'
import { logoutCleanup } from './actions'

const primaryPersistConfig = {
  version,
  key: 'primary',
  storage,
  transforms: [
    encryptTransform({
      secretKey: config.REDUX_ENCRYPT_KEY,
    }),
  ],
  blacklist: ['private'],
}

const persistedReducer = persistReducer(primaryPersistConfig, createRootReducer({ privateReducer }))

const sagaMiddleware = createSagaMiddleware()

const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware))

const persistor = persistStore(store)

sagaMiddleware.run(rootSaga)

export { store, persistor }

export const replacePersistPrivateRedux = (
  userId: string,
  secretKey: string,
  onRehydrateComplete?: () => void,
) => {
  if (!secretKey) {
    return false
  }

  const privatePersistConfig = {
    key: userId,
    storage,
    transforms: [
      encryptTransform({
        secretKey,
      }),
    ],
  }

  const persistedUserReducer = persistReducer(privatePersistConfig, privateReducer)

  const persistedRootReducer = persistReducer(
    primaryPersistConfig,
    createRootReducer({ privateReducer: persistedUserReducer }),
  )

  store.replaceReducer(persistedRootReducer)
  persistor.persist()

  // AFTER REHYDRATE
  const unsubscribe = store.subscribe(() => {
    const lastAction = store.getState()._persist?.rehydrated
    if (lastAction) {
      unsubscribe() // Ensure we only call this once
      onRehydrateComplete?.()
    }
  })
  return true
}

export const logOutUserRedux = () => {
  const persistedRootReducer = persistReducer(
    primaryPersistConfig,
    createRootReducer({ privateReducer }),
  )

  store.replaceReducer(persistedRootReducer)
  persistor.persist()
  store.dispatch(logoutCleanup())
}
