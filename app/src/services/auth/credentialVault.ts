// Per-user credential record. Stores the password / secret-answer hashes for offline
// verification, and (until the account syncs to the server) the AES-encrypted plaintext
// needed to register the account online later. Everything is AsyncStorage plus pure-JS
// crypto, so no native rebuild is needed. Keychain (expo-secure-store) is a future
// hardening step that would require a native build.
import AsyncStorage from '@react-native-async-storage/async-storage'
import CryptoJS from 'crypto-js'
import { config } from '../../resources/redux'
import { credentialKey } from '../storage/storageKeys'
import { hashSecret, verifySecret } from './hashUtils'

interface StoredCredential {
  passwordHash: string
  passwordSalt: string
  secretAnswerHash: string | null
  secretAnswerSalt: string | null
  // AES-encrypted plaintext, present only until the account is synced to the server.
  encPassword?: string
  encSecretAnswer?: string
}

const KEY: string = config.REDUX_ENCRYPT_KEY

function encrypt(plain: string): string {
  return CryptoJS.AES.encrypt(plain, KEY).toString()
}

function decrypt(cipher: string | undefined): string | null {
  if (!cipher) {
    return null
  }
  try {
    const text = CryptoJS.AES.decrypt(cipher, KEY).toString(CryptoJS.enc.Utf8)
    return text || null
  } catch {
    return null
  }
}

async function read(userId: string): Promise<StoredCredential | null> {
  try {
    const raw = await AsyncStorage.getItem(credentialKey(userId))
    return raw ? (JSON.parse(raw) as StoredCredential) : null
  } catch {
    return null
  }
}

async function write(userId: string, record: StoredCredential): Promise<void> {
  await AsyncStorage.setItem(credentialKey(userId), JSON.stringify(record))
}

export async function saveCredential(params: {
  userId: string
  password: string
  secretAnswer?: string | null
  keepPlainForSync?: boolean
}): Promise<void> {
  const { userId, password, secretAnswer, keepPlainForSync = true } = params
  const pw = hashSecret(password)
  const sa = secretAnswer ? hashSecret(secretAnswer) : null
  const record: StoredCredential = {
    passwordHash: pw.hash,
    passwordSalt: pw.salt,
    secretAnswerHash: sa ? sa.hash : null,
    secretAnswerSalt: sa ? sa.salt : null,
  }
  if (keepPlainForSync) {
    record.encPassword = encrypt(password)
    if (secretAnswer) {
      record.encSecretAnswer = encrypt(secretAnswer)
    }
  }
  await write(userId, record)
}

export async function verifyPassword(userId: string, password: string): Promise<boolean> {
  const rec = await read(userId)
  if (!rec) {
    return false
  }
  return verifySecret(password, rec.passwordHash, rec.passwordSalt)
}

export async function verifySecretAnswer(userId: string, answer: string): Promise<boolean> {
  const rec = await read(userId)
  if (!rec || !rec.secretAnswerHash || !rec.secretAnswerSalt) {
    return false
  }
  return verifySecret(answer, rec.secretAnswerHash, rec.secretAnswerSalt)
}

export async function setNewPassword(userId: string, password: string): Promise<void> {
  const rec = await read(userId)
  const pw = hashSecret(password)
  await write(userId, {
    passwordHash: pw.hash,
    passwordSalt: pw.salt,
    secretAnswerHash: rec ? rec.secretAnswerHash : null,
    secretAnswerSalt: rec ? rec.secretAnswerSalt : null,
    encPassword: encrypt(password),
    encSecretAnswer: rec ? rec.encSecretAnswer : undefined,
  })
}

export async function getSyncSecrets(
  userId: string,
): Promise<{ password: string | null; secretAnswer: string | null }> {
  const rec = await read(userId)
  if (!rec) {
    return { password: null, secretAnswer: null }
  }
  return { password: decrypt(rec.encPassword), secretAnswer: decrypt(rec.encSecretAnswer) }
}

export async function clearSyncSecrets(userId: string): Promise<void> {
  const rec = await read(userId)
  if (!rec) {
    return
  }
  delete rec.encPassword
  delete rec.encSecretAnswer
  await write(userId, rec)
}

export async function deleteCredential(userId: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(credentialKey(userId))
  } catch {
    // already gone
  }
}
