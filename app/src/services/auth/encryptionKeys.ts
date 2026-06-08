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

// The key to encrypt/decrypt this account with: its per-account Keychain key if one exists,
// otherwise the global key (legacy and migrated accounts).
export async function getEncryptionKey(userId: string): Promise<string> {
  const cached = memoryCache.get(userId)
  if (cached) {
    return cached
  }
  if (SecureStore) {
    try {
      const stored = await SecureStore.getItemAsync(secureKeyName(userId))
      if (stored) {
        memoryCache.set(userId, stored)
        return stored
      }
    } catch {
      // fall through to the global key
    }
  }
  return GLOBAL_KEY
}

// Generate and persist a fresh per-account key in the Keychain. Called when an account is created.
export async function createEncryptionKey(userId: string): Promise<string> {
  const key = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex)
  memoryCache.set(userId, key)
  if (SecureStore) {
    try {
      await SecureStore.setItemAsync(secureKeyName(userId), key)
    } catch {
      // best effort; cached for this session at least
    }
  }
  return key
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
