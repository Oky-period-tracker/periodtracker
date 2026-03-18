import AsyncStorage from '@react-native-async-storage/async-storage'
import { PartialStateSnapshot } from '../redux/types/partialStore'
import { UserMetadata } from '../redux/reducers/authReducer'

const PENDING_SYNC_KEY = '@pending_sync_after_431'

/**
 * Profile data interface
 */
export interface EditInfoData {
  name: string
  dateOfBirth: string
  gender: string
  location: string
  secretQuestion: string
  metadata?: UserMetadata
}

/**
 * Data awaiting synchronization with the server.
 */
export interface PendingSyncData {
  userId: string
  replaceStore: {
    storeVersion: number
    appState: PartialStateSnapshot
  }
  editInfo: EditInfoData
}

/**
 * Store data awaiting synchronization with the server.
 * This workflow addresses a 431 error caused by backend token sizes exceeding limits due to excessive metadata.
 * @param data Data awaiting synchronization with the server.
 */
export async function savePendingSyncData(data: PendingSyncData): Promise<void> {
  try {
    await AsyncStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(data))
  } catch (err) {
    // Best effort - don't crash if storage fails
  }
}

/**
 * Get data awaiting synchronization with the server.
 * @returns Data awaiting synchronization with the server.
 */
export async function loadPendingSyncData(): Promise<PendingSyncData | null> {
  try {
    const raw = await AsyncStorage.getItem(PENDING_SYNC_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PendingSyncData
  } catch (err) {
    return null
  }
}

/**
 * Clear data awaiting synchronization with the server.
 */
export async function clearPendingSyncData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PENDING_SYNC_KEY)
  } catch (err) {
    // Best effort
  }
}
