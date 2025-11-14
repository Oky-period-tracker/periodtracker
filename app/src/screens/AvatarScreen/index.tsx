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
import { globalStyles } from '../../config/theme'
import { Text } from '../../components/Text'
import { analytics } from '../../services/firebase'
import { PaletteStatus } from '../../hooks/useColor'
import { AvatarLock } from '../../components/AvatarLock'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { assets } from '../../resources/assets'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useResponsive } from '../../contexts/ResponsiveContext'
import { UIConfig } from '../../config/UIConfig'
import { createAvatarScreenStyles } from './AvatarScreen.styles'
import { currentThemeSelector } from '../../redux/selectors'
import { useTodayPrediction } from '../../contexts/PredictionProvider'
import { useAuth } from '../../contexts/AuthContext'
import { getStandardAvatarSvg } from '../../resources/assets/friendAssets'
import { AvatarPreview } from '../../components/AvatarPreview'
import { useAvatar } from '../../hooks/useAvatar'

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
  const { UIConfig, width, size } = useResponsive()
  const theme = useSelector(currentThemeSelector)
  const { onPeriod } = useTodayPrediction()
  const { isLoggedIn } = useAuth()
  const avatarData = useAvatar()

  const [selectedAvatar, setSelectedAvatar] = React.useState(currentAvatar)
  
  // Hide navigation header
  React.useLayoutEffect(() => {
    if (navigation) {
      navigation.setOptions({
        headerShown: false,
      })
    }
  }, [navigation])
  
  const avatarConfig = UIConfig.avatarSelection
  
  // Determine friend avatar state
  const isFriendLocked = (currentUser?.cyclesNumber || 0) < 3
  const isFriendCreated = !isFriendLocked && 
    currentUser?.avatar && 
    currentUser.avatar.customAvatarUnlocked === true
  
  // Get background image based on theme and period status
  const backgroundImage = React.useMemo(() => {
    try {
      if (onPeriod && isLoggedIn) {
        const img = getAsset(`backgrounds.${theme}.onPeriod`)
        return img
      }
      const img = getAsset(`backgrounds.${theme}.default`)
      return img
    } catch (error) {
      console.warn('Error loading background image:', error)
      return null
    }
  }, [theme, onPeriod, isLoggedIn])
  
  // Get reminder message based on friend avatar state
  const reminderMessage = React.useMemo(() => {
    if (isFriendLocked) {
      return 'select_avatar_reminder_locked'
    } else if (isFriendCreated) {
      return 'select_avatar_reminder_unlocked_created'
    } else {
      return 'select_avatar_reminder_unlocked_not_created'
    }
  }, [isFriendLocked, isFriendCreated])
  
  // Get reminder icon based on friend avatar state
  const reminderIcon = React.useMemo(() => {
    return isFriendLocked ? 'icons.locked' : 'icons.unlocked'
  }, [isFriendLocked])
  // Calculate width for 3 avatars per row - use screen width directly for immediate calculation
  const containerPadding = avatarConfig.screenPaddingHorizontal * 2
  const avatarsPadding = avatarConfig.itemsContainerPaddingHorizontal * 2
  const totalMarginSpace = avatarConfig.avatarMarginHorizontal * 3
  // Use screen width directly - it's available immediately, no need to wait for onLayout
  const availableWidth = width - containerPadding - avatarsPadding - totalMarginSpace
  // Calculate exact width per avatar (3 avatars per row)
  const avatarWidth = availableWidth > 0 ? availableWidth / 3 : 0
  
  // Debug logging
  React.useEffect(() => {
    if (__DEV__) {
      console.log(`[AvatarScreen] size: ${size}, width: ${width}, availableWidth: ${availableWidth.toFixed(2)}, avatarWidth: ${avatarWidth.toFixed(2)}, screenPadding: ${avatarConfig.screenPaddingHorizontal}, itemsPadding: ${avatarConfig.itemsContainerPaddingHorizontal}, marginHorizontal: ${avatarConfig.avatarMarginHorizontal}`)
    }
  }, [size, width, availableWidth, avatarWidth, avatarConfig])
  
  const isInitialSelection = !!onConfirm
  const dynamicStyles = createAvatarScreenStyles(avatarConfig, avatarWidth, !!onGoBack, isInitialSelection)
  
  // Double-tap detection for friend avatar
  const friendAvatarLastTap = React.useRef<number | null>(null)
  const friendAvatarTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  
  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (friendAvatarTimeoutRef.current) {
        clearTimeout(friendAvatarTimeoutRef.current)
      }
    }
  }, [])

  const confirm = () => {
    const action = setAvatarWithValidation(selectedAvatar, currentUser?.cyclesNumber || 0)
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
    <Screen style={dynamicStyles.screen}>
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
          {/* Title Section with Logo */}
          <View style={dynamicStyles.titleContainer}>
            <Image 
              source={assets.static.launch_icon} 
              style={dynamicStyles.logo} 
              resizeMode="contain" 
            />
            <View style={dynamicStyles.titleBox}>
              <Text style={[dynamicStyles.title, { color: '#000000' }]}>
                select_avatar_title
              </Text>
              <Text style={[dynamicStyles.subtitle, { color: '#000000' }]}>
                select_avatar_subtitle
              </Text>
            </View>
          </View>

          {/* Avatar Grid */}
          <View style={dynamicStyles.avatars}>
            {avatarNames.map((avatar) => {
              const isSelected = avatar === selectedAvatar
              const isCurrent = avatar === currentAvatar

              const isFriendAvatar = avatar === 'friend'
              const isFriendAvatarLocked = isFriendAvatar && isFriendLocked
              const isFriendAvatarUnlocked = isFriendAvatar && isFriendCreated

              const onPress = () => {
                // Don't allow selection if friend avatar is locked
                if (isFriendAvatarLocked) {
                  return
                }
                
                // Handle double-tap on friend avatar to navigate to customization
                if (isFriendAvatar && navigation) {
                  const now = Date.now()
                  const DOUBLE_TAP_DELAY = 300
                  
                  // Clear any existing timeout
                  if (friendAvatarTimeoutRef.current) {
                    clearTimeout(friendAvatarTimeoutRef.current)
                  }
                  
                  if (friendAvatarLastTap.current && (now - friendAvatarLastTap.current) < DOUBLE_TAP_DELAY) {
                    // Double tap detected
                    friendAvatarLastTap.current = null
                    if (friendAvatarTimeoutRef.current) {
                      clearTimeout(friendAvatarTimeoutRef.current)
                    }
                    navigation.navigate('CustomAvatar')
                    return
                  }
                  
                  // Single tap - update last tap time and set timeout to reset
                  friendAvatarLastTap.current = now
                  friendAvatarTimeoutRef.current = setTimeout(() => {
                    friendAvatarLastTap.current = null
                  }, DOUBLE_TAP_DELAY)
                }
                
                setSelectedAvatar(avatar)
              }

              return (
                <TouchableOpacity
                  key={avatar}
                  onPress={onPress}
                  style={[dynamicStyles.avatar, { width: avatarWidth }]}
                >
                  <View
                    style={[
                      dynamicStyles.avatarBody,
                      { backgroundColor: isFriendAvatar ? 'transparent' : 'transparent' },
                      isFriendAvatarLocked && dynamicStyles.lockedAvatar,
                    ]}
                  >
                    {isFriendAvatar ? (
                      <View style={dynamicStyles.imageWrapper}>
                        <View
                          style={dynamicStyles.friendAvatarImage}
                        >
                          {(() => {
                            const BlankSvg = getStandardAvatarSvg('friend')
                            return BlankSvg ? (
                              <View style={dynamicStyles.avatarOuterContainer}>
                                {(isSelected || isCurrent) && (
                                  <View style={dynamicStyles.avatarGreenBorder} />
                                )}
                                <View style={dynamicStyles.avatarInnerContainer}>
                                  <View style={dynamicStyles.friendAvatarContainer}>
                                    {React.createElement(BlankSvg, {
                                      width: '100%',
                                      height: '100%',
                                    })}
                                    {avatarData && (
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
                                          width={avatarConfig.avatarSize.width * 0.7}
                                          height={avatarConfig.avatarSize.height * 1.4}
                                          style={dynamicStyles.avatarPreview}
                                        />
                                      </View>
                                    )}
                                  </View>
                                </View>
                                {/* Show checkmark icon only when avatar is active (current) */}
                                {isCurrent && (
                                  <View style={dynamicStyles.check}>
                                    <FontAwesome name="check" size={avatarConfig.iconSize} color="#FFFFFF" />
                                  </View>
                                )}
                                {/* Show pencil icon when selected but not active */}
                                {isSelected && !isCurrent && (
                                  <View style={dynamicStyles.editIconContainer}>
                                    <FontAwesome name="pencil" size={avatarConfig.iconSize} color="#FFFFFF" />
                                  </View>
                                )}
                              </View>
                            ) : (
                              <Image 
                                source={getAsset(`avatars.${avatar}.theme`)} 
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="contain"
                              />
                            )
                          })()}
                        </View>
                      </View>
                    ) : (() => {
                      const StandardAvatarSvg = getStandardAvatarSvg(avatar)
                      return StandardAvatarSvg ? (
                        <View style={dynamicStyles.imageWrapper}>
                          <View style={dynamicStyles.avatarOuterContainer}>
                            {(isSelected || isCurrent) && (
                              <View style={dynamicStyles.avatarGreenBorder} />
                            )}
                            <View style={dynamicStyles.avatarInnerContainer}>
                              <View style={dynamicStyles.standardAvatarSvgContainer}>
                                {React.createElement(StandardAvatarSvg, {
                                  width: '100%',
                                  height: '100%',
                                })}
                              </View>
                            </View>
                            {/* Show checkmark icon only when avatar is active (current) */}
                            {isCurrent && (
                              <View style={dynamicStyles.check}>
                                <FontAwesome name="check" size={avatarConfig.iconSize} color="#FFFFFF" />
                              </View>
                            )}
                            {/* Show pencil icon when selected but not active */}
                            {isSelected && !isCurrent && (
                              <View style={dynamicStyles.editIconContainer}>
                                <FontAwesome name="pencil" size={avatarConfig.iconSize} color="#FFFFFF" />
                              </View>
                            )}
                          </View>
                        </View>
                      ) : (
                        <View style={dynamicStyles.imageWrapper}>
                          <View style={dynamicStyles.avatarOuterContainer}>
                            {(isSelected || isCurrent) && (
                              <View style={dynamicStyles.avatarGreenBorder} />
                            )}
                            <View style={dynamicStyles.avatarInnerContainer}>
                              <View style={dynamicStyles.avatarImage}>
                                <Image 
                                  source={getAsset(`avatars.${avatar}.theme`)} 
                                  style={{ width: '100%', height: '100%' }}
                                  resizeMode="contain"
                                />
                              </View>
                            </View>
                            {/* Show checkmark icon only when avatar is active (current) */}
                            {isCurrent && (
                              <View style={dynamicStyles.check}>
                                <FontAwesome name="check" size={avatarConfig.iconSize} color="#FFFFFF" />
                              </View>
                            )}
                            {/* Show pencil icon when selected but not active */}
                            {isSelected && !isCurrent && (
                              <View style={dynamicStyles.editIconContainer}>
                                <FontAwesome name="pencil" size={avatarConfig.iconSize} color="#FFFFFF" />
                              </View>
                            )}
                          </View>
                        </View>
                      )
                    })()}
                    <Text style={[dynamicStyles.name, { color: '#000000' }]}>
                      {isFriendAvatar && currentUser?.avatar?.name ? currentUser.avatar.name : avatar}
                    </Text>
                    {isFriendAvatarLocked && (
                      <AvatarLock 
                        cyclesNumber={currentUser?.cyclesNumber || 0} 
                        style={dynamicStyles.lockOverlay}
                        showSingleLock={true}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Reminder Box */}
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
        </ScrollView>
        
        {/* Buttons - Fixed at bottom */}
        <View style={dynamicStyles.buttonContainer}>
          {isInitialSelection ? (
            <Button onPress={confirm} status={confirmStatus}>
              continue
            </Button>
          ) : (
            <Button onPress={confirm} status={confirmStatus}>
              confirm
            </Button>
          )}
        </View>
      </ImageBackground>
    </Screen>
  )
}


const getCheckStatus = ({
  isSelected,
  isCurrent,
  changed,
  isInitialSelection,
}: {
  isSelected: boolean
  isCurrent: boolean
  changed: boolean
  isInitialSelection: boolean
}): {
  showCheck: boolean
  checkStatus: PaletteStatus
} => {
  // When making selection for the first time, indicate selection with primary (green) status
  if (isInitialSelection) {
    return {
      showCheck: isSelected,
      checkStatus: 'primary',
    }
  }

  // When editing, show current as basic and selected as secondary, to indicate unsaved changes
  return {
    showCheck: isSelected || (isCurrent && !isSelected),
    checkStatus: isSelected ? (changed ? 'secondary' : 'primary') : 'basic',
  }
}

