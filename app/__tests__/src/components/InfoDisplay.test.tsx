import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { InfoDisplay } from '../../../src/components/InfoDisplay'

jest.mock('../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      test: 'test',
    }
    return translations[key] || key
  }),
}))

describe('<InfoDisplay />', () => {
  it('renders the component', () => {
    render(<InfoDisplay content={[{ type: 'CONTENT', content: 'test' }]} />)
    expect(screen.getByText('test')).toBeTruthy()
  })
})
