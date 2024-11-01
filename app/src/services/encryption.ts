import CryptoJS from 'crypto-js'
import { deleteSecureValue, getSecureValue, setSecureValue } from './storage'

// ========== Encrypt ========== //
export const encrypt = (value: string, secret: string): string => {
  // Initialization vector
  const iv = CryptoJS.lib.WordArray.random(16) // 16 bytes
  const encryptedValue = CryptoJS.AES.encrypt(value, secret, { iv }).toString()
  const ivHex = iv.toString(CryptoJS.enc.Hex)
  // Concatenate IV
  return ivHex + encryptedValue
}

export const decrypt = (encrypted: string, secret: string): string => {
  // Extract IV (first 32 hex characters = 16 bytes)
  try {
    const ivHex = encrypted.slice(0, 32)
    const iv = CryptoJS.enc.Hex.parse(ivHex)
    const encryptedHex = encrypted.slice(32)
    const decrypted = CryptoJS.AES.decrypt(encryptedHex, secret, { iv })
    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch (e) {
    return ''
  }
}

export const hash = (value: string) => {
  return CryptoJS.SHA256(value).toString()
}

// ========== Salt ========== //
export const generateSalt = () => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8)
  return salt.toString(CryptoJS.enc.Hex)
}

export const setSalt = async (userId: string, salt: string, suffix = '', prefix = '') => {
  return await setSecureValue(`${userId}_${prefix}salt${suffix}`, salt)
}

export const getSalt = async (userId: string, suffix = '', prefix = '') => {
  return await getSecureValue(`${userId}_${prefix}salt${suffix}`)
}

// ========== KEK - Key Encryption Key ========== //
export const deriveKEK = (password: string, salt: string) => {
  const iterations = 5000
  const keySize = 256 / 32
  const KEK = CryptoJS.PBKDF2(password, salt, {
    iterations,
    keySize,
  }).toString()
  return KEK
}

// ========== DEK - Data Encryption Key ========== //
export const generateDEK = () => {
  const DEK = CryptoJS.lib.WordArray.random(256 / 8) // 256-bit DEK
  return DEK.toString(CryptoJS.enc.Hex)
}

export const setDEK = async (userId: string, DEK: string, KEK: string, suffix = '') => {
  try {
    const hashedDEK = hash(DEK)
    const encryptedDEK = encrypt(DEK, KEK)

    const [hashSuccess, dekSuccess] = await Promise.all([
      setSecureValue(`${userId}_hashed_dek`, hashedDEK),
      setSecureValue(`${userId}_encrypted_dek${suffix}`, encryptedDEK),
    ])

    return hashSuccess && dekSuccess
  } catch (e) {
    return false
  }
}

export const setAnswerDEK = async (userId: string, DEK: string, KEK: string, suffix = '') => {
  try {
    const encryptedDEK = encrypt(DEK, KEK)
    return setSecureValue(`${userId}_answer_encrypted_dek${suffix}`, encryptedDEK)
  } catch (e) {
    return false
  }
}

export const getDEK = async (userId: string, KEK: string, suffix = '', prefix = '') => {
  const encryptedDEK = await getSecureValue(`${userId}_${prefix}encrypted_dek${suffix}`)
  if (!encryptedDEK) {
    return undefined
  }

  const DEK = decrypt(encryptedDEK, KEK)
  return DEK
}

export const validateDEK = async (userId: string, DEK: string | undefined) => {
  if (!DEK) {
    return false
  }
  const hashedDEK = hash(DEK)
  const storedHash = await getSecureValue(`${userId}_hashed_dek`)
  return !!storedHash && hashedDEK === storedHash
}

// ========== Username to Id mapping ========== //
export const checkNameAvailableLocally = async (username: string) => {
  try {
    const hashedUsername = hash(username)
    const value = await getSecureValue(`username_${hashedUsername}`)
    return !value
  } catch (e) {
    return true
  }
}

export const setUserIdForName = async (username: string, userId: string) => {
  try {
    const hashedUsername = hash(username)
    return await setSecureValue(`username_${hashedUsername}`, userId)
  } catch (e) {
    return false
  }
}

export const getUserIdFromName = async (username: string) => {
  const hashedUsername = hash(username)
  return await getSecureValue(`username_${hashedUsername}`)
}

export const deleteUserIdForName = async (username: string) => {
  try {
    const hashedUsername = hash(username)
    return await deleteSecureValue(`username_${hashedUsername}`)
  } catch (e) {
    return false
  }
}
