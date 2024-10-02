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
  errorColor: string
  placeholderTextColor: string
  linkColor: string
  starColor: string
}

export type ColorScheme = Record<ColorSchemeName, ColorSchemeBase>

export type PaletteStatus =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'neutral'
  | 'basic'
  | 'danger'
  | 'danger_light'

export type Palette = Record<
  PaletteStatus,
  {
    base: string
    highlight: string
    shadow: string
    dark: string
    text: string
  }
>

export const useColor = (): {
  palette: Palette
} & ColorSchemeBase => {
  const colorSchemeName = useColorScheme() ?? 'light'

  return {
    palette: palettes[colorSchemeName],
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
    errorColor: '#ff0000',
    placeholderTextColor: '#28b9cb',
    linkColor: '#28b9cb',
    starColor: '#F6AC3F',
  },
  dark: {
    backgroundColor: '#1B1B1F',
    color: '#fff',
    navColor: '#1B1B1F',
    borderColor: '#323237',
    inputBackgroundColor: '#323237',
    videoTabBackgroundColor: '#4a0c2e',
    modalBackdropColor: 'rgba(50,50,50,0.8)',
    backgroundOverlayColor: 'rgba(0,0,0,0.5)',
    errorColor: '#ff0000',
    placeholderTextColor: '#28b9cb',
    linkColor: '#28b9cb',
    starColor: '#F6AC3F',
  },
}

const palettes: Record<ColorSchemeName, Palette> = {
  light: {
    primary: {
      base: '#97C800',
      highlight: '#fff',
      shadow: '#00A65A',
      dark: '#028045',
      text: '#97C800',
    },
    secondary: {
      base: '#FF8C00',
      highlight: '#FFC26A',
      shadow: '#BD6600',
      dark: '#944f00',
      text: '#FF8C00',
    },
    tertiary: {
      base: '#3DA4DD',
      highlight: '#fff',
      shadow: '#1169BF',
      dark: '#0344A5',
      text: '#3DA4DD',
    },
    neutral: {
      base: '#91d9e2',
      highlight: '#fff',
      shadow: '#53b8c8',
      dark: '#2f9cb1',
      text: '#91d9e2',
    },
    basic: {
      base: '#D1D0D2',
      highlight: '#fff',
      shadow: '#B7B6B6',
      dark: '#82807f',
      text: '#000',
    },
    danger: {
      base: '#E3629B',
      highlight: '#F9C7C1',
      shadow: '#971B63',
      dark: '#6b1244',
      text: '#E3629B',
    },
    danger_light: {
      base: '#F9C7C1',
      highlight: '#FFF',
      shadow: '#E3629B',
      dark: '#971B63',
      text: '#F9C7C1',
    },
  },
  dark: {
    primary: {
      base: '#00A65A',
      highlight: '#97C800',
      shadow: '#028045',
      dark: '#015930',
      text: '#97C800',
    },
    secondary: {
      base: '#BD6600',
      highlight: '#FF8C00',
      shadow: '#592f00',
      dark: '#402200',
      text: '#FF8C00',
    },
    tertiary: {
      base: '#3DA4DD',
      highlight: '#fff',
      shadow: '#1169BF',
      dark: '#0344A5',
      text: '#3DA4DD',
    },
    neutral: {
      base: '#53b8c8',
      highlight: '#91d9e2',
      shadow: '#2f9cb1',
      dark: '#1b5863',
      text: '#91d9e2',
    },
    basic: {
      base: '#82807f',
      highlight: '#B7B6B6',
      shadow: '#454342',
      dark: '#292827',
      text: '#000',
    },
    danger: {
      base: '#971B63',
      highlight: '#E3629B',
      shadow: '#6b1244',
      dark: '#470b2c',
      text: '#E3629B',
    },
    danger_light: {
      base: '#E3629B',
      highlight: '#F9C7C1',
      shadow: '#971B63',
      dark: '#6b1244',
      text: '#E3629B',
    },
  },
}
