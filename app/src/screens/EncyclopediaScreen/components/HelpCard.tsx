import React from 'react'
import { Image, StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { Text } from '../../../components/Text'
import { getAsset } from '../../../services/asset'
import { useSelector } from 'react-redux'
import { currentAvatarSelector } from '../../../redux/selectors'
import { useColor } from '../../../hooks/useColor'

export const HelpCard = ({ ...props }: TouchableOpacityProps) => {
  const selectedAvatar = useSelector(currentAvatarSelector)
  const { palette, helpCardBackgroundColor } = useColor()

  return (
    <TouchableOpacity style={styles.helpCard} {...props}>
      <Image
        resizeMode="contain"
        source={getAsset(`avatars.${selectedAvatar}.stationary_colour`)}
        style={styles.image}
      />
      <View style={[styles.textContainer, { backgroundColor: helpCardBackgroundColor }]}>
        <Text style={[styles.text, { color: palette.secondary.text }]}>find help</Text>
      </View>
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
  textContainer: {
    borderRadius: 12,
    width: 100,
    marginTop: -40,
    padding: 4,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  image: {
    width: 140,
  },
})
