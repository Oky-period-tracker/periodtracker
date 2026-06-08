// Orchestrates every change to the ACTIVE account: signup, login, switch, delete.
// These must live outside the per-user redux saga, because storeManager.switchToUser tears
// down and rebuilds the active store (cancelling the saga that called it). The UI calls these
// directly. Each updates the registry and credential vault, switches the per-user store, and
// dispatches the resulting user into the freshly built store.
import { getActiveBundle, switchToUser } from '../../redux/storeManager'
import { ANON_USER_ID } from '../storage/storageKeys'
import { loginSuccess } from '../../redux/actions'
import * as registry from '../userMetadata/registry'
import { saveCredential, verifyPassword, setNewPassword, verifySecretAnswer } from './credentialVault'
import { getDeviceId } from '../deviceId'
import { uuidv4 } from '../uuid'

export const MAX_ACCOUNTS = registry.MAX_ACCOUNTS_ERROR

export interface NewAccount {
  id?: string
  name: string
  password: string
  secretQuestion?: string
  secretAnswer?: string
  gender?: string
  location?: string
  country?: string
  province?: string
  dateOfBirth?: string
  dateSignedUp: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any
}

function toUser(id: string, a: NewAccount) {
  return {
    id,
    name: a.name,
    password: a.password,
    secretQuestion: a.secretQuestion ?? '',
    secretAnswer: a.secretAnswer ?? '',
    gender: a.gender ?? '',
    location: a.location ?? '',
    country: a.country ?? '',
    province: a.province ?? '',
    dateOfBirth: a.dateOfBirth ?? '',
    dateSignedUp: a.dateSignedUp,
    isGuest: false as const,
    metadata: a.metadata ?? {},
  }
}

function dispatchUser(user: ReturnType<typeof toUser>): void {
  const bundle = getActiveBundle()
  // appToken is undefined until the account syncs to the server.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bundle?.store.dispatch(loginSuccess({ appToken: undefined as any, user: user as any }))
}

// Create a new account: register it, store its credentials, give it its own store, and make
// it active and logged in. Marked pending-sync so the server registration can happen later.
export async function signupAccount(a: NewAccount): Promise<{ userId: string }> {
  const existing = await registry.findUserByName(a.name)
  if (existing) {
    throw new Error('name_taken')
  }
  const deviceId = await getDeviceId()
  const userId = a.id || uuidv4()
  // Throws MAX_ACCOUNTS_ERROR if the device already has the maximum number of accounts.
  await registry.addUser({ id: userId, name: a.name, deviceId, isPendingSync: true, appToken: null })
  await saveCredential({
    userId,
    password: a.password,
    secretAnswer: a.secretAnswer ?? null,
    keepPlainForSync: true,
  })
  await switchToUser(userId)
  dispatchUser(toUser(userId, a))
  return { userId }
}

// Attempt an offline login against a locally registered account. Returns false if no local
// account exists for that name (caller may then fall back to an online login). Throws
// 'login_failed' if the account exists but the password is wrong.
export async function loginToAccount(name: string, password: string): Promise<boolean> {
  const account = await registry.findUserByName(name)
  if (!account) {
    return false
  }
  const ok = await verifyPassword(account.id, password)
  if (!ok) {
    throw new Error('login_failed')
  }
  await switchToUser(account.id)
  return true
}

// Reset an account's password offline by verifying its secret answer.
export async function resetPasswordOffline(
  name: string,
  secretAnswer: string,
  newPassword: string,
): Promise<boolean> {
  const account = await registry.findUserByName(name)
  if (!account) {
    return false
  }
  const ok = await verifySecretAnswer(account.id, secretAnswer)
  if (!ok) {
    throw new Error('wrong_secret_answer')
  }
  await setNewPassword(account.id, newPassword)
  return true
}

export async function switchToAccount(userId: string): Promise<void> {
  await switchToUser(userId)
}

// Leave the active account and return to the logged-out (anon) context.
export async function logoutToAnon(): Promise<void> {
  await switchToUser(ANON_USER_ID)
}

// Remove an account entirely (registry entry, per-user store, credentials) and switch away
// from it if it was active.
export async function deleteAccount(userId: string): Promise<void> {
  await registry.removeUser(userId)
  const remaining = await registry.listUsers()
  await switchToUser(remaining.length > 0 ? remaining[0].id : ANON_USER_ID)
}

export async function listAccounts() {
  return registry.listUsers()
}
