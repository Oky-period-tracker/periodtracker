import * as React from 'react'
import { Image, ImageBackground, ScrollView, TouchableOpacity, View } from 'react-native'
import { Screen } from '../../components/Screen'
import { Button } from '../../components/Button'
import { themeNames } from '../../resources/translations'
import { getAsset } from '../../services/asset'
import { useSelector } from '../../redux/useSelector'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { currentThemeSelector } from '../../redux/selectors'
import { useDispatch } from 'react-redux'
import { setTheme } from '../../redux/actions'
import { globalStyles } from '../../config/theme'
import { Text } from '../../components/Text'
import { analytics } from '../../services/firebase'
import { PaletteStatus } from '../../hooks/useColor'
import { assets } from '../../resources/assets'
import { useResponsive } from '../../contexts/ResponsiveContext'
import { UIConfig } from '../../config/UIConfig'
import { createThemeScreenStyles } from './ThemeScreen.styles'
import { useTodayPrediction } from '../../contexts/PredictionProvider'
import { useAuth } from '../../contexts/AuthContext'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { getThemeSvg } from '../../resources/assets/friendAssets'

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
  const { UIConfig, width, size } = useResponsive()
  const { onPeriod } = useTodayPrediction()
  const { isLoggedIn } = useAuth()

  const [selectedTheme, setSelectedTheme] = React.useState(currentTheme)

  // Hide navigation header
  React.useLayoutEffect(() => {
    if (navigation) {
      navigation.setOptions({
        headerShown: false,
      })
    }
  }, [navigation])

  const themeConfig = UIConfig.themeSelection

  // Get background image based on selected theme and period status
  const backgroundImage = React.useMemo(() => {
    try {
      if (onPeriod && isLoggedIn) {
        const img = getAsset(`backgrounds.${selectedTheme}.onPeriod`)
        return img
      }
      const img = getAsset(`backgrounds.${selectedTheme}.default`)
      return img
    } catch (error) {
      console.warn('Error loading background image:', error)
      return null
    }
  }, [selectedTheme, onPeriod, isLoggedIn])

  // Calculate width for 2 themes per row - use screen width directly for immediate calculation
  const containerPadding = themeConfig.screenPaddingHorizontal * 2
  const themesPadding = themeConfig.itemsContainerPaddingHorizontal * 2
  const totalMarginSpace = themeConfig.themeMarginHorizontal * 2
  // Use screen width directly - it's available immediately, no need to wait for onLayout
  const availableWidth = width - containerPadding - themesPadding - totalMarginSpace
  // Calculate exact width per theme (2 themes per row)
  const themeWidth = availableWidth > 0 ? availableWidth / 2 : 0
  
  // Debug logging
  React.useEffect(() => {
    if (__DEV__) {
      console.log(`[ThemeScreen] size: ${size}, width: ${width}, availableWidth: ${availableWidth.toFixed(2)}, themeWidth: ${themeWidth.toFixed(2)}, screenPadding: ${themeConfig.screenPaddingHorizontal}, itemsPadding: ${themeConfig.itemsContainerPaddingHorizontal}, marginHorizontal: ${themeConfig.themeMarginHorizontal}`)
    }
  }, [size, width, availableWidth, themeWidth, themeConfig])

  const isInitialSelection = !!onConfirm
  const dynamicStyles = createThemeScreenStyles(themeConfig, themeWidth, isInitialSelection, !!onGoBack)

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

  return (
    <Screen style={dynamicStyles.screen}>
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
          <View style={dynamicStyles.titleContainer}>
            <Image 
              source={assets.static.launch_icon} 
              style={dynamicStyles.logo} 
              resizeMode="contain" 
            />
            <View style={dynamicStyles.titleBox}>
              <Text style={[dynamicStyles.title, { color: '#000000' }]}>
                select_theme_title
              </Text>
              <Text style={[dynamicStyles.subtitle, { color: '#000000' }]}>
                select_theme_subtitle
              </Text>
            </View>
          </View>

          {/* Theme Grid */}
          <View style={dynamicStyles.themes}>
            {themeNames.map((theme) => {
              const isSelected = theme === selectedTheme
              const isCurrent = theme === currentTheme

              const onPress = () => {
                setSelectedTheme(theme)
              }

              const ThemeSvg = getThemeSvg(theme)

              if (!ThemeSvg) {
                console.warn(`Theme SVG not found for: ${theme}`)
                return null
              }

              return (
                <View key={theme} style={[dynamicStyles.theme, { width: themeWidth }]}>
                  <View style={dynamicStyles.themeBody}>
                    <TouchableOpacity
                      onPress={onPress}
                      activeOpacity={0.7}
                      style={dynamicStyles.themeOuterContainer}
                    >
                      {(isSelected || isCurrent) && (
                        <View style={dynamicStyles.themeGreenBorder} />
                      )}
                      <View style={dynamicStyles.themeInnerContainer}>
                        <View style={dynamicStyles.themeSvgContainer}>
                          {React.createElement(ThemeSvg, {
                            width: '100%',
                            height: '100%',
                          })}
                        </View>
                      </View>
                      {/* Show checkmark icon only when theme is active (current) */}
                      {isCurrent && (
                        <View style={dynamicStyles.check}>
                          <FontAwesome 
                            name="check" 
                            size={themeConfig.iconSize} 
                            color="#FFFFFF" 
                          />
                        </View>
                      )}
                      {/* Show pencil icon when selected but not active */}
                      {isSelected && !isCurrent && (
                        <View style={dynamicStyles.editIconContainer}>
                          <FontAwesome 
                            name="pencil" 
                            size={themeConfig.iconSize} 
                            color="#FFFFFF" 
                          />
                        </View>
                      )}
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
        
        {/* Buttons - Fixed at bottom */}
        <View style={dynamicStyles.buttonContainer}>
          {isInitialSelection ? (
            <>
              {onGoBack && (
                <Button onPress={onGoBack} status="basic">
                  go_back
                </Button>
              )}
              <Button onPress={confirm} status={confirmStatus}>
                continue
              </Button>
            </>
          ) : (
            <Button onPress={confirm} status={confirmStatus}>
              confirm
            </Button>
          )}
        </View>
      </ImageBackground>
    </Screen>
  )
}

const getCheckStatus = ({
  isSelected,
  isCurrent,
  changed,
  isInitialSelection,
}: {
  isSelected: boolean
  isCurrent: boolean
  changed: boolean
  isInitialSelection: boolean
}): {
  showCheck: boolean
  checkStatus: PaletteStatus
} => {
  // When making selection for the first time, indicate selection with primary (green) status
  if (isInitialSelection) {
    return {
      showCheck: isSelected,
      checkStatus: 'primary',
    }
  }

  // When editing, show current as basic and selected as secondary, to indicate unsaved changes
  return {
    showCheck: isSelected || (isCurrent && !isSelected),
    checkStatus: isSelected ? (changed ? 'secondary' : 'primary') : 'basic',
  }
}

