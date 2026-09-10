import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text as MockNativeText, TouchableOpacity as MockTouchableOpacity } from 'react-native'
import { SaveAccountButton } from '../../../../../src/screens/ProfileScreen/components/SaveAccountButton'

const mockDispatch = jest.fn()
let mockState: Record<string, unknown>

jest.mock('react-redux', () => ({ useDispatch: () => mockDispatch }))
jest.mock('../../../../../src/redux/useSelector', () => ({
  useSelector: (selector: (state: Record<string, unknown>) => unknown) => selector(mockState),
}))
jest.mock('../../../../../src/components/Button', () => ({
  Button: ({ children, onPress }: { children: React.ReactNode; onPress: () => void }) => (
    <MockTouchableOpacity onPress={onPress}>
      <MockNativeText>{children}</MockNativeText>
    </MockTouchableOpacity>
  ),
}))
jest.mock('../../../../../src/components/Text', () => ({
  Text: ({ children }: { children: React.ReactNode }) => <MockNativeText>{children}</MockNativeText>,
}))

describe('<SaveAccountButton />', () => {
  it('shows progress after save starts', () => {
    mockState = {
      auth: {
        user: { id: '1', name: 'Ana', isGuest: true },
        connectAccountAttempts: 0,
        error: null,
        isCreatingAccount: true,
      },
    }

    render(<SaveAccountButton />)
    fireEvent.press(screen.getByText('connect_account'))

    expect(screen.getByText('sync_account_in_progress')).toBeTruthy()
  })
})
