// Per-user redux store manager. Replaces the old single static store. Each user gets their
// own redux-persist store keyed 'user:{id}:data', so accounts never share or overwrite state.
// Switching tears down the active store (after flushing it) and builds the selected user's.
import { applyMiddleware, createStore, Store } from 'redux'
import { persistStore, persistReducer, PersistedState, Persistor } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { encryptTransform } from 'redux-persist-transform-encrypt'
import createSagaMiddleware, { Task } from 'redux-saga'
import { rootReducer } from './reducers'
import { rootSaga } from './sagas'
import { config } from '../resources/redux'
import { reduxMigrations, reduxStoreVersion } from '../optional/reduxMigrations'
import { setHttpClientStore } from '../services/HttpClient'
import {
  userDataConfigKey,
  userDataStorageKey,
  ANON_USER_ID,
} from '../services/storage/storageKeys'

export interface StoreBundle {
  userId: string
  store: Store
  persistor: Persistor
}

const encryptor = encryptTransform({
  secretKey: config.REDUX_ENCRYPT_KEY,
  onError: function () {
    // @TODO: handle decryption errors
  },
})

let active: StoreBundle | null = null
let activeSaga: Task | null = null
const listeners = new Set<(bundle: StoreBundle) => void>()

function buildBundle(userId: string): StoreBundle {
  const persistConfig = {
    version: reduxStoreVersion,
    key: userDataConfigKey(userId),
    storage: AsyncStorage,
    transforms: [encryptor],
    migrate: (state: PersistedState) => {
      if (reduxMigrations[reduxStoreVersion]) {
        return Promise.resolve(reduxMigrations[reduxStoreVersion]?.(state, reduxStoreVersion))
      }
      return Promise.resolve(state)
    },
  }
  // @ts-ignore redux-persist reducer typing
  const persistedReducer = persistReducer(persistConfig, rootReducer)
  const sagaMiddleware = createSagaMiddleware()
  // @ts-ignore redux-persist reducer typing
  const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware))
  activeSaga = sagaMiddleware.run(rootSaga)
  const persistor = persistStore(store)
  setHttpClientStore(store as Parameters<typeof setHttpClientStore>[0])
  return { userId, store, persistor }
}

export function getActiveBundle(): StoreBundle | null {
  return active
}

export function subscribeBundle(fn: (bundle: StoreBundle) => void): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

function notify(bundle: StoreBundle): void {
  listeners.forEach((l) => l(bundle))
}

async function teardownActive(): Promise<void> {
  if (!active) {
    return
  }
  try {
    await active.persistor.flush()
  } catch {
    // ignore flush errors during teardown
  }
  if (activeSaga) {
    activeSaga.cancel()
    activeSaga = null
  }
  active = null
}

// Build the store for whoever the registry says is active (or an empty anon store on a
// fresh device). Idempotent: returns the existing bundle if already built.
export async function initStoreManager(): Promise<StoreBundle> {
  if (active) {
    return active
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getActiveUserId } = require('../services/userMetadata/registry') as {
    getActiveUserId: () => Promise<string | null>
  }
  const userId = (await getActiveUserId()) || ANON_USER_ID
  active = buildBundle(userId)
  notify(active)
  return active
}

export async function switchToUser(userId: string): Promise<StoreBundle> {
  if (active && active.userId === userId) {
    return active
  }
  await teardownActive()
  if (userId !== ANON_USER_ID) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { setActiveUser } = require('../services/userMetadata/registry') as {
      setActiveUser: (id: string | null) => Promise<void>
    }
    await setActiveUser(userId)
  }
  active = buildBundle(userId)
  notify(active)
  return active
}

// Delete a user's persisted store blob. Tears down the active store first if it belongs to
// that user. Called by registry.removeUser (lazy-required there to avoid an import cycle).
export async function purgeUserStorage(userId: string): Promise<void> {
  if (active && active.userId === userId) {
    await teardownActive()
  }
  try {
    await AsyncStorage.removeItem(userDataStorageKey(userId))
  } catch {
    // already gone
  }
}
