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
import { hash } from '../services/encryption'
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
  blacklist: ['private'],
}

const persistedReducer = persistReducer(primaryPersistConfig, createRootReducer({ privateReducer }))

const sagaMiddleware = createSagaMiddleware()

const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware))

const persistor = persistStore(store)

sagaMiddleware.run(rootSaga)

export { store, persistor }

export const replacePersistPrivateRedux = async (userId: string, secretKey: string) => {
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

export const deleteUserRedux = async (
  userId: string,
  username: string, //password: string
) => {
  logOutUserRedux()

  /* 
  const { localUserId, DEK } = await localLogin(username, password)

  if (!DEK || !localUserId || localUserId !== userId) {
    return // TODO: Local validation failed
  }

  const appToken = ''
  const onlineSuccess = false

  if (appToken) {
    try {
      await httpClient.deleteUserFromPassword({
        name,
        password,
      })
    } catch (e) {
      //
    }
  }

  if (appToken && !onlineSuccess) {
    return // ERROR, failed to delete online
  } */

  removeAsyncStorageItem(`persist:${userId}`)
  deleteSecureValue(`username_${hash(username)}`)
  deleteSecureValue(`${userId}_encrypted_dek`)
  deleteSecureValue(`${userId}_salt`)

  // analytics?.().logEvent('deleteAccount')
}
