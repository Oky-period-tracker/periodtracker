import NetInfo from '@react-native-community/netinfo'
import { getActiveBundle, subscribeBundle } from '../../redux/storeManager'
import * as registry from '../userMetadata/registry'
import { clearSyncSecrets, getSyncSecrets } from '../auth/credentialVault'
import { deleteEncryptionKey } from '../auth/encryptionKeys'
import { getDeviceId } from '../deviceId'
import { httpClient } from '../HttpClient'
import { loginSuccess } from '../../redux/actions'
import { clearSyncSnapshot, loadSyncSnapshot } from './syncSnapshot'

let syncing = false

type Account = Awaited<ReturnType<typeof registry.listAllUsers>>[number]

async function completePendingDelete(account: Account) {
  const { password } = await getSyncSecrets(account.id)
  if (!password) throw new Error('missing deletion credentials')
  try {
    await httpClient.deleteUserFromPassword({ name: account.name, password })
  } catch (error) {
    const status = (error as { response?: { status?: number } })?.response?.status
    if (status !== 404) throw error
  }
  await registry.removeUser(account.id)
  await clearSyncSnapshot(account.id)
  await deleteEncryptionKey(account.id)
}

async function syncAccount(account: Account) {
  if (account.isPendingDelete) {
    await completePendingDelete(account)
    return
  }

  const snapshot = await loadSyncSnapshot(account.id)
  if (!snapshot) return

  let appToken = account.appToken ?? null
  if (account.isPendingSync) {
    const secrets = await getSyncSecrets(account.id)
    const password = secrets.password ?? snapshot.user.password
    if (!password || !snapshot.user.country || snapshot.user.country === '00') return

    const response = await httpClient.signup({
      name: snapshot.user.name,
      password,
      dateOfBirth: snapshot.user.dateOfBirth,
      gender: snapshot.user.gender,
      location: snapshot.user.location,
      country: snapshot.user.country,
      province: snapshot.user.province,
      secretQuestion: snapshot.user.secretQuestion,
      secretAnswer: secrets.secretAnswer ?? snapshot.user.secretAnswer,
      dateSignedUp: snapshot.user.dateSignedUp,
      metadata: snapshot.user.metadata,
      preferredId: account.id,
      deviceId: account.deviceId || (await getDeviceId()),
    })
    if (!response?.appToken || !response?.user?.id) throw new Error('invalid signup response')

    appToken = response.appToken
    await registry.markSynced(account.id, response.user.id, appToken)
    await clearSyncSecrets(account.id)

    const active = getActiveBundle()
    if (active?.userId === account.id) {
      active.store.dispatch(loginSuccess({ appToken, user: snapshot.user }))
    }
  }

  if (!appToken) return
  await httpClient.replaceStore({
    storeVersion: snapshot.storeVersion,
    appState: snapshot.appState,
    appToken,
  })
  await clearSyncSnapshot(account.id, snapshot.updatedAt)
}

/** Process every device account without switching the visible account. */
export async function syncAllAccounts(): Promise<void> {
  if (syncing) return
  syncing = true
  try {
    const net = await NetInfo.fetch().catch(() => ({ isConnected: false }))
    if (!net.isConnected) return

    const accounts = await registry.listAllUsers()
    for (const account of accounts) {
      try {
        await syncAccount(account)
      } catch (error) {
        console.warn('Account sync failed', account.id, error)
      }
    }
  } finally {
    syncing = false
  }
}

export const syncActiveAccount = syncAllAccounts

export function startSyncWatcher(): () => void {
  void syncAllAccounts()
  const unsubscribeBundle = subscribeBundle(() => void syncAllAccounts())
  const unsubscribeNet = NetInfo.addEventListener((state) => {
    if (state.isConnected) void syncAllAccounts()
  })
  return () => {
    unsubscribeBundle()
    unsubscribeNet()
  }
}
