import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { AuthCardBody } from '../../../../../src/screens/AuthScreen/components/AuthCardBody'

describe('AuthCardBody', () => {
  it('renders correctly with children', () => {
    const { getByText } = render(
      <AuthCardBody>
        <Text>Test Child</Text>
      </AuthCardBody>,
    )

    expect(getByText('Test Child')).toBeTruthy()
  })

  it('applies custom styles', () => {
    const { getByTestId } = render(
      <AuthCardBody testID="auth-card" style={{ backgroundColor: 'red' }}>
        <Text>Styled Component</Text>
      </AuthCardBody>,
    )

    const authCard = getByTestId('auth-card')
    expect(authCard.props.style).toContainEqual({ backgroundColor: 'red' })
  })
})
