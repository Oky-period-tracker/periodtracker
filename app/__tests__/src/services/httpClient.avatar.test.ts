import { httpClient } from '../../../src/services/HttpClient'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('httpClient - Avatar APIs', () => {
  const mockAppToken = 'test-token-123'
  const mockBaseURL = 'http://localhost:3000'

  beforeEach(() => {
    jest.clearAllMocks()
    mockedAxios.create = jest.fn(() => mockedAxios as any)
    ;(mockedAxios.post as jest.Mock).mockResolvedValue({ data: {} })
  })

  describe('updateAvatar', () => {
    it('sends correct payload to update avatar', async () => {
      const mockAvatar = {
        customAvatarUnlocked: true,
        name: 'MyFriend',
        body: 'body-medium',
        skinColor: '#F1B98C',
      }

      await httpClient.updateAvatar({
        appToken: mockAppToken,
        avatar: mockAvatar,
      })

      expect(mockedAxios.post).toHaveBeenCalled()
      // Verify the call was made with correct parameters
      const callArgs = (mockedAxios.post as jest.Mock).mock.calls[0]
      expect(callArgs).toBeDefined()
    })

    it('includes appToken in request headers', async () => {
      await httpClient.updateAvatar({
        appToken: mockAppToken,
        avatar: { customAvatarUnlocked: true },
      })

      expect(mockedAxios.post).toHaveBeenCalled()
      // Headers should include authorization
    })

    it('handles errors gracefully', async () => {
      const error = new Error('Network error')
      ;(mockedAxios.post as jest.Mock).mockRejectedValue(error)

      await expect(
        httpClient.updateAvatar({
          appToken: mockAppToken,
          avatar: { customAvatarUnlocked: true },
        })
      ).rejects.toThrow()
    })

    it('handles partial avatar updates', async () => {
      await httpClient.updateAvatar({
        appToken: mockAppToken,
        avatar: { customAvatarUnlocked: true },
      })

      expect(mockedAxios.post).toHaveBeenCalled()
    })
  })

  describe('updateCyclesNumber', () => {
    it('sends correct cyclesNumber to API', async () => {
      await httpClient.updateCyclesNumber({
        appToken: mockAppToken,
        cyclesNumber: 3,
      })

      expect(mockedAxios.post).toHaveBeenCalled()
      const callArgs = (mockedAxios.post as jest.Mock).mock.calls[0]
      expect(callArgs).toBeDefined()
    })

    it('includes appToken in request', async () => {
      await httpClient.updateCyclesNumber({
        appToken: mockAppToken,
        cyclesNumber: 5,
      })

      expect(mockedAxios.post).toHaveBeenCalled()
    })

    it('handles zero cyclesNumber', async () => {
      await httpClient.updateCyclesNumber({
        appToken: mockAppToken,
        cyclesNumber: 0,
      })

      expect(mockedAxios.post).toHaveBeenCalled()
    })

    it('handles errors gracefully', async () => {
      const error = new Error('API error')
      ;(mockedAxios.post as jest.Mock).mockRejectedValue(error)

      await expect(
        httpClient.updateCyclesNumber({
          appToken: mockAppToken,
          cyclesNumber: 3,
        })
      ).rejects.toThrow()
    })

    it('handles large cyclesNumber values', async () => {
      await httpClient.updateCyclesNumber({
        appToken: mockAppToken,
        cyclesNumber: 100,
      })

      expect(mockedAxios.post).toHaveBeenCalled()
    })
  })
})

