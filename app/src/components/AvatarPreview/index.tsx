import * as React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { getPreviewAsset, BodySize } from '../../resources/assets/friendAssets'
import { getDarkerSkinColor } from '../../utils/colorUtils'

export interface AvatarPreviewProps {
  bodyType: 'body-small' | 'body-medium' | 'body-large'
  skinColor?: string
  hairStyle?: string | null
  hairColor?: string
  eyeShape?: string | null
  eyeColor?: string
  smile?: string | null
  clothing?: string | null
  devices?: string | null
  width?: number
  height?: number
  style?: ViewStyle
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
 * Uses react-native-svg-transformer to import SVGs as React components
 * Colors are applied via the `color` prop which maps to `currentColor` in SVG
 */
export const AvatarPreview: React.FC<AvatarPreviewProps> = ({
  bodyType,
  skinColor = '#FFDBAC',
  hairStyle = null,
  hairColor = '#000000',
  eyeShape = null,
  eyeColor = '#000000',
  smile = 'smile',
  clothing = null,
  devices = null,
  width = 150,
  height = 200,
  style,
}) => {
  const bodySize: BodySize = React.useMemo(() => {
    if (bodyType === 'body-small') return 'small'
    if (bodyType === 'body-large') return 'large'
    return 'medium'
  }, [bodyType])

  // Calculate darker skin color for shadow parts
  const darkerSkinColor = React.useMemo(() => {
    return getDarkerSkinColor(skinColor)
  }, [skinColor])

  // Load SVG components (these are React components thanks to react-native-svg-transformer)
  const BodySvg = getPreviewAsset('body', bodyType, bodySize)
  const HairSvg = getPreviewAsset('hair', hairStyle, bodySize)
  const SmileSvg = smile ? getPreviewAsset('smile', smile, bodySize) : null
  const EyeSvg = getPreviewAsset('eyes', eyeShape, bodySize)
  const ClothingSvg = getPreviewAsset('clothing', clothing, bodySize)
  const DeviceSvg = getPreviewAsset('devices', devices, bodySize)

  // Helper to check if a value is a valid React component
  const isValidComponent = (component: any): component is SvgComponent => {
    return component && (typeof component === 'function' || React.isValidElement(component))
  }

  // Helper to recursively replace fill colors in SVG children
  const replaceFillColor = (element: any, oldColor: string, newColor: string): any => {
    if (!element) return element

    // Handle arrays
    if (Array.isArray(element)) {
      return element.map((child) => replaceFillColor(child, oldColor, newColor))
    }

    if (React.isValidElement(element)) {
      const props = element.props || {}
      const newProps: any = { ...props }

      // Normalize color for comparison (handle both #C1C1C1 and C1C1C1)
      const normalizeColor = (color: string) => {
        if (!color || typeof color !== 'string') return color
        return color.startsWith('#') ? color.toUpperCase() : `#${color.toUpperCase()}`
      }

      // Replace fill color if it matches (case-insensitive)
      const elementFill = normalizeColor(props.fill)
      const targetColor = normalizeColor(oldColor)
      
      if (elementFill === targetColor) {
        newProps.fill = newColor
      }

      // Also check style prop for fill color
      if (props.style) {
        const style = Array.isArray(props.style) 
          ? Object.assign({}, ...props.style) 
          : props.style
        
        if (style.fill) {
          const styleFill = normalizeColor(style.fill)
          if (styleFill === targetColor) {
            newProps.style = {
              ...style,
              fill: newColor,
            }
          }
        }
      }

      // Recursively process children
      if (props.children) {
        const children = React.Children.map(props.children, (child) =>
          replaceFillColor(child, oldColor, newColor)
        )
        newProps.children = children
      }

      return React.cloneElement(element, newProps)
    }

    return element
  }

  // Helper to recursively override fill props in SVG children
  const overrideFillColor = (element: any, targetColor: string, newColor: string): any => {
    if (!element) return element

    // Handle arrays
    if (Array.isArray(element)) {
      return element.map((child) => overrideFillColor(child, targetColor, newColor))
    }

    if (React.isValidElement(element)) {
      const props = element.props || {}
      const newProps: any = { ...props }

      // Normalize color for comparison (but preserve placeholders like SKIN_SHADOW_COLOR)
      const normalizeColor = (color: string) => {
        if (!color || typeof color !== 'string') return color
        // If it's a placeholder (not a hex color), return as-is
        if (!color.startsWith('#') && !/^[0-9A-Fa-f]{6}$/.test(color)) {
          return color
        }
        return color.startsWith('#') ? color.toUpperCase() : `#${color.toUpperCase()}`
      }

      // Check if this element has the target fill color
      const elementFill = props.fill ? normalizeColor(props.fill) : null
      const normalizedTarget = normalizeColor(targetColor)
      
      if (elementFill === normalizedTarget) {
        newProps.fill = newColor
      }

      // Also check style prop
      if (props.style) {
        const style = Array.isArray(props.style) 
          ? Object.assign({}, ...props.style) 
          : props.style
        
        if (style.fill) {
          const styleFill = normalizeColor(style.fill)
          if (styleFill === normalizedTarget) {
            newProps.style = {
              ...style,
              fill: newColor,
            }
          }
        }
      }

      // Recursively process children
      if (props.children) {
        const children = React.Children.map(props.children, (child) =>
          overrideFillColor(child, targetColor, newColor)
        )
        newProps.children = children
      }

      return React.cloneElement(element, newProps)
    }

    return element
  }

  // Helper to render SVG component safely with color replacement for body
  const renderBodySvg = (SvgComponent: SvgComponent | null, props: any, darkerColor: string) => {
    if (!SvgComponent || !isValidComponent(SvgComponent)) {
      return null
    }
    
    // Render the SVG first
    const svgElement = <SvgComponent {...props} />
    
    // Replace the marker color #C1C1C0 with the darker skin color
    // We replaced #C1C1C1 with #C1C1C0 in the SVG files as a marker
    // This marker color will be replaced with the calculated darker skin color
    return overrideFillColor(svgElement, '#C1C1C0', darkerColor)
  }

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
      {BodySvg && isValidComponent(BodySvg) && (
        <View style={[styles.layer, styles.bodyLayer]}>
          {/* Body SVG component - apply skin color as fill, darker color for shadows */}
          {renderBodySvg(BodySvg, { 
            width, 
            height, 
            color: skinColor,
            fill: skinColor 
          }, darkerSkinColor)}
        </View>
      )}

      {/* Hair layer with color */}
      {HairSvg && isValidComponent(HairSvg) && (
        <View style={[styles.layer, styles.hairLayer]}>
          {renderSvg(HairSvg, { width, height, color: hairColor, fill: hairColor })}
        </View>
      )}

      {/* Smile layer */}
      {SmileSvg && isValidComponent(SmileSvg) && (
        <View style={[styles.layer, styles.smileLayer]}>
          {renderSvg(SmileSvg, { width, height })}
        </View>
      )}

      {/* Eyes layer with color */}
      {EyeSvg && isValidComponent(EyeSvg) && (
        <View style={[styles.layer, styles.eyeLayer]}>
          {renderSvg(EyeSvg, { width, height, color: eyeColor, fill: eyeColor })}
        </View>
      )}

      {/* Clothing layer */}
      {ClothingSvg && isValidComponent(ClothingSvg) && (
        <View style={[styles.layer, styles.clothingLayer]}>
          {renderSvg(ClothingSvg, { width, height })}
        </View>
      )}

      {/* Devices layer */}
      {DeviceSvg && isValidComponent(DeviceSvg) && (
        <View style={[styles.layer, styles.deviceLayer]}>
          {renderSvg(DeviceSvg, { width, height })}
        </View>
      )}
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
})
