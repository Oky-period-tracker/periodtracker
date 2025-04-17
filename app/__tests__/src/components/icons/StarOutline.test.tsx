import React from 'react'
import { render } from '@testing-library/react-native'
import { StarOutline } from '../../../../src/components/icons/StarOutline'

describe('<StarOutline />', () => {
  it('renders the component', () => {
    render(<StarOutline />)
    const { getByTestId } = render(<StarOutline />)
    expect(getByTestId('star-o')).toBeTruthy()
  })
})
