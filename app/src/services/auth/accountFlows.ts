// Orchestrates every change to the ACTIVE account: signup, login, switch, delete.
// These must live outside the per-user redux saga, because storeManager.switchToUser tears
// down and rebuilds the active store (cancelling the saga that called it). The UI calls these
// directly. Each updates the registry and credential vault, switches the per-user store, and
// dispatches the resulting user into the freshly built store.
import {
  flushActiveSyncSnapshot,
  getActiveBundle,
  purgeUserStorage,
  switchToUser,
} from '../../redux/storeManager'
import { ANON_USER_ID } from '../storage/storageKeys'
import {
  loginSuccess,
  setLocale,
  setTheme,
  setAvatar,
  setOnboardingPending,
  refreshStore,
} from '../../redux/actions'
import { loadPendingSyncData, clearPendingSyncData, PendingSyncData } from '../pendingSync'
import * as registry from '../userMetadata/registry'
import {
  saveCredential,
  verifyPassword,
  setNewPassword,
  verifySecretAnswer,
  deleteCredential,
} from './credentialVault'
import { createEncryptionKey, deleteEncryptionKey } from './encryptionKeys'
import { consumePendingLocale } from './pendingLocale'
import { getDeviceId } from '../deviceId'
import { httpClient } from '../HttpClient'
import { uuidv4 } from '../uuid'
import { syncAllAccounts } from '../sync/syncManager'
import { clearSyncSnapshot } from '../sync/syncSnapshot'

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

// Create a new account: register it, store its credentials, give it its own store, and make
// it active and logged in. Marked pending-sync so the server registration can happen later.
export async function signupAccount(a: NewAccount): Promise<{ userId: string }> {
  const existing = await registry.findAnyUserByName(a.name)
  if (existing) {
    throw new Error('name_taken')
  }
  // Capture the language/theme/avatar the user picked on the auth screen. These live in the
  // active (anon) store's app slice and would otherwise be lost when we switch to the new
  // account's fresh store, which resets them to the device/app defaults.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prevApp = (getActiveBundle()?.store.getState() as any)?.app as
    | { locale?: string; theme?: string; avatar?: string }
    | undefined
  // The locale is carried via prevApp below; clear any pending auth-screen pick so it is not also
  // applied to a later login.
  consumePendingLocale()
  const deviceId = await getDeviceId()
  const userId = a.id || uuidv4()
  // Create this account's own Keychain key first. If the Keychain is present but the key did not
  // durably persist, abort rather than encrypt the account's data under a key lost on restart.
  const keyResult = await createEncryptionKey(userId)
  if (keyResult.secureStoreAvailable && !keyResult.persisted) {
    await deleteEncryptionKey(userId)
    throw new Error('keystore_unavailable')
  }
  try {
    await saveCredential({
      userId,
      password: a.password,
      secretAnswer: a.secretAnswer ?? null,
      keepPlainForSync: true,
    })
    // The registry entry is written last, so a registered account always implies a usable
    // credential record and encryption key.
    await registry.addUser({
      id: userId,
      name: a.name,
      deviceId,
      isPendingSync: true,
      appToken: null,
      hasEncryptionKey: keyResult.persisted,
    })
  } catch (err) {
    // Roll back the partial writes so a failed signup never leaves an orphaned half-created account.
    await deleteCredential(userId).catch(() => undefined)
    await deleteEncryptionKey(userId).catch(() => undefined)
    throw err
  }
  // Dispatch into the bundle we just built (never getActiveBundle(), which a concurrent switch
  // could have replaced). appToken is undefined until the account syncs to the server.
  const bundle = await switchToUser(userId)
  // Carry the onboarding selections into the new account's store before it renders.
  if (prevApp?.locale) {
    bundle.store.dispatch(setLocale(prevApp.locale))
  }
  if (prevApp?.theme) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bundle.store.dispatch(setTheme(prevApp.theme as any))
  }
  if (prevApp?.avatar) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bundle.store.dispatch(setAvatar(prevApp.avatar as any))
  }
  // Mark onboarding as pending so the auth screen routes the new account through avatar -> theme ->
  // period survey before reaching home. The flag lives in the new account's store, so it survives
  // the store-switch remount and is cleared when the survey is confirmed.
  bundle.store.dispatch(setOnboardingPending(true))
  bundle.store.dispatch(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loginSuccess({ appToken: undefined as any, user: toUser(userId, a) as any }),
  )
  await bundle.flushSyncSnapshot()
  void syncAllAccounts()
  return { userId }
}

// Attempt an offline login against a locally registered account. Returns false if no local
// account exists for that name (caller may then fall back to an online login). Throws
// 'login_failed' if the account exists but the password is wrong.
export async function loginToAccount(name: string, password: string): Promise<boolean> {
  const anyAccount = await registry.findAnyUserByName(name)
  if (anyAccount?.isPendingDelete) {
    await syncAllAccounts()
    if ((await registry.getUser(anyAccount.id))?.isPendingDelete) {
      throw new Error('account_pending_deletion')
    }
  }
  const account = await registry.findUserByName(name)
  if (!account) {
    return false
  }
  const ok = await verifyPassword(account.id, password)
  if (!ok) {
    throw new Error('login_failed')
  }
  const bundle = await switchToUser(account.id)
  // If the user picked a language on the auth screen, carry it into this account's store.
  const carriedLocale = consumePendingLocale()
  if (carriedLocale) {
    bundle.store.dispatch(setLocale(carriedLocale))
  }
  return true
}

// Re-upload data that was queued before a 431-forced logout. Best-effort: a failure here must
// never block the login. Mirrors the saga's resendPendingSyncDataToServer.
async function resendPendingSyncData(appToken: string, pending: PendingSyncData): Promise<void> {
  try {
    await httpClient.replaceStore({
      storeVersion: pending.replaceStore.storeVersion,
      appState: pending.replaceStore.appState,
      appToken,
    })
    await httpClient.editUserInfo({ appToken, ...pending.editInfo })
    await clearPendingSyncData()
  } catch {
    // Best-effort: keep the pending data for the next attempt.
  }
}

// Online login for an account that is NOT yet registered on this device. Authenticates against the
// server, then creates a proper local account (registry entry, credential vault, per-account
// encryption key) and switches to its OWN store — mirroring loginToAccount/signupAccount. This is
// what makes a server account appear in the account switcher and keeps its data out of the shared
// anon store. Returns false if the server returns no usable user; throws on auth/network failure so
// the caller can surface it. Runs outside the saga because switchToUser tears the saga down.
export async function loginOnlineToAccount(name: string, password: string): Promise<boolean> {
  const pendingDelete = await registry.findAnyUserByName(name)
  if (pendingDelete?.isPendingDelete) {
    await syncAllAccounts()
    if ((await registry.getUser(pendingDelete.id))?.isPendingDelete) {
      throw new Error('account_pending_deletion')
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { appToken, user, store }: any = await httpClient.login({ name, password })
  if (!user?.id) {
    return false
  }
  const userId: string = user.id

  // A language picked on the auth screen, to carry into the new account's store.
  const carriedLocale = consumePendingLocale()

  // Data saved before a 431-forced logout for THIS user takes precedence over the server snapshot.
  const pendingData = await loadPendingSyncData()
  const hasPendingData = !!pendingData && pendingData.userId === userId

  const deviceId = await getDeviceId()
  // Per-account Keychain key, with the same durability guard as signup: never encrypt the account's
  // data under a key that did not persist (it would be unrecoverable on restart).
  const keyResult = await createEncryptionKey(userId)
  if (keyResult.secureStoreAvailable && !keyResult.persisted) {
    await deleteEncryptionKey(userId)
    throw new Error('keystore_unavailable')
  }
  try {
    await saveCredential({ userId, password, secretAnswer: null, keepPlainForSync: true })
    // Already on the server, so not pending-sync; record the server id and token.
    await registry.addUser({
      id: userId,
      name,
      deviceId,
      isPendingSync: false,
      serverId: user.id,
      appToken: appToken ?? null,
      hasEncryptionKey: keyResult.persisted,
    })
  } catch (err) {
    await deleteCredential(userId).catch(() => undefined)
    await deleteEncryptionKey(userId).catch(() => undefined)
    throw err
  }

  // Build (and switch to) this account's own store, then populate it. Dispatch into the returned
  // bundle, never getActiveBundle(), which a concurrent switch could have replaced.
  const bundle = await switchToUser(userId)
  const userForState = hasPendingData
    ? { ...user, ...pendingData!.editInfo, name, password, isGuest: false as const }
    : { ...user, name, password, isGuest: false as const }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bundle.store.dispatch(loginSuccess({ appToken, user: userForState as any }))

  if (hasPendingData) {
    const pendingAppState = pendingData!.replaceStore.appState
    bundle.store.dispatch(
      refreshStore({
        userID: userId,
        ...pendingAppState,
        ...(pendingAppState.app
          ? { app: { ...pendingAppState.app, ...(carriedLocale ? { locale: carriedLocale } : {}) } }
          : {}),
      }),
    )
    void resendPendingSyncData(appToken, pendingData!)
  } else {
    if (pendingData) {
      // Pending data belongs to a different user: discard it.
      await clearPendingSyncData()
    }
    if (store && store.storeVersion >= 0 && store.appState) {
      bundle.store.dispatch(
        refreshStore({
          userID: userId,
          ...store.appState,
          app: { ...store.appState.app, ...(carriedLocale ? { locale: carriedLocale } : {}) },
        }),
      )
    }
  }

  if (carriedLocale) {
    bundle.store.dispatch(setLocale(carriedLocale))
  }
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
  const bundle = await switchToUser(userId)
  // Carry a language picked on the auth screen into the account being switched to.
  const carriedLocale = consumePendingLocale()
  if (carriedLocale) {
    bundle.store.dispatch(setLocale(carriedLocale))
  }
}

// Leave the active account and return to the logged-out (anon) context.
export async function logoutToAnon(): Promise<void> {
  await flushActiveSyncSnapshot()
  await syncAllAccounts()
  await switchToUser(ANON_USER_ID)
}

// Remove an account entirely (registry entry, per-user store, credentials) and return to the
// logged-out (anon) context.
export async function deleteAccount(userId: string): Promise<void> {
  await registry.removeUser(userId)
  await clearSyncSnapshot(userId)
  await deleteEncryptionKey(userId)
  await switchToUser(ANON_USER_ID)
}

// Delete the currently active (logged-in) account. Best-effort server delete, then full local
// teardown (registry entry, encryption key, credential vault, store blob) and return to anon.
// Lives here, outside the per-user saga, because the store teardown cancels that saga; the in-app
// Settings delete must call this directly rather than dispatching into the saga.
export async function deleteActiveAccount(credentials?: {
  name: string
  password: string
}): Promise<'deleted' | 'queued'> {
  const userId = getActiveBundle()?.userId
  const account = userId ? await registry.getUser(userId) : null

  if (account && !account.isPendingSync && credentials) {
    await flushActiveSyncSnapshot()
    await saveCredential({
      userId: account.id,
      password: credentials.password,
      keepPlainForSync: true,
    })
    try {
      await httpClient.deleteUserFromPassword(credentials)
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status
      if (status !== 404) {
        await registry.markPendingDelete(account.id)
        await purgeUserStorage(account.id)
        await switchToUser(ANON_USER_ID)
        void syncAllAccounts()
        return 'queued'
      }
    }
  }
  if (userId && userId !== ANON_USER_ID) {
    await deleteAccount(userId)
  } else {
    await switchToUser(ANON_USER_ID)
  }
  return 'deleted'
}

export async function listAccounts() {
  return registry.listUsers()
}
