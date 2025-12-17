import { scaleHorizontal, scaleDimension } from '../../../utils/responsive'
import { getResponsiveMargin } from '../../../utils/layoutCalculations'
import { calculateOptimalItemWidth } from '../../../utils/layoutCalculations'
import type { UIConfig } from '../../../config/UIConfig'

const MAX_TABLET_WIDTH = 1200
const HEIGHT_ADDITION_RATIO = 4 / 10

export const calculateThemeWidth = (
  width: number,
  themeConfig: UIConfig['themeSelection']
): number => {
  const itemsPerRow = 2
  const containerWidthPercent = width <= 360 ? 0.98 : (width <= 480 ? 0.92 : 0.92)
  const containerWidth = Math.min(width * containerWidthPercent, MAX_TABLET_WIDTH)
  
  let baseWidth: number
  
  if (width <= 480) {
    if (width <= 360) {
      const actualContainerWidth = width * 0.98
      const marginHorizontal = 2
      const totalMargins = marginHorizontal * (itemsPerRow * 2 + 1)
      const availableWidth = actualContainerWidth - totalMargins
      const calculatedWidth = Math.floor(availableWidth / itemsPerRow)
      const scaledWidth = calculatedWidth * 0.85
      baseWidth = Math.max(Math.min(scaledWidth, 160), 100)
    } else if (width > 360 && width <= 392) {
      const marginHorizontal = getResponsiveMargin(width, {
        xs: 6,
        sm: 6,
        md: 8,
      })
      baseWidth = calculateOptimalItemWidth(containerWidth, itemsPerRow, {
        marginHorizontal,
        safetyBuffer: 6,
        minWidth: 85,
        maxWidth: 135,
        scaleMargins: true,
        scaleBuffer: true,
      })
    } else if (width > 392 && width <= 411) {
      const marginHorizontal = getResponsiveMargin(width, {
        xs: 6,
        sm: 6,
        md: 8,
      })
      baseWidth = calculateOptimalItemWidth(containerWidth, itemsPerRow, {
        marginHorizontal,
        safetyBuffer: 6,
        minWidth: 88,
        maxWidth: 138,
        scaleMargins: true,
        scaleBuffer: true,
      })
    } else {
      const marginHorizontal = getResponsiveMargin(width, {
        xs: 6,
        sm: 6,
        md: 8,
      })
      baseWidth = calculateOptimalItemWidth(containerWidth, itemsPerRow, {
        marginHorizontal,
        safetyBuffer: 6,
        minWidth: 90,
        maxWidth: 140,
        scaleMargins: true,
        scaleBuffer: true,
      })
    }
  } else if (width > 480 && width <= 600) {
    const containerPadding = scaleHorizontal(themeConfig.screenPaddingHorizontal) * 2
    const themesPadding = scaleHorizontal(themeConfig.itemsContainerPaddingHorizontal) * 2
    const totalMarginSpace = scaleHorizontal(themeConfig.themeMarginHorizontal) * 2
    const availableWidth = containerWidth - containerPadding - themesPadding - totalMarginSpace
    baseWidth = availableWidth > 0 ? availableWidth / itemsPerRow : 0
  } else {
    const containerPadding = scaleHorizontal(themeConfig.screenPaddingHorizontal) * 2
    const themesPadding = scaleHorizontal(themeConfig.itemsContainerPaddingHorizontal) * 2
    const totalMarginSpace = scaleHorizontal(themeConfig.themeMarginHorizontal) * 2
    const availableWidth = containerWidth - containerPadding - themesPadding - totalMarginSpace
    
    baseWidth = availableWidth > 0 ? availableWidth / itemsPerRow : 0
  }
  
  return width <= 360 ? baseWidth : baseWidth * 0.85
}

export const calculateThemeDimensions = (
  themeWidth: number,
  themeConfig: UIConfig['themeSelection'],
  screenWidth: number
) => {
  const isNarrowScreen = screenWidth <= 480
  const themeImageAspectRatio = themeConfig.themeSize.width / themeConfig.themeSize.height
  const imageWidth = themeWidth
  const imageHeight = imageWidth / themeImageAspectRatio
  const borderWidth = isNarrowScreen ? scaleDimension(4) : scaleDimension(8)
  const extraWidth = (screenWidth <= 360) ? 0 : (isNarrowScreen ? scaleHorizontal(3) : scaleHorizontal(4))
  const baseWidthReduction = scaleHorizontal(14)
  const additionalReduction = (screenWidth > 480 && screenWidth <= 600) ? scaleHorizontal(6) : 0
  const widthReduction = baseWidthReduction + additionalReduction
  
  const getContainerWidthAdjustment = (width: number): number => {
    if (width <= 360) return scaleHorizontal(8)
    if (width <= 392) return scaleHorizontal(16)
    if (width <= 411) return scaleHorizontal(8)
    if (width <= 480) return scaleHorizontal(8)
    if (width <= 600) return scaleHorizontal(8)
    if (width <= 720) return scaleHorizontal(0)
    return scaleHorizontal(8)
  }
  
  const containerWidthAdjustment = getContainerWidthAdjustment(screenWidth)
  const containerWidth = Math.max(0, imageWidth + extraWidth - widthReduction + containerWidthAdjustment)
  const containerHeight = imageHeight + (scaleDimension(themeConfig.iconSize) * HEIGHT_ADDITION_RATIO)
  const borderRadiusRatio = themeConfig.themeBorderRadius / themeConfig.themeSize.height
  const imageBorderRadius = imageHeight * borderRadiusRatio
  const containerBorderRadius = containerHeight * borderRadiusRatio
  const scaledIconSize = scaleDimension(themeConfig.iconSize)
  const getIconOffsetMultiplier = (width: number): number => {
    if (width <= 360) return 1.6
    if (width <= 392) return 1.2
    if (width <= 411) return 1.4
    if (width <= 480) return 1.3
    if (width <= 600) return 1.8
    if (width <= 720) return 2
    return 1.0
  }
  const iconOffsetMultiplier = getIconOffsetMultiplier(screenWidth)
  const iconOffset = scaledIconSize * iconOffsetMultiplier
  const iconPositionOffset = 0
  
  return {
    imageWidth,
    imageHeight,
    containerWidth,
    containerHeight,
    imageBorderRadius,
    containerBorderRadius,
    iconOffset,
    iconPositionOffset,
  }
}

export const getContainerBackgroundColor = (
  isCurrent: boolean,
  isSelected: boolean
): string => {
  const THEME_COLORS = {
    CURRENT_SELECTED: '#A4D233',
    CURRENT_UNSELECTED: '#D1D0D2',
    PENDING: '#FF8C00',
    TRANSPARENT: 'transparent',
  } as const

  if (isCurrent && isSelected) return THEME_COLORS.CURRENT_SELECTED
  if (isCurrent && !isSelected) return THEME_COLORS.CURRENT_UNSELECTED
  if (isSelected) return THEME_COLORS.PENDING
  return THEME_COLORS.TRANSPARENT
}

