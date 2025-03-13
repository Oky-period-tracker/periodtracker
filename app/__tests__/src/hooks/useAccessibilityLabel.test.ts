import { renderHook } from '@testing-library/react-hooks'
import { useAccessibilityLabel } from '../../../src/hooks/useAccessibilityLabel'
import { Platform } from 'react-native'

jest.mock('../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      test_label: 'Test Label',
      accessibility_prompt: 'Double-tap to activate',
    }
    return translations[key] || key
  }),
}))

describe('useAccessibilityLabel', () => {
  it('translates the label when shouldTranslate is true', () => {
    const { result } = renderHook(() => useAccessibilityLabel())
    const getLabel = result.current
    expect(getLabel('test_label')).toBe('Test Label. Double-tap to activate')
  })

  it('returns raw label key when shouldTranslate is false', () => {
    const { result } = renderHook(() => useAccessibilityLabel())
    const getLabel = result.current
    expect(getLabel('test_label', false)).toBe('test_label. Double-tap to activate')
  })

  it('appends accessibility prompt for iOS', () => {
    Platform.OS = 'ios'
    const { result } = renderHook(() => useAccessibilityLabel())
    const getLabel = result.current
    expect(getLabel('test_label')).toBe('Test Label. Double-tap to activate')
  })

  it('does not append accessibility prompt for non-iOS platforms', () => {
    Platform.OS = 'android'
    const { result } = renderHook(() => useAccessibilityLabel())
    const getLabel = result.current
    expect(getLabel('test_label')).toBe('Test Label')
  })

  it('returns an empty string for an empty label key', () => {
    const { result } = renderHook(() => useAccessibilityLabel())
    const getLabel = result.current
    expect(getLabel('')).toBe('')
  })
})
