import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  ENFORCE_ACCOUNT_LIMIT,
  MAX_ACCOUNTS_PER_DEVICE,
} from '../../../../src/services/userMetadata/types'

// The limit tests only apply when enforcement is compiled in; when the flag is off the
// registry must instead accept accounts beyond the limit.
const itWhenEnforced = ENFORCE_ACCOUNT_LIMIT ? it : it.skip
const itWhenNotEnforced = ENFORCE_ACCOUNT_LIMIT ? it.skip : it

// credentialVault pulls in the Keychain/crypto native modules at import time (via encryptionKeys),
// and is only used by removeUser — not the per-device limit path under test. Stub it out.
jest.mock('../../../../src/services/auth/credentialVault', () => ({
  deleteCredential: jest.fn(),
}))

// storeManager is lazy-required by removeUser only; stub it so the import cannot pull native deps.
jest.mock('../../../../src/redux/storeManager', () => ({
  purgeUserStorage: jest.fn(),
}))

import {
  MAX_ACCOUNTS_ERROR,
  addUser,
  listUsers,
  userCount,
  removeUser,
  getUser,
} from '../../../../src/services/userMetadata/registry'

const makeUser = (id: string) => ({
  id,
  name: `User ${id}`,
  deviceId: 'device-1',
  isPendingSync: true,
})

describe('account registry per-device limit', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

  it('allows adding up to MAX_ACCOUNTS_PER_DEVICE accounts', async () => {
    for (let i = 0; i < MAX_ACCOUNTS_PER_DEVICE; i++) {
      await addUser(makeUser(`u${i}`))
    }

    expect(await userCount()).toBe(MAX_ACCOUNTS_PER_DEVICE)
  })

  itWhenEnforced('throws MAX_ACCOUNTS_ERROR when adding one account over the limit', async () => {
    for (let i = 0; i < MAX_ACCOUNTS_PER_DEVICE; i++) {
      await addUser(makeUser(`u${i}`))
    }

    await expect(addUser(makeUser('overflow'))).rejects.toThrow(MAX_ACCOUNTS_ERROR)
    // The rejected add must not be persisted.
    expect(await userCount()).toBe(MAX_ACCOUNTS_PER_DEVICE)
    expect(await getUser('overflow')).toBeNull()
  })

  itWhenNotEnforced('allows adding accounts beyond the limit while enforcement is disabled', async () => {
    for (let i = 0; i < MAX_ACCOUNTS_PER_DEVICE; i++) {
      await addUser(makeUser(`u${i}`))
    }

    await expect(addUser(makeUser('overflow'))).resolves.toMatchObject({ id: 'overflow' })
    expect(await userCount()).toBe(MAX_ACCOUNTS_PER_DEVICE + 1)
  })

  it('does not count re-adding an existing account against the limit', async () => {
    for (let i = 0; i < MAX_ACCOUNTS_PER_DEVICE; i++) {
      await addUser(makeUser(`u${i}`))
    }

    // Re-adding an account that already exists (same id) is an update, not a new slot.
    await expect(
      addUser({ ...makeUser('u0'), name: 'Renamed' }),
    ).resolves.toMatchObject({ id: 'u0', name: 'Renamed' })

    const users = await listUsers()
    expect(users).toHaveLength(MAX_ACCOUNTS_PER_DEVICE)
    expect(users.find((u) => u.id === 'u0')?.name).toBe('Renamed')
  })

  itWhenEnforced('frees a slot after removing an account', async () => {
    for (let i = 0; i < MAX_ACCOUNTS_PER_DEVICE; i++) {
      await addUser(makeUser(`u${i}`))
    }
    await expect(addUser(makeUser('overflow'))).rejects.toThrow(MAX_ACCOUNTS_ERROR)

    await removeUser('u0')

    await expect(addUser(makeUser('overflow'))).resolves.toMatchObject({ id: 'overflow' })
    expect(await userCount()).toBe(MAX_ACCOUNTS_PER_DEVICE)
  })
})
