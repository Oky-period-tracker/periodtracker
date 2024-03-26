import React from 'react'
import {
  TouchableOpacity,
  Image,
  ImageProps,
  TouchableOpacityProps,
  StyleSheet,
} from 'react-native'
import { assets } from '../../../assets'
import { IS_TABLET } from '../../../config/tablet'
import { hapticAndSoundFeedback } from '../../../services/tonefeedback'

type Props = Omit<ImageProps, 'source'> & {
  name: string
  onPress: () => void
  width?: number
  height?: number
  touchableStyle?: TouchableOpacityProps['style']
  disabled?: boolean
}

const defaultSize = IS_TABLET ? 32 : 20

export const IconButton = ({
  name,
  onPress,
  width = defaultSize,
  height = defaultSize,
  touchableStyle = null,
  disabled = false,
  ...props
}: Props) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.default, touchableStyle]}
      onPressIn={() => hapticAndSoundFeedback('close')}
      onPress={onPress}
    >
      <Image source={assets.static.icons[name]} style={{ width, height }} {...props} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  default: {
    zIndex: 999,
  },
})
