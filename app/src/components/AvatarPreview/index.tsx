import * as React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { getPreviewAsset, BodySize } from '../../resources/assets/friendAssets'
import { getDarkerSkinColor } from '../../utils/colorUtils'
import { BodySmall, BodyMedium, BodyLarge } from '../../resources/assets/images/avatars/friend/avatar-parts/bodies/BodyComponents'

import { SharedValue } from 'react-native-reanimated'

export interface AvatarPreviewProps {
  bodyType: 'body-small' | 'body-medium' | 'body-large'
  skinColor?: string
  hairStyle?: string | null
  hairColor?: string
  eyeShape?: string | null
  eyeColor?: string
  smile?: string // Optional in props but will always have a value when used
  clothing?: string | null
  devices?: string | string[] | null // Support both string (old format) and array (new format)
  width?: number
  height?: number
  style?: ViewStyle
  // Animated transform props for body parts
  animatedTransforms?: {
    chest?: { translateX?: SharedValue<number>; translateY?: SharedValue<number> }
    head?: { translateX?: SharedValue<number>; translateY?: SharedValue<number> }
    leftLeg?: { translateY?: SharedValue<number>; scaleY?: SharedValue<number> }
    rightLeg?: { translateY?: SharedValue<number>; scaleY?: SharedValue<number> }
    leftHand?: { rotation?: SharedValue<number>; translateX?: SharedValue<number>; translateY?: SharedValue<number> }
    rightHand?: { rotation?: SharedValue<number>; translateX?: SharedValue<number>; translateY?: SharedValue<number> }
    eyes?: { translateX?: SharedValue<number>; translateY?: SharedValue<number> }
  }
}

// Type for SVG component (returned by react-native-svg-transformer)
type SvgComponent = React.ComponentType<{ 
  width?: number | string
  height?: number | string
  color?: string
  fill?: string
}>

/**
 * Reusable AvatarPreview component that stacks SVG layers and applies colors
 * Can be used throughout the app to display custom avatars
 * 
 * Body components are JSX components with color props (BodyComponents.tsx)
 * Other parts use react-native-svg-transformer to import SVGs as React components
 * Colors are applied via props for body, and `color`/`fill` props for other parts
 */
export const AvatarPreview: React.FC<AvatarPreviewProps> = ({
  bodyType,
  skinColor,
  hairStyle = null,
  hairColor,
  eyeShape = null,
  eyeColor,
  smile,
  clothing = null,
  devices = null,
  width = 150,
  height = 200,
  style,
  animatedTransforms,
}) => {
  const bodySize: BodySize = React.useMemo(() => {
    if (bodyType === 'body-small') return 'small'
    if (bodyType === 'body-large') return 'large'
    return 'medium'
  }, [bodyType])


  // Normalize devices to array format (handle both string and array)
  const devicesArray = React.useMemo(() => {
    if (!devices) return []
    if (Array.isArray(devices)) return devices
    return [devices] // Old format: single string
  }, [devices])

  // Check if any device is a prosthetic type that needs to render before clothing
  const isProstheticDevice = React.useMemo(() => {
    if (!devicesArray || devicesArray.length === 0) return false
    const prostheticDevices = ['prostetic1', 'prostetic2', 'prostetic2-small', 'prostetic2-medium', 'prostetic2-large', 'prosteticleg2-small', 'prosteticleg2-medium', 'prosteticleg2-large']
    return devicesArray.some(device => prostheticDevices.includes(device))
  }, [devicesArray])

  // Load body component based on size (now using JSX components with color props)
  const BodyComponent = React.useMemo(() => {
    if (bodySize === 'small') return BodySmall
    if (bodySize === 'large') return BodyLarge
    return BodyMedium
  }, [bodySize])

  // Load other SVG components (these are React components thanks to react-native-svg-transformer)
  // '00' is bald - don't load any hair SVG
  const HairSvg = hairStyle === '00' ? null : getPreviewAsset('hair', hairStyle, bodySize)
  const SmileSvg = smile ? getPreviewAsset('smile', smile, bodySize) : null
  const EyeSvg = getPreviewAsset('eyes', eyeShape, bodySize)
  const ClothingSvg = getPreviewAsset('clothing', clothing, bodySize)
  
  // Load device SVGs for all selected devices, separated by subcategory
  const DeviceSvgs = React.useMemo(() => {
    return devicesArray.map(device => ({
      device,
      svg: getPreviewAsset('devices', device, bodySize),
      isAccessory: ['necklace1', 'necklace2', 'necklace3'].includes(device)
    })).filter(item => item.svg !== null)
  }, [devicesArray, bodySize])
  
  // Separate devices into accessories and non-accessories
  const AccessorySvgs = React.useMemo(() => {
    return DeviceSvgs.filter(item => item.isAccessory)
  }, [DeviceSvgs])
  
  const NonAccessoryDeviceSvgs = React.useMemo(() => {
    return DeviceSvgs.filter(item => !item.isAccessory)
  }, [DeviceSvgs])

  // Helper to check if a value is a valid React component
  const isValidComponent = (component: any): component is SvgComponent => {
    return component && (typeof component === 'function' || React.isValidElement(component))
  }

  // Helper to render body SVG with colors applied via props
  const renderBodySvg = React.useCallback((props: any) => {
    if (!BodyComponent) {
      return null
    }
    
    // Calculate darker color if skin color is provided
    const darkerColor = skinColor ? getDarkerSkinColor(skinColor) : '#C1C1C1'
    const mainColor = skinColor || '#EFEFEF'
    
    // Render body component with color props and animated transforms
    return (
      <BodyComponent
        width={props.width}
        height={props.height}
        mainColor={mainColor}
        darkerColor={darkerColor}
        animatedTransforms={animatedTransforms}
      />
    )
  }, [BodyComponent, skinColor, animatedTransforms])

  // Helper to render SVG component safely
  const renderSvg = (SvgComponent: SvgComponent | null, props: any) => {
    if (!SvgComponent || !isValidComponent(SvgComponent)) {
      return null
    }
    return <SvgComponent {...props} />
  }

  return (
    <View style={[styles.container, { width, height }, style]}>
      {/* Body layer with skin color */}
      {BodyComponent && (
        <View style={[styles.layer, styles.bodyLayer]}>
          {/* Body component with color props */}
          {renderBodySvg({ width, height })}
        </View>
      )}

      {/* Hair layer with color */}
      {HairSvg && isValidComponent(HairSvg) && hairColor && (
        <View style={[styles.layer, styles.hairLayer]}>
          {renderSvg(HairSvg, { width, height, color: hairColor, fill: hairColor, animatedTransforms })}
        </View>
      )}
      {/* Hair layer without color (if hair selected but no color) */}
      {HairSvg && isValidComponent(HairSvg) && !hairColor && (
        <View style={[styles.layer, styles.hairLayer]}>
          {renderSvg(HairSvg, { width, height, animatedTransforms })}
        </View>
      )}

      {/* Smile layer - always show if smile is provided (defaults to 'smile') */}
      {smile && SmileSvg && isValidComponent(SmileSvg) && (
        <View style={[styles.layer, styles.smileLayer]}>
          {renderSvg(SmileSvg, { width, height, animatedTransforms })}
        </View>
      )}

      {/* Eyes layer with color */}
      {EyeSvg && isValidComponent(EyeSvg) && eyeColor && (
        <View style={[styles.layer, styles.eyeLayer]}>
          {renderSvg(EyeSvg, { width, height, color: eyeColor, fill: eyeColor, animatedTransforms })}
        </View>
      )}
      {/* Eyes layer without color (if eyes selected but no color) */}
      {EyeSvg && isValidComponent(EyeSvg) && !eyeColor && (
        <View style={[styles.layer, styles.eyeLayer]}>
          {renderSvg(EyeSvg, { width, height, animatedTransforms })}
        </View>
      )}

      {/* Clothing layer - render before devices if prosthetic, after if not */}
      {ClothingSvg && isValidComponent(ClothingSvg) && !isProstheticDevice && (
        <View style={[styles.layer, styles.clothingLayer]}>
          {renderSvg(ClothingSvg, { width, height, animatedTransforms })}
        </View>
      )}

      {/* Non-accessory devices layer - render before clothing if prosthetic, after if not */}
      {NonAccessoryDeviceSvgs.map(({ device, svg }) => {
        if (!svg || !isValidComponent(svg)) return null
        return (
          <View 
            key={device} 
            style={[styles.layer, isProstheticDevice ? styles.deviceLayerProsthetic : styles.deviceLayer]}
          >
            {renderSvg(svg, { width, height, animatedTransforms })}
          </View>
        )
      })}

      {/* Clothing layer - render after devices if prosthetic */}
      {ClothingSvg && isValidComponent(ClothingSvg) && isProstheticDevice && (
        <View style={[styles.layer, styles.clothingLayerProsthetic]}>
          {renderSvg(ClothingSvg, { width, height, animatedTransforms })}
        </View>
      )}

      {/* Accessories layer - render on top of clothing (highest z-index) */}
      {AccessorySvgs.map(({ device, svg }) => {
        if (!svg || !isValidComponent(svg)) return null
        return (
          <View 
            key={device} 
            style={[styles.layer, styles.accessoryLayer]}
          >
            {renderSvg(svg, { width, height, animatedTransforms })}
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyLayer: {
    zIndex: 1,
  },
  hairLayer: {
    zIndex: 2,
  },
  smileLayer: {
    zIndex: 3,
  },
  eyeLayer: {
    zIndex: 4,
  },
  clothingLayer: {
    zIndex: 5,
  },
  deviceLayer: {
    zIndex: 6,
  },
  // For prosthetic devices: devices render before clothing
  deviceLayerProsthetic: {
    zIndex: 5,
  },
  clothingLayerProsthetic: {
    zIndex: 6,
  },
  accessoryLayer: {
    zIndex: 7, // Highest z-index to render on top of clothing
  },
})
