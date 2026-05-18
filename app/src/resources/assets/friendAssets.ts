// Public stub for the custom avatar feature. The full implementation with
// branded avatars lives in the private periodtracker_resources-global repo.
// In the public baseline every lookup returns null except for the two
// avatars the whitelabel ships (panda, unicorn).

import { Image, ImageSourcePropType } from 'react-native'
import React from 'react'

export type BodySize = 'small' | 'medium' | 'large'

const publicStandardAvatars: Record<string, ImageSourcePropType> = {
  panda: require('./images/static/panda.png'),
  unicorn: require('./images/static/unicorn.png'),
}

export const getStandardAvatarSvg = (
  avatarName: string,
): React.ComponentType<any> | null => {
  const source = publicStandardAvatars[avatarName]
  if (!source) return null
  return ({ width, height }: { width?: number | string; height?: number | string }) =>
    React.createElement(Image, {
      source,
      style: { width, height },
      resizeMode: 'contain',
    })
}

export const getThemeSvg = (_themeName: string): React.ComponentType<any> | null => null
export const getThemeImage = (_themeName: string): ImageSourcePropType | null => null
export const getSelectionAsset = (
  _category: string,
  _item: string,
  _variant?: string,
): ImageSourcePropType | null => null
export const getPreviewAsset = (
  _category: string,
  _item: string | null | undefined,
  _variant?: string,
): ImageSourcePropType | null => null
export const getFriendAsset = (_key: string): ImageSourcePropType | null => null
export const getCategoryIcon = (
  _category: 'body' | 'hair' | 'eyes' | 'clothing' | 'devices',
): ImageSourcePropType | null => null

export default {}
