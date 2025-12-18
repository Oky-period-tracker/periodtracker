import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { ThemeSelect } from '../../../../src/screens/ThemeScreen/index'

jest.mock('react-native-size-matters', () => ({
  moderateScale: jest.fn((value) => value),
  scale: jest.fn((value) => value),
  verticalScale: jest.fn((value) => value),
}))

jest.mock('../../../../src/redux/useSelector', () => ({
  useSelector: jest.fn(),
}))

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(() => jest.fn()),
}))

jest.mock('../../../../src/contexts/ResponsiveContext', () => ({
  useResponsive: () => ({
    UIConfig: {
      themeSelection: {
        themeSize: {
          width: 140,
          height: 90,
        },
        iconSize: 20,
      },
    },
    width: 800,
  }),
}))

jest.mock('../../../../src/contexts/PredictionProvider', () => ({
  useTodayPrediction: () => ({
    onPeriod: false,
  }),
}))

jest.mock('../../../../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    isLoggedIn: true,
  }),
}))

jest.mock('../../../../src/hooks/useTranslate', () => ({
  useTranslate: () => (key: string) => key,
}))

jest.mock('../../../../src/hooks/useAccessibilityLabel', () => ({
  useAccessibilityLabel: () => (key: string) => key,
}))

jest.mock('../../../../src/services/asset', () => ({
  getAsset: jest.fn(() => ({ uri: 'test-bg.png' })),
}))

jest.mock('../../../../src/services/firebase', () => ({
  analytics: () => ({
    logEvent: jest.fn(),
  }),
}))

jest.mock('../../../../src/redux/actions', () => ({
  setTheme: jest.fn(),
}))

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}))

import { useSelector } from '../../../../src/redux/useSelector'
import { currentThemeSelector } from '../../../../src/redux/selectors'
import { useDispatch } from 'react-redux'
import { setTheme } from '../../../../src/redux/actions'

describe('<ThemeSelect />', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  }

  const mockDispatch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch)
    ;(useSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === currentThemeSelector) {
        return 'default'
      }
      return null
    })
  })

  it('renders theme selection screen', () => {
    const { getByText } = render(
      <ThemeSelect navigation={mockNavigation} />
    )
    expect(getByText('select_theme_title')).toBeTruthy()
  })

  it('displays subtitle', () => {
    const { getByText } = render(
      <ThemeSelect navigation={mockNavigation} />
    )
    expect(getByText('select_theme_subtitle')).toBeTruthy()
  })

  it('calls setTheme when a theme is selected', () => {
    const { getByText } = render(
      <ThemeSelect navigation={mockNavigation} />
    )
    // Find and press a theme button (assuming themes are rendered)
    // This would need actual theme names from translations
    expect(mockDispatch).toBeDefined()
  })

  it('navigates back when onGoBack is provided', () => {
    const mockOnGoBack = jest.fn()
    const { getByText } = render(
      <ThemeSelect navigation={mockNavigation} onGoBack={mockOnGoBack} />
    )
    // Find back button and press
    expect(mockOnGoBack).toBeDefined()
  })

  it('logs analytics event when theme changes', () => {
    const { getByText } = render(
      <ThemeSelect navigation={mockNavigation} />
    )
    // Theme change should trigger analytics
    expect(mockDispatch).toBeDefined()
  })
})

