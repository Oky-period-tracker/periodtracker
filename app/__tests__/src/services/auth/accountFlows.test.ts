import {
  deleteActiveAccount,
  loginOnlineToAccount,
} from '../../../../src/services/auth/accountFlows'
import * as registry from '../../../../src/services/userMetadata/registry'
import { httpClient } from '../../../../src/services/HttpClient'
import { deleteEncryptionKey } from '../../../../src/services/auth/encryptionKeys'
import { purgeUserStorage, switchToUser } from '../../../../src/redux/storeManager'

jest.mock('../../../../src/redux/storeManager', () => ({
  getActiveBundle: jest.fn(() => ({ userId: 'u1' })),
  flushActiveSyncSnapshot: jest.fn(),
  purgeUserStorage: jest.fn(),
  switchToUser: jest.fn(),
}))
jest.mock('../../../../src/services/userMetadata/registry')
jest.mock('../../../../src/services/auth/credentialVault', () => ({
  saveCredential: jest.fn(),
  deleteCredential: jest.fn(),
}))
jest.mock('../../../../src/services/auth/encryptionKeys', () => ({
  createEncryptionKey: jest.fn(() => ({ secureStoreAvailable: false, persisted: false })),
  deleteEncryptionKey: jest.fn(),
}))
jest.mock('../../../../src/services/sync/syncManager', () => ({ syncAllAccounts: jest.fn() }))
jest.mock('../../../../src/services/sync/syncSnapshot', () => ({
  clearSyncSnapshot: jest.fn(),
}))
jest.mock('../../../../src/services/HttpClient', () => ({
  httpClient: { deleteUserFromPassword: jest.fn(), login: jest.fn() },
}))
jest.mock('../../../../src/services/pendingSync', () => ({
  loadPendingSyncData: jest.fn().mockResolvedValue(null),
  clearPendingSyncData: jest.fn(),
}))
jest.mock('../../../../src/services/deviceId', () => ({ getDeviceId: jest.fn(() => 'device') }))
jest.mock('../../../../src/services/auth/pendingLocale', () => ({
  consumePendingLocale: jest.fn(() => null),
}))

describe('deleteActiveAccount', () => {
  beforeEach(() => jest.clearAllMocks())

  it('queues a synced account when server deletion cannot run', async () => {
    ;(registry.getUser as jest.Mock).mockResolvedValue({
      id: 'u1',
      name: 'Ana',
      isPendingSync: false,
    })
    ;(httpClient.deleteUserFromPassword as jest.Mock).mockRejectedValue(new Error('offline'))

    await expect(
      deleteActiveAccount({ name: 'Ana', password: 'formatted' }),
    ).resolves.toBe('queued')
    expect(registry.markPendingDelete).toHaveBeenCalledWith('u1')
    expect(purgeUserStorage).toHaveBeenCalledWith('u1')
    expect(registry.removeUser).not.toHaveBeenCalled()
    expect(deleteEncryptionKey).not.toHaveBeenCalled()
    expect(switchToUser).toHaveBeenCalledWith('__anon__')
  })

  it('deletes a local-only account without a server request', async () => {
    ;(registry.getUser as jest.Mock).mockResolvedValue({ id: 'u1', isPendingSync: true })

    await expect(
      deleteActiveAccount({ name: 'Ana', password: 'formatted' }),
    ).resolves.toBe('deleted')
    expect(httpClient.deleteUserFromPassword).not.toHaveBeenCalled()
    expect(registry.removeUser).toHaveBeenCalledWith('u1')
    expect(deleteEncryptionKey).toHaveBeenCalledWith('u1')
  })
})

describe('loginOnlineToAccount', () => {
  it('restores fetched cycle history under the server user id', async () => {
    const dispatch = jest.fn()
    ;(registry.findAnyUserByName as jest.Mock).mockResolvedValue(null)
    ;(httpClient.login as jest.Mock).mockResolvedValue({
      appToken: 'token',
      user: { id: 'server-user', name: 'Ana' },
      store: {
        storeVersion: 1,
        appState: {
          app: { locale: 'en' },
          prediction: { history: [{ startDate: '2026-08-01' }] },
          verifiedDates: { '2026-08-01': { periodDay: true } },
        },
      },
    })
    ;(switchToUser as jest.Mock).mockResolvedValue({ store: { dispatch } })

    await expect(loginOnlineToAccount('Ana', 'formatted')).resolves.toBe(true)
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'REFRESH_STORE',
        payload: expect.objectContaining({
          userID: 'server-user',
          verifiedDates: { '2026-08-01': { periodDay: true } },
        }),
      }),
    )
  })
})
