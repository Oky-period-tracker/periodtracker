import { applyMiddleware, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from '@react-native-async-storage/async-storage'
import { encryptTransform } from 'redux-persist-transform-encrypt'
import createSagaMiddleware from 'redux-saga'
import { version } from './version'
import { config } from '../resources/redux'
import { createRootReducer } from './reducers'
import { rootSaga } from './sagas'
import { userReducer } from './reducers/userReducer'
import { handleEncryptionKeys } from '../services/encryption'
import { logoutCleanup } from './actions'
import { deleteSecureValue, removeAsyncStorageItem } from '../services/storage'

const primaryPersistConfig = {
  version,
  key: 'primary',
  storage,
  transforms: [
    encryptTransform({
      secretKey: config.REDUX_ENCRYPT_KEY,
    }),
  ],
  blacklist: ['user'],
}

const persistedReducer = persistReducer(primaryPersistConfig, createRootReducer({ userReducer }))

const sagaMiddleware = createSagaMiddleware()

const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware))

const persistor = persistStore(store)

sagaMiddleware.run(rootSaga)

export { store, persistor }

export const replacePersistUserRedux = async (userId: string, password: string) => {
  const secretKey = await handleEncryptionKeys(userId, password)

  if (!secretKey) {
    return false
  }

  const userPersistConfig = {
    key: userId,
    storage,
    transforms: [
      encryptTransform({
        secretKey,
      }),
    ],
  }

  const persistedUserReducer = persistReducer(userPersistConfig, userReducer)

  const persistedRootReducer = persistReducer(
    primaryPersistConfig,
    createRootReducer({ userReducer: persistedUserReducer }),
  )

  store.replaceReducer(persistedRootReducer)
  persistor.persist()
  return true
}

export const logOutUserRedux = () => {
  const persistedRootReducer = persistReducer(
    primaryPersistConfig,
    createRootReducer({ userReducer }),
  )

  store.replaceReducer(persistedRootReducer)
  persistor.persist()
  store.dispatch(logoutCleanup())
}

export const deleteUserRedux = (userId: string) => {
  logOutUserRedux()
  removeAsyncStorageItem(`persist:${userId}`)
  deleteSecureValue(`${userId}_salt`)
  deleteSecureValue(`${userId}_encrypted_dek`)
}
