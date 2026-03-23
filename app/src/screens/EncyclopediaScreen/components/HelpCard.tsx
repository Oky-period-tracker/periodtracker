import React from 'react'
import { Image, StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { Text } from '../../../components/Text'
import { getAsset } from '../../../services/asset'
import { useSelector } from 'react-redux'
import { currentAvatarSelector } from '../../../redux/selectors'
import { useColor } from '../../../hooks/useColor'
import { useAvatar } from '../../../hooks/useAvatar'
import { AvatarPreview } from '../../../components/AvatarPreview'
import { assets } from '../../../resources/assets'

export const HelpCard = ({ ...props }: TouchableOpacityProps) => {
  const selectedAvatar = useSelector(currentAvatarSelector)
  const { palette } = useColor()
  const avatarPreviewData = useAvatar()

  const isFriendAvatar = selectedAvatar === 'friend'
  const isCustomAvatar = isFriendAvatar && avatarPreviewData !== null

  if (isCustomAvatar) {
    return (
      <TouchableOpacity style={styles.helpCard} {...props}>
        <View style={styles.customAvatarContainer}>
          <View style={styles.cloudsWrapper}>
            <Image
              source={assets.static.clouds}
              style={styles.cloudsBackground}
              resizeMode="contain"
            />
          </View>
          <View style={styles.avatarWrapper}>
            <AvatarPreview
              bodyType={avatarPreviewData.bodyType}
              skinColor={avatarPreviewData.skinColor}
              hairStyle={avatarPreviewData.hairStyle}
              hairColor={avatarPreviewData.hairColor}
              eyeShape={avatarPreviewData.eyeShape}
              eyeColor={avatarPreviewData.eyeColor}
              smile={avatarPreviewData.smile}
              clothing={avatarPreviewData.clothing}
              devices={avatarPreviewData.devices}
              width={60}
              height={80}
            />
          </View>
          <Text style={[styles.customText, { color: palette.secondary.text }]}>find help</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity style={styles.helpCard} {...props}>
      <Image
        resizeMode="contain"
        source={getAsset(`avatars.${selectedAvatar}.stationary_colour`)}
        style={styles.image}
      />
      <Text style={[styles.text, { color: palette.secondary.text }]}>find help</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  helpCard: {
    zIndex: 9999,
    position: 'absolute',
    bottom: 12,
    right: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20,
    position: 'absolute',
    textAlign: 'center',
    bottom: 12,
  },
  image: {
    height: 140,
  },
  customAvatarContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 120,
    height: 140,
  },
  cloudsWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cloudsBackground: {
    width: '100%',
    maxHeight: '100%',
  },
  avatarWrapper: {
    zIndex: 1,
    marginBottom: 24,
  },
  customText: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
  },
})
