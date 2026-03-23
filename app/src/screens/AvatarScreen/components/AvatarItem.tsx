import * as React from 'react'
import { View, TouchableOpacity } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Text } from '../../../components/Text'
import { getStandardAvatarSvg } from '../../../resources/assets/friendAssets'
import { AvatarPreview } from '../../../components/AvatarPreview'
import { getCheckIconStyle, getFriendWhiteContainerStyle, getFriendAvatarContainerStyle, getAvatarPreviewStyle, getAvatarStyle, getAvatarBodyStyle } from '../AvatarScreen.styles'
import type { AvatarName } from '../../../resources/translations'

interface AvatarItemProps {
  avatar: AvatarName
  isSelected: boolean
  isCurrent: boolean
  isFriendAvatar: boolean
  isFriendAvatarLocked: boolean
  isFriendCustomized: boolean
  avatarData: any
  avatarWidth: number
  width: number
  avatarConfig: any
  dynamicStyles: any
  onPress: () => void
  avatarLabel: string
  getAccessibilityLabel: (key: string) => string
  currentUser: any
}

export const AvatarItem: React.FC<AvatarItemProps> = ({
  avatar,
  isSelected,
  isCurrent,
  isFriendAvatar,
  isFriendAvatarLocked,
  isFriendCustomized,
  avatarData,
  avatarWidth,
  width,
  avatarConfig,
  dynamicStyles,
  onPress,
  avatarLabel,
  getAccessibilityLabel,
  currentUser,
}) => {
  const renderFriendAvatar = () => {
    let FriendSvg
    if (isFriendAvatarLocked) {
      FriendSvg = getStandardAvatarSvg('friend-locked')
    } else if (isFriendCustomized) {
      FriendSvg = getStandardAvatarSvg('friend')
    } else {
      FriendSvg = getStandardAvatarSvg('friend-unlocked-not-customized')
    }

    if (!FriendSvg) return null

    const friendImageAspectRatio = 105 / 74
    const friendBorderWidth = (isSelected || isCurrent) ? 2 : 1
    const friendBorderPadding = Math.max(4, avatarConfig.iconSize * 0.4)
    const friendWhiteContainerWidth = avatarWidth
    const friendImageWidth = friendWhiteContainerWidth - (friendBorderWidth * 2) - friendBorderPadding
    const friendImageHeight = friendImageWidth / friendImageAspectRatio
    const friendWhiteContainerHeight = friendImageHeight + (friendBorderWidth * 2) + friendBorderPadding
    const friendIconOffset = width > 720
      ? avatarConfig.iconSize * 0.75
      : width > 600 && width <= 720
      ? avatarConfig.iconSize * 0.8 
      : avatarConfig.iconSize * 0.9
    const friendBorderColor = (isCurrent && isSelected) ? '#A4D233' : (isCurrent && !isSelected) ? '#D1D0D2' : (isSelected ? '#FF8C00' : '#EFEFEF')
    
    return (
      <View style={dynamicStyles.imageWrapper}>
        <View 
          style={[
            (isSelected || isCurrent) 
              ? [dynamicStyles.avatarWhiteContainer, { borderColor: friendBorderColor }]
              : dynamicStyles.avatarWhiteContainerDefault,
            getFriendWhiteContainerStyle(friendWhiteContainerWidth, friendWhiteContainerHeight),
          ]}
        />
        <View style={[dynamicStyles.friendAvatarContainer, getFriendAvatarContainerStyle()]}>
          {React.createElement(FriendSvg, {
            width: friendImageWidth,
            height: friendImageHeight,
          })}
          {!isFriendAvatarLocked && isFriendCustomized && avatarData && (
            <View style={dynamicStyles.avatarPreviewContainer}>
              <AvatarPreview
                bodyType={avatarData.bodyType}
                skinColor={avatarData.skinColor}
                hairStyle={avatarData.hairStyle}
                hairColor={avatarData.hairColor}
                eyeShape={avatarData.eyeShape}
                eyeColor={avatarData.eyeColor}
                smile={avatarData.smile}
                clothing={avatarData.clothing}
                devices={avatarData.devices}
                width={friendImageWidth * 1.4}
                height={friendImageHeight * 1.4}
                style={{
                  ...dynamicStyles.avatarPreview,
                  ...getAvatarPreviewStyle(friendImageHeight),
                }}
              />
            </View>
          )}
        </View>
        {isCurrent && isSelected && (
          <View style={[
            dynamicStyles.check,
            getCheckIconStyle(friendBorderWidth, avatarConfig.iconSize, friendIconOffset),
          ]}>
            <FontAwesome name="check" size={avatarConfig.iconSize} color="#FFFFFF" />
          </View>
        )}
        {isCurrent && !isSelected && (
          <View style={[
            dynamicStyles.grayIconContainer,
            getCheckIconStyle(friendBorderWidth, avatarConfig.iconSize, friendIconOffset),
          ]}>
            <FontAwesome name="check" size={avatarConfig.iconSize} color="#FFFFFF" />
          </View>
        )}
        {isSelected && !isCurrent && (
          <View style={[
            dynamicStyles.pendingIconContainer,
            getCheckIconStyle(friendBorderWidth, avatarConfig.iconSize, friendIconOffset),
          ]}>
            <FontAwesome name="check" size={avatarConfig.iconSize} color="#FFFFFF" />
          </View>
        )}
      </View>
    )
  }

  const renderStandardAvatar = () => {
    const StandardAvatarSvg = getStandardAvatarSvg(avatar)
    if (!StandardAvatarSvg) return null

    const imageAspectRatio = 105 / 74
    const borderWidth = (isSelected || isCurrent) ? 2 : 1
    const borderPadding = Math.max(4, avatarConfig.iconSize * 0.4)
    const whiteContainerWidth = avatarWidth
    const imageWidth = whiteContainerWidth - (borderWidth * 2) - borderPadding
    const imageHeight = imageWidth / imageAspectRatio
    const whiteContainerHeight = imageHeight + (borderWidth * 2) + borderPadding
    const iconOffset = width > 720
      ? avatarConfig.iconSize * 0.75
      : width > 600 && width <= 720
      ? avatarConfig.iconSize * 0.8 
      : avatarConfig.iconSize * 0.9
    const borderColor = (isCurrent && isSelected) ? '#A4D233' : (isCurrent && !isSelected) ? '#D1D0D2' : (isSelected ? '#FF8C00' : '#EFEFEF')
    
    return (
      <View style={dynamicStyles.imageWrapper}>
        <View 
          style={[
            (isSelected || isCurrent) 
              ? [dynamicStyles.avatarWhiteContainer, { borderColor }]
              : dynamicStyles.avatarWhiteContainerDefault,
            getFriendWhiteContainerStyle(whiteContainerWidth, whiteContainerHeight),
          ]}
        />
        <View style={[dynamicStyles.standardAvatarSvgContainer, getFriendAvatarContainerStyle()]}>
          {React.createElement(StandardAvatarSvg, {
            width: imageWidth,
            height: imageHeight,
          })}
        </View>
        {isCurrent && isSelected && (
          <View style={[
            dynamicStyles.check,
            getCheckIconStyle(borderWidth, avatarConfig.iconSize, iconOffset),
          ]}>
            <FontAwesome name="check" size={avatarConfig.iconSize} color="#FFFFFF" />
          </View>
        )}
        {isCurrent && !isSelected && (
          <View style={[
            dynamicStyles.grayIconContainer,
            getCheckIconStyle(borderWidth, avatarConfig.iconSize, iconOffset),
          ]}>
            <FontAwesome name="check" size={avatarConfig.iconSize} color="#FFFFFF" />
          </View>
        )}
        {isSelected && !isCurrent && (
          <View style={[
            dynamicStyles.pendingIconContainer,
            getCheckIconStyle(borderWidth, avatarConfig.iconSize, iconOffset),
          ]}>
            <FontAwesome name="check" size={avatarConfig.iconSize} color="#FFFFFF" />
          </View>
        )}
      </View>
    )
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        dynamicStyles.avatar,
        getAvatarStyle(avatarWidth, width),
      ]}
      accessibilityLabel={getAccessibilityLabel('select_avatar_button') + `: ${avatarLabel}`}
      accessibilityRole="button"
    >
      <View style={[dynamicStyles.avatarBody, getAvatarBodyStyle()]}>
        {isFriendAvatar ? renderFriendAvatar() : renderStandardAvatar()}
        <Text style={[dynamicStyles.name, { color: '#000000' }]}>
          {isFriendAvatar && currentUser?.avatar?.name ? currentUser.avatar.name : avatar}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

