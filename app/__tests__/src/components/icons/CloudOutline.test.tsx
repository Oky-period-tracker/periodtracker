import React from 'react'
import { render } from '@testing-library/react-native'
import { CircleOutline } from '../../../../src/components/icons/CircleOutline'

describe('<CircleOutline />', () => {
  it('renders the component', () => {
    render(<CircleOutline />)
    const { getByTestId } = render(<CircleOutline />)
    expect(getByTestId('circle-o')).toBeTruthy()
  })
})
