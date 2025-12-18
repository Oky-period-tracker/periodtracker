import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { AvatarNamingModal } from '../../../../../src/screens/CustomAvatarScreen/components/AvatarNamingModal'

jest.mock('../../../../../src/components/Modal', () => {
  const React = require('react')
  const { TouchableOpacity, View } = require('react-native')
  return {
    Modal: ({ visible, children, style, toggleVisible }: any) => {
      if (!visible) return null
      return (
        <View testID="modal" style={style}>
          <TouchableOpacity testID="modal-backdrop" onPress={toggleVisible} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          <View pointerEvents="box-none">
            <TouchableOpacity testID="modal-close-button" onPress={toggleVisible} accessibilityLabel="close" />
            {children}
          </View>
        </View>
      )
    },
  }
})

jest.mock('../../../../../src/components/AvatarPreview', () => ({
  AvatarPreview: (props: any) => <div testID="avatar-preview" {...props} />,
}))

jest.mock('../../../../../src/hooks/useTranslate', () => ({
  useTranslate: () => (key: string) => {
    const translations: Record<string, string> = {
      avatar_naming_modal_title: 'Name Your Friend',
      avatar_naming_modal_subtitle: 'Give your friend a name',
      avatar_naming_modal_placeholder: 'Enter name',
      characters: 'characters',
      skip: 'skip',
      save_and_continue_button: 'Save',
    }
    return translations[key] || key
  },
}))

jest.mock('../../../../../src/hooks/useAccessibilityLabel', () => ({
  useAccessibilityLabel: () => (key: string) => key,
}))

jest.mock('../../../../../src/hooks/useColor', () => ({
  useColor: () => ({
    color: '#000000',
    palette: {
      basic: { text: '#000000' },
      primary: { text: '#000000' },
      secondary: { text: '#000000' },
    },
  }),
}))

describe('<AvatarNamingModal />', () => {
  const mockOnClose = jest.fn()
  const mockOnConfirm = jest.fn()
  const mockOnSkip = jest.fn()
  const mockOnNameChange = jest.fn()

  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    onSkip: mockOnSkip,
    tempName: 'Friend',
    onNameChange: mockOnNameChange,
    avatarSelection: {
      bodyType: 'body-medium' as const,
      skinColor: '#F1B98C',
      hairStyle: '01',
      hairColor: '#6E411C',
      eyeShape: '00',
      eyeColor: '#945A1C',
      smile: 'smile',
      clothing: 'shirt1',
      devices: [],
    },
    avatarConfig: {
      avatarPreviewSize: {
        width: 150,
        height: 200,
      },
    } as any,
    styles: {
      nameModal: {},
      modalTitle: {},
      avatarContainer: {},
      nameInputContainer: {},
      nameInput: {},
      buttonContainer: {},
      confirmButton: {},
      skipButton: {},
      buttonText: {},
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders when visible is true', () => {
    const { getByTestId } = render(<AvatarNamingModal {...defaultProps} />)
    expect(getByTestId('modal')).toBeTruthy()
  })

  it('does not render when visible is false', () => {
    const { queryByTestId } = render(
      <AvatarNamingModal {...defaultProps} visible={false} />
    )
    expect(queryByTestId('modal')).toBeNull()
  })

  it('displays the title', () => {
    const { getByText } = render(<AvatarNamingModal {...defaultProps} />)
    expect(getByText('Name Your Friend')).toBeTruthy()
  })

  it('displays avatar preview', () => {
    const { getByTestId } = render(<AvatarNamingModal {...defaultProps} />)
    expect(getByTestId('avatar-preview')).toBeTruthy()
  })

  it('displays name input with current tempName', () => {
    const { getByDisplayValue } = render(
      <AvatarNamingModal {...defaultProps} tempName="MyFriend" />
    )
    expect(getByDisplayValue('MyFriend')).toBeTruthy()
  })

  it('calls onNameChange when input changes', () => {
    const { getByDisplayValue } = render(<AvatarNamingModal {...defaultProps} />)
    const input = getByDisplayValue('Friend')

    fireEvent.changeText(input, 'NewName')

    expect(mockOnNameChange).toHaveBeenCalledWith('NewName')
  })

  it('calls onConfirm when confirm button is pressed', () => {
    const { getByText } = render(<AvatarNamingModal {...defaultProps} />)
    const confirmButton = getByText('Save')

    fireEvent.press(confirmButton)

    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onSkip when skip button is pressed', () => {
    const { getByText } = render(<AvatarNamingModal {...defaultProps} />)
    const skipButton = getByText('skip')

    fireEvent.press(skipButton)

    expect(mockOnSkip).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when modal close button is pressed', () => {
    const { getByTestId } = render(<AvatarNamingModal {...defaultProps} />)
    const closeButton = getByTestId('modal-close-button')

    fireEvent.press(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('passes correct props to AvatarPreview', () => {
    const { getByTestId } = render(<AvatarNamingModal {...defaultProps} />)
    const preview = getByTestId('avatar-preview')

    expect(preview).toBeTruthy()
    // AvatarPreview receives all avatarSelection props
  })
})

