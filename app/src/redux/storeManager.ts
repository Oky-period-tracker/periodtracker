// Per-user redux store manager. Replaces the old single static store. Each user gets their
// own redux-persist store keyed 'user:{id}:data', so accounts never share or overwrite state.
// Switching tears down the active store (after flushing it) and builds the selected user's.
//
// All transitions (init / switch / purge) are serialized through a single promise chain so that
// concurrent account operations (e.g. a double-tap on the switcher, or a logout firing during a
// signup) can never interleave and corrupt the module state or write one account's data into
// another's store. Each bundle also owns its own saga task, so an overlapping build can never
// orphan a still-running saga.
import { applyMiddleware, createStore, Store } from 'redux'
import { persistStore, persistReducer, PersistedState, Persistor } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { encryptTransform } from 'redux-persist-transform-encrypt'
import createSagaMiddleware, { Task } from 'redux-saga'
import { rootReducer } from './reducers'
import { rootSaga } from './sagas'
import { reduxMigrations, reduxStoreVersion } from '../optional/reduxMigrations'
import { setHttpClientStore } from '../services/HttpClient'
import { getEncryptionKey, EncryptionKeyUnavailableError } from '../services/auth/encryptionKeys'
import {
  userDataConfigKey,
  userDataStorageKey,
  USERS_REGISTRY_KEY,
  ANON_USER_ID,
} from '../services/storage/storageKeys'

export interface StoreBundle {
  userId: string
  store: Store
  persistor: Persistor
  // The saga task for this bundle's store, owned by the bundle so it is always the one cancelled
  // on teardown (never overwritten by an overlapping build).
  saga: Task
}

let active: StoreBundle | null = null
const listeners = new Set<(bundle: StoreBundle) => void>()

// Serialize every store-manager transition. enqueue runs fn only after the previous transition
// has fully settled, so `active` is never mutated by two transitions at once.
let opChain: Promise<unknown> = Promise.resolve()
function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = opChain.then(fn, fn)
  opChain = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

async function buildBundle(userId: string): Promise<StoreBundle> {
  // Per-account encryptor: keyed by this account's Keychain key (or the global key for legacy
  // accounts). Resolving the key first means a key-unavailable error aborts the build BEFORE any
  // store/persistor exists, so a wrong-key store can never be created and then overwrite the blob.
  const secretKey = await getEncryptionKey(userId)
  const encryptor = encryptTransform({
    secretKey,
    onError: function () {
      // @TODO: surface decryption errors
    },
  })
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
  const saga = sagaMiddleware.run(rootSaga)
  setHttpClientStore(store as Parameters<typeof setHttpClientStore>[0])
  // Resolve only after rehydration finishes, so callers (e.g. signup) can dispatch into the
  // store without a late REHYDRATE overwriting what they dispatched.
  return new Promise<StoreBundle>((resolve) => {
    const persistor = persistStore(store, null, () => {
      resolve({ userId, store, persistor, saga })
    })
  })
}

// Build the requested user's bundle, falling back to a fresh anon bundle if that account's
// encryption key cannot be read right now (a transient Keychain failure). The fallback never
// touches the account's persisted blob, so the data stays intact for a later successful open.
async function buildBundleSafe(userId: string): Promise<StoreBundle> {
  try {
    return await buildBundle(userId)
  } catch (err) {
    if (err instanceof EncryptionKeyUnavailableError && userId !== ANON_USER_ID) {
      return buildBundle(ANON_USER_ID)
    }
    throw err
  }
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
  const bundle = active
  active = null
  try {
    await bundle.persistor.flush()
  } catch {
    // ignore flush errors during teardown
  }
  bundle.saga.cancel()
}

async function getActiveUserIdFromStorage(): Promise<string | null> {
  try {
    const raw = await AsyncStorage.getItem(USERS_REGISTRY_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { activeUserId?: string | null }
    return parsed.activeUserId ?? null
  } catch {
    return null
  }
}

async function setActiveUserInStorage(userId: string): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(USERS_REGISTRY_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    parsed.activeUserId = userId
    parsed.users = (parsed.users || []).map((u: any) => ({
      ...u,
      isActive: u.id === userId,
      lastActiveAt: u.id === userId ? new Date().toISOString() : u.lastActiveAt,
    }))
    await AsyncStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(parsed))
  } catch {
    // ignore
  }
}

// Build the store for whoever the registry says is active (or an empty anon store on a
// fresh device). Idempotent: returns the existing bundle if already built. Serialized.
export function initStoreManager(): Promise<StoreBundle> {
  return enqueue(async () => {
    if (active) {
      return active
    }
    const userId = (await getActiveUserIdFromStorage()) || ANON_USER_ID
    active = await buildBundleSafe(userId)
    notify(active)
    return active
  })
}

export function switchToUser(userId: string): Promise<StoreBundle> {
  return enqueue(async () => {
    if (active && active.userId === userId) {
      return active
    }
    await teardownActive()
    if (userId !== ANON_USER_ID) {
      await setActiveUserInStorage(userId)
    }
    active = await buildBundleSafe(userId)
    notify(active)
    return active
  })
}

// Delete a user's persisted store blob. Tears down the active store first if it belongs to
// that user. Called by registry.removeUser (lazy-required there to avoid an import cycle).
export function purgeUserStorage(userId: string): Promise<void> {
  return enqueue(async () => {
    if (active && active.userId === userId) {
      await teardownActive()
    }
    try {
      await AsyncStorage.removeItem(userDataStorageKey(userId))
    } catch {
      // already gone
    }
  })
}
