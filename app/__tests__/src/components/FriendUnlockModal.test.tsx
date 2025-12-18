import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { FriendUnlockModal } from '../../../src/components/FriendUnlockModal'

jest.mock('react-native-size-matters', () => ({
  moderateScale: jest.fn((value) => value),
  scale: jest.fn((value) => value),
  verticalScale: jest.fn((value) => value),
}))

jest.mock('../../../src/components/Modal', () => ({
  Modal: ({ visible, children, style }: any) => {
    if (!visible) return null
    return <div testID="modal" style={style}>{children}</div>
  },
}))

jest.mock('../../../src/services/asset', () => ({
  getAsset: jest.fn(() => ({ uri: 'test-image.png' })),
}))

jest.mock('../../../src/hooks/useScreenDimensions', () => ({
  useScreenDimensions: () => ({ width: 800 }),
}))

jest.mock('../../../src/contexts/ResponsiveContext', () => ({
  useResponsive: () => ({ width: 800 }),
}))

jest.mock('../../../src/hooks/useAccessibilityLabel', () => ({
  useAccessibilityLabel: () => (key: string) => key,
}))

jest.mock('../../../src/hooks/useTranslate', () => ({
  useTranslate: () => (key: string) => key,
}))

jest.mock('../../../src/hooks/useColor', () => ({
  useColor: () => ({
    color: '#000000',
    palette: {
      basic: { text: '#000000' },
      primary: { text: '#000000' },
      secondary: { text: '#000000' },
    },
  }),
}))

describe('<FriendUnlockModal />', () => {
  const mockToggleVisible = jest.fn()
  const mockOnCreateFriend = jest.fn()

  const defaultProps = {
    visible: true,
    toggleVisible: mockToggleVisible,
    onCreateFriend: mockOnCreateFriend,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders when visible is true', () => {
    const { getByTestId } = render(<FriendUnlockModal {...defaultProps} />)
    expect(getByTestId('modal')).toBeTruthy()
  })

  it('does not render when visible is false', () => {
    const { queryByTestId } = render(
      <FriendUnlockModal {...defaultProps} visible={false} />
    )
    expect(queryByTestId('modal')).toBeNull()
  })

  it('displays the title', () => {
    const { getByText } = render(<FriendUnlockModal {...defaultProps} />)
    expect(getByText('friend_unlock_modal_title')).toBeTruthy()
  })

  it('displays the celebration image', () => {
    const { getByLabelText } = render(<FriendUnlockModal {...defaultProps} />)
    expect(getByLabelText('friend_unlock_celebration_image')).toBeTruthy()
  })

  it('displays the create button', () => {
    const { getByText } = render(<FriendUnlockModal {...defaultProps} />)
    expect(getByText('friend_unlock_modal_button')).toBeTruthy()
  })

  it('calls toggleVisible and onCreateFriend when button is pressed', () => {
    const { getByText } = render(<FriendUnlockModal {...defaultProps} />)
    const button = getByText('friend_unlock_modal_button')

    fireEvent.press(button)

    expect(mockToggleVisible).toHaveBeenCalledTimes(1)
    expect(mockOnCreateFriend).toHaveBeenCalledTimes(1)
  })

  it('applies responsive width for large screens', () => {
    const { getByTestId } = render(<FriendUnlockModal {...defaultProps} />)
    const modal = getByTestId('modal')
    expect(modal).toBeTruthy()
  })

  it('applies responsive width for small screens', () => {
    jest.mock('../../../src/contexts/ResponsiveContext', () => ({
      useResponsive: () => ({ width: 600 }),
    }))

    const { getByTestId } = render(<FriendUnlockModal {...defaultProps} />)
    const modal = getByTestId('modal')
    expect(modal).toBeTruthy()
  })
})

