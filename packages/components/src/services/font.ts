import { PixelRatio } from 'react-native'

type FontScale = 'NORMAL' | 'LARGE' | 'EXTRA_LARGE'

export const getDeviceFontScale = (): FontScale => {
  const fontScale = PixelRatio.getFontScale()

  if (fontScale > 1.15) {
    return 'EXTRA_LARGE'
  }

  if (fontScale > 1) {
    return 'LARGE'
  }

  return 'NORMAL'
}
