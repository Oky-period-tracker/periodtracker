import { ImageSourcePropType } from 'react-native'
import { assets, avatarAssets } from '../resources/assets'
import _ from 'lodash'

/**
 * Get an asset by path
 * Safe way to access assets, will return null if the asset is not found
 */
export const getAsset = (path: string) => {
  const segments = path.split('.')
  let currentLevel: object = assets

  for (const segment of segments) {
    // @ts-expect-error Can be object or asset because of assets structure
    currentLevel = currentLevel[segment] as object
    if (!currentLevel) {
      // tslint:disable-next-line
      console.warn(`Asset not found: ${path}`)
      return undefined // or a default asset
    }
  }

  const asset = currentLevel as ImageSourcePropType
  return asset
}

// Type for SVG component (returned by react-native-svg-transformer)
type SvgComponent = React.ComponentType<{ width?: number | string; height?: number | string; color?: string; fill?: string }>

/**
 * Helper to extract component as SVG component
 * @param component Component
 * @returns component as SVG component
 */
const getSvgComponent = (component: any): SvgComponent | null => {
  if (!component) return null
  
  // Components are now imported directly, so just return them
  if (typeof component !== 'function') {
    return null
  }
  
  return component as SvgComponent
}

/**
 * Get an avatar asset based on body size
 * @param category Category of asset
 * @param item Name of asset
 * @param bodySize Body size
 * @returns Asset
 */
export const getAvatarAsset = (
  category: 'body' | 'hair' | 'eyes' | 'clothing' | 'devices' | 'smile',
  item: string | null,
  bodySize: 'small' | 'medium' | 'large' = 'medium'
): SvgComponent | null => {
  if (!item) return null

  let svgModule: any = null

  switch (category) {
    case 'body': {
      // Body previews are now handled by JSX components (BodyComponents.tsx)
      // Return null - the AvatarPreview component handles body rendering directly
      return null
    }
    case 'hair':
    case 'eyes':
    case 'smile': {
      svgModule = _.get(avatarAssets, `${category}.${item}`) || null
      break;
    }
    case 'clothing': {
      svgModule = _.get(avatarAssets, `${category}.${item}-${bodySize}`) || null
      break;
    }
    case 'devices': {
      // Some devices have size variants
      svgModule = _.get(avatarAssets, `${category}.${item}-${bodySize}`) || null
      if (!svgModule) {
        // If no size variant found, try to get it without size variant
        svgModule = _.get(avatarAssets, `${category}.${item}`) || null
      }
      break;
    }
  }

  return getSvgComponent(svgModule)
}