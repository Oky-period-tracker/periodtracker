import AsyncStorage from '@react-native-async-storage/async-storage'
import CryptoJS from 'crypto-js'
import { ReduxState } from '../../redux/reducers'
import { reduxStoreVersion } from '../../optional/reduxMigrations'
import { getEncryptionKey } from '../auth/encryptionKeys'
import { syncSnapshotKey } from '../storage/storageKeys'

export interface SyncSnapshot {
  updatedAt: number
  storeVersion: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
  appState: {
    app: ReduxState['app']
    prediction: ReduxState['prediction']
    verifiedDates: unknown
    helpCenters: ReduxState['helpCenters']
  }
}

const writes = new Map<string, Promise<void>>()
const revisions = new Map<string, number>()

export function saveSyncSnapshot(userId: string, state: ReduxState): Promise<void> {
  const previous = writes.get(userId) ?? Promise.resolve()
  const next = previous.then(async () => {
    const user = state.auth?.user
    if (!user) return
    const updatedAt = Math.max(Date.now(), (revisions.get(userId) ?? 0) + 1)
    revisions.set(userId, updatedAt)
    const snapshot: SyncSnapshot = {
      updatedAt,
      storeVersion: reduxStoreVersion,
      user,
      appState: {
        app: state.app,
        prediction: state.prediction,
        verifiedDates: state.answer[user.id]?.verifiedDates ?? {},
        helpCenters: state.helpCenters,
      },
    }
    const key = await getEncryptionKey(userId)
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(snapshot), key).toString()
    await AsyncStorage.setItem(syncSnapshotKey(userId), encrypted)
  })
  writes.set(userId, next.catch(() => undefined))
  return next
}

export async function loadSyncSnapshot(userId: string): Promise<SyncSnapshot | null> {
  await writes.get(userId)
  try {
    const encrypted = await AsyncStorage.getItem(syncSnapshotKey(userId))
    if (!encrypted) return null
    const key = await getEncryptionKey(userId)
    const json = CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8)
    return json ? (JSON.parse(json) as SyncSnapshot) : null
  } catch {
    return null
  }
}

export async function clearSyncSnapshot(userId: string, updatedAt?: number): Promise<void> {
  if (updatedAt !== undefined) {
    const current = await loadSyncSnapshot(userId)
    if (current && current.updatedAt !== updatedAt) return
  }
  await AsyncStorage.removeItem(syncSnapshotKey(userId))
}
