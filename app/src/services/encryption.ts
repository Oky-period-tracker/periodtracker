import * as SecureStore from 'expo-secure-store'
import CryptoJS from 'crypto-js'

/* 
  DEK = Data encryption key
  KEK = Key encryption key
  IV = Initialization vector
*/

// ========== Secure store ========== //
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

// ========== Encrypt ========== //
export const encrypt = (value: string, secret: string): string => {
  const iv = CryptoJS.lib.WordArray.random(16) // 16 bytes
  const encryptedValue = CryptoJS.AES.encrypt(value, secret, { iv }).toString()
  const ivHex = iv.toString(CryptoJS.enc.Hex)
  // Concatenate IV
  return ivHex + encryptedValue
}

export const decrypt = (encrypted: string, secret: string): string => {
  // Extract IV (first 32 hex characters = 16 bytes)
  const ivHex = encrypted.slice(0, 32)
  const iv = CryptoJS.enc.Hex.parse(ivHex)
  const encryptedHex = encrypted.slice(32)
  const decrypted = CryptoJS.AES.decrypt(encryptedHex, secret, { iv })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

// ========== Salt ========== //
export const generateSalt = () => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8)
  return salt.toString(CryptoJS.enc.Hex)
}

export const setSalt = async (userId: string, salt: string) => {
  await setSecureValue(`${userId}_salt`, salt)
}

export const getSalt = async (userId: string) => {
  return await getSecureValue(`${userId}_salt`)
}

// ========== KEK ========== //
export const deriveKEK = (password: string, salt: string) => {
  const iterations = 5000
  const keySize = 256 / 32
  const KEK = CryptoJS.PBKDF2(password, salt, {
    iterations,
    keySize,
  }).toString()
  return KEK
}

// ========== DEK ========== //
export const generateDEK = () => {
  const DEK = CryptoJS.lib.WordArray.random(256 / 8) // 256-bit DEK
  return DEK.toString(CryptoJS.enc.Hex)
}

export const setDEK = async (userId: string, DEK: string, KEK: string) => {
  const encryptedDEK = encrypt(DEK, KEK)
  return await setSecureValue(`${userId}_encrypted_dek`, encryptedDEK)
}

export const getDEK = async (userId: string, KEK: string) => {
  const encryptedDEK = await getSecureValue(`${userId}_encrypted_dek`)

  if (!encryptedDEK) {
    return undefined
  }

  const DEK = decrypt(encryptedDEK, KEK)
  return DEK
}

// ========== Auth ========== //
export const handleEncryptionKeys = async (userId: string, password: string) => {
  let isNewSalt = false
  let salt = await getSalt(userId)

  if (!salt) {
    salt = generateSalt()
    await setSalt(userId, salt)
    isNewSalt = true
  }

  const KEK = deriveKEK(password, salt)

  let DEK = await getDEK(userId, KEK)

  if (isNewSalt || !DEK) {
    DEK = generateDEK()
    await setDEK(userId, DEK, KEK)
  }

  return DEK
}
