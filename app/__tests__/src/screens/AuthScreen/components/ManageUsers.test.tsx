import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { ManageUsers } from '../../../../../src/screens/AuthScreen/components/ManageUsers'
import { listUsers } from '../../../../../src/services/userMetadata/registry'

const mockSetAuthMode = jest.fn()
const mockSetLoginName = jest.fn()
const mockUsersWithReminders = new Set<string>()

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
    palette: {
      secondary: { base: '#FF8C00' },
      neutral: { base: '#91D9E2' },
      danger: { base: '#E3629B' },
    },
  }),
}))
jest.mock('../../../../../src/hooks/useTranslate', () => ({
  useTranslate: () => (key: string) => key,
}))
jest.mock('../../../../../src/hooks/useUsersWithPeriodReminders', () => ({
  useUsersWithPeriodReminders: () => mockUsersWithReminders,
}))

describe('<ManageUsers />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUsersWithReminders.clear()
  })

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
    const icons = screen
      .UNSAFE_getAllByType(FontAwesome)
      .filter((icon) => icon.props.name === 'cloud' || icon.props.name === 'cloud-upload')
    expect(icons).toHaveLength(4)
    expect(icons.filter((icon) => icon.props.name === 'cloud').every((icon) => icon.props.color === '#91D9E2')).toBe(
      true,
    )
    expect(
      icons.filter((icon) => icon.props.name === 'cloud-upload').every((icon) => icon.props.color === '#FF8C00'),
    ).toBe(true)
    expect(screen.getByText('cloud_icon_explainer_synced')).toBeTruthy()
    expect(screen.getByText('cloud_icon_explainer_offline')).toBeTruthy()
  })

  it('marks only the accounts with a period reminder waiting', async () => {
    mockUsersWithReminders.add('2')
    ;(listUsers as jest.Mock).mockResolvedValue([
      { id: '1', name: 'Zoe', isPendingSync: false },
      { id: '2', name: 'Ana', isPendingSync: false },
    ])
    render(<ManageUsers />)

    await screen.findByText('Ana')
    expect(screen.getAllByLabelText('period_reminder_waiting')).toHaveLength(1)
  })
})
