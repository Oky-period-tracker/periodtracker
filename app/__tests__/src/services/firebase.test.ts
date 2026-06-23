import { sanitizeAnalyticsParams } from '../../../src/services/firebase'

describe('sanitizeAnalyticsParams', () => {
  it('strips sensitive top-level keys', () => {
    const result = sanitizeAnalyticsParams({
      userId: 'abc',
      deviceId: 'xyz',
      user: { name: 'Jane' },
      user_id: 1,
      device_id: 2,
      screen: 'Home',
    })

    expect(result).toEqual({ screen: 'Home' })
  })

  it('removes sensitive keys nested in objects', () => {
    const result = sanitizeAnalyticsParams({
      event: 'open',
      meta: {
        userId: 'abc',
        source: 'push',
      },
    })

    expect(result).toEqual({
      event: 'open',
      meta: { source: 'push' },
    })
  })

  it('removes sensitive keys nested in arrays', () => {
    const result = sanitizeAnalyticsParams({
      items: [
        { userId: 'abc', value: 1 },
        { deviceId: 'xyz', value: 2 },
      ],
    })

    expect(result).toEqual({
      items: [{ value: 1 }, { value: 2 }],
    })
  })

  it('leaves primitives untouched', () => {
    expect(sanitizeAnalyticsParams('hello')).toBe('hello')
    expect(sanitizeAnalyticsParams(42)).toBe(42)
    expect(sanitizeAnalyticsParams(true)).toBe(true)
    expect(sanitizeAnalyticsParams(null)).toBeNull()
    expect(sanitizeAnalyticsParams(undefined)).toBeUndefined()
  })

  it('preserves non-sensitive payloads as-is', () => {
    const payload = { screen: 'Home', count: 3, tags: ['a', 'b'] }
    expect(sanitizeAnalyticsParams(payload)).toEqual(payload)
  })
})
