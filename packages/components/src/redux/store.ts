import { applyMiddleware, createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import { encryptTransform } from 'redux-persist-transform-encrypt'
import storage from 'redux-persist/lib/storage'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'remote-redux-devtools'

// Function to create an encryptor
const createEncryptor = (secretKey) =>
  encryptTransform({
    secretKey,
    onError(error) {
      // Handle the error.
    },
  })

export const version = -1

export function configureStore({ key, secretKey, rootReducer, rootSaga, blacklist }) {
  const encryptor = createEncryptor(secretKey)

  const persistConfig = {
    version,
    key,
    storage,
    timeout: 10000,
    throttle: 500,
    blacklist,
    transforms: [encryptor],
  }

  const persistedReducer = persistReducer(persistConfig, rootReducer)
  const composeEnhancers = composeWithDevTools({
    realtime: true,
    port: 8000,
  })
  const sagaMiddleware = createSagaMiddleware()

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)))

  const persistor = persistStore(store)

  sagaMiddleware.run(rootSaga)

  return { store, persistor }
}
