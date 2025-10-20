import * as React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Screen } from '../../components/Screen'
import { Button } from '../../components/Button'
import { themeNames } from '../../resources/translations'
import { getAsset } from '../../services/asset'
import { CheckButton } from '../../components/CheckButton'
import { useSelector } from '../../redux/useSelector'
import { currentThemeSelector } from '../../redux/selectors'
import { useDispatch } from 'react-redux'
import { setTheme } from '../../redux/actions'
import { globalStyles } from '../../config/theme'
import { Text } from '../../components/Text'
import { analytics } from '../../services/firebase'
import { PaletteStatus, useColor } from '../../hooks/useColor'

const ThemeScreen = () => {
  return <ThemeSelect />
}

export default ThemeScreen

interface ThemeSelectProps {
  onConfirm?: () => void
}

export const ThemeSelect = ({ onConfirm }: ThemeSelectProps) => {
  const currentTheme = useSelector(currentThemeSelector)
  const dispatch = useDispatch()
  const { backgroundColor, palette } = useColor()

  const [selectedTheme, setSelectedTheme] = React.useState(currentTheme)

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
  const hasChanged = themeChanged

  const isInitialSelection = !!onConfirm
  const confirmStatus = hasChanged || isInitialSelection ? 'primary' : 'basic'

  return (
    <Screen style={styles.screen}>
      {isInitialSelection && (
        <Text style={[styles.title, { color: palette.secondary.text }]}>
          select_theme
        </Text>
      )}
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

      <Button onPress={confirm} status={confirmStatus}>
        confirm
      </Button>
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

const styles = StyleSheet.create({
  screen: {
    maxWidth: 800,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
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
    marginBottom: 24,
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
  check: {
    position: 'absolute',
    top: 8,
    left: 8,
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
})
