import * as React from 'react'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { Screen } from '../../components/Screen'
import { themeNames } from '../../resources/translations'
import { useDispatch, useSelector } from 'react-redux'
import { currentThemeSelector } from '../../redux/selectors'
import { TouchableOpacity, View, StyleSheet, Image } from 'react-native'
import { getAsset } from '../../services/asset'
import { Text } from '../../components/Text'
import { PaletteStatus, useColor } from '../../hooks/useColor'
import { globalStyles } from '../../config/theme'
import { CheckButton } from '../../components/CheckButton'
import { setTheme } from '../../redux/actions'
import { analytics } from '../../services/firebase'
import { Button } from '../../components/Button'

/**
 * Screen to select theme for background.
 * Accessible from the Profile page
 */
const ThemeSelectScreen: ScreenComponent<'ThemeSelect'> = () => {
  return <ThemeSelect />
}

interface ThemeSelectProps {
  onConfirm?: () => void
}

export const ThemeSelect = ({ onConfirm }: ThemeSelectProps) => {
  const currentTheme = useSelector(currentThemeSelector)
  const [selectedTheme, setSelectedTheme] = React.useState(currentTheme)
  const { backgroundColor, palette } = useColor()
  const dispatch = useDispatch()

  const themeChanged = currentTheme !== selectedTheme
  const isInitialSelection = !!onConfirm
  const confirmStatus = themeChanged || isInitialSelection ? 'primary' : 'basic'

  const confirm = () => {
    dispatch(setTheme(selectedTheme))

    if (selectedTheme !== currentTheme) {
      analytics?.().logEvent('themeChanged', {
        selectedTheme,
      })
    }

    onConfirm?.()
  }

  return (
    <Screen>
      {/* List of themes */}
      <View style={styles.themes}>
        {themeNames.map((theme) => {
          const { showCheck, checkStatus } = getCheckStatus({
            isSelected: theme === selectedTheme,
            isCurrent: theme === currentTheme,
            changed: themeChanged,
            isInitialSelection,
          })

          const onPress = () => {
            setSelectedTheme(theme)
          }

          return (
            <TouchableOpacity
              key={theme}
              onPress={onPress}
              style={[styles.theme, globalStyles.shadow]}
            >
              <View style={[styles.themeBody, globalStyles.elevation]}>
                <Image
                  source={getAsset(`backgrounds.${theme}.icon`)}
                  style={[styles.themeImage, { backgroundColor, borderColor: backgroundColor }]}
                />
                <Text style={[styles.name, { color: palette.secondary.text }]}>{theme}</Text>
                {showCheck && <CheckButton style={styles.check} status={checkStatus} />}
              </View>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Confirm button */}
      <Button onPress={confirm} status={confirmStatus}>
        confirm
      </Button>
    </Screen>
  )
}

export default ThemeSelectScreen

/**
 * Check status of a card
 */
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

/**
 * Page styles
 */
const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  themes: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexWrap: 'wrap',
  },
  theme: {
    minWidth: 100,
    maxWidth: 180,
    height: 100,
    flexBasis: '40%',
    margin: 8,
  },
  themeBody: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  themeImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    resizeMode: 'cover',
    borderWidth: 4,
    borderRadius: 20,
  },
  name: {
    position: 'absolute',
    top: 2,
    left: 0,
    width: '100%',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  check: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
})
