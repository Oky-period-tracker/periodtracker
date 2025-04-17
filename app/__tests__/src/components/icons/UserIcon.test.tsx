import React from 'react'
import { render } from '@testing-library/react-native'
import { UserIcon } from '../../../../src/components/icons/UserIcon'

describe('<UserIcon />', () => {
  it('renders the component', () => {
    render(<UserIcon />)
    const { getByTestId } = render(<UserIcon />)
    expect(getByTestId('user')).toBeTruthy()
  })
})
