/* eslint-disable @typescript-eslint/no-var-requires */

import { StyleProp, ViewStyle } from 'react-native'
import { AvatarName } from '../resources/translations'

export type CustomAvatarStyles = {
  avatar?: StyleProp<ViewStyle>
  avatarMessage?: StyleProp<ViewStyle>
  progressSection?: StyleProp<ViewStyle>
}

let getCustomAvatarStyles: (params: {
  lottieHeight: number
}) => Partial<Record<AvatarName, CustomAvatarStyles>> | undefined

try {
  getCustomAvatarStyles = require('../resources/translations/themes').getCustomAvatarStyles
} catch (e) {
  //
}

export { getCustomAvatarStyles }
