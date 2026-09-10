import NetInfo from '@react-native-community/netinfo'
import { syncAllAccounts } from '../../../../src/services/sync/syncManager'
import * as registry from '../../../../src/services/userMetadata/registry'
import { getSyncSecrets } from '../../../../src/services/auth/credentialVault'
import {
  clearSyncSnapshot,
  loadSyncSnapshot,
} from '../../../../src/services/sync/syncSnapshot'
import { httpClient } from '../../../../src/services/HttpClient'

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
  addEventListener: jest.fn(() => jest.fn()),
}))
jest.mock('../../../../src/redux/storeManager', () => ({
  getActiveBundle: jest.fn(() => null),
  subscribeBundle: jest.fn(() => jest.fn()),
}))
jest.mock('../../../../src/services/userMetadata/registry')
jest.mock('../../../../src/services/auth/credentialVault')
jest.mock('../../../../src/services/auth/encryptionKeys', () => ({
  deleteEncryptionKey: jest.fn(),
}))
jest.mock('../../../../src/services/sync/syncSnapshot')
jest.mock('../../../../src/services/deviceId', () => ({ getDeviceId: jest.fn(() => 'device') }))
jest.mock('../../../../src/services/HttpClient', () => ({
  httpClient: {
    signup: jest.fn(),
    replaceStore: jest.fn(),
    deleteUserFromPassword: jest.fn(),
  },
}))

const snapshot = (name: string, updatedAt: number) => ({
  updatedAt,
  storeVersion: 1,
  user: { name, country: 'UG' },
  appState: { app: {}, prediction: { history: [name] }, verifiedDates: {}, helpCenters: {} },
})

describe('syncAllAccounts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true })
    ;(registry.listAllUsers as jest.Mock).mockResolvedValue([
      { id: 'a', name: 'A', isPendingSync: true },
      { id: 'b', name: 'B', isPendingSync: false, appToken: 'token-b' },
      { id: 'c', name: 'C', isPendingDelete: true },
    ])
    ;(loadSyncSnapshot as jest.Mock).mockImplementation((id) =>
      Promise.resolve(id === 'a' ? snapshot('A', 1) : id === 'b' ? snapshot('B', 2) : null),
    )
    ;(getSyncSecrets as jest.Mock).mockResolvedValue({ password: 'pw', secretAnswer: 'sa' })
    ;(httpClient.signup as jest.Mock).mockResolvedValue({
      appToken: 'token-a',
      user: { id: 'server-a' },
    })
    ;(httpClient.replaceStore as jest.Mock).mockResolvedValue(undefined)
    ;(httpClient.deleteUserFromPassword as jest.Mock).mockResolvedValue(undefined)
  })

  it('registers and uploads every account and completes queued deletions', async () => {
    await syncAllAccounts()

    expect(httpClient.signup).toHaveBeenCalledWith(expect.objectContaining({ name: 'A' }))
    expect(registry.markSynced).toHaveBeenCalledWith('a', 'server-a', 'token-a')
    expect(httpClient.replaceStore).toHaveBeenCalledTimes(2)
    expect(httpClient.deleteUserFromPassword).toHaveBeenCalledWith({ name: 'C', password: 'pw' })
    expect(registry.removeUser).toHaveBeenCalledWith('c')
    expect(clearSyncSnapshot).toHaveBeenCalledWith('a', 1)
    expect(clearSyncSnapshot).toHaveBeenCalledWith('b', 2)
  })
})
