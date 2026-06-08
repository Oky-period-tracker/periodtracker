// Pure-JS password / secret-answer hashing for offline verification.
// PBKDF2-SHA256 over crypto-js (already a dependency). No native module, so this works
// on the existing dev build without a rebuild. Iteration count is a deliberate tradeoff:
// high enough to slow brute force, low enough to not freeze the JS thread on a phone.
// Tune ITERATIONS after measuring on-device if signup/login feels sluggish.
import CryptoJS from 'crypto-js'

const ITERATIONS = 10000
const KEY_SIZE_WORDS = 256 / 32
const SALT_BYTES = 16

export interface Hashed {
  hash: string
  salt: string
}

function derive(secret: string, saltHex: string): string {
  return CryptoJS.PBKDF2(secret, CryptoJS.enc.Hex.parse(saltHex), {
    keySize: KEY_SIZE_WORDS,
    iterations: ITERATIONS,
    hasher: CryptoJS.algo.SHA256,
  }).toString(CryptoJS.enc.Hex)
}

export function hashSecret(secret: string): Hashed {
  const salt = CryptoJS.lib.WordArray.random(SALT_BYTES).toString(CryptoJS.enc.Hex)
  return { hash: derive(secret, salt), salt }
}

export function verifySecret(secret: string, hash: string, salt: string): boolean {
  if (!hash || !salt) {
    return false
  }
  const derived = derive(secret, salt)
  return derived.length === hash.length && derived === hash
}
