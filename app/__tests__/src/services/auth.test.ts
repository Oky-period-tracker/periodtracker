import { formatPassword } from '../../../src/services/auth'

describe('formatPassword', () => {
  it('converts a password to lowercase', () => {
    expect(formatPassword('Password123')).toBe('password123')
  })

  it('trims leading and trailing whitespace', () => {
    expect(formatPassword('  Password123  ')).toBe('password123')
  })

  it('handles an already formatted password', () => {
    expect(formatPassword('password123')).toBe('password123')
  })

  it('handles empty strings', () => {
    expect(formatPassword('')).toBe('')
  })

  it('handles strings with only whitespace', () => {
    expect(formatPassword('   ')).toBe('')
  })

  it('handles strings with mixed case and whitespace', () => {
    expect(formatPassword('   PaSsWoRd   ')).toBe('password')
  })
})
