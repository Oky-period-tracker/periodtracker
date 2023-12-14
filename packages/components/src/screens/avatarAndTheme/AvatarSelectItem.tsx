import React from 'react'
import { Image, View } from 'react-native'
import { assets } from '../../assets/index'

export function AvatarSelectItem({ avatarName, type = 'theme' }) {
  return (
    <View
      style={{
        width: '90%',
        height: '90%',
        margin: 4,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <Image
        source={assets.avatars[avatarName][type]}
        style={{
          width: '100%',
          height: '100%',
          alignSelf: 'center',
          aspectRatio: 1,
          resizeMode: 'contain',
        }}
      />
    </View>
  )
}
