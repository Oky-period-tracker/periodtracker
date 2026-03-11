import AsyncStorage from '@react-native-async-storage/async-storage'
import { PartialStateSnapshot } from '../redux/types/partialStore'
import { UserMetadata } from '../redux/reducers/authReducer'

const PENDING_SYNC_KEY = '@pending_sync_after_431'

export interface EditInfoData {
  name: string
  dateOfBirth: string
  gender: string
  location: string
  secretQuestion: string
  metadata?: UserMetadata
}

export interface PendingSyncData {
  userId: string
  replaceStore: {
    storeVersion: number
    appState: PartialStateSnapshot
  }
  editInfo: EditInfoData
}

export async function savePendingSyncData(data: PendingSyncData): Promise<void> {
  try {
    await AsyncStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(data))
  } catch (err) {
    // Best effort - don't crash if storage fails
  }
}

export async function loadPendingSyncData(): Promise<PendingSyncData | null> {
  try {
    const raw = await AsyncStorage.getItem(PENDING_SYNC_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PendingSyncData
  } catch (err) {
    return null
  }
}

export async function clearPendingSyncData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PENDING_SYNC_KEY)
  } catch (err) {
    // Best effort
  }
}
