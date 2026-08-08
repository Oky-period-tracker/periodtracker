import AsyncStorage from '@react-native-async-storage/async-storage'
// credentialVault pulls in the Keychain/crypto native modules at import time (via encryptionKeys),
// and is only used by removeUser — not the per-device limit path under test. Stub it out.
jest.mock('../../../../src/services/auth/credentialVault', () => ({
  deleteCredential: jest.fn(),
}))

// storeManager is lazy-required by removeUser only; stub it so the import cannot pull native deps.
jest.mock('../../../../src/redux/storeManager', () => ({
  purgeUserStorage: jest.fn(),
}))

import { addUser, listUsers, userCount, removeUser, getUser, markSynced } from '../../../../src/services/userMetadata/registry'

const makeUser = (id: string) => ({
  id,
  name: `User ${id}`,
  deviceId: 'device-1',
  isPendingSync: true,
})

describe('account registry', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

  it('allows more than three accounts on one device', async () => {
    for (let i = 0; i < 5; i++) {
      await addUser(makeUser(`u${i}`))
    }

    expect(await userCount()).toBe(5)
  })

  it('updates an existing account instead of duplicating it', async () => {
    await addUser(makeUser('u0'))

    // Re-adding an account that already exists (same id) is an update, not a new slot.
    await expect(
      addUser({ ...makeUser('u0'), name: 'Renamed' }),
    ).resolves.toMatchObject({ id: 'u0', name: 'Renamed' })

    const users = await listUsers()
    expect(users).toHaveLength(1)
    expect(users.find((u) => u.id === 'u0')?.name).toBe('Renamed')
  })

  it('marks an offline account as synced after a successful server registration', async () => {
    await addUser(makeUser('u0'))

    await markSynced('u0', 'server-u0', 'token')

    expect(await getUser('u0')).toMatchObject({
      isPendingSync: false,
      serverId: 'server-u0',
      appToken: 'token',
    })
  })

  it('removes a local account and its registry entry', async () => {
    await addUser(makeUser('u0'))
    await removeUser('u0')

    expect(await getUser('u0')).toBeNull()
  })
})
