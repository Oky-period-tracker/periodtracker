// One-time migration from the legacy single-user store ('persist:primary') to the per-user
// model. Copies the existing user's encrypted blob to their 'user:{id}:data' key, registers
// them as the active account, and seeds their credential vault from the plaintext password
// and secret answer that the legacy auth slice stored. Runs once, never blocks boot on error,
// and never loses the existing user's data (the legacy key is retained for rollback).
import AsyncStorage from '@react-native-async-storage/async-storage'
import CryptoJS from 'crypto-js'
import { config } from '../../resources/redux'
import { LEGACY_PERSIST_KEY, userDataStorageKey, MIGRATION_FLAG_KEY } from '../storage/storageKeys'
import { addUser, listUsers, setActiveUser } from '../userMetadata/registry'
import { getDeviceId } from '../deviceId'
import { saveCredential } from '../auth/credentialVault'

interface LegacyAuthSlice {
  appToken?: string | null
  user?: {
    id?: string
    name?: string
    password?: string
    secretAnswer?: string
  } | null
}

function decryptSlice(cipher: string): LegacyAuthSlice | null {
  try {
    const text = CryptoJS.AES.decrypt(cipher, config.REDUX_ENCRYPT_KEY).toString(CryptoJS.enc.Utf8)
    return text ? (JSON.parse(text) as LegacyAuthSlice) : null
  } catch {
    return null
  }
}

export async function runLegacyMigration(): Promise<void> {
  try {
    if (await AsyncStorage.getItem(MIGRATION_FLAG_KEY)) {
      return
    }
    const legacyRaw = await AsyncStorage.getItem(LEGACY_PERSIST_KEY)
    const alreadyHaveUsers = (await listUsers()).length > 0

    if (!legacyRaw || alreadyHaveUsers) {
      // Fresh install, or accounts already exist: nothing to migrate.
      await AsyncStorage.setItem(MIGRATION_FLAG_KEY, '1')
      return
    }

    const blob = JSON.parse(legacyRaw) as Record<string, string>
    const auth = blob.auth ? decryptSlice(blob.auth) : null
    const user = auth && auth.user
    if (!user || !user.id || !user.name) {
      // No usable account in the legacy blob; treat the device as fresh.
      await AsyncStorage.setItem(MIGRATION_FLAG_KEY, '1')
      return
    }

    const deviceId = await getDeviceId()
    // The legacy blob is already encrypted with the same key the per-user store uses, so the
    // new store rehydrates it directly. Copy it verbatim to the user-scoped key.
    await AsyncStorage.setItem(userDataStorageKey(user.id), legacyRaw)

    await addUser({
      id: user.id,
      serverId: user.id,
      name: user.name,
      deviceId,
      isPendingSync: false,
      appToken: auth?.appToken ?? null,
    })
    await setActiveUser(user.id)

    if (user.password) {
      // The legacy account was created online, so it is already synced; no plaintext is kept
      // for re-sync, only the hashes for offline login and the secret answer for reset.
      await saveCredential({
        userId: user.id,
        password: user.password,
        secretAnswer: user.secretAnswer ?? null,
        keepPlainForSync: false,
      })
    }

    await AsyncStorage.setItem(MIGRATION_FLAG_KEY, '1')
  } catch {
    // Never block boot on a migration failure; the app falls back to a clean account-selection
    // state and the legacy key is left intact for a later retry.
  }
}
