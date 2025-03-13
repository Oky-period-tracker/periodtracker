import React from 'react'
import { render } from '@testing-library/react-native'
import { CenterCard } from '../../../../../src/screens/MainScreen/components/CenterCard'

jest.mock('../../../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      test: 'test',
    }
    return translations[key] || key
  }),
}))

jest.mock('../../../../../src/contexts/PredictionProvider', () => ({
  useTodayPrediction: jest.fn(() => ({
    onPeriod: false, // Mocked value for onPeriod
  })),
}))

jest.mock('../../../../../src/hooks/useScreenDimensions', () => ({
  useScreenDimensions: jest.fn(() => ({
    width: 1000,
  })),
}))

jest.mock('../../../../../src/hooks/useDayStatus', () => ({
  useDayStatus: jest.fn(() => ({
    status: 'primary',
  })),
}))

jest.mock('../../../../../src/contexts/ResponsiveContext', () => ({
  useResponsive: jest.fn(() => {
    return {
      width: 0,
      height: 0,
      size: 'm',
      UIConfig: {
        carousel: {
          cardWidth: 220,
          cardMargin: 32,
        },
        centerCard: {
          width: 120,
          numberFontSize: 36,
          textFontSize: 14,
        },
        tutorial: {
          paddingTop: 120,
          paddingBottom: 80,
          emojiCard: {
            titleFontSize: 20,
            titleMargin: 24,
            questionFontSize: 16,
            textFontSize: 14,
            questionMargin: 12,
            emojiMargin: 12,
            badgeSize: 'small',
          },
        },
        progressSection: {
          marginVertical: 1,
          barHeight: 8,
          iconSize: 12,
        },
        misc: {
          touchableRowPadding: 24,
          touchableRowHeight: 100,
        },
      },
    }
  }),
}))

describe('<CenterCard />', () => {
  it('renders the component', () => {
    const { getByTestId } = render(
      <CenterCard testID="auth-card" style={{ backgroundColor: 'red' }}></CenterCard>,
    )

    const authCard = getByTestId('auth-card')
    expect(authCard.props.style).toContainEqual({ backgroundColor: 'red' })
  })
})
