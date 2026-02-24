import { applyMiddleware, createStore } from 'redux'
import { persistStore, persistReducer, PersistedState } from 'redux-persist'
import { reduxPersistSQLiteAdapter } from '../services/sqlite/reduxPersistAdapter'
import { encryptTransform } from 'redux-persist-transform-encrypt'
import createSagaMiddleware from 'redux-saga'
import { rootReducer } from './reducers'
import { rootSaga } from './sagas'
import { config } from '../resources/redux'
import { reduxMigrations, reduxStoreVersion } from '../optional/reduxMigrations'
import { initializeDatabase, getDatabase } from '../services/sqlite/database'

let dbInitializationPromise: Promise<void> | null = null
let persistor: any = null
let store: any = null
let storeInitPromise: Promise<{ store: any; persistor: any }> | null = null

async function initializeStore() {
  if (storeInitPromise) {
    return storeInitPromise
  }

  storeInitPromise = (async () => {
    try {
      console.log('[Store] Starting store initialization...')
      
      // Step 1: Initialize database first
      console.log('[Store] Initializing database...')
      await initializeDatabase()
      console.log('[Store] Database initialized - tables created')
      
      // Step 1.5: Verify database is ready by checking tables exist
      console.log('[Store] Verifying tables exist...')
      const db = await getDatabase()
      try {
        // Try to query one of the tables to verify it exists
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const testResult = await (db as any).prepareAsync('SELECT COUNT(*) as count FROM user_app_state LIMIT 1')
        await testResult.finalizeAsync()
        console.log('[Store] Table verification successful - tables exist')
      } catch (verifyError) {
        console.error('[Store] Table verification failed:', verifyError)
        throw new Error(`Tables don't exist after initialization: ${verifyError}`)
      }

      // Step 2: Create encryptor
      const encryptor = encryptTransform({
        secretKey: config.REDUX_ENCRYPT_KEY,
        onError: function (/* error */) {
          // @TODO: Handle the error.
        },
      })

      // Step 3: Create persist config
      const persistConfig: any = {
        version: reduxStoreVersion,
        key: 'primary',
        storage: reduxPersistSQLiteAdapter,
        transforms: [encryptor],
        migrate: (state: PersistedState) => {
          if (reduxMigrations[reduxStoreVersion]) {
            const result = reduxMigrations[reduxStoreVersion]?.(state, reduxStoreVersion)
            return Promise.resolve(result)
          }
          return Promise.resolve(state)
        },
      }

      // Step 4: Create persisted reducer (NOW tables exist)
      // @ts-ignore - redux-persist type compatibility
      const persistedReducer: any = persistReducer(persistConfig, rootReducer)
      console.log('[Store] Persisted reducer created')

      // Step 5: Create saga middleware
      const sagaMiddleware = createSagaMiddleware()

      // Step 6: Create store
      // @ts-ignore - redux-persist type compatibility
      store = createStore(persistedReducer, applyMiddleware(sagaMiddleware))
      console.log('[Store] Store created')

      // Step 7: Run sagas
      sagaMiddleware.run(rootSaga)
      console.log('[Store] Sagas started')

      // Step 8: Create persistor
      console.log('[Store] Creating persistor...')
      persistor = persistStore(store)
      console.log('[Store] Persistor created')

      return { store, persistor }
    } catch (error) {
      console.error('[Store] Failed to initialize:', error)
      throw error
    }
  })()

  return storeInitPromise
}

// Getter that waits for store to be ready
async function getStore() {
  if (!store) {
    console.log('[Store] Waiting for store to be ready...')
    const { store: readyStore } = await initializeStore()
    return readyStore
  }
  return store
}

// Getter that waits for persistor to be ready
async function getPersistor() {
  if (!persistor) {
    console.log('[Store] Waiting for persistor to be ready...')
    const { persistor: readyPersistor } = await initializeStore()
    return readyPersistor
  }
  return persistor
}

export { getStore, getPersistor, initializeStore }
export const storeInitPromiseExport = initializeStore()
