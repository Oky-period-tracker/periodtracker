import React from 'react'
import { render } from '@testing-library/react-native'
import Cloud from '../../../../src/components/icons/Cloud'

describe('<Cloud />', () => {
  it('renders the component', () => {
    render(<Cloud />)
    const { getByTestId } = render(<Cloud />)
    expect(getByTestId('cloud')).toBeTruthy()
  })
})
