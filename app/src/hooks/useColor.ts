import { useColorScheme } from 'react-native'

export type ColorSchemeName = 'light' | 'dark'

export type ColorSchemeBase = {
  backgroundColor: string
  color: string
  navColor: string
  borderColor: string
  inputBackgroundColor: string
  videoTabBackgroundColor: string
  modalBackdropColor: string
  backgroundOverlayColor: string
}

export type ColorScheme = Record<ColorSchemeName, ColorSchemeBase>

export const useColor = (): {
  colorSchemeName: ColorSchemeName
} & ColorSchemeBase => {
  const colorSchemeName = useColorScheme() ?? 'light'

  return {
    colorSchemeName,
    ...schemes[colorSchemeName],
  }
}

const schemes: ColorScheme = {
  light: {
    backgroundColor: '#fff',
    color: '#000',
    navColor: '#F1F1F1',
    borderColor: '#f0f0f0',
    inputBackgroundColor: '#f1f1f1',
    videoTabBackgroundColor: '#ffe6e3',
    modalBackdropColor: 'rgba(0,0,0,0.8)',
    backgroundOverlayColor: 'transparent',
  },
  dark: {
    backgroundColor: '#1B1B1F',
    color: '#fff',
    navColor: '#1B1B1F',
    borderColor: '#323237',
    inputBackgroundColor: '#323237',
    videoTabBackgroundColor: '#4a0c2e',
    modalBackdropColor: 'rgba(50,50,50,0.8)',
    backgroundOverlayColor: 'rgba(0,0,0,0.25)',
  },
}
