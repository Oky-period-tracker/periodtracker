import * as React from 'react'
import { Image, ImageBackground, ScrollView, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from '../../components/Button'
import { Text } from '../../components/Text'
import { useResponsive } from '../../contexts/ResponsiveContext'
import { useTodayPrediction } from '../../contexts/PredictionProvider'
import { useAuth } from '../../contexts/AuthContext'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { useSelector } from '../../redux/useSelector'
import { currentThemeSelector } from '../../redux/selectors'
import { setTheme } from '../../redux/actions'
import { themeNames } from '../../resources/translations'
import { getAsset } from '../../services/asset'
import { analytics } from '../../services/firebase'
import { assets } from '../../resources/assets'
import { getThemeSvg } from '../../resources/assets/friendAssets'
import { createThemeScreenStyles, getThemeStyle, getThemeImageWrapperStyle, getThemeContainerStyle } from './ThemeScreen.styles'
import { useAccessibilityLabel } from '../../hooks/useAccessibilityLabel'
import { useTranslate } from '../../hooks/useTranslate'
import { calculateOptimalItemWidth, getResponsiveMargin } from '../../utils/layoutCalculations'
import { scaleHorizontal, scaleDimension } from '../../utils/responsive'

const ThemeScreen: ScreenComponent<'Theme'> = ({ navigation }) => {
  return <ThemeSelect navigation={navigation} />
}

export default ThemeScreen

const MAX_TABLET_WIDTH = 1200
const HEIGHT_ADDITION_RATIO = 4 / 10
const ICON_OFFSET_MULTIPLIER = 1.3
const ICON_POSITION_OFFSET_MULTIPLIER = 0.6

const THEME_COLORS = {
  CURRENT_SELECTED: '#A4D233',
  CURRENT_UNSELECTED: '#D1D0D2',
  PENDING: '#FF8C00',
  TRANSPARENT: 'transparent',
} as const

interface ThemeSelectProps {
  onConfirm?: () => void
  onGoBack?: () => void
  navigation?: any
}

export const ThemeSelect = ({ onConfirm, onGoBack, navigation }: ThemeSelectProps) => {
  const currentTheme = useSelector(currentThemeSelector)
  const dispatch = useDispatch()
  const { UIConfig, width } = useResponsive()
  const { onPeriod } = useTodayPrediction()
  const { isLoggedIn } = useAuth()
  const insets = useSafeAreaInsets()
  const getAccessibilityLabel = useAccessibilityLabel()
  const translate = useTranslate()

  const [selectedTheme, setSelectedTheme] = React.useState(currentTheme)


  const themeConfig = UIConfig.themeSelection

  const backgroundImage = React.useMemo(() => {
    try {
      if (onPeriod && isLoggedIn) {
        const img = getAsset(`backgrounds.${selectedTheme}.onPeriod`)
        return img
      }
      const img = getAsset(`backgrounds.${selectedTheme}.default`)
      return img
    } catch (error) {
      return null
    }
  }, [selectedTheme, onPeriod, isLoggedIn])

  const themeWidth = React.useMemo(() => {
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
  }, [themeConfig, width])

  const isInitialSelection = !!onConfirm
  const dynamicStyles = React.useMemo(
    () => createThemeScreenStyles(themeConfig, themeWidth, isInitialSelection, !!onGoBack, true, width),
    [themeConfig, themeWidth, isInitialSelection, onGoBack, width],
  )

  const confirm = () => {
    dispatch(setTheme(selectedTheme))

    if (selectedTheme !== currentTheme) {
      analytics?.().logEvent('themeChanged', {
        selectedTheme,
      })
    }

    onConfirm?.()
  }

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack()
    } else if (navigation) {
      navigation.goBack()
    }
  }

  const themeChanged = currentTheme !== selectedTheme
  const confirmStatus = themeChanged || isInitialSelection ? 'primary' : 'basic'

  const calculateThemeDimensions = React.useCallback((themeWidth: number, themeConfig: typeof UIConfig.themeSelection) => {
    const isNarrowScreen = width <= 480
    const themeImageAspectRatio = themeConfig.themeSize.width / themeConfig.themeSize.height
    const imageWidth = themeWidth
    const imageHeight = imageWidth / themeImageAspectRatio
    const borderWidth = isNarrowScreen ? scaleDimension(4) : scaleDimension(8)
    const extraWidth = (width <= 360) ? 0 : (isNarrowScreen ? scaleHorizontal(3) : scaleHorizontal(4))
    const baseWidthReduction = scaleHorizontal(14)
    const additionalReduction = (width > 480 && width <= 600) ? scaleHorizontal(6) : 0
    const widthReduction = baseWidthReduction + additionalReduction
    
    const getContainerWidthAdjustment = (screenWidth: number): number => {
      if (screenWidth <= 360) return scaleHorizontal(8)
      if (screenWidth <= 392) return scaleHorizontal(16)
      if (screenWidth <= 411) return scaleHorizontal(8)
      if (screenWidth <= 480) return scaleHorizontal(8)
      if (screenWidth <= 600) return scaleHorizontal(8)
      if (screenWidth <= 720) return scaleHorizontal(0)
      return scaleHorizontal(8)
    }
    
    const containerWidthAdjustment = getContainerWidthAdjustment(width)
    const containerWidth = Math.max(0, imageWidth + extraWidth - widthReduction + containerWidthAdjustment)
    const containerHeight = imageHeight + (scaleDimension(themeConfig.iconSize) * HEIGHT_ADDITION_RATIO)
    const borderRadiusRatio = themeConfig.themeBorderRadius / themeConfig.themeSize.height
    const imageBorderRadius = imageHeight * borderRadiusRatio
    const containerBorderRadius = containerHeight * borderRadiusRatio
    const scaledIconSize = scaleDimension(themeConfig.iconSize)
    const getIconOffsetMultiplier = (screenWidth: number): number => {
      if (screenWidth <= 360) return 1.6
      if (screenWidth <= 392) return 1.2
      if (screenWidth <= 411) return 1.4
      if (screenWidth <= 480) return 1.3
      if (screenWidth <= 600) return 1.8
      if (screenWidth <= 720) return 2
      return 1.0
    }
    const iconOffsetMultiplier = getIconOffsetMultiplier(width)
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
  }, [width])

  const getContainerBackgroundColor = React.useCallback((isCurrent: boolean, isSelected: boolean): string => {
    if (isCurrent && isSelected) return THEME_COLORS.CURRENT_SELECTED
    if (isCurrent && !isSelected) return THEME_COLORS.CURRENT_UNSELECTED
    if (isSelected) return THEME_COLORS.PENDING
    return THEME_COLORS.TRANSPARENT
  }, [])

  const renderCheckmarkIcon = React.useCallback((
    isCurrent: boolean,
    isSelected: boolean,
    iconPositionOffset: number,
    iconOffset: number,
    iconSize: number,
  ) => {
    if (!isCurrent && !isSelected) return null

    const iconStyle = isCurrent && isSelected
      ? dynamicStyles.check
      : isCurrent && !isSelected
      ? dynamicStyles.grayIconContainer
      : dynamicStyles.pendingIconContainer

    return (
      <View
        style={[
          iconStyle,
          {
            right: iconPositionOffset - iconSize + iconOffset,
            top: iconPositionOffset - iconSize + iconOffset,
          },
        ]}
      >
        <FontAwesome name="check" size={iconSize} color="#FFFFFF" />
      </View>
    )
  }, [dynamicStyles])

  return (
    <View style={dynamicStyles.screen}>
      <ImageBackground
        source={backgroundImage || undefined}
        style={dynamicStyles.backgroundImage}
        resizeMode="cover"
        imageStyle={dynamicStyles.backgroundImageStyle}
      >
        <ScrollView 
          style={dynamicStyles.scrollView}
          contentContainerStyle={dynamicStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title Section with Logo */}
          <View style={dynamicStyles.titleContainerWrapper}>
            <View style={dynamicStyles.titleContainer}>
              <View style={dynamicStyles.titleSpacer}>
                <Image 
                  source={assets.static.launch_icon} 
                  style={dynamicStyles.logo} 
                  resizeMode="contain" 
                />
              </View>
              <View style={dynamicStyles.titleBox}>
              <Text style={[dynamicStyles.title, { color: '#000000' }]}>
                select_theme_title
              </Text>
              <Text style={[dynamicStyles.subtitle, { color: '#000000' }]}>
                select_theme_subtitle
              </Text>
              </View>
            </View>
          </View>

          {/* Theme Grid */}
          <View style={dynamicStyles.themes}>
            {themeNames.map((theme) => {
              const isSelected = theme === selectedTheme
              const isCurrent = theme === currentTheme
              const ThemeSvg = getThemeSvg(theme)

              if (!ThemeSvg) {
                return null
              }

              const dimensions = calculateThemeDimensions(themeWidth, themeConfig)
              const containerBackgroundColor = getContainerBackgroundColor(isCurrent, isSelected)

              return (
                <View 
                  key={theme} 
                  style={[
                    dynamicStyles.theme, 
                    getThemeStyle(themeWidth, dimensions.containerHeight, width),
                  ]}
                >
                  <View style={dynamicStyles.themeBody}>
                    <TouchableOpacity
                      onPress={() => setSelectedTheme(theme)}
                      activeOpacity={0.7}
                      style={dynamicStyles.themeTouchable}
                      accessibilityLabel={getAccessibilityLabel('select_theme_button') + `: ${translate(theme)}, ${isSelected ? 'selected' : 'tap to select'}`}
                      accessibilityRole="button"
                    >
                      <View style={[dynamicStyles.imageWrapper, getThemeImageWrapperStyle()]}>
                        {/* Container with background color indicating theme status */}
                        <View
                          style={getThemeContainerStyle(
                            dimensions.containerWidth,
                            dimensions.containerHeight,
                            dimensions.containerBorderRadius,
                            containerBackgroundColor
                          )}
                        >
                          {/* Theme SVG */}
                          <View
                            style={{
                              width: dimensions.imageWidth,
                              height: dimensions.imageHeight,
                              borderRadius: dimensions.imageBorderRadius,
                              overflow: 'hidden',
                            }}
                          >
                            {React.createElement(ThemeSvg, {
                              width: dimensions.imageWidth,
                              height: dimensions.imageHeight,
                            })}
                          </View>
                        </View>
                        {/* Checkmark icon */}
                        {renderCheckmarkIcon(
                          isCurrent,
                          isSelected,
                          dimensions.iconPositionOffset,
                          dimensions.iconOffset,
                          themeConfig.iconSize,
                        )}
                      </View>
                    </TouchableOpacity>
                    <Text style={[dynamicStyles.name, { color: '#000000' }]}>
                      {theme}
                    </Text>
                  </View>
                </View>
              )
            })}
          </View>
        </ScrollView>
        
        {/* Action Buttons */}
        <View
          style={[
            dynamicStyles.buttonContainer,
            isInitialSelection && { paddingBottom: themeConfig.buttonPaddingBottom + insets.bottom },
          ]}
        >
          {isInitialSelection ? (
            <>
              {onGoBack && (
                <Button 
                  onPress={handleGoBack} 
                  status="basic"
                  accessibilityLabel={getAccessibilityLabel('arrow_button')}
                >
                  go_back
                </Button>
              )}
              <Button 
                onPress={confirm} 
                status={confirmStatus}
                accessibilityLabel={getAccessibilityLabel('continue')}
              >
                continue
              </Button>
            </>
          ) : (
            <Button 
              onPress={confirm} 
              status={confirmStatus}
              accessibilityLabel={getAccessibilityLabel('confirm')}
            >
              confirm
            </Button>
          )}
        </View>
      </ImageBackground>
    </View>
  )
}

