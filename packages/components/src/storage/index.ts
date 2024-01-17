import AsyncStorage from '@react-native-async-storage/async-storage'

const storeString = async ({ key, value }: { key: string; value: string }) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    // saving error
  }
}

const storeObject = async ({ key, value }: { key: string; value: object }) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    // saving error
  }
}

const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key)
    return value
  } catch (e) {
    // error reading value
  }
}

const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys()
  } catch (e) {
    // error reading value
  }
}

const Storage = {
  storeString,
  storeObject,
  getData,
  getAllKeys,
}

export default Storage
