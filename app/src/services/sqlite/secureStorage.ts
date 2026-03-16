// Stores plain password in iOS Keychain / Android Keystore for server sync — never in SQLite

// Dynamic require so the module doesn't crash in Expo Go (native module not available there)
let SecureStore: {
  setItemAsync: (key: string, value: string) => Promise<void>
  getItemAsync: (key: string) => Promise<string | null>
  deleteItemAsync: (key: string) => Promise<void>
} | null = null

try {
  SecureStore = require('expo-secure-store')
} catch {
  // expo-secure-store not available in Expo Go — in-memory fallback will be used
}

// In-memory fallback used only in Expo Go
const memoryFallback = new Map<string, string>()

const PASSWORD_KEY_PREFIX = 'oky_sync_pw_'

function passwordKey(userId: string): string {
  return `${PASSWORD_KEY_PREFIX}${userId}`
}

// Save plain password to secure storage on account creation (deleted after server sync)
export async function savePasswordSecurely(userId: string, password: string): Promise<void> {
  const key = passwordKey(userId)
  if (SecureStore) {
    await SecureStore.setItemAsync(key, password)
  } else {
    memoryFallback.set(key, password)
  }
}

// Retrieve plain password for server sync — returns null if already synced or missing
export async function getSecurePassword(userId: string): Promise<string | null> {
  const key = passwordKey(userId)
  if (SecureStore) {
    return SecureStore.getItemAsync(key)
  }
  return memoryFallback.get(key) ?? null
}

// Delete plain password after successful server sync
export async function deleteSecurePassword(userId: string): Promise<void> {
  const key = passwordKey(userId)
  try {
    if (SecureStore) {
      await SecureStore.deleteItemAsync(key)
    } else {
      memoryFallback.delete(key)
    }
  } catch {
    // Already deleted or never existed — safe to ignore
  }
}

// ------- Secret answer (same lifecycle as password) -------

const SECRET_ANSWER_KEY_PREFIX = 'oky_sync_sa_'

function secretAnswerKey(userId: string): string {
  return `${SECRET_ANSWER_KEY_PREFIX}${userId}`
}

// Save plain secret answer to secure storage on account creation (deleted after server sync)
export async function saveSecretAnswerSecurely(userId: string, secretAnswer: string): Promise<void> {
  const key = secretAnswerKey(userId)
  if (SecureStore) {
    await SecureStore.setItemAsync(key, secretAnswer)
  } else {
    memoryFallback.set(key, secretAnswer)
  }
}

// Retrieve plain secret answer for server sync — returns null if already synced or missing
export async function getSecureSecretAnswer(userId: string): Promise<string | null> {
  const key = secretAnswerKey(userId)
  if (SecureStore) {
    return SecureStore.getItemAsync(key)
  }
  return memoryFallback.get(key) ?? null
}

// Delete plain secret answer after successful server sync
export async function deleteSecureSecretAnswer(userId: string): Promise<void> {
  const key = secretAnswerKey(userId)
  try {
    if (SecureStore) {
      await SecureStore.deleteItemAsync(key)
    } else {
      memoryFallback.delete(key)
    }
  } catch {
    // Already deleted or never existed — safe to ignore
  }
}
