import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { assets } from '../../assets/index'
import { Text } from './Text'

export const LangIcon = ({
  lang,
  onPress,
  width = 30,
  height = 30,
  fontSize = 9,
  disabled = false,
  style = null,
  isActive = false,
  textVisible = true,
}) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={{ alignItems: 'center' }}>
      <Image
        source={assets.static.icons.locales[lang]}
        style={{ width, height, borderRadius: height / 2, opacity: isActive ? 1 : 0.3, ...style }}
      />
      {textVisible && (
        <Text
          style={{ position: 'absolute', bottom: -20, width: 50, fontSize, textAlign: 'center' }}
        >
          {lang}
        </Text>
      )}
    </TouchableOpacity>
  )
}
