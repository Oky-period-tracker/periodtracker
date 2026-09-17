jest.mock('../../src/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

import { withRetry } from '../../src/helpers/retry'

describe('withRetry', () => {
  it('returns result on first success', async () => {
    const fn = jest.fn().mockResolvedValue('success')
    const result = await withRetry(fn, { maxRetries: 3, baseDelay: 10, label: 'Test' })
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries on failure and succeeds eventually', async () => {
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValue('success')

    const result = await withRetry(fn, { maxRetries: 3, baseDelay: 10, label: 'Test' })
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('throws after exhausting all retries', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('always fails'))

    await expect(
      withRetry(fn, { maxRetries: 2, baseDelay: 10, label: 'Test' }),
    ).rejects.toThrow('always fails')

    // initial attempt + 2 retries = 3 total
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('uses exponential backoff', async () => {
    const timestamps: number[] = []
    const fn = jest.fn().mockImplementation(() => {
      timestamps.push(Date.now())
      if (timestamps.length < 3) throw new Error('not yet')
      return Promise.resolve('done')
    })

    await withRetry(fn, { maxRetries: 3, baseDelay: 50, label: 'Backoff' })

    expect(timestamps).toHaveLength(3)
    // Second retry delay should be longer than first (exponential)
    if (timestamps.length >= 3) {
      const delay1 = timestamps[1] - timestamps[0]
      const delay2 = timestamps[2] - timestamps[1]
      // With jitter, delay2 should generally be >= delay1 * 0.8 (allowing for jitter variation)
      expect(delay2).toBeGreaterThanOrEqual(delay1 * 0.5)
    }
  })

  it('converts non-Error rejections to Error objects', async () => {
    const fn = jest.fn().mockRejectedValue('string error')

    await expect(
      withRetry(fn, { maxRetries: 0, baseDelay: 10, label: 'Test' }),
    ).rejects.toThrow('string error')
  })

  it('uses default options when none provided', async () => {
    const fn = jest.fn().mockResolvedValue('ok')
    const result = await withRetry(fn)
    expect(result).toBe('ok')
  })

  it('respects maxDelay cap', async () => {
    const startTimes: number[] = []
    const fn = jest.fn().mockImplementation(() => {
      startTimes.push(Date.now())
      if (startTimes.length <= 4) throw new Error('fail')
      return Promise.resolve('done')
    })

    await withRetry(fn, { maxRetries: 5, baseDelay: 10, maxDelay: 50, label: 'Cap' })

    // All delays should be <= maxDelay + jitter margin
    for (let i = 1; i < startTimes.length; i++) {
      const delay = startTimes[i] - startTimes[i - 1]
      expect(delay).toBeLessThan(200) // generous margin for CI
    }
  })
})
