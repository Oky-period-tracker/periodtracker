import CryptoJS from 'crypto-js'
import { deleteSecureValue, getSecureValue, setSecureValue } from './storage'

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

export const hash = (value: string) => {
  return CryptoJS.SHA256(value).toString()
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
  try {
    const hashedDEK = hash(DEK)
    const encryptedDEK = encrypt(DEK, KEK)

    await setSecureValue(`${userId}_hashed_dek`, hashedDEK)
    await setSecureValue(`${userId}_encrypted_dek`, encryptedDEK)

    return true
  } catch (e) {
    return false
  }
}

export const getDEK = async (userId: string, KEK: string) => {
  const encryptedDEK = await getSecureValue(`${userId}_encrypted_dek`)

  if (!encryptedDEK) {
    return undefined
  }

  const DEK = decrypt(encryptedDEK, KEK)
  return DEK
}

export const validateDEK = async (userId: string, DEK: string) => {
  const hashedDEK = hash(DEK)
  const storedHash = await getSecureValue(`${userId}_hashed_dek`)
  return storedHash && hashedDEK === storedHash
}

// ========== Username to Id mapping ========== //
export const checkNameAvailableLocally = async (username: string, isGuest: boolean) => {
  const suffix = isGuest ? '_guest' : ''

  try {
    const hashedUsername = hash(username)
    return await getSecureValue(`username_${hashedUsername}${suffix}`)
  } catch (e) {
    return false
  }
}

export const setUserIdForName = async (username: string, userId: string, oldUsername?: string) => {
  try {
    const hashedUsername = hash(username)
    await setSecureValue(`username_${hashedUsername}`, userId)
    if (oldUsername) {
      const hashedOldUsername = hash(oldUsername)
      await deleteSecureValue(`username_${hashedOldUsername}`)
    }
  } catch (e) {
    return false
  }
}

export const getUserIdFromName = async (username: string) => {
  const hashedUsername = hash(username)
  return await getSecureValue(`username_${hashedUsername}`)
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

  const isValid = await validateDEK(userId, DEK)

  if (!isValid) {
    return null
  }

  return DEK
}
