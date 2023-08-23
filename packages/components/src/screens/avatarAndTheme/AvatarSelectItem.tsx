import React from 'react'
import { Image, View } from 'react-native'
import { assets } from '../../assets/index'

export function AvatarSelectItem({ avatarName, type = 'theme' }) {
  return (
    <View
      style={{
        width: '90%',
        aspectRatio: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <Image
        source={assets.avatars[avatarName][type]}
        resizeMode="contain"
        style={{ width: '70%', alignSelf: 'center', aspectRatio: 1 }}
      />
    </View>
  )
}
