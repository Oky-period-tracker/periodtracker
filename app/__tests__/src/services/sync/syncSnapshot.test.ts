import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  clearSyncSnapshot,
  loadSyncSnapshot,
  saveSyncSnapshot,
} from '../../../../src/services/sync/syncSnapshot'

jest.mock('../../../../src/services/auth/encryptionKeys', () => ({
  getEncryptionKey: jest.fn(() => 'test-key'),
}))

describe('sync snapshots', () => {
  beforeEach(() => AsyncStorage.clear())

  it('encrypts and restores cycle data for an inactive-account upload', async () => {
    const state = {
      auth: { user: { id: 'u1', name: 'Ana' } },
      app: { locale: 'en' },
      prediction: { history: [{ startDate: '2026-08-01' }] },
      answer: { u1: { verifiedDates: { '2026-08-01': { periodDay: true } } } },
      helpCenters: {},
    }
    await saveSyncSnapshot('u1', state as never)

    const saved = await loadSyncSnapshot('u1')
    expect(saved?.appState.prediction.history).toHaveLength(1)
    expect(saved?.appState.verifiedDates).toEqual({
      '2026-08-01': { periodDay: true },
    })
    expect((await AsyncStorage.getItem('metadata:oky:sync:u1'))).not.toContain('2026-08-01')
  })

  it('does not clear a newer snapshot after an older upload finishes', async () => {
    const now = jest.spyOn(Date, 'now').mockReturnValueOnce(1).mockReturnValueOnce(2)
    const state = {
      auth: { user: { id: 'u1' } },
      app: {},
      prediction: {},
      answer: { u1: { verifiedDates: {} } },
      helpCenters: {},
    }
    await saveSyncSnapshot('u1', state as never)
    const old = await loadSyncSnapshot('u1')
    await saveSyncSnapshot('u1', state as never)
    await clearSyncSnapshot('u1', old!.updatedAt)

    expect(await loadSyncSnapshot('u1')).not.toBeNull()
    now.mockRestore()
  })
})
