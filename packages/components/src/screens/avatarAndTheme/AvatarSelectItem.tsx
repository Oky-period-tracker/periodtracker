import React from 'react'
import { Image, View } from 'react-native'
import { getAsset } from '../../services/asset'
import { AvatarName } from '@oky/core'
import { assets } from '../../assets'

export function AvatarSelectItem({
  avatarName,
  type = 'theme',
}: {
  avatarName: AvatarName
  type?: keyof typeof assets.avatars[AvatarName]
}) {
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
        style={{
          width: '100%',
          height: '100%',
          alignSelf: 'center',
          aspectRatio: 1,
          resizeMode: 'contain',
        }}
        source={getAsset(`avatars.${avatarName}.${type}`)}
      />
    </View>
  )
}
