jest.mock('../../src/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

import { withTimeout, DEFAULT_QUERY_TIMEOUT, DEFAULT_REQUEST_TIMEOUT, DEFAULT_EXTERNAL_TIMEOUT } from '../../src/helpers/timeout'

describe('withTimeout', () => {
  it('resolves when promise completes before timeout', async () => {
    const result = await withTimeout(Promise.resolve('done'), 1000)
    expect(result).toBe('done')
  })

  it('rejects when promise exceeds timeout', async () => {
    const slow = new Promise((resolve) => setTimeout(() => resolve('late'), 2000))
    await expect(withTimeout(slow, 50, 'TestOp')).rejects.toThrow('TestOp timed out after 50ms')
  })

  it('propagates original error when promise rejects before timeout', async () => {
    const failing = Promise.reject(new Error('original error'))
    await expect(withTimeout(failing, 5000)).rejects.toThrow('original error')
  })

  it('uses default label in timeout message', async () => {
    const slow = new Promise((resolve) => setTimeout(() => resolve('late'), 2000))
    await expect(withTimeout(slow, 50)).rejects.toThrow('Operation timed out after 50ms')
  })

  it('clears timer on success so it does not leak', async () => {
    const clearSpy = jest.spyOn(global, 'clearTimeout')

    const result = await withTimeout(Promise.resolve('ok'), 5000)
    expect(result).toBe('ok')
    expect(clearSpy).toHaveBeenCalled()

    clearSpy.mockRestore()
  })

  it('exports correct default values', () => {
    expect(DEFAULT_QUERY_TIMEOUT).toBe(30000)
    expect(DEFAULT_REQUEST_TIMEOUT).toBe(60000)
    expect(DEFAULT_EXTERNAL_TIMEOUT).toBe(15000)
  })
})
