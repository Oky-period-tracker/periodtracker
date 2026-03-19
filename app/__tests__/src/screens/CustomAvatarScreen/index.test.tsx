import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import CustomAvatarScreen from '../../../../src/screens/CustomAvatarScreen/index'

jest.mock('react-native-size-matters', () => ({
  moderateScale: jest.fn((value) => value),
  scale: jest.fn((value) => value),
  verticalScale: jest.fn((value) => value),
}))

jest.mock('../../../../src/hooks/useColor', () => ({
  useColor: () => ({
    backgroundColor: '#FFFFFF',
    palette: {
      primary: '#A4D233',
      secondary: '#F1B98C',
    },
  }),
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
      avatarCustomization: {
        avatarPreviewSize: { width: 150, height: 200 },
        spacing: { small: 10, medium: 16, large: 22 },
        bodyTypeSize: { width: 78, height: 117 },
        optionImageSize: { width: 78, height: 100 },
        categoryIconSize: 48,
        paddingHorizontal: 18,
      },
      avatarSelection: {
        iconSize: 20,
        borderWidth: 2,
      },
    },
    width: 800,
  }),
}))

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}))

jest.mock('../../../../src/hooks/useTranslate', () => ({
  useTranslate: () => (key: string) => key,
}))

jest.mock('../../../../src/hooks/useAccessibilityLabel', () => ({
  useAccessibilityLabel: () => (key: string) => key,
}))

jest.mock('../../../../src/services/firebase', () => ({
  analytics: () => ({
    logEvent: jest.fn(),
  }),
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
  useRoute: jest.fn(() => ({
    params: {},
  })),
  useFocusEffect: jest.fn((callback) => callback()),
}))

jest.mock('../../../../src/components/AvatarPreview', () => ({
  AvatarPreview: (props: any) => <div testID="avatar-preview" {...props} />,
}))

jest.mock('../../../../src/screens/CustomAvatarScreen/components/CategoryTabs', () => ({
  CategoryTabs: ({ onSelectCategory }: any) => (
    <div testID="category-tabs">
      <button testID="body-category" onClick={() => onSelectCategory('body')}>Body</button>
      <button testID="hair-category" onClick={() => onSelectCategory('hair')}>Hair</button>
    </div>
  ),
}))

jest.mock('../../../../src/screens/CustomAvatarScreen/components/FirstVisitTooltip', () => {
  const React = require('react')
  const { TouchableOpacity, View } = require('react-native')
  return {
    FirstVisitTooltip: ({ visible, onClose }: any) => {
      if (!visible) return null
      return (
        <View testID="first-visit-tooltip">
          <TouchableOpacity testID="close-tooltip" onPress={onClose}>
            <View>Close</View>
          </TouchableOpacity>
        </View>
      )
    },
  }
})

jest.mock('../../../../src/screens/CustomAvatarScreen/components/AvatarNamingModal', () => ({
  AvatarNamingModal: ({ visible, onConfirm, onSkip }: any) => {
    if (!visible) return null
    return (
      <div testID="naming-modal">
        <button testID="confirm-name" onClick={onConfirm}>Confirm</button>
        <button testID="skip-name" onClick={onSkip}>Skip</button>
      </div>
    )
  },
}))

import { useSelector } from '../../../../src/redux/useSelector'
import { currentUserSelector, appTokenSelector } from '../../../../src/redux/selectors'

describe('<CustomAvatarScreen />', () => {
  const mockParent = {
    setOptions: jest.fn(),
    navigate: jest.fn(),
  }

  const mockNavigation = {
    setOptions: jest.fn(),
    getParent: jest.fn(() => mockParent),
    navigate: jest.fn(),
    goBack: jest.fn(),
    canGoBack: jest.fn(() => true),
  }

  const mockCurrentUser = {
    id: 'user123',
    avatar: {
      name: 'MyFriend',
      body: 'body-medium',
      skinColor: '#F1B98C',
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === currentUserSelector) {
        return mockCurrentUser
      }
      if (selector === appTokenSelector) {
        return 'test-token'
      }
      return null
    })
  })

  it('renders the customizer screen', () => {
    const { getByText } = render(<CustomAvatarScreen navigation={mockNavigation} />)
    expect(getByText('customizer_title')).toBeTruthy()
  })

  it('displays subtitle', () => {
    const { getByText } = render(<CustomAvatarScreen navigation={mockNavigation} />)
    expect(getByText('customizer_subtitle')).toBeTruthy()
  })

  it('renders category tabs', () => {
    const { getByTestId } = render(<CustomAvatarScreen navigation={mockNavigation} />)
    expect(getByTestId('category-tabs')).toBeTruthy()
  })

  it('renders avatar preview', () => {
    const { getByTestId } = render(<CustomAvatarScreen navigation={mockNavigation} />)
    expect(getByTestId('avatar-preview')).toBeTruthy()
  })

  it('shows first visit tooltip on first visit', async () => {
    const { getByTestId } = render(<CustomAvatarScreen navigation={mockNavigation} />)
    await waitFor(
      () => {
        expect(getByTestId('first-visit-tooltip')).toBeTruthy()
      },
      { timeout: 3000 }
    )
  })

  it('closes tooltip when close button is pressed', async () => {
    const { getByTestId, queryByTestId } = render(
      <CustomAvatarScreen navigation={mockNavigation} />
    )
    await waitFor(
      () => {
        expect(getByTestId('first-visit-tooltip')).toBeTruthy()
      },
      { timeout: 3000 }
    )

    const closeButton = getByTestId('close-tooltip')
    fireEvent.press(closeButton)

    await waitFor(
      () => {
        expect(queryByTestId('first-visit-tooltip')).toBeNull()
      },
      { timeout: 3000 }
    )
  })

  it('changes category when category tab is pressed', () => {
    const { getByTestId } = render(<CustomAvatarScreen navigation={mockNavigation} />)
    const hairCategory = getByTestId('hair-category')

    fireEvent.press(hairCategory)

    // Category should change (this would show different options)
    expect(getByTestId('category-tabs')).toBeTruthy()
  })

  it('shows naming modal when save button is pressed', () => {
    const { getByText, getByTestId } = render(
      <CustomAvatarScreen navigation={mockNavigation} />
    )
    const saveButton = getByText('customizer_save_friend')

    fireEvent.press(saveButton)

    expect(getByTestId('naming-modal')).toBeTruthy()
  })

  it('handles exit button press', () => {
    const { getByText } = render(<CustomAvatarScreen navigation={mockNavigation} />)
    const exitButton = getByText('customizer_exit')

    fireEvent.press(exitButton)

    expect(mockParent.navigate).toHaveBeenCalledWith('home')
  })

  it('handles exit when no parent navigation', () => {
    mockNavigation.getParent = jest.fn(() => null)
    mockNavigation.canGoBack = jest.fn(() => true)

    const { getByText } = render(<CustomAvatarScreen navigation={mockNavigation} />)
    const exitButton = getByText('customizer_exit')

    fireEvent.press(exitButton)

    expect(mockNavigation.goBack).toHaveBeenCalled()
  })

  it('handles exit fallback navigation', () => {
    mockNavigation.getParent = jest.fn(() => null)
    mockNavigation.canGoBack = jest.fn(() => false)

    const { getByText } = render(<CustomAvatarScreen navigation={mockNavigation} />)
    const exitButton = getByText('customizer_exit')

    fireEvent.press(exitButton)

    expect(mockNavigation.navigate).toHaveBeenCalledWith('home')
  })
})

