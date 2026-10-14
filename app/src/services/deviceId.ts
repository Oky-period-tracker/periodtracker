// Stable per-install device id, used to scope the per-device account limit.
// Deliberately lives in its own file rather than services/device.ts: resources/redux.ts
// imports IS_IOS from services/device.ts, so adding AsyncStorage logic there would create
// an import cycle (resources/redux -> device -> AsyncStorage).
import AsyncStorage from '@react-native-async-storage/async-storage'
import { v4 as uuidv4 } from 'uuid'
import { DEVICE_ID_KEY } from './storage/storageKeys'

let cached: string | null = null

export async function getDeviceId(): Promise<string> {
  if (cached) {
    return cached
  }
  try {
    const existing = await AsyncStorage.getItem(DEVICE_ID_KEY)
    if (existing) {
      cached = existing
      return existing
    }
  } catch {
    // fall through and generate a fresh id
  }
  const generated = uuidv4()
  cached = generated
  try {
    await AsyncStorage.setItem(DEVICE_ID_KEY, generated)
  } catch {
    // best effort; the cached value is still stable for this session
  }
  return generated
}
