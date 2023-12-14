import { ImageSourcePropType } from 'react-native'
import { AnimatedLottieViewProps } from 'lottie-react-native'
import { assets } from '../assets'

/**
 * Get an asset by path
 * Safe way to access assets, will return null if the asset is not found
 */
export const getAsset = (path: string) => {
  const segments = path.split('.')
  let currentLevel = assets

  for (const segment of segments) {
    currentLevel = currentLevel[segment]
    if (!currentLevel) {
      // tslint:disable-next-line
      console.warn(`Asset not found: ${path}`)
      return null // or a default asset
    }
  }

  const asset = currentLevel as any
  return asset
}
