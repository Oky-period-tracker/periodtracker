import { renderHook } from '@testing-library/react-hooks'
import {
  useTranslate,
  useAvailableLocaleEffect,
  initialLocale,
} from '../../../src/hooks/useTranslate'
import { useDispatch } from 'react-redux'
import { useSelector } from '../../../src/redux/useSelector'

jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [{ languageCode: 'en' }]),
}))

jest.mock('../../../src/resources/translations', () => ({
  appTranslations: {
    en: { hello: 'Hello', missingKey: null },
    fr: { hello: 'Bonjour' },
  },
  defaultLocale: 'en',
  localeTranslations: {},
  themeTranslations: {},
}))

jest.mock('../../../src/redux/useSelector', () => ({
  useSelector: jest.fn(),
}))

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}))

describe('useTranslate', () => {
  it('returns a translated value for a valid key', () => {
    ;(useSelector as jest.Mock).mockReturnValue('en')
    const { result } = renderHook(() => useTranslate())

    const translate = result.current
    expect(translate('hello')).toBe('Hello')
  })

  it('returns the key itself if translation is missing in production mode', () => {
    ;(useSelector as jest.Mock).mockReturnValue('en')
    process.env.ENV = 'production'

    const { result } = renderHook(() => useTranslate())
    const translate = result.current

    expect(translate('unknownKey')).toBe('UnknownKey')
  })

  it('capitalizes the first letter of the translation', () => {
    ;(useSelector as jest.Mock).mockReturnValue('en')
    const { result } = renderHook(() => useTranslate())

    const translate = result.current
    expect(translate('hello')).toBe('Hello')
  })
})

describe('useAvailableLocaleEffect', () => {
  const mockDispatch = jest.fn()
  beforeEach(() => {
    jest.clearAllMocks()
    ;((useDispatch as unknown) as jest.Mock).mockReturnValue(mockDispatch)
  })

  it('sets the locale to initialLocale if current locale is unavailable', () => {
    ;(useSelector as jest.Mock).mockReturnValue('invalidLocale')

    renderHook(() => useAvailableLocaleEffect())

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_LOCALE',
      payload: { locale: initialLocale },
    })
  })

  it('does not dispatch if the current locale is valid', () => {
    ;(useSelector as jest.Mock).mockReturnValue('en')

    renderHook(() => useAvailableLocaleEffect())

    expect(mockDispatch).not.toHaveBeenCalled()
  })
})
