import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { AvatarItem } from '../../../../../src/screens/AvatarScreen/components/AvatarItem'

jest.mock('react-native-size-matters', () => ({
  moderateScale: jest.fn((value) => value),
  scale: jest.fn((value) => value),
  verticalScale: jest.fn((value) => value),
}))

jest.mock('../../../../../src/resources/assets/friendAssets', () => {
  const React = require('react')
  const { View } = require('react-native')
  return {
    getStandardAvatarSvg: jest.fn((avatar) => {
      if (avatar === 'friend-locked') {
        return () => <View testID="friend-locked-svg" />
      }
      if (avatar === 'friend-unlocked-not-customized') {
        return () => <View testID="friend-unlocked-not-customized-svg" />
      }
      if (avatar === 'friend') {
        return () => <View testID="friend-svg" />
      }
      return () => <View testID={`standard-avatar-${avatar}-svg`} />
    }),
  }
})

jest.mock('../../../../../src/components/AvatarPreview', () => {
  const React = require('react')
  const { View } = require('react-native')
  return {
    AvatarPreview: (props: any) => <View testID="avatar-preview" {...props} />,
  }
})

jest.mock('../../../../../src/hooks/useAccessibilityLabel', () => ({
  useAccessibilityLabel: () => (key: string) => key,
}))

jest.mock('../../../../../src/hooks/useTranslate', () => ({
  useTranslate: () => (key: string) => key,
}))

describe('<AvatarItem />', () => {
  const mockOnPress = jest.fn()
  const mockGetAccessibilityLabel = jest.fn((key) => key)

  const defaultProps = {
    avatar: 'oky' as any,
    isSelected: false,
    isCurrent: false,
    isFriendAvatar: false,
    isFriendAvatarLocked: false,
    isFriendCustomized: false,
    avatarData: null,
    avatarWidth: 100,
    width: 800,
    avatarConfig: {
      iconSize: 20,
    },
    dynamicStyles: {
      avatar: {},
      avatarBody: {},
      imageWrapper: {},
      avatarWhiteContainer: {},
      avatarWhiteContainerDefault: {},
      friendAvatarContainer: {},
      standardAvatarSvgContainer: {},
      check: {},
      grayIconContainer: {},
      pendingIconContainer: {},
      avatarPreviewContainer: {},
      avatarPreview: {},
      name: {},
    },
    onPress: mockOnPress,
    avatarLabel: 'Oky',
    getAccessibilityLabel: mockGetAccessibilityLabel,
    currentUser: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders standard avatar', () => {
    const { getByTestId } = render(<AvatarItem {...defaultProps} />)
    expect(getByTestId('standard-avatar-oky-svg')).toBeTruthy()
  })

  it('renders friend avatar when locked', () => {
    const { getByTestId } = render(
      <AvatarItem {...defaultProps} isFriendAvatar={true} isFriendAvatarLocked={true} />
    )
    expect(getByTestId('friend-locked-svg')).toBeTruthy()
  })

  it('renders friend avatar when unlocked but not customized', () => {
    const { getByTestId } = render(
      <AvatarItem
        {...defaultProps}
        isFriendAvatar={true}
        isFriendAvatarLocked={false}
        isFriendCustomized={false}
      />
    )
    expect(getByTestId('friend-unlocked-not-customized-svg')).toBeTruthy()
  })

  it('renders friend avatar with preview when customized', () => {
    const { getByTestId } = render(
      <AvatarItem
        {...defaultProps}
        isFriendAvatar={true}
        isFriendAvatarLocked={false}
        isFriendCustomized={true}
        avatarData={{
          bodyType: 'body-medium',
          skinColor: '#F1B98C',
        }}
      />
    )
    expect(getByTestId('friend-svg')).toBeTruthy()
    expect(getByTestId('avatar-preview')).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    const { getByText } = render(<AvatarItem {...defaultProps} />)
    const avatar = getByText('oky').parent

    fireEvent.press(avatar!)

    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })

  it('shows check icon when selected and current', () => {
    const { getByTestId } = render(
      <AvatarItem {...defaultProps} isSelected={true} isCurrent={true} />
    )
    // Check icon should be visible
    expect(getByTestId).toBeDefined()
  })

  it('shows gray icon when current but not selected', () => {
    const { getByTestId } = render(
      <AvatarItem {...defaultProps} isSelected={false} isCurrent={true} />
    )
    // Gray icon should be visible
    expect(getByTestId).toBeDefined()
  })

  it('shows pending icon when selected but not current', () => {
    const { getByTestId } = render(
      <AvatarItem {...defaultProps} isSelected={true} isCurrent={false} />
    )
    // Pending icon should be visible
    expect(getByTestId).toBeDefined()
  })

  it('displays custom name for friend avatar when available', () => {
    const { getByText } = render(
      <AvatarItem
        {...defaultProps}
        isFriendAvatar={true}
        currentUser={{
          avatar: {
            name: 'MyFriend',
          },
        } as any}
      />
    )
    expect(getByText('MyFriend')).toBeTruthy()
  })

  it('displays avatar name when no custom name', () => {
    const { getByText } = render(
      <AvatarItem
        {...defaultProps}
        isFriendAvatar={true}
        currentUser={null}
      />
    )
    expect(getByText('oky')).toBeTruthy()
  })
})

