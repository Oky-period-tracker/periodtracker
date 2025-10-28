import * as React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Screen } from '../../components/Screen'
import { Button } from '../../components/Button'
import { avatarNames } from '../../resources/translations'
import { getAsset } from '../../services/asset'
import { CheckButton } from '../../components/CheckButton'
import { useSelector } from '../../redux/useSelector'
import { currentAvatarSelector } from '../../redux/selectors'
import { useDispatch } from 'react-redux'
import { setAvatar } from '../../redux/actions'
import { globalStyles } from '../../config/theme'
import { Text } from '../../components/Text'
import { analytics } from '../../services/firebase'
import { PaletteStatus, useColor } from '../../hooks/useColor'

const AvatarScreen = () => {
  return <AvatarSelect />
}

export default AvatarScreen

interface AvatarSelectProps {
  onConfirm?: () => void
}

export const AvatarSelect = ({ onConfirm }: AvatarSelectProps) => {
  const currentAvatar = useSelector(currentAvatarSelector)
  const dispatch = useDispatch()
  const { backgroundColor, palette } = useColor()

  const [selectedAvatar, setSelectedAvatar] = React.useState(currentAvatar)

  const confirm = () => {
    dispatch(setAvatar(selectedAvatar))

    if (selectedAvatar !== currentAvatar) {
      analytics?.().logEvent('avatarChanged', {
        selectedAvatar,
      })
    }

    onConfirm?.()
  }

  const avatarChanged = currentAvatar !== selectedAvatar
  const hasChanged = avatarChanged

  const isInitialSelection = !!onConfirm
  const confirmStatus = hasChanged || isInitialSelection ? 'primary' : 'basic'

  return (
    <Screen style={styles.screen}>
      {isInitialSelection && (
        <Text style={[styles.title, { color: palette.secondary.text }]}>
          select_avatar
        </Text>
      )}
      <View style={styles.avatars}>
        {avatarNames.map((avatar) => {
          const { showCheck, checkStatus } = getCheckStatus({
            isSelected: avatar === selectedAvatar,
            isCurrent: avatar === currentAvatar,
            changed: avatarChanged,
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
  avatarBody: {
    borderWidth: 4,
    overflow: 'hidden',
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
  name: {
    position: 'absolute',
    top: 2,
    left: 0,
    width: '100%',
    fontWeight: 'bold',
    textAlign: 'center',
  },
})
