// Per-account encryption key, stored in the OS Keychain/Keystore via expo-secure-store. Used to
// encrypt that account's redux store and credential vault, so a leak of one account's key (or the
// on-disk blobs) does not expose the others. Accounts created before this existed have no stored
// key and fall back to the app's global key, so their already-encrypted data keeps decrypting.
import CryptoJS from 'crypto-js'
import { config } from '../../resources/redux'

// Dynamic require so the bundle does not crash if the native module is missing (e.g. Expo Go).
let SecureStore: typeof import('expo-secure-store') | null = null
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  SecureStore = require('expo-secure-store')
} catch {
  SecureStore = null
}

const GLOBAL_KEY: string = config.REDUX_ENCRYPT_KEY

// expo-secure-store keys may only contain [A-Za-z0-9._-].
function secureKeyName(userId: string): string {
  return `oky_enc_${userId.replace(/[^A-Za-z0-9._-]/g, '')}`
}

const memoryCache = new Map<string, string>()

// Thrown when an account is known to have its own Keychain key but that key cannot be read.
// Callers must NOT fall back to the global key in this case: doing so would rehydrate the
// account's correctly-encrypted blob to blank and then overwrite it. Instead the account should
// be treated as temporarily unopenable (fall back to the logged-out context) until the key reads.
export class EncryptionKeyUnavailableError extends Error {
  constructor(userId: string) {
    super(`encryption key unavailable for ${userId}`)
    this.name = 'EncryptionKeyUnavailableError'
  }
}

import AsyncStorage from '@react-native-async-storage/async-storage'
import { USERS_REGISTRY_KEY } from '../storage/storageKeys'

// Does the registry record this account as having its own durable Keychain key?
async function accountExpectsOwnKey(userId: string): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(USERS_REGISTRY_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw) as { users?: Array<{ id: string; hasEncryptionKey?: boolean }> }
    const account = parsed.users?.find((u) => u.id === userId)
    return account?.hasEncryptionKey === true
  } catch {
    return false
  }
}

// The key to encrypt/decrypt this account with: its per-account Keychain key if one exists,
// otherwise the global key (legacy and migrated accounts). Crucially, a *thrown* Keychain read
// (or a missing key) for an account that is supposed to have its own key is treated as an error,
// never as "use the global key" — silently using the wrong key destroys that account's data.
export async function getEncryptionKey(userId: string): Promise<string> {
  const cached = memoryCache.get(userId)
  if (cached) {
    return cached
  }
  const expectsOwnKey = await accountExpectsOwnKey(userId)
  if (SecureStore) {
    let stored: string | null
    try {
      stored = await SecureStore.getItemAsync(secureKeyName(userId))
    } catch (err) {
      if (expectsOwnKey) {
        throw new EncryptionKeyUnavailableError(userId)
      }
      // Legacy account with no per-account key: the read error is irrelevant, the global key is
      // the correct one.
      return GLOBAL_KEY
    }
    if (stored) {
      memoryCache.set(userId, stored)
      return stored
    }
    // No stored key. For a legacy account that is expected; for an own-key account it means the
    // key vanished, and falling back would corrupt — refuse.
    if (expectsOwnKey) {
      throw new EncryptionKeyUnavailableError(userId)
    }
    return GLOBAL_KEY
  }
  if (expectsOwnKey) {
    throw new EncryptionKeyUnavailableError(userId)
  }
  return GLOBAL_KEY
}

export interface CreatedEncryptionKey {
  key: string
  // The Keychain native module is present on this device.
  secureStoreAvailable: boolean
  // The key was durably written to and read back from the Keychain (so it survives a restart).
  persisted: boolean
}

// Generate a fresh per-account key. When the Keychain is available the key is written and read
// back to confirm it persisted (a non-durable key would make the account's data unrecoverable on
// restart); the caller decides whether to proceed. When the Keychain is unavailable the account
// will consistently use the global key, so the random key is neither cached nor persisted.
export async function createEncryptionKey(userId: string): Promise<CreatedEncryptionKey> {
  const key = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex)
  if (!SecureStore) {
    return { key, secureStoreAvailable: false, persisted: false }
  }
  try {
    await SecureStore.setItemAsync(secureKeyName(userId), key)
    const readback = await SecureStore.getItemAsync(secureKeyName(userId))
    if (readback === key) {
      memoryCache.set(userId, key)
      return { key, secureStoreAvailable: true, persisted: true }
    }
  } catch {
    // fall through: not persisted
  }
  return { key, secureStoreAvailable: true, persisted: false }
}

export async function deleteEncryptionKey(userId: string): Promise<void> {
  memoryCache.delete(userId)
  if (SecureStore) {
    try {
      await SecureStore.deleteItemAsync(secureKeyName(userId))
    } catch {
      // already gone
    }
  }
}
