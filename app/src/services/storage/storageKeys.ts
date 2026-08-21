// Single source of truth for every multi-user storage key.
// Nothing else in the app should hardcode these strings.

// The legacy single-user redux-persist blob, written before multi-user existed.
export const LEGACY_PERSIST_KEY = 'persist:primary'

// The redux-persist config "key" for a given user (what persistReducer is configured with).
export const userDataConfigKey = (userId: string): string => `user:${userId}:data`

// The actual AsyncStorage key redux-persist writes under for that config key.
export const userDataStorageKey = (userId: string): string => `persist:user:${userId}:data`

// The account registry: list of local accounts plus the active user id.
export const USERS_REGISTRY_KEY = 'metadata:oky:users'

// Encrypted per-user credential record (hashes plus sync secrets).
export const credentialKey = (userId: string): string => `metadata:oky:cred:${userId}`
// Encrypted, retryable server snapshot for an account.
export const syncSnapshotKey = (userId: string): string => `metadata:oky:sync:${userId}`

// Stable per-install device id, used to scope the per-device account limit.
export const DEVICE_ID_KEY = 'metadata:oky:deviceId'

// One-time legacy migration completion flag.
export const MIGRATION_FLAG_KEY = 'metadata:oky:migrated'

// Placeholder id used before any real account exists on the device.
export const ANON_USER_ID = '__anon__'
