// Friend avatar assets mapping
// This file contains all friend avatar customization assets
// PNG files are for the selection UI (customization-page)
// SVG files are for the preview (avatar-parts) - imported as React components via react-native-svg-transformer

import { ImageSourcePropType } from 'react-native'
import React from 'react'

// Standard avatar SVGs for selection screen
const standardAvatarSvgs: Record<string, any> = {
  ari: require('./images/avatars/standard-avatars/ari.svg'),
  nur: require('./images/avatars/standard-avatars/nur.svg'),
  julia: require('./images/avatars/standard-avatars/anu.svg'), // julia maps to anu
  oky: require('./images/avatars/standard-avatars/oky.svg'),
  pihu: require('./images/avatars/standard-avatars/pihu.svg'),
  shiko: require('./images/avatars/standard-avatars/shiko.svg'),
  kuku: require('./images/avatars/standard-avatars/kuku.svg'),
  friend: require('./images/avatars/standard-avatars/blank.svg'),
  'friend-locked': require('./images/avatars/standard-avatars/friend-locked.svg'),
  'friend-unlocked-not-customized': require('./images/avatars/standard-avatars/friend-unlocked-not-customized.svg'),
  'friend-unlocked-and-customized': require('./images/avatars/standard-avatars/friend-unlocked-and-customized.svg'),
}

// Theme SVGs for selection screen
const themeSvgs: Record<string, any> = {
  hills: require('./images/static/themes/hills.svg'),
  village: require('./images/static/themes/village.svg'),
  mosaic: require('./images/static/themes/mosaic.svg'),
  desert: require('./images/static/themes/dessert.svg'), // Note: file is named dessert.svg but theme is desert
}

// Get standard avatar SVG component
export const getStandardAvatarSvg = (avatarName: string): React.ComponentType<any> | null => {
  // Always use normal SVGs, borders are applied via CSS
  const svg = standardAvatarSvgs[avatarName]
  if (!svg) return null
  
  // Handle both direct component and { default: Component } formats
  if (typeof svg === 'function') {
    return svg
  }
  if (svg && typeof svg === 'object' && svg.default) {
    return svg.default
  }
  return null
}

// Get theme SVG component
export const getThemeSvg = (themeName: string): React.ComponentType<any> | null => {
  // Always use normal SVGs, borders are applied via CSS
  const svg = themeSvgs[themeName]
  if (!svg) return null
  
  // Handle both direct component and { default: Component } formats
  if (typeof svg === 'function') {
    return svg
  }
  if (svg && typeof svg === 'object' && svg.default) {
    return svg.default
  }
  return null
}

// Mapping from customization-page PNG names to avatar-parts SVG names
// Names now match between customization-page and avatar-parts, so mapping is 1:1
// Some clothing items have size variants (small, medium, large)
const clothingNameMapping: Record<string, string> = {
  blazer1: 'blazer1',
  blazer2: 'blazer2',
  cape: 'cape',
  dress1: 'dress1',
  dress2: 'dress2',
  dress3: 'dress3',
  hijab: 'hijab',
  jumper: 'jumper',
  longdressbelt: 'longdressbelt',
  longuniform: 'longuniform',
  shirtandpants: 'shirtandpants',
  shortandshirt1: 'shortandshirt1',
  shortandshirt2: 'shortandshirt2',
  shortandshirt3: 'shortandshirt3',
  skirtandshirt: 'skirtandshirt',
  traditional1: 'traditional1',
  traditional2: 'traditional2',
  traditional3: 'traditional3',
  traditional4: 'traditional4',
  traditional5: 'traditional5',
}

// Selection UI assets
// PNG files for all selection UI assets (bodies, hair, eyes, categories, clothing, devices)
const selectionAssets = {
  bodies: {
    'body-small': require('./images/avatars/friend/customization-page/bodies/body-small.png'),
    'body-medium': require('./images/avatars/friend/customization-page/bodies/body-medium.png'),
    'body-large': require('./images/avatars/friend/customization-page/bodies/body-large.png'),
  } as Record<string, any>,
  hair: {
    '00': require('./images/avatars/friend/customization-page/hair/00.png'), // Bald option
    '01': require('./images/avatars/friend/customization-page/hair/01.png'),
    '02': require('./images/avatars/friend/customization-page/hair/02.png'),
    '03': require('./images/avatars/friend/customization-page/hair/03.png'),
    '04': require('./images/avatars/friend/customization-page/hair/04.png'),
    '05': require('./images/avatars/friend/customization-page/hair/05.png'),
    '06': require('./images/avatars/friend/customization-page/hair/06.png'),
    '07': require('./images/avatars/friend/customization-page/hair/07.png'),
    '08': require('./images/avatars/friend/customization-page/hair/08.png'),
    '09': require('./images/avatars/friend/customization-page/hair/09.png'),
    '10': require('./images/avatars/friend/customization-page/hair/10.png'),
    '11': require('./images/avatars/friend/customization-page/hair/11.png'),
    '12': require('./images/avatars/friend/customization-page/hair/12.png'),
    '13': require('./images/avatars/friend/customization-page/hair/13.png'),
    '14': require('./images/avatars/friend/customization-page/hair/14.png'),
    '15': require('./images/avatars/friend/customization-page/hair/15.png'),
    '16': require('./images/avatars/friend/customization-page/hair/16.png'),
    '17': require('./images/avatars/friend/customization-page/hair/17.png'),
    '18': require('./images/avatars/friend/customization-page/hair/18.png'),
  },
  eyes: {
    '00': require('./images/avatars/friend/customization-page/eyes/00.png'),
    '01': require('./images/avatars/friend/customization-page/eyes/01.png'),
    '02': require('./images/avatars/friend/customization-page/eyes/02.png'),
    '03': require('./images/avatars/friend/customization-page/eyes/03.png'),
    '04': require('./images/avatars/friend/customization-page/eyes/04.png'),
    '05': require('./images/avatars/friend/customization-page/eyes/05.png'),
    '06': require('./images/avatars/friend/customization-page/eyes/06.png'),
  },
  clothing: {
    blazer1: require('./images/avatars/friend/customization-page/clothing/blazer1.png'),
    blazer2: require('./images/avatars/friend/customization-page/clothing/blazer2.png'),
    cape: require('./images/avatars/friend/customization-page/clothing/cape.png'),
    dress1: require('./images/avatars/friend/customization-page/clothing/dress1.png'),
    dress2: require('./images/avatars/friend/customization-page/clothing/dress2.png'),
    dress3: require('./images/avatars/friend/customization-page/clothing/dress3.png'),
    hijab: require('./images/avatars/friend/customization-page/clothing/hijab.png'),
    jumper: require('./images/avatars/friend/customization-page/clothing/jumper.png'),
    longdressbelt: require('./images/avatars/friend/customization-page/clothing/longdressbelt.png'),
    longuniform: require('./images/avatars/friend/customization-page/clothing/longuniform.png'),
    shirtandpants: require('./images/avatars/friend/customization-page/clothing/shirtandpants.png'),
    shortandshirt1: require('./images/avatars/friend/customization-page/clothing/shortandshirt1.png'),
    shortandshirt2: require('./images/avatars/friend/customization-page/clothing/shortandshirt2.png'),
    shortandshirt3: require('./images/avatars/friend/customization-page/clothing/shortandshirt3.png'),
    skirtandshirt: require('./images/avatars/friend/customization-page/clothing/skirtandshirt.png'),
    traditional1: require('./images/avatars/friend/customization-page/clothing/traditional1.png'),
    traditional2: require('./images/avatars/friend/customization-page/clothing/traditional2.png'),
    traditional3: require('./images/avatars/friend/customization-page/clothing/traditional3.png'),
    traditional4: require('./images/avatars/friend/customization-page/clothing/traditional4.png'),
    traditional5: require('./images/avatars/friend/customization-page/clothing/traditional5.png'),
  },
  devices: {
    bandana: require('./images/avatars/friend/customization-page/devices/bandana.png'),
    beanie: require('./images/avatars/friend/customization-page/devices/beanie.png'),
    beanie2: require('./images/avatars/friend/customization-page/devices/beanie2.png'),
    buckethat: require('./images/avatars/friend/customization-page/devices/buckethat.png'),
    cane: require('./images/avatars/friend/customization-page/devices/cane.png'),
    cap: require('./images/avatars/friend/customization-page/devices/cap.png'),
    crown: require('./images/avatars/friend/customization-page/devices/crown.png'),
    darkglasses: require('./images/avatars/friend/customization-page/devices/darkglasses.png'),
    earings: require('./images/avatars/friend/customization-page/devices/earings.png'),
    flowers: require('./images/avatars/friend/customization-page/devices/flowers.png'),
    glasses: require('./images/avatars/friend/customization-page/devices/glasses.png'),
    hat: require('./images/avatars/friend/customization-page/devices/hat.png'),
    head: require('./images/avatars/friend/customization-page/devices/head.png'),
    headband: require('./images/avatars/friend/customization-page/devices/headband.png'),
    headphones: require('./images/avatars/friend/customization-page/devices/headphones.png'),
    necklace1: require('./images/avatars/friend/customization-page/devices/necklace1.png'),
    necklace2: require('./images/avatars/friend/customization-page/devices/necklace2.png'),
    necklace3: require('./images/avatars/friend/customization-page/devices/necklace3.png'),
    prostetic1: require('./images/avatars/friend/customization-page/devices/prostetic1.png'),
    prostetic2: require('./images/avatars/friend/customization-page/devices/prostetic2.png'),
    purse: require('./images/avatars/friend/customization-page/devices/purse.png'),
    readingglasses2: require('./images/avatars/friend/customization-page/devices/readingglasses2.png'),
    sunglass1: require('./images/avatars/friend/customization-page/devices/sunglass1.png'),
    sunglass2: require('./images/avatars/friend/customization-page/devices/sunglass2.png'),
    sunhat: require('./images/avatars/friend/customization-page/devices/sunhat.png'),
  },
  categories: {
    body: require('./images/avatars/friend/customization-page/categories/body.png'),
    hair: require('./images/avatars/friend/customization-page/categories/hair.png'),
    eyes: require('./images/avatars/friend/customization-page/categories/eyes.png'),
    clothing: require('./images/avatars/friend/customization-page/categories/clothing.png'),
    devices: require('./images/avatars/friend/customization-page/categories/devices.png'),
  },
}

// Preview assets (SVG files from avatar-parts) - imported as React components
// With react-native-svg-transformer, require() returns a React component
// Note: Body previews are now JSX components (BodyComponents.tsx), not SVG files
const previewAssets = {
  bodies: {
    // Body previews are handled by JSX components in AvatarPreview/BodyComponents.tsx
  },
  hair: {
    '01': require('./images/avatars/friend/avatar-parts/hair/01.svg'),
    '02': require('./images/avatars/friend/avatar-parts/hair/02.svg'),
    '03': require('./images/avatars/friend/avatar-parts/hair/03.svg'),
    '04': require('./images/avatars/friend/avatar-parts/hair/04.svg'),
    '05': require('./images/avatars/friend/avatar-parts/hair/05.svg'),
    '06': require('./images/avatars/friend/avatar-parts/hair/06.svg'),
    '07': require('./images/avatars/friend/avatar-parts/hair/07.svg'),
    '08': require('./images/avatars/friend/avatar-parts/hair/08.svg'),
    '09': require('./images/avatars/friend/avatar-parts/hair/09.svg'),
    '10': require('./images/avatars/friend/avatar-parts/hair/10.svg'),
    '11': require('./images/avatars/friend/avatar-parts/hair/11.svg'),
    '12': require('./images/avatars/friend/avatar-parts/hair/12.svg'),
    '13': require('./images/avatars/friend/avatar-parts/hair/13.svg'),
    '14': require('./images/avatars/friend/avatar-parts/hair/14.svg'),
    '15': require('./images/avatars/friend/avatar-parts/hair/15.svg'),
    '16': require('./images/avatars/friend/avatar-parts/hair/16.svg'),
    '17': require('./images/avatars/friend/avatar-parts/hair/17.svg'),
    '18': require('./images/avatars/friend/avatar-parts/hair/18.svg'),
  },
  eyes: {
    '00': require('./images/avatars/friend/avatar-parts/eyes/00.svg'),
    '01': require('./images/avatars/friend/avatar-parts/eyes/01.svg'),
    '02': require('./images/avatars/friend/avatar-parts/eyes/02.svg'),
    '03': require('./images/avatars/friend/avatar-parts/eyes/03.svg'),
    '04': require('./images/avatars/friend/avatar-parts/eyes/04.svg'),
    '05': require('./images/avatars/friend/avatar-parts/eyes/05.svg'),
    '06': require('./images/avatars/friend/avatar-parts/eyes/06.svg'),
  },
  clothing: {
    // Base names with size suffix - will be resolved with size
    'blazer1-small': require('./images/avatars/friend/avatar-parts/clothing/blazer1-small.svg'),
    'blazer1-medium': require('./images/avatars/friend/avatar-parts/clothing/blazer1-medium.svg'),
    'blazer1-large': require('./images/avatars/friend/avatar-parts/clothing/blazer1-large.svg'),
    'blazer2-small': require('./images/avatars/friend/avatar-parts/clothing/blazer2-small.svg'),
    'blazer2-medium': require('./images/avatars/friend/avatar-parts/clothing/blazer2-medium.svg'),
    'blazer2-large': require('./images/avatars/friend/avatar-parts/clothing/blazer2-large.svg'),
    'cape-small': require('./images/avatars/friend/avatar-parts/clothing/cape-small.svg'),
    'cape-medium': require('./images/avatars/friend/avatar-parts/clothing/cape-medium.svg'),
    'cape-large': require('./images/avatars/friend/avatar-parts/clothing/cape-large.svg'),
    'dress1-small': require('./images/avatars/friend/avatar-parts/clothing/dress1-small.svg'),
    'dress1-medium': require('./images/avatars/friend/avatar-parts/clothing/dress1-medium.svg'),
    'dress1-large': require('./images/avatars/friend/avatar-parts/clothing/dress1-large.svg'),
    'dress2-small': require('./images/avatars/friend/avatar-parts/clothing/dress2-small.svg'),
    'dress2-medium': require('./images/avatars/friend/avatar-parts/clothing/dress2-medium.svg'),
    'dress2-large': require('./images/avatars/friend/avatar-parts/clothing/dress2-large.svg'),
    'dress3-small': require('./images/avatars/friend/avatar-parts/clothing/dress3-small.svg'),
    'dress3-medium': require('./images/avatars/friend/avatar-parts/clothing/dress3-medium.svg'),
    'dress3-large': require('./images/avatars/friend/avatar-parts/clothing/dress3-large.svg'),
    'hijab-small': require('./images/avatars/friend/avatar-parts/clothing/hijab-small.svg'),
    'hijab-medium': require('./images/avatars/friend/avatar-parts/clothing/hijab-medium.svg'),
    'hijab-large': require('./images/avatars/friend/avatar-parts/clothing/hijab-large.svg'),
    'jumper-small': require('./images/avatars/friend/avatar-parts/clothing/jumper-small.svg'),
    'jumper-medium': require('./images/avatars/friend/avatar-parts/clothing/jumper-medium.svg'),
    'jumper-large': require('./images/avatars/friend/avatar-parts/clothing/jumper-large.svg'),
    'longdressbelt-small': require('./images/avatars/friend/avatar-parts/clothing/longdressbelt-small.svg'),
    'longdressbelt-medium': require('./images/avatars/friend/avatar-parts/clothing/longdressbelt-medium.svg'),
    'longdressbelt-large': require('./images/avatars/friend/avatar-parts/clothing/longdressbelt-large.svg'),
    'longuniform-small': require('./images/avatars/friend/avatar-parts/clothing/longuniform-small.svg'),
    'longuniform-medium': require('./images/avatars/friend/avatar-parts/clothing/longuniform-medium.svg'),
    'longuniform-large': require('./images/avatars/friend/avatar-parts/clothing/longuniform-large.svg'),
    'shirtandpants-small': require('./images/avatars/friend/avatar-parts/clothing/shirtandpants-small.svg'),
    'shirtandpants-medium': require('./images/avatars/friend/avatar-parts/clothing/shirtandpants-medium.svg'),
    'shirtandpants-large': require('./images/avatars/friend/avatar-parts/clothing/shirtandpants-large.svg'),
    'shortandshirt1-small': require('./images/avatars/friend/avatar-parts/clothing/shortandshirt1-small.svg'),
    'shortandshirt1-medium': require('./images/avatars/friend/avatar-parts/clothing/shortandshirt1-medium.svg'),
    'shortandshirt1-large': require('./images/avatars/friend/avatar-parts/clothing/shortandshirt1-large.svg'),
    'shortandshirt2-small': require('./images/avatars/friend/avatar-parts/clothing/shortandshirt2-small.svg'),
    'shortandshirt2-medium': require('./images/avatars/friend/avatar-parts/clothing/shortandshirt2-medium.svg'),
    'shortandshirt2-large': require('./images/avatars/friend/avatar-parts/clothing/shortandshirt2-large.svg'),
    'shortandshirt3-small': require('./images/avatars/friend/avatar-parts/clothing/shortandshirt3-small.svg'),
    'shortandshirt3-medium': require('./images/avatars/friend/avatar-parts/clothing/shortandshirt3-medium.svg'),
    'shortandshirt3-large': require('./images/avatars/friend/avatar-parts/clothing/shortandshirt3-large.svg'),
    'skirtandshirt-small': require('./images/avatars/friend/avatar-parts/clothing/skirtandshirt-small.svg'),
    'skirtandshirt-medium': require('./images/avatars/friend/avatar-parts/clothing/skirtandshirt-medium.svg'),
    'skirtandshirt-large': require('./images/avatars/friend/avatar-parts/clothing/skirtandshirt-large.svg'),
    'traditional1-small': require('./images/avatars/friend/avatar-parts/clothing/traditional1-small.svg'),
    'traditional1-medium': require('./images/avatars/friend/avatar-parts/clothing/traditional1-medium.svg'),
    'traditional1-large': require('./images/avatars/friend/avatar-parts/clothing/traditional1-large.svg'),
    'traditional2-small': require('./images/avatars/friend/avatar-parts/clothing/traditional2-small.svg'),
    'traditional2-medium': require('./images/avatars/friend/avatar-parts/clothing/traditional2-medium.svg'),
    'traditional2-large': require('./images/avatars/friend/avatar-parts/clothing/traditional2-large.svg'),
    'traditional3-small': require('./images/avatars/friend/avatar-parts/clothing/traditional3-small.svg'),
    'traditional3-medium': require('./images/avatars/friend/avatar-parts/clothing/traditional3-medium.svg'),
    'traditional3-large': require('./images/avatars/friend/avatar-parts/clothing/traditional3-large.svg'),
    'traditional4-small': require('./images/avatars/friend/avatar-parts/clothing/traditional4-small.svg'),
    'traditional4-medium': require('./images/avatars/friend/avatar-parts/clothing/traditional4-medium.svg'),
    'traditional4-large': require('./images/avatars/friend/avatar-parts/clothing/traditional4-large.svg'),
    'traditional5-small': require('./images/avatars/friend/avatar-parts/clothing/traditional5-small.svg'),
    'traditional5-medium': require('./images/avatars/friend/avatar-parts/clothing/traditional5-medium.svg'),
    'traditional5-large': require('./images/avatars/friend/avatar-parts/clothing/traditional5-large.svg'),
  },
  devices: {
    bandana: require('./images/avatars/friend/avatar-parts/devices/bandana.svg'),
    beanie: require('./images/avatars/friend/avatar-parts/devices/beanie.svg'),
    beanie2: require('./images/avatars/friend/avatar-parts/devices/beanie2.svg'),
    buckethat: require('./images/avatars/friend/avatar-parts/devices/buckethat.svg'),
    cane: require('./images/avatars/friend/avatar-parts/devices/cane.svg'),
    cap: require('./images/avatars/friend/avatar-parts/devices/cap.svg'),
    crown: require('./images/avatars/friend/avatar-parts/devices/crown.svg'),
    darkglasses: require('./images/avatars/friend/avatar-parts/devices/darkglasses.svg'),
    earings: require('./images/avatars/friend/avatar-parts/devices/earings.svg'),
    flowers: require('./images/avatars/friend/avatar-parts/devices/flowers.svg'),
    glasses: require('./images/avatars/friend/avatar-parts/devices/glasses.svg'),
    hat: require('./images/avatars/friend/avatar-parts/devices/hat.svg'),
    head: require('./images/avatars/friend/avatar-parts/devices/head.svg'),
    headband: require('./images/avatars/friend/avatar-parts/devices/headband.svg'),
    headphones: require('./images/avatars/friend/avatar-parts/devices/headphones.svg'),
    necklace1: require('./images/avatars/friend/avatar-parts/devices/necklace1.svg'),
    necklace2: require('./images/avatars/friend/avatar-parts/devices/necklace2.svg'),
    necklace3: require('./images/avatars/friend/avatar-parts/devices/necklace3.svg'),
    prostetic1: require('./images/avatars/friend/avatar-parts/devices/prostetic1.svg'),
    'prostetic2-small': require('./images/avatars/friend/avatar-parts/devices/prosteticleg2-small.svg'),
    'prostetic2-medium': require('./images/avatars/friend/avatar-parts/devices/prosteticleg2-medium.svg'),
    'prostetic2-large': require('./images/avatars/friend/avatar-parts/devices/prosteticleg2-large.svg'),
    purse: require('./images/avatars/friend/avatar-parts/devices/purse.svg'),
    readingglass: require('./images/avatars/friend/avatar-parts/devices/readingglass.svg'),
    readingglasses2: require('./images/avatars/friend/avatar-parts/devices/readingglass.svg'),
    sunglass1: require('./images/avatars/friend/avatar-parts/devices/sunglass1.svg'),
    sunglass2: require('./images/avatars/friend/avatar-parts/devices/sunglass2.svg'),
    sunhat: require('./images/avatars/friend/avatar-parts/devices/sunhat.svg'),
  },
  smile: {
    smile: require('./images/avatars/friend/avatar-parts/smile/smile.svg'),
  },
}

export type BodySize = 'small' | 'medium' | 'large'

// Type for SVG component (returned by react-native-svg-transformer)
type SvgComponent = React.ComponentType<{ width?: number | string; height?: number | string; color?: string; fill?: string }>

// Get selection asset (SVG for bodies/hair/eyes, PNG for categories/clothing/devices)
export const getSelectionAsset = (
  category: 'body' | 'hair' | 'eyes' | 'clothing' | 'devices' | 'categories',
  item: string | null
): ImageSourcePropType | SvgComponent | null => {
  if (!item) return null
  
  // Map 'body' category to 'bodies' key
  const categoryKey = category === 'body' ? 'bodies' : category
  
  const categoryAssets = selectionAssets[categoryKey as keyof typeof selectionAssets] as Record<string, any> | undefined
  const asset = categoryAssets ? categoryAssets[item] ?? null : null
  
  if (!asset) {
    return null
  }
  
  // All selection assets are now PNG images, return as-is
  return asset
}

// Helper to extract SVG component from require() result
// react-native-svg-transformer returns { default: Component } or Component directly
const getSvgComponent = (svgModule: any): SvgComponent | null => {
  if (!svgModule) return null
  
  // Handle both { default: Component } and Component directly
  const component = svgModule.default || svgModule
  
  // Check if it's actually a component
  if (typeof component !== 'function') {
    return null
  }
  
  return component as SvgComponent
}

// Get preview asset (SVG component for preview) with body size handling
export const getPreviewAsset = (
  category: 'body' | 'hair' | 'eyes' | 'clothing' | 'devices' | 'smile',
  item: string | null,
  bodySize: BodySize = 'medium'
): SvgComponent | null => {
  if (!item) return null

  let svgModule: any = null

  if (category === 'body') {
    // Body previews are now handled by JSX components (BodyComponents.tsx)
    // Return null - the AvatarPreview component handles body rendering directly
    return null
  } else if (category === 'hair') {
    const hairCollection = previewAssets.hair as Record<string, any>
    svgModule = hairCollection[item] ?? null
  } else if (category === 'eyes') {
    const eyesCollection = previewAssets.eyes as Record<string, any>
    svgModule = eyesCollection[item] ?? null
  } else if (category === 'clothing') {
    // Map clothing name to SVG name and add size suffix
    const svgBaseName = clothingNameMapping[item] || item
    const svgKey = `${svgBaseName}-${bodySize}`
    const clothingCollection = previewAssets.clothing as Record<string, any>
    svgModule = clothingCollection[svgKey] ?? null
  } else if (category === 'devices') {
    // Some devices have size variants
    if (item === 'prostetic2') {
      const svgKey = `prostetic2-${bodySize}`
      const devicesCollection = previewAssets.devices as Record<string, any>
      svgModule = devicesCollection[svgKey] ?? null
    } else {
      const devicesCollection = previewAssets.devices as Record<string, any>
      svgModule = devicesCollection[item] ?? null
    }
  } else if (category === 'smile') {
    const smileCollection = previewAssets.smile as Record<string, any>
    svgModule = smileCollection[item] ?? null
  }

  return getSvgComponent(svgModule)
}

// Legacy function for backward compatibility
export const getFriendAsset = (
  category: 'body' | 'hair' | 'eyes' | 'clothing' | 'devices' | 'categories',
  item: string | null
): ImageSourcePropType | null => {
  return getSelectionAsset(category, item) as ImageSourcePropType | null
}

export const getCategoryIcon = (category: 'body' | 'hair' | 'eyes' | 'clothing' | 'devices') => {
  const categories = selectionAssets.categories as Record<string, ImageSourcePropType> | undefined
  return categories ? categories[category] ?? null : null
}

export default selectionAssets
