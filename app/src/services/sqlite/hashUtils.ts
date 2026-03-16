import * as ExpoCrypto from 'expo-crypto'

// 1000 rounds of SHA-256 with a random salt per user.
// PBKDF2 standard recommends 100k+ rounds, but expo-crypto runs on the Hermes JS thread
// so higher counts cause noticeable UI lag. 1000 is a practical tradeoff for mobile.
const ITERATIONS = 1_000

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function deriveHash(secret: string, salt: string): Promise<string> {
  let current = secret + ':' + salt
  for (let i = 0; i < ITERATIONS; i++) {
    current = await ExpoCrypto.digestStringAsync(ExpoCrypto.CryptoDigestAlgorithm.SHA256, current)
  }
  return current
}

export async function hashSecret(secret: string): Promise<{ hash: string; salt: string }> {
  const saltBytes = ExpoCrypto.getRandomBytes(16)
  const salt = bytesToHex(saltBytes)
  const hash = await deriveHash(secret, salt)
  return { hash, salt }
}

export async function verifySecret(secret: string, hash: string, salt: string): Promise<boolean> {
  const derived = await deriveHash(secret, salt)
  return derived === hash
}
