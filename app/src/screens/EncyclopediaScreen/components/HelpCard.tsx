import React from 'react'
import { Image, StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { Text } from '../../../components/Text'
import { getAsset } from '../../../services/asset'
import { useSelector } from 'react-redux'
import { currentAvatarSelector } from '../../../redux/selectors'
import { useColor } from '../../../hooks/useColor'

export const HelpCard = ({ ...props }: TouchableOpacityProps) => {
  const selectedAvatar = useSelector(currentAvatarSelector)
  const { palette } = useColor()

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
})
