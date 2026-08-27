import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { ManageUsers } from '../../../../../src/screens/AuthScreen/components/ManageUsers'
import { listUsers } from '../../../../../src/services/userMetadata/registry'

const mockSetAuthMode = jest.fn()
const mockSetLoginName = jest.fn()

jest.mock('../../../../../src/screens/AuthScreen/AuthModeContext', () => ({
  useAuthMode: () => ({ setAuthMode: mockSetAuthMode, setLoginName: mockSetLoginName }),
}))
jest.mock('../../../../../src/screens/AuthScreen/components/AuthHeader', () => ({
  AuthHeader: () => null,
}))
jest.mock('../../../../../src/services/userMetadata/registry', () => ({ listUsers: jest.fn() }))
jest.mock('../../../../../src/hooks/useColor', () => ({
  useColor: () => ({
    color: '#111111',
    palette: { secondary: { base: '#FF8C00' }, neutral: { base: '#91D9E2' } },
  }),
}))
jest.mock('../../../../../src/hooks/useTranslate', () => ({
  useTranslate: () => (key: string) => key,
}))

describe('<ManageUsers />', () => {
  beforeEach(() => jest.clearAllMocks())

  it('shows the device empty state', async () => {
    ;(listUsers as jest.Mock).mockResolvedValue([])
    render(<ManageUsers />)
    expect(await screen.findByText('no_users')).toBeTruthy()
  })

  it('prefills login when a user is selected', async () => {
    ;(listUsers as jest.Mock).mockResolvedValue([
      { id: '1', name: 'Zoe', isPendingSync: true },
      { id: '2', name: 'Ana', isPendingSync: false },
    ])
    render(<ManageUsers />)

    await waitFor(() => expect(screen.getByText('Ana')).toBeTruthy())
    fireEvent.press(screen.getByText('Ana'))

    expect(mockSetLoginName).toHaveBeenCalledWith('Ana')
    expect(mockSetAuthMode).toHaveBeenCalledWith('log_in')
  })

  it('explains cloud states and distinguishes offline accounts', async () => {
    ;(listUsers as jest.Mock).mockResolvedValue([
      { id: '1', name: 'Offline', isPendingSync: true },
      { id: '2', name: 'Online', isPendingSync: false },
    ])
    render(<ManageUsers />)

    await screen.findByText('Online')
    expect(screen.getByText('cloud_icon_explainer_title')).toBeTruthy()
    expect(screen.getByText('cloud_icon_explainer')).toBeTruthy()
    const icons = screen
      .UNSAFE_getAllByType(FontAwesome)
      .filter((icon) => icon.props.name === 'cloud' || icon.props.name === 'cloud-upload')
    expect(icons).toHaveLength(2)
    expect(icons.find((icon) => icon.props.name === 'cloud')?.props.color).toBe('#91D9E2')
    expect(icons.find((icon) => icon.props.name === 'cloud-upload')?.props.color).toBe('#FF8C00')
  })
})
