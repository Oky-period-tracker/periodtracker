export interface RegisteredUser {
  // Immutable local id. Used to key the per-user persisted store and credentials.
  // Never changes, even after the account syncs and the server assigns its own id.
  id: string
  // Server-assigned id, recorded after a successful sync. May differ from the local id.
  serverId?: string | null
  name: string
  deviceId: string
  isActive: boolean
  // True while the account exists only locally and still needs to be registered on the server.
  isPendingSync: boolean
  // True when this account has its own durable per-account key in the Keychain. Legacy/migrated
  // accounts (and accounts created where the Keychain was unavailable) use the global key, so this
  // is false/undefined for them. Used to refuse falling back to the global key for an account that
  // actually has its own key, which would otherwise decrypt to blank and overwrite the real data.
  hasEncryptionKey?: boolean
  // True when an online-synced account was deleted offline and the server delete is still pending.
  isPendingDelete?: boolean
  appToken?: string | null
  createdAt: string
  lastActiveAt?: string | null
}

export interface UsersRegistry {
  users: RegisteredUser[]
  activeUserId: string | null
}
