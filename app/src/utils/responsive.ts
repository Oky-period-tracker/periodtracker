import { WidthBreakpointSize, widthBreakpoints } from '../config/UIConfig'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'

/**
 * Get the current width breakpoint based on screen width
 */
export const getWidthBreakpoint = (width: number): WidthBreakpointSize => {
  if (width >= widthBreakpoints.xl) return 'xl'
  if (width >= widthBreakpoints.lg) return 'lg'
  if (width >= widthBreakpoints.md) return 'md'
  if (width >= widthBreakpoints.sm) return 'sm'
  return 'xs'
}

/**
 * Get responsive value based on width breakpoints
 * Falls back to smaller breakpoints if value not defined
 */
export const getResponsiveValue = <T>(
  width: number,
  values: Partial<Record<WidthBreakpointSize, T>>
): T | undefined => {
  const breakpoint = getWidthBreakpoint(width)
  
  // Try current breakpoint first, then fall back to smaller ones
  const order: WidthBreakpointSize[] = [breakpoint, 'lg', 'md', 'sm', 'xs']
  
  for (const bp of order) {
    if (values[bp] !== undefined) {
      return values[bp]
    }
  }
  
  return undefined
}

/**
 * Standardized scaling functions
 * Use consistent scaling factors across the app
 */

/**
 * Scale horizontal dimensions (width, padding, margins)
 * Uses moderateScale with 0.3 factor for consistent scaling
 */
export const scaleHorizontal = (value: number): number => {
  return moderateScale(value, 0.3)
}

/**
 * Scale vertical dimensions (height, padding, margins)
 * Uses moderateScale with 0.3 factor for consistent scaling
 */
export const scaleVertical = (value: number): number => {
  return moderateScale(value, 0.3)
}

/**
 * Scale font sizes and text-related dimensions
 * Uses moderateScale with 0.3 factor for consistent scaling
 */
export const scaleFont = (value: number): number => {
  return moderateScale(value, 0.3)
}

/**
 * Scale general dimensions (icons, borders, etc.)
 * Uses moderateScale with 0.3 factor for consistent scaling
 */
export const scaleDimension = (value: number): number => {
  return moderateScale(value, 0.3)
}

/**
 * Scale using the original scale function (for specific cases)
 * Use sparingly, prefer scaleHorizontal/scaleVertical/scaleFont
 */
export const scaleOriginal = (value: number): number => {
  return scale(value)
}

