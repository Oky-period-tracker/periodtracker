import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { TextInput } from 'react-native'
import { LogIn } from '../../../../../src/screens/AuthScreen/components/LogIn'
import { loginOnlineToAccount } from '../../../../../src/services/auth/accountFlows'

jest.mock('../../../../../src/redux/useSelector', () => ({ useSelector: () => null }))
jest.mock('../../../../../src/hooks/useTranslate', () => ({
  useTranslate: () => (key: string) => key,
}))
jest.mock('../../../../../src/contexts/AuthContext', () => ({
  useAuth: () => ({ setIsLoggedIn: jest.fn() }),
}))
jest.mock('../../../../../src/screens/AuthScreen/AuthModeContext', () => ({
  useAuthMode: () => ({ loginName: 'Ana' }),
}))
jest.mock('../../../../../src/screens/AuthScreen/components/AuthHeader', () => ({
  AuthHeader: () => null,
}))
jest.mock('../../../../../src/services/pendingSync', () => ({
  loadPendingSyncData: jest.fn().mockResolvedValue(null),
}))
jest.mock('../../../../../src/services/auth/credentialVault', () => ({
  verifyPassword: jest.fn(),
}))
jest.mock('../../../../../src/services/auth/accountFlows', () => ({
  loginToAccount: jest.fn().mockResolvedValue(false),
  loginOnlineToAccount: jest.fn(),
}))

describe('<LogIn />', () => {
  beforeEach(() => jest.clearAllMocks())

  it('prefills a selected device username and shows progress while logging in', async () => {
    ;(loginOnlineToAccount as jest.Mock).mockReturnValue(new Promise(() => undefined))
    render(<LogIn />)

    expect(screen.getByDisplayValue('Ana')).toBeTruthy()
    fireEvent.changeText(screen.UNSAFE_getAllByType(TextInput)[1], '1234')
    fireEvent.press(screen.getByText('confirm'))

    expect(await screen.findByText('logging_in')).toBeTruthy()
  })

  it('uses the neutral credential error', async () => {
    ;(loginOnlineToAccount as jest.Mock).mockRejectedValue(new Error('unknown user'))
    render(<LogIn />)
    fireEvent.changeText(screen.UNSAFE_getAllByType(TextInput)[1], '1234')
    fireEvent.press(screen.getByText('confirm'))

    await waitFor(() => expect(screen.getByText('incorrect_username_or_passcode')).toBeTruthy())
  })
})
