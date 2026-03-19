import { scaleHorizontal } from './responsive'
import { WidthBreakpointSize, widthBreakpoints } from '../config/UIConfig'

/**
 * Calculate item width to fit a specific number of items per row
 * 
 * @param containerWidth - Total available width for items
 * @param itemsPerRow - Desired number of items per row
 * @param marginHorizontal - Horizontal margin between items (scaled)
 * @param containerPadding - Padding on container sides (scaled)
 * @param safetyBuffer - Additional buffer to prevent overflow (scaled)
 * @returns Calculated item width
 */
export const calculateItemWidth = (
  containerWidth: number,
  itemsPerRow: number,
  marginHorizontal: number = 0,
  containerPadding: number = 0,
  safetyBuffer: number = 0
): number => {
  const totalMargins = marginHorizontal * (itemsPerRow - 1)
  const totalPadding = containerPadding * 2
  const availableWidth = containerWidth - totalMargins - totalPadding - safetyBuffer
  
  if (availableWidth <= 0) return 0
  
  return Math.floor(availableWidth / itemsPerRow)
}

/**
 * Calculate item width with min/max constraints
 * 
 * @param containerWidth - Total available width for items
 * @param itemsPerRow - Desired number of items per row
 * @param options - Configuration options
 * @returns Calculated item width within constraints
 */
export interface CalculateItemWidthOptions {
  marginHorizontal?: number
  containerPadding?: number
  safetyBuffer?: number
  minWidth?: number
  maxWidth?: number
  scaleMargins?: boolean // Whether to scale margins using scaleHorizontal
  scalePadding?: boolean // Whether to scale padding using scaleHorizontal
  scaleBuffer?: boolean // Whether to scale buffer using scaleHorizontal
}

export const calculateItemWidthWithConstraints = (
  containerWidth: number,
  itemsPerRow: number,
  options: CalculateItemWidthOptions = {}
): number => {
  const {
    marginHorizontal = 0,
    containerPadding = 0,
    safetyBuffer = 0,
    minWidth,
    maxWidth,
    scaleMargins = true,
    scalePadding = true,
    scaleBuffer = true,
  } = options

  const scaledMargin = scaleMargins ? scaleHorizontal(marginHorizontal) : marginHorizontal
  const scaledPadding = scalePadding ? scaleHorizontal(containerPadding) : containerPadding
  const scaledBuffer = scaleBuffer ? scaleHorizontal(safetyBuffer) : safetyBuffer

  const calculatedWidth = calculateItemWidth(
    containerWidth,
    itemsPerRow,
    scaledMargin,
    scaledPadding,
    scaledBuffer
  )

  let finalWidth = calculatedWidth

  // Apply min/max constraints
  if (minWidth !== undefined) {
    const scaledMinWidth = scaleHorizontal(minWidth)
    finalWidth = Math.max(finalWidth, scaledMinWidth)
  }

  if (maxWidth !== undefined) {
    const scaledMaxWidth = scaleHorizontal(maxWidth)
    finalWidth = Math.min(finalWidth, scaledMaxWidth)
  }

  return finalWidth > 0 ? finalWidth : (minWidth ? scaleHorizontal(minWidth) : 0)
}

/**
 * Verify that a specific number of items fit in the container
 * 
 * @param itemWidth - Width of each item
 * @param itemsPerRow - Number of items to check
 * @param containerWidth - Total container width
 * @param marginHorizontal - Horizontal margin between items
 * @returns True if items fit, false otherwise
 */
export const verifyItemsFit = (
  itemWidth: number,
  itemsPerRow: number,
  containerWidth: number,
  marginHorizontal: number = 0
): boolean => {
  const totalWidth = (itemWidth * itemsPerRow) + (marginHorizontal * (itemsPerRow - 1))
  return totalWidth <= containerWidth
}

/**
 * Calculate optimal item width ensuring exact number of items per row
 * Will adjust width if needed to prevent overflow or underflow
 * 
 * @param containerWidth - Total available width
 * @param itemsPerRow - Desired number of items per row
 * @param options - Configuration options
 * @returns Optimized item width
 */
export const calculateOptimalItemWidth = (
  containerWidth: number,
  itemsPerRow: number,
  options: CalculateItemWidthOptions = {}
): number => {
  const {
    marginHorizontal = 0,
    containerPadding = 0,
    safetyBuffer = 0,
    minWidth,
    maxWidth,
    scaleMargins = true,
    scalePadding = true,
    scaleBuffer = true,
  } = options

  const scaledMargin = scaleMargins ? scaleHorizontal(marginHorizontal) : marginHorizontal
  const scaledPadding = scalePadding ? scaleHorizontal(containerPadding) : containerPadding
  const scaledBuffer = scaleBuffer ? scaleHorizontal(safetyBuffer) : safetyBuffer

  // Initial calculation
  let finalWidth = calculateItemWidthWithConstraints(
    containerWidth,
    itemsPerRow,
    {
      marginHorizontal: scaledMargin,
      containerPadding: scaledPadding,
      safetyBuffer: scaledBuffer,
      minWidth,
      maxWidth,
      scaleMargins: false,
      scalePadding: false,
      scaleBuffer: false,
    }
  )

  // Verify items fit correctly
  const totalWidth = (finalWidth * itemsPerRow) + (scaledMargin * (itemsPerRow - 1))
  const availableWidth = containerWidth - (scaledPadding * 2) - scaledBuffer

  // If items don't fit, recalculate
  if (totalWidth > availableWidth) {
    const recalculatedWidth = Math.floor(
      (availableWidth - (scaledMargin * (itemsPerRow - 1))) / itemsPerRow
    )
    
    if (minWidth !== undefined) {
      const scaledMinWidth = scaleHorizontal(minWidth)
      finalWidth = Math.max(recalculatedWidth, scaledMinWidth)
    } else {
      finalWidth = recalculatedWidth
    }
  }

  // Check if one more item would fit (to prevent underutilization)
  const nextItemTotal = (finalWidth * (itemsPerRow + 1)) + (scaledMargin * itemsPerRow)
  if (nextItemTotal <= availableWidth && maxWidth === undefined) {
    // One more item would fit, but we want exactly itemsPerRow
    // Slightly increase width to prevent this
    const maxWidthForExactFit = Math.floor(
      (availableWidth - (scaledMargin * (itemsPerRow - 1))) / itemsPerRow
    )
    finalWidth = Math.min(finalWidth, maxWidthForExactFit)
  }

  return finalWidth > 0 ? finalWidth : (minWidth ? scaleHorizontal(minWidth) : 0)
}

/**
 * Get responsive margin based on width breakpoint
 */
export const getResponsiveMargin = (
  width: number,
  margins: Partial<Record<WidthBreakpointSize, number>>
): number => {
  if (width >= widthBreakpoints.xl && margins.xl !== undefined) return scaleHorizontal(margins.xl)
  if (width >= widthBreakpoints.lg && margins.lg !== undefined) return scaleHorizontal(margins.lg)
  if (width >= widthBreakpoints.md && margins.md !== undefined) return scaleHorizontal(margins.md)
  if (width >= widthBreakpoints.sm && margins.sm !== undefined) return scaleHorizontal(margins.sm)
  if (margins.xs !== undefined) return scaleHorizontal(margins.xs)
  return 0
}

/**
 * Get responsive padding based on width breakpoint
 */
export const getResponsivePadding = (
  width: number,
  paddings: Partial<Record<WidthBreakpointSize, number>>
): number => {
  if (width >= widthBreakpoints.xl && paddings.xl !== undefined) return scaleHorizontal(paddings.xl)
  if (width >= widthBreakpoints.lg && paddings.lg !== undefined) return scaleHorizontal(paddings.lg)
  if (width >= widthBreakpoints.md && paddings.md !== undefined) return scaleHorizontal(paddings.md)
  if (width >= widthBreakpoints.sm && paddings.sm !== undefined) return scaleHorizontal(paddings.sm)
  if (paddings.xs !== undefined) return scaleHorizontal(paddings.xs)
  return 0
}

