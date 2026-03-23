import { WidthBreakpointSize, widthBreakpoints } from '../config/UIConfig'
import { moderateScale, scale } from 'react-native-size-matters'

/**
 * Determines the current width breakpoint category based on screen width.
 * @param width - The current screen width in pixels
 * @returns The matching breakpoint size ('xs' | 'sm' | 'md' | 'lg' | 'xl')
 */
export const getWidthBreakpoint = (width: number): WidthBreakpointSize => {
  if (width >= widthBreakpoints.xl) return 'xl'
  if (width >= widthBreakpoints.lg) return 'lg'
  if (width >= widthBreakpoints.md) return 'md'
  if (width >= widthBreakpoints.sm) return 'sm'
  return 'xs'
}

/**
 * Resolves a responsive value by matching the current screen width to the closest defined breakpoint.
 * Falls back to smaller breakpoints if the value for the current breakpoint is not defined.
 * @param width - The current screen width in pixels
 * @param values - A partial map of breakpoint sizes to values
 * @returns The value for the matching or nearest smaller breakpoint, or undefined if none match
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
 * Scales a horizontal dimension (width, horizontal padding/margin) using moderate scaling.
 * @param value - The base dimension in logical pixels
 * @returns The scaled value using a 0.3 moderate scale factor
 */
export const scaleHorizontal = (value: number): number => {
  return moderateScale(value, 0.3)
}

/**
 * Scales a vertical dimension (height, vertical padding/margin) using moderate scaling.
 * @param value - The base dimension in logical pixels
 * @returns The scaled value using a 0.3 moderate scale factor
 */
export const scaleVertical = (value: number): number => {
  return moderateScale(value, 0.3)
}

/**
 * Scales a font size or text-related dimension using moderate scaling.
 * @param value - The base font size in logical pixels
 * @returns The scaled value using a 0.3 moderate scale factor
 */
export const scaleFont = (value: number): number => {
  return moderateScale(value, 0.3)
}

/**
 * Scales a general dimension (icons, borders, etc.) using moderate scaling.
 * @param value - The base dimension in logical pixels
 * @returns The scaled value using a 0.3 moderate scale factor
 */
export const scaleDimension = (value: number): number => {
  return moderateScale(value, 0.3)
}

/**
 * Scales a value using the original linear scale function (no moderation).
 * Prefer `scaleHorizontal`/`scaleVertical`/`scaleFont` for most cases.
 * @param value - The base dimension in logical pixels
 * @returns The linearly scaled value
 */
export const scaleOriginal = (value: number): number => {
  return scale(value)
}

