import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { useAvatarMessage } from '../../../../src/contexts/AvatarMessageContext'
import { useTutorial } from '../../../../src/screens/MainScreen/TutorialContext'
import { useColor } from '../../../../src/hooks/useColor'
import { AvatarMessage } from '../../../../src/components/Avatar/AvatarMessage'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

// Mock the hooks
jest.mock('../../../../src/contexts/AvatarMessageContext', () => ({
  useAvatarMessage: jest.fn(),
}))

jest.mock('../../../../src/screens/MainScreen/TutorialContext', () => ({
  useTutorial: jest.fn(),
}))

jest.mock('../../../../src/hooks/useColor', () => ({
  useColor: jest.fn(),
}))

const mockStore = configureMockStore()

describe('<AvatarMessage />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const store = mockStore({})

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<Provider store={store}>{ui}</Provider>)
  }

  it('renders the message when message exists and tutorial is not playing', () => {
    // Mock the hook return values
    ;(useAvatarMessage as jest.Mock).mockReturnValue({ message: 'test' })
    ;(useTutorial as jest.Mock).mockReturnValue({ state: { isPlaying: false } })
    ;(useColor as jest.Mock).mockReturnValue({ backgroundColor: '#ffffff' })

    // Render the component
    renderWithProvider(<AvatarMessage />)

    // Assert that the message is rendered
    expect(screen.getByText('test')).toBeTruthy()
  })

  it('does not render when message is null', () => {
    ;(useAvatarMessage as jest.Mock).mockReturnValue({ message: null })
    ;(useTutorial as jest.Mock).mockReturnValue({ state: { isPlaying: false } })
    ;(useColor as jest.Mock).mockReturnValue({ backgroundColor: '#ffffff' })

    renderWithProvider(<AvatarMessage />)

    // Assert that the message is not rendered
    expect(screen.queryByText('test')).toBeNull()
  })

  it('does not render when tutorial is playing', () => {
    ;(useAvatarMessage as jest.Mock).mockReturnValue({ message: 'test' })
    ;(useTutorial as jest.Mock).mockReturnValue({ state: { isPlaying: true } })
    ;(useColor as jest.Mock).mockReturnValue({ backgroundColor: '#ffffff' })

    renderWithProvider(<AvatarMessage />)

    // Assert that the message is not rendered
    expect(screen.queryByText('test')).toBeNull()
  })
})
