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
        aspectRatio: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <Image
        source={getAsset(`avatars.${avatarName}.${type}`)}
        resizeMode="contain"
        style={{ width: '70%', alignSelf: 'center', aspectRatio: 1 }}
      />
    </View>
  )
}
