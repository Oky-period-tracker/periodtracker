import * as React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { Screen } from '../../components/Screen'
import { currentAvatarSelector } from '../../redux/selectors/appSelectors'
import { useSelector } from '../../redux/useSelector'
import { setAvatar } from '../../redux/actions'
import { analytics } from '../../services/firebase'
import { useDispatch } from 'react-redux'
import { Text } from '../../components/Text'
import { PaletteStatus, useColor } from '../../hooks/useColor'
import { avatarNames } from '../../resources/translations'
import { globalStyles } from '../../config/theme'
import { getAsset } from '../../services/asset'
import { CheckButton } from '../../components/CheckButton'
import { Button } from '../../components/Button'

/**
 * Screen to select avatar
 * Accessible from the Profile page
 */
const AvatarSelectScreen: ScreenComponent<'AvatarSelect'> = () => {
  return <AvatarSelect />
}

interface AvatarSelectProps {
  onConfirm?: () => void
}

export const AvatarSelect = ({ onConfirm }: AvatarSelectProps) => {
  const currentAvatar = useSelector(currentAvatarSelector)
  const [selectedAvatar, setSelectedAvatar] = React.useState(currentAvatar)
  const dispatch = useDispatch()
  const { backgroundColor, palette } = useColor()

  const themeChanged = currentAvatar !== selectedAvatar
  const isInitialSelection = !!onConfirm
  const confirmStatus = themeChanged || isInitialSelection ? 'primary' : 'basic'

  const confirm = () => {
    dispatch(setAvatar(selectedAvatar))

    if (selectedAvatar !== currentAvatar) {
      analytics?.().logEvent('avatarChanged', {
        selectedAvatar,
      })
    }

    onConfirm?.()
  }

  return (
    <Screen>
      {/* List of themes */}
      <View style={styles.avatars}>
        {avatarNames.map((avatar) => {
          const { showCheck, checkStatus } = getCheckStatus({
            isSelected: avatar === selectedAvatar,
            isCurrent: avatar === currentAvatar,
            changed: themeChanged,
            isInitialSelection,
          })

          const onPress = () => {
            setSelectedAvatar(avatar)
          }

          return (
            <TouchableOpacity
              key={avatar}
              onPress={onPress}
              style={[styles.avatar, globalStyles.shadow]}
            >
              <View
                style={[
                  styles.avatarBody,
                  { backgroundColor, borderColor: backgroundColor },
                  globalStyles.elevation,
                ]}
              >
                <Image source={getAsset(`avatars.${avatar}.theme`)} style={styles.avatarImage} />
                <Text style={[styles.name, { color: palette.secondary.text }]}>{avatar}</Text>
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

export default AvatarSelectScreen

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

const styles = StyleSheet.create({
  screen: {
    maxWidth: 800,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  avatars: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    margin: 4,
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
  avatarBody: {
    borderWidth: 4,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    borderRadius: 20,
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
  avatarImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    aspectRatio: 1,
    resizeMode: 'contain',
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
