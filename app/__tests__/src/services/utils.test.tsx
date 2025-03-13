import React from 'react'
import { Text } from 'react-native'
import {
  recordToArray,
  generateRange,
  reactNodeExists,
  formatDate,
  isDefined,
} from '../../../src/services/utils'

describe('recordToArray', () => {
  it('returns an empty array when no object is provided', () => {
    expect(recordToArray()).toEqual([])
  })

  it('converts an object to an array of entries', () => {
    const input = { a: 1, b: 2 }
    const output = [
      ['a', 1],
      ['b', 2],
    ]
    expect(recordToArray(input)).toEqual(output)
  })
})

describe('generateRange', () => {
  it('generates a range of numbers in ascending order', () => {
    expect(generateRange(1, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('generates a range of numbers in descending order', () => {
    expect(generateRange(5, 1)).toEqual([5, 4, 3, 2, 1])
  })

  it('returns an array with a single number when start equals end', () => {
    expect(generateRange(3, 3)).toEqual([3])
  })
})

describe('reactNodeExists', () => {
  it('returns false for null, undefined, or empty array', () => {
    expect(reactNodeExists(null)).toBe(false)
    expect(reactNodeExists(undefined)).toBe(false)
    expect(reactNodeExists([])).toBe(false)
  })

  it('returns true for a valid React node', () => {
    expect(reactNodeExists('Hello')).toBe(true)
    expect(reactNodeExists(<Text>Test</Text>)).toBe(true)
  })

  it('returns true if at least one valid React node exists in an array', () => {
    expect(reactNodeExists([null, 'Test'])).toBe(true)
  })
})

describe('formatDate', () => {
  it('formats a date object to "YYYY-MM-DD"', () => {
    const date = new Date('2025-01-20T12:00:00Z')
    expect(formatDate(date)).toBe('2025-01-20')
  })
})

describe('isDefined', () => {
  it('filters out undefined values from an array', () => {
    const input = [1, undefined, 2, undefined, 3]
    const output = input.filter(isDefined)
    expect(output).toEqual([1, 2, 3])
  })

  it('returns true for defined values and false for undefined', () => {
    expect(isDefined(1)).toBe(true)
    expect(isDefined(undefined)).toBe(false)
  })
})
