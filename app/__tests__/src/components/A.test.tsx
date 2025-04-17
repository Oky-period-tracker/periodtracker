import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { A } from '../../../src/components/A'

jest.mock('../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      test: 'test',
    }
    return translations[key] || key
  }),
}))

jest.mock('expo-linking', () => ({
  createURL: jest.fn(() => 'mocked-url'),
  openURL: jest.fn(),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  getInitialURL: jest.fn(() => Promise.resolve('mocked-url')),
}))

describe('<A />', () => {
  it('renders the component', () => {
    render(<A>test</A>)
    expect(screen.getByText('test')).toBeTruthy()
  })
})
