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
import { calculateThemeWidth, calculateThemeDimensions, getContainerBackgroundColor } from './utils/themeCalculations'

const ThemeScreen: ScreenComponent<'Theme'> = ({ navigation }) => {
  return <ThemeSelect navigation={navigation} />
}

export default ThemeScreen

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
    return calculateThemeWidth(width, themeConfig)
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

  const getThemeDimensions = React.useCallback((themeWidth: number) => {
    return calculateThemeDimensions(themeWidth, themeConfig, width)
  }, [themeConfig, width])

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

              const dimensions = getThemeDimensions(themeWidth)
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

