// Background sync for accounts created offline. When the device is online (and whenever the
// active account changes), the active account, if still pending sync, is registered on the
// server via the existing signup endpoint, carrying its deviceId. Event-based via NetInfo plus
// an attempt on every account switch; no polling. Non-active pending accounts sync when they
// next become active and online.
import NetInfo from '@react-native-community/netinfo'
import { getActiveBundle, subscribeBundle } from '../../redux/storeManager'
import { ANON_USER_ID } from '../storage/storageKeys'
import * as registry from '../userMetadata/registry'
import { getSyncSecrets, clearSyncSecrets } from '../auth/credentialVault'
import { getDeviceId } from '../deviceId'
import { httpClient } from '../HttpClient'
import { loginSuccess } from '../../redux/actions'

let syncing = false

export async function syncActiveAccount(): Promise<void> {
  // Set the single-flight guard synchronously, before any await, so two triggers firing close
  // together (e.g. the initial run plus a NetInfo online event) cannot both pass the check and
  // double-register the same account.
  if (syncing) {
    return
  }
  syncing = true
  try {
    const bundle = getActiveBundle()
    if (!bundle || bundle.userId === ANON_USER_ID) {
      return
    }

    const account = await registry.getUser(bundle.userId)
    if (!account || !account.isPendingSync) {
      return
    }

    const net = await NetInfo.fetch().catch(() => ({ isConnected: false }))
    if (!net.isConnected) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (bundle.store.getState() as any)?.auth?.user
    // The API rejects account creation when country is unset / '00' (old-variant guard).
    if (!user || !user.country || user.country === '00') {
      return
    }

    const secrets = await getSyncSecrets(account.id)
    const deviceId = await getDeviceId()
    const response = await httpClient.signup({
      name: user.name,
      password: secrets.password ?? user.password,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      location: user.location,
      country: user.country,
      province: user.province,
      secretQuestion: user.secretQuestion,
      secretAnswer: secrets.secretAnswer ?? user.secretAnswer,
      dateSignedUp: user.dateSignedUp,
      metadata: user.metadata,
      preferredId: account.id,
      deviceId,
    })

    if (response && response.appToken && response.user && response.user.id) {
      // The local id stays the store key; the server id is recorded separately in the registry.
      await registry.markSynced(account.id, response.user.id, response.appToken)
      await clearSyncSecrets(account.id)
      // Only reflect the token in the live store if this account is still the active one — the
      // user may have switched (or logged out) during the network round-trip, which would have
      // torn down the captured store.
      const current = getActiveBundle()
      if (current && current.userId === account.id) {
        current.store.dispatch(loginSuccess({ appToken: response.appToken, user }))
      }
    }
  } catch {
    // Leave the account pending; it retries on the next online event or account switch.
  } finally {
    syncing = false
  }
}

// Start watching for opportunities to sync: once now, on every account switch, and whenever the
// device comes back online. Returns an unsubscribe function.
export function startSyncWatcher(): () => void {
  void syncActiveAccount()
  const unsubscribeBundle = subscribeBundle(() => {
    void syncActiveAccount()
  })
  const unsubscribeNet = NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      void syncActiveAccount()
    }
  })
  return () => {
    unsubscribeBundle()
    unsubscribeNet()
  }
}
