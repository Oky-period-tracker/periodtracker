import * as React from 'react'
import { Image, ImageBackground, ScrollView, TouchableOpacity, View } from 'react-native'
import { Screen } from '../../components/Screen'
import { Button } from '../../components/Button'
import { avatarNames } from '../../resources/translations'
import { getAsset } from '../../services/asset'
import { useSelector } from '../../redux/useSelector'
import { currentAvatarSelector, currentUserSelector } from '../../redux/selectors'
import { useDispatch } from 'react-redux'
import { setAvatarWithValidation } from '../../redux/actions'
import { Text } from '../../components/Text'
import { analytics } from '../../services/firebase'
import { AvatarLock } from '../../components/AvatarLock'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { assets } from '../../resources/assets'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useResponsive } from '../../contexts/ResponsiveContext'
import { createAvatarScreenStyles, getAvatarStyle, getAvatarBodyStyle, getFriendWhiteContainerStyle, getFriendAvatarContainerStyle, getAvatarPreviewStyle, getCheckIconStyle } from './AvatarScreen.styles'
import { currentThemeSelector } from '../../redux/selectors'
import { useTodayPrediction } from '../../contexts/PredictionProvider'
import { useAuth } from '../../contexts/AuthContext'
import { getStandardAvatarSvg } from '../../resources/assets/friendAssets'
import { AvatarPreview } from '../../components/AvatarPreview'
import { useAvatar } from '../../hooks/useAvatar'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { useAccessibilityLabel } from '../../hooks/useAccessibilityLabel'
import { useTranslate } from '../../hooks/useTranslate'
import { calculateOptimalItemWidth, getResponsiveMargin } from '../../utils/layoutCalculations'
import { scaleHorizontal, scaleDimension, scaleOriginal } from '../../utils/responsive'

const AvatarScreen: ScreenComponent<'Avatar'> = ({ navigation }) => {
  return <AvatarSelect navigation={navigation} />
}

export default AvatarScreen

interface AvatarSelectProps {
  onConfirm?: () => void
  onGoBack?: () => void
  navigation?: any
}

export const AvatarSelect = ({ onConfirm, onGoBack, navigation }: AvatarSelectProps) => {
  const currentAvatar = useSelector(currentAvatarSelector)
  const currentUser = useSelector(currentUserSelector)
  const dispatch = useDispatch()
  const { UIConfig, width, height, widthBreakpoint, size } = useResponsive()
  const theme = useSelector(currentThemeSelector)
  const { onPeriod } = useTodayPrediction()
  const { isLoggedIn } = useAuth()
  const avatarData = useAvatar()
  const insets = useSafeAreaInsets()
  const getAccessibilityLabel = useAccessibilityLabel()
  const translate = useTranslate()


  const isInitialSelection = !!onConfirm
  const [selectedAvatar, setSelectedAvatar] = React.useState(() => {
    const isFriendLocked = currentUser?.avatar?.customAvatarUnlocked !== true && (currentUser?.cyclesNumber || 0) < 3
    if (isInitialSelection && isFriendLocked && currentAvatar === 'friend') {
      return avatarNames.find(avatar => avatar !== 'friend') || avatarNames[0]
    }
    return currentAvatar || avatarNames[0]
  })
  
  const avatarConfig = UIConfig.avatarSelection
  
  const isFriendLocked = currentUser?.avatar?.customAvatarUnlocked !== true && (currentUser?.cyclesNumber || 0) < 3
  const isFriendUnlocked = !isFriendLocked && 
    currentUser?.avatar && 
    currentUser.avatar.customAvatarUnlocked === true
  
  const isFriendCustomized = React.useMemo(() => {
    if (!isFriendUnlocked || !currentUser?.avatar) return false
    
    const avatar = currentUser.avatar
    const hasBody = avatar.body !== null && avatar.body !== undefined
    const hasHair = avatar.hair !== null && avatar.hair !== undefined
    const hasEyes = avatar.eyes !== null && avatar.eyes !== undefined
    const hasSkinColor = avatar.skinColor !== null && avatar.skinColor !== undefined
    const hasHairColor = avatar.hairColor !== null && avatar.hairColor !== undefined
    const hasEyeColor = avatar.eyeColor !== null && avatar.eyeColor !== undefined
    const hasClothing = avatar.clothing !== null && avatar.clothing !== undefined
    const hasDevices = avatar.devices !== null && avatar.devices !== undefined
    
    return hasBody || hasHair || hasEyes || hasSkinColor || hasHairColor || hasEyeColor || hasClothing || hasDevices
  }, [isFriendUnlocked, currentUser?.avatar])
  
  const isFriendCreated = isFriendUnlocked && isFriendCustomized
  const backgroundImage = React.useMemo(() => {
    try {
      if (onPeriod && isLoggedIn) {
        const img = getAsset(`backgrounds.${theme}.onPeriod`)
        return img
      }
      const img = getAsset(`backgrounds.${theme}.default`)
      return img
    } catch (error) {
      return null
    }
  }, [theme, onPeriod, isLoggedIn])
  
  const reminderMessage = React.useMemo(() => {
    if (isFriendLocked) {
      return 'select_avatar_reminder_locked'
    } else if (isFriendCreated) {
      return 'select_avatar_reminder_unlocked_created'
    } else {
      return 'select_avatar_reminder_unlocked_not_created'
    }
  }, [isFriendLocked, isFriendCreated])
  
  const reminderIcon = React.useMemo(() => {
    return isFriendLocked ? 'icons.locked' : 'icons.unlocked'
  }, [isFriendLocked])
  const avatarWidth = React.useMemo(() => {
    const avatarsContainerWidthPercent = width * (avatarConfig.avatarsContainerWidthPercent / 100)
    const avatarsContainerWidth = Math.min(avatarsContainerWidthPercent, 1200)
    const itemsPerRow = 3

    const marginHorizontal = width > 720
      ? 12
      : getResponsiveMargin(width, {
          xs: 3,
          sm: 3,
          md: 3,
          lg: avatarConfig.avatarMarginHorizontal || 4,
          xl: 2,
        })

    const getConstraints = () => {
      if (width <= 360) {
        return {
          minWidth: 70,
          maxWidth: 100,
          safetyBuffer: 8,
          containerWidthMultiplier: 1.0,
        }
      } else if (width > 360 && width <= 392) {
        return {
          minWidth: 85,
          maxWidth: 105,
          safetyBuffer: 9,
          containerWidthMultiplier: 0.95,
        }
      } else if (width > 392 && width <= 411) {
        return {
          minWidth: 90,
          maxWidth: 108,
          safetyBuffer: 9,
          containerWidthMultiplier: 0.92,
        }
      } else if (width > 411 && width <= 480) {
        return {
          minWidth: 95,
          maxWidth: 110,
          safetyBuffer: 10,
          containerWidthMultiplier: 0.90,
        }
      } else if (width > 480 && width <= 600) {
        return {
          minWidth: undefined,
          maxWidth: 120,
          safetyBuffer: 20,
          containerWidthMultiplier: 1.0,
        }
      } else if (width > 600 && width <= 720) {
        return {
          minWidth: undefined,
          maxWidth: 180,
          safetyBuffer: 50,
          containerWidthMultiplier: 0.75,
        }
      } else {
        return {
          minWidth: undefined,
          maxWidth: 200,
          safetyBuffer: 40,
          containerWidthMultiplier: 0.70,
        }
      }
    }

    const constraints = getConstraints()
    const effectiveContainerWidth = avatarsContainerWidth * constraints.containerWidthMultiplier

    return calculateOptimalItemWidth(effectiveContainerWidth, itemsPerRow, {
      marginHorizontal,
      safetyBuffer: constraints.safetyBuffer,
      minWidth: constraints.minWidth,
      maxWidth: constraints.maxWidth,
      scaleMargins: true,
      scaleBuffer: true,
    })
  }, [avatarConfig, width])
  
  const reminderMaxWidth = React.useMemo(() => {
    const contentContainerWidthPercent = width * (avatarConfig.contentContainerWidthPercent / 100)
    const contentContainerWidth = Math.min(contentContainerWidthPercent, 1200)
    const titleBoxWidth = contentContainerWidth * 0.8
    return Math.floor(titleBoxWidth)
  }, [width, avatarConfig])
  
  const scaledMarginHorizontal = scaleOriginal(avatarConfig.avatarMarginHorizontal || 4)
  const effectiveAvatarsContainerWidthPercent = avatarConfig.avatarsContainerWidthPercent
  const effectiveContentContainerWidthPercent = avatarConfig.contentContainerWidthPercent
  
  const effectiveAvatarConfig = {
    ...avatarConfig,
    avatarsContainerWidthPercent: effectiveAvatarsContainerWidthPercent,
    contentContainerWidthPercent: effectiveContentContainerWidthPercent,
    avatarMarginHorizontal: scaledMarginHorizontal,
  }
  

  const dynamicStyles = React.useMemo(
    () => createAvatarScreenStyles(effectiveAvatarConfig, avatarWidth, !!onGoBack, isInitialSelection, reminderMaxWidth, width, true),
    [effectiveAvatarConfig, avatarWidth, onGoBack, isInitialSelection, reminderMaxWidth, width],
  )
  
  const returningFromCustomAvatarRef = React.useRef(false)
  
  useFocusEffect(
    React.useCallback(() => {
      if (returningFromCustomAvatarRef.current) {
        if (isFriendCustomized) {
          setSelectedAvatar('friend')
        }
        returningFromCustomAvatarRef.current = false
      }
    }, [isFriendCustomized])
  )

  const confirm = () => {
    const action = setAvatarWithValidation(
      selectedAvatar, 
      currentUser?.cyclesNumber || 0,
      currentUser?.avatar?.customAvatarUnlocked === true
    )
    if (action) {
      dispatch(action)

      if (selectedAvatar !== currentAvatar) {
        analytics?.().logEvent('avatarChanged', {
          selectedAvatar,
        })
      }

      onConfirm?.()
    }
  }

  const avatarChanged = currentAvatar !== selectedAvatar

  const confirmStatus = avatarChanged || isInitialSelection ? 'primary' : 'basic'

  return (
    <View style={dynamicStyles.screen}>
      <ImageBackground
        source={backgroundImage || undefined}
        style={dynamicStyles.backgroundImage}
        resizeMode="cover"
        imageStyle={dynamicStyles.backgroundImageStyle}
      >
        <ScrollView 
          style={dynamicStyles.scrollView}
          contentContainerStyle={dynamicStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Message Container */}
          <View style={dynamicStyles.topMessageContainer}>
            {/* Title Section with Logo */}
            <View style={dynamicStyles.titleContainer}>
            <View style={dynamicStyles.titleSpacer}>
              <Image 
                source={assets.static.launch_icon} 
                style={dynamicStyles.logo} 
                resizeMode="contain" 
              />
            </View>
            <View style={dynamicStyles.titleBox}>
              <Text style={[dynamicStyles.title, { color: '#000000' }]}>
                {isInitialSelection 
                  ? 'select_avatar_title' 
                  : (isFriendUnlocked ? 'select_avatar_title_unlocked' : 'select_avatar_title')}
              </Text>
              <Text style={[dynamicStyles.subtitle, { color: '#000000' }]}>
                {isInitialSelection 
                  ? 'select_avatar_subtitle' 
                  : (isFriendUnlocked ? 'select_avatar_subtitle_unlocked' : 'select_avatar_subtitle')}
              </Text>
            </View>
          </View>
          </View>

          {/* Avatars Container */}
          <View style={dynamicStyles.avatarsContainer}>
            <View style={dynamicStyles.avatars}>
            {avatarNames.map((avatar, index) => {
              const isFriendAvatar = avatar === 'friend'
              const isFriendAvatarLocked = isFriendAvatar && isFriendLocked
              const isFriendAvatarUnlocked = isFriendAvatar && isFriendCreated
              
              const isSelected = avatar === selectedAvatar && !(isFriendAvatarLocked && isInitialSelection)
              const isCurrent = avatar === currentAvatar && !(isFriendAvatarLocked && isInitialSelection)

              const onPress = () => {
                if (isFriendAvatarLocked) {
                  return
                }
                
                if (isFriendAvatar && navigation) {
                  returningFromCustomAvatarRef.current = true
                  navigation.navigate('CustomAvatar')
                  return
                }
                
                setSelectedAvatar(avatar)
              }

              const translatedAvatarName = translate(avatar) || avatar
              const avatarLabel = isFriendAvatarLocked 
                ? `${translatedAvatarName} locked`
                : isFriendAvatar && navigation
                ? `${translatedAvatarName}, tap to customize`
                : `${translatedAvatarName}, ${isSelected ? 'selected' : 'tap to select'}`
              
              return (
                <TouchableOpacity
                  key={avatar}
                  onPress={onPress}
                  style={[
                    dynamicStyles.avatar,
                    getAvatarStyle(avatarWidth, width),
                  ]}
                  accessibilityLabel={getAccessibilityLabel('select_avatar_button') + `: ${avatarLabel}`}
                  accessibilityRole="button"
                >
                  <View
                    style={[
                      dynamicStyles.avatarBody,
                      getAvatarBodyStyle(),
                    ]}
                  >
                    {isFriendAvatar ? (
                      (() => {
                        let FriendSvg
                        if (isFriendAvatarLocked) {
                          FriendSvg = getStandardAvatarSvg('friend-locked')
                        } else if (isFriendAvatarUnlocked) {
                          FriendSvg = getStandardAvatarSvg('friend')
                        } else {
                          FriendSvg = getStandardAvatarSvg('friend-unlocked-not-customized')
                        }
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
                        
                        return FriendSvg ? (
                          <View style={dynamicStyles.imageWrapper}>
                                <View 
                                  style={[
                                    (isSelected || isCurrent) 
                                      ? [dynamicStyles.avatarWhiteContainer, { borderColor: friendBorderColor }]
                                      : dynamicStyles.avatarWhiteContainerDefault,
                                    getFriendWhiteContainerStyle(friendWhiteContainerWidth, friendWhiteContainerHeight),
                                  ]}
                                />
                                {/* Friend avatar container - positioned on top, centered */}
                                <View style={[dynamicStyles.friendAvatarContainer, getFriendAvatarContainerStyle()]}>
                                  {React.createElement(FriendSvg, {
                                    width: friendImageWidth,
                                    height: friendImageHeight,
                                  })}
                                  {/* Only show custom avatar preview if unlocked, customized, and avatarData exists */}
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
                                        style={[
                                          dynamicStyles.avatarPreview,
                                          getAvatarPreviewStyle(friendImageHeight),
                                        ]}
                                      />
                                    </View>
                                  )}
                                </View>
                                {/* Show checkmark icon when avatar is active (current) and still selected - green */}
                                {isCurrent && isSelected && (
                                  <View style={[
                                    dynamicStyles.check,
                                    getCheckIconStyle(friendBorderWidth, avatarConfig.iconSize, friendIconOffset),
                                  ]}>
                                    <FontAwesome name="check" size={avatarConfig.iconSize} color="#FFFFFF" />
                                  </View>
                                )}
                                {/* Show checkmark icon when was current but now something else is selected - gray */}
                                {isCurrent && !isSelected && (
                                  <View style={[
                                    dynamicStyles.grayIconContainer,
                                    getCheckIconStyle(friendBorderWidth, avatarConfig.iconSize, friendIconOffset),
                                  ]}>
                                    <FontAwesome name="check" size={avatarConfig.iconSize} color="#FFFFFF" />
                                  </View>
                                )}
                                {/* Show checkmark icon when selected but not active - orange */}
                                {isSelected && !isCurrent && (
                                  <View style={[
                                    dynamicStyles.pendingIconContainer,
                                    getCheckIconStyle(friendBorderWidth, avatarConfig.iconSize, friendIconOffset),
                                  ]}>
                                    <FontAwesome name="check" size={avatarConfig.iconSize} color="#FFFFFF" />
                                  </View>
                                )}
                              </View>
                            ) : null
                          })()
                    ) : (() => {
                      const StandardAvatarSvg = getStandardAvatarSvg(avatar)
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
                      
                      if (StandardAvatarSvg) {
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
                      
                      return null
                    })()}
                    <Text style={[dynamicStyles.name, { color: '#000000' }]}>
                      {isFriendAvatar && currentUser?.avatar?.name ? currentUser.avatar.name : avatar}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
            {/* Add empty placeholder spots to fill last row to 3 items */}
            {(() => {
              const columns = 3
              const totalAvatars = avatarNames.length
              const remainder = totalAvatars % columns
              const emptySpotsNeeded = remainder > 0 ? columns - remainder : 0
              
              return Array.from({ length: emptySpotsNeeded }, (_, index) => (
                <View
                  key={`empty-${index}`}
                  style={[
                    dynamicStyles.avatar,
                    {
                      width: avatarWidth,
                      opacity: 0,
                      pointerEvents: 'none',
                    },
                  ]}
                />
              ))
            })()}
            </View>
          </View>

          {/* Reminder Container */}
          <View style={dynamicStyles.reminderContainer}>
            <View style={dynamicStyles.reminderInnerContainer}>
              <View style={dynamicStyles.reminderSpacer} />
              <View style={dynamicStyles.reminderBox}>
              <View style={dynamicStyles.reminderIconContainer}>
                <Image 
                  source={getAsset(reminderIcon)} 
                  style={dynamicStyles.reminderIcon} 
                  resizeMode="contain"
                />
              </View>
              <Text style={[dynamicStyles.reminderText, { color: '#000000' }]}>
                {reminderMessage}
              </Text>
            </View>
            </View>
          </View>
        </ScrollView>
        
        {/* Buttons - Fixed at bottom */}
        <View style={[dynamicStyles.buttonContainer, isInitialSelection && { paddingBottom: avatarConfig.buttonPaddingBottom + insets.bottom }]}>
          {isInitialSelection ? (
            <Button 
              onPress={confirm} 
              status={confirmStatus}
              accessibilityLabel={getAccessibilityLabel('continue')}
            >
              continue
            </Button>
          ) : (
            <Button 
              onPress={confirm} 
              status={confirmStatus}
              accessibilityLabel={getAccessibilityLabel('confirm')}
            >
              confirm
            </Button>
          )}
        </View>
      </ImageBackground>
    </View>
  )
}


