import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { FullScreen, SafeScreen, Screen } from '../../../src/components/Screen'
import { Text } from 'react-native'

describe('<Screen />', () => {
  it('renders the component', () => {
    render(
      <Screen>
        <Text>test</Text>
      </Screen>,
    )
    expect(screen.getByText('test')).toBeTruthy()
  })

  describe('<SafeScreen />', () => {
    it('renders the component', () => {
      render(
        <SafeScreen>
          <Text>test</Text>
        </SafeScreen>,
      )
      expect(screen.getByText('test')).toBeTruthy()
    })
  })

  describe('<FullScreen />', () => {
    it('renders the component', () => {
      render(
        <FullScreen>
          <Text>test</Text>
        </FullScreen>,
      )
      expect(screen.getByText('test')).toBeTruthy()
    })
  })
})
