import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const setSecureValue = async (key: string, value: string) => {
  let success = false

  try {
    await SecureStore.setItemAsync(key, value)
    success = true
  } catch (e) {
    success = false
  }

  return success
}

export const getSecureValue = async (key: string) => {
  let returnValue = null

  try {
    returnValue = await SecureStore.getItemAsync(key)
  } catch (e) {
    //
  }

  return returnValue
}

export const deleteSecureValue = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key)
    return true
  } catch (e) {
    return false
  }
}

export const removeAsyncStorageItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key)
    return true
  } catch (e) {
    return false
  }
}
