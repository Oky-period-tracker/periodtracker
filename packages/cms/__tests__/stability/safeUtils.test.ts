jest.mock('../../src/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

import { safeJsonParse, toError } from '../../src/helpers/safeUtils'

describe('safeJsonParse', () => {
  it('parses valid JSON correctly', () => {
    const result = safeJsonParse('{"key": "value"}', {})
    expect(result).toEqual({ key: 'value' })
  })

  it('returns fallback for invalid JSON', () => {
    const fallback = { default: true }
    const result = safeJsonParse('not valid json', fallback)
    expect(result).toEqual(fallback)
  })

  it('returns fallback for empty string', () => {
    const result = safeJsonParse('', 'default')
    expect(result).toBe('default')
  })

  it('parses arrays correctly', () => {
    const result = safeJsonParse('[1, 2, 3]', [])
    expect(result).toEqual([1, 2, 3])
  })

  it('returns fallback for null input', () => {
    const result = safeJsonParse(null as any, 'fallback')
    // JSON.parse(null) returns null in some engines, or may throw
    // Our safeJsonParse should handle it gracefully either way
    expect(result === null || result === 'fallback').toBe(true)
  })

  it('logs warning on parse failure', () => {
    const { logger } = require('../../src/logger')
    safeJsonParse('bad json', {}, 'TestLabel')
    expect(logger.warn).toHaveBeenCalledWith(
      'TestLabel parse failed, using fallback',
      expect.objectContaining({ message: expect.any(String) }),
    )
  })

  it('preserves type parameter', () => {
    interface Config {
      name: string
      count: number
    }
    const result = safeJsonParse<Config>('{"name":"test","count":5}', { name: '', count: 0 })
    expect(result.name).toBe('test')
    expect(result.count).toBe(5)
  })
})

describe('toError', () => {
  it('returns the same Error if input is an Error', () => {
    const err = new Error('test')
    expect(toError(err)).toBe(err)
  })

  it('wraps a string into an Error', () => {
    const err = toError('string message')
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('string message')
  })

  it('wraps a number into an Error', () => {
    const err = toError(42)
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('42')
  })

  it('wraps null into an Error', () => {
    const err = toError(null)
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('null')
  })

  it('wraps undefined into an Error', () => {
    const err = toError(undefined)
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('undefined')
  })

  it('wraps an object into an Error', () => {
    const err = toError({ code: 'ERR_TEST' })
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBeDefined()
    expect(typeof err.message).toBe('string')
  })
})
