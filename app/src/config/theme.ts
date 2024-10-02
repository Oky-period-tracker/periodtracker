import { StyleSheet } from 'react-native'
import { AvatarName } from '../resources/translations'

export const globalStyles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  // Sometimes Android shadow has to be applied to a different component compared to iOS
  elevation: {
    elevation: 4,
  },
})

export const avatarException = 'oky' as AvatarName
