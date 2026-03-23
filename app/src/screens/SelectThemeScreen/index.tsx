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
import { Text } from '../../components/Text'
import { analytics } from '../../services/firebase'
import { assets } from '../../resources/assets'
import { useResponsive } from '../../contexts/ResponsiveContext'
import { createSelectThemeScreenStyles } from './SelectThemeScreen.styles'
import { useTodayPrediction } from '../../contexts/PredictionProvider'
import { useAuth } from '../../contexts/AuthContext'
import { ScreenComponent } from '../../navigation/RootNavigator'

const SelectThemeScreen: ScreenComponent<'SelectTheme'> = ({ navigation }) => {
  return <SelectTheme navigation={navigation} />
}

export default SelectThemeScreen

interface SelectThemeProps {
  onConfirm?: () => void
  onGoBack?: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation?: any
}

export const SelectTheme = ({ onConfirm, onGoBack, navigation }: SelectThemeProps) => {
  const currentTheme = useSelector(currentThemeSelector)
  const dispatch = useDispatch()
  const { UIConfig, width } = useResponsive()
  const { onPeriod } = useTodayPrediction()
  const { isLoggedIn } = useAuth()

  const [selectedTheme, setSelectedTheme] = React.useState(currentTheme)

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

  const isInitialSelection = !!onConfirm
  const dynamicStyles = createSelectThemeScreenStyles(themeConfig, isInitialSelection, !!onGoBack)

  const confirm = () => {
    dispatch(setTheme(selectedTheme))

    if (selectedTheme !== currentTheme) {
      analytics?.().logEvent('themeChanged', {
        selectedTheme,
      })
    }

    onConfirm?.()
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
                          <Image
                            source={getAsset(`backgrounds.${theme}.svg`)}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                          />
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
