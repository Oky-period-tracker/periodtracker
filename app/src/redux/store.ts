import { applyMiddleware, createStore } from 'redux'
import { persistStore, persistReducer, PersistedState } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { encryptTransform } from 'redux-persist-transform-encrypt'
import createSagaMiddleware from 'redux-saga'
import { rootReducer } from './reducers'
import { rootSaga } from './sagas'
import { config } from '../resources/redux'
import { reduxMigrations, reduxStoreVersion } from '../optional/reduxMigrations'

const encryptor = encryptTransform({
  secretKey: config.REDUX_ENCRYPT_KEY,
  onError: function (/* error */) {
    // @TODO: Handle the error.
  },
})

const persistConfig = {
  version: reduxStoreVersion,
  key: 'primary',
  storage: AsyncStorage,
  transforms: [encryptor],
  migrate: (state: PersistedState) => {
    if (reduxMigrations[reduxStoreVersion]) {
      const result = reduxMigrations[reduxStoreVersion]?.(state, reduxStoreVersion)
      return Promise.resolve(result)
    }
    return Promise.resolve(state)
  },
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const sagaMiddleware = createSagaMiddleware()

const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware))

const persistor = persistStore(store)

sagaMiddleware.run(rootSaga)

export { store, persistor }
