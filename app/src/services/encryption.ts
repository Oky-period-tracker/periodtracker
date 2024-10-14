import * as SecureStore from 'expo-secure-store'
import CryptoJS from 'crypto-js'

/* 
  DEK = Data encryption key
  KEK = Key encryption key
  IV = Initialization vector
*/

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
  await SecureStore.setItemAsync(`${userId}_salt`, salt)
}

export const getSalt = async (userId: string) => {
  return await SecureStore.getItemAsync(`${userId}_salt`)
}

// ========== KEK ========== //
export const deriveKEK = (password: string, salt: string) => {
  const iterations = 100000
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
  return await SecureStore.setItemAsync(`${userId}_encrypted_dek`, encryptedDEK)
}

export const getDEK = async (userId: string, KEK: string) => {
  const encryptedDEK = await SecureStore.getItemAsync(`${userId}_encrypted_dek`)

  if (!encryptedDEK) {
    throw new Error('Encrypted DEK not found')
  }

  const DEK = decrypt(encryptedDEK, KEK)
  return DEK
}
