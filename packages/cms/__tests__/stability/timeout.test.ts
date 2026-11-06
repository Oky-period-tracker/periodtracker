jest.mock('../../src/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

import {
  withTimeout,
  DEFAULT_QUERY_TIMEOUT,
  DEFAULT_REQUEST_TIMEOUT,
  DEFAULT_EXTERNAL_TIMEOUT,
} from '../../src/helpers/timeout'

// A promise that settles long after the timeouts under test. Its timer is
// cancelled once the test is over, or Jest reports it as an open handle.
const slowPromise = () => {
  let timer: ReturnType<typeof setTimeout> | undefined
  const promise = new Promise((resolve) => {
    timer = setTimeout(() => resolve('late'), 2000)
  })
  return { promise, cancel: () => clearTimeout(timer) }
}

describe('withTimeout', () => {
  it('resolves when promise completes before timeout', async () => {
    const result = await withTimeout(Promise.resolve('done'), 1000)
    expect(result).toBe('done')
  })

  it('rejects when promise exceeds timeout', async () => {
    const slow = slowPromise()
    await expect(withTimeout(slow.promise, 50, 'TestOp')).rejects.toThrow(
      'TestOp timed out after 50ms',
    )
    slow.cancel()
  })

  it('propagates original error when promise rejects before timeout', async () => {
    const failing = Promise.reject(new Error('original error'))
    await expect(withTimeout(failing, 5000)).rejects.toThrow('original error')
  })

  it('uses default label in timeout message', async () => {
    const slow = slowPromise()
    await expect(withTimeout(slow.promise, 50)).rejects.toThrow('Operation timed out after 50ms')
    slow.cancel()
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
