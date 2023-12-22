import { config } from '../config'
import { configureStore } from '../store'
import { commonRootReducer } from './reducers'
import { commonRootSaga } from './sagas'

const { persistor, store } = configureStore({
  key: 'primary',
  secretKey: config.REDUX_ENCRYPT_KEY,
  rootReducer: commonRootReducer,
  rootSaga: commonRootSaga,
})

export { store as commonStore, persistor as commonPersistor }
