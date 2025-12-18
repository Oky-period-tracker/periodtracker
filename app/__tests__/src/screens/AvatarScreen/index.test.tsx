import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { AvatarSelect } from '../../../../src/screens/AvatarScreen/index'

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
      avatarSelection: {
        avatarSize: {
          width: 160,
          height: 68,
        },
        iconSize: 20,
      },
    },
    width: 800,
    height: 600,
    widthBreakpoint: 'large',
    size: 'large',
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

jest.mock('../../../../src/hooks/useAvatar', () => ({
  useAvatar: () => ({
    bodyType: 'body-medium',
    skinColor: '#F1B98C',
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
  setAvatarWithValidation: jest.fn(),
}))

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}))

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((callback) => callback()),
}))

import { useSelector } from '../../../../src/redux/useSelector'
import { currentAvatarSelector, currentUserSelector } from '../../../../src/redux/selectors'
import { currentThemeSelector } from '../../../../src/redux/selectors'

describe('<AvatarSelect />', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  }

  const mockCurrentUser = {
    id: 'user123',
    cyclesNumber: 3,
    avatar: {
      customAvatarUnlocked: true,
      name: 'MyFriend',
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === currentAvatarSelector) {
        return 'oky'
      }
      if (selector === currentUserSelector) {
        return mockCurrentUser
      }
      if (selector === currentThemeSelector) {
        return 'default'
      }
      return null
    })
  })

  it('renders avatar selection screen', () => {
    const { getByText } = render(
      <AvatarSelect navigation={mockNavigation} />
    )
    expect(getByText('select_avatar_title_unlocked')).toBeTruthy()
  })

  it('displays unlocked message when friend is unlocked', () => {
    const { getByText } = render(
      <AvatarSelect navigation={mockNavigation} />
    )
    expect(getByText('select_avatar_subtitle_unlocked')).toBeTruthy()
  })

  it('displays locked message when friend is locked', () => {
    ;(useSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === currentAvatarSelector) {
        return 'oky'
      }
      if (selector === currentUserSelector) {
        return {
          ...mockCurrentUser,
          cyclesNumber: 2,
          avatar: {
            customAvatarUnlocked: false,
          },
        }
      }
      if (selector === currentThemeSelector) {
        return 'default'
      }
      return null
    })

    const { getByText } = render(
      <AvatarSelect navigation={mockNavigation} />
    )
    expect(getByText('select_avatar_reminder_locked')).toBeTruthy()
  })

  it('navigates to customizer when friend avatar is pressed and unlocked', () => {
    const { getByLabelText } = render(
      <AvatarSelect navigation={mockNavigation} />
    )
    // Find and press friend avatar by accessibility label
    const friendButton = getByLabelText('select_avatar_button: friend, tap to customize')
    fireEvent.press(friendButton)

    expect(mockNavigation.navigate).toHaveBeenCalledWith('CustomAvatar')
  })

  it('does not navigate when friend avatar is locked', () => {
    ;(useSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === currentAvatarSelector) {
        return 'oky'
      }
      if (selector === currentUserSelector) {
        return {
          ...mockCurrentUser,
          cyclesNumber: 2,
          avatar: {
            customAvatarUnlocked: false,
          },
        }
      }
      if (selector === currentThemeSelector) {
        return 'default'
      }
      return null
    })

    const { getByText } = render(
      <AvatarSelect navigation={mockNavigation} />
    )
    // Friend should show lock, not be pressable
    expect(mockNavigation.navigate).not.toHaveBeenCalled()
  })
})

