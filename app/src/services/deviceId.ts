import * as Device from 'expo-device'
import { v4 as uuidv4 } from 'uuid'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Get or generate device ID
 * Uses device model ID if available, otherwise generates and stores UUID
 */
let cachedDeviceId: string | null = null

export async function getDeviceId(): Promise<string> {
  // Return cached if available
  if (cachedDeviceId) {
    return cachedDeviceId
  }

  try {
    // Try to get stored device ID from AsyncStorage
    const storedId = await AsyncStorage.getItem('deviceId')

    if (storedId) {
      cachedDeviceId = storedId
      return storedId
    }

    // Try to use device model ID
    const modelId = Device.modelId

    if (modelId) {
      cachedDeviceId = modelId
      await AsyncStorage.setItem('deviceId', modelId)
      return modelId
    }

    // Generate new UUID if no model ID
    const generatedId = uuidv4()
    cachedDeviceId = generatedId
    await AsyncStorage.setItem('deviceId', generatedId)
    return generatedId
  } catch (error) {
    console.error('Error getting device ID:', error)

    // Fallback: generate UUID
    const fallbackId = uuidv4()
    cachedDeviceId = fallbackId
    return fallbackId
  }
}

export function clearCachedDeviceId(): void {
  cachedDeviceId = null
}
