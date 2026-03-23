import * as React from 'react'
import { Image, ImageBackground, ScrollView, TouchableOpacity, View } from 'react-native'
import { Screen } from '../../components/Screen'
import { Button } from '../../components/Button'
import { avatarNames } from '../../resources/translations'
import { getAsset } from '../../services/asset'
import { useSelector } from '../../redux/useSelector'
import { currentAvatarSelector, currentUserSelector, cyclesNumberSelector } from '../../redux/selectors'
import { useDispatch } from 'react-redux'
import { setAvatarWithValidation } from '../../redux/actions'
import { Text } from '../../components/Text'
import { analytics } from '../../services/firebase'
import { AvatarLocks } from '../../components/AvatarLocks'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { assets } from '../../resources/assets'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useResponsive } from '../../contexts/ResponsiveContext'
import { createSelectAvatarScreenStyles } from './SelectAvatarScreen.styles'
import { currentThemeSelector } from '../../redux/selectors'
import { useTodayPrediction } from '../../contexts/PredictionProvider'
import { useAuth } from '../../contexts/AuthContext'
import { AvatarPreview } from '../../components/AvatarPreview'
import { useAvatar } from '../../hooks/useAvatar'

const SelectAvatarScreen: ScreenComponent<'SelectAvatar'> = ({ navigation }) => {
  return <SelectAvatar navigation={navigation} />
}

export default SelectAvatarScreen

interface SelectAvatarProps {
  onConfirm?: () => void
  onGoBack?: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation?: any
}

export const SelectAvatar = ({ onConfirm, onGoBack, navigation }: SelectAvatarProps) => {
  const currentAvatar = useSelector(currentAvatarSelector)
  const currentUser = useSelector(currentUserSelector)
  const cyclesNumber = useSelector(cyclesNumberSelector)
  const dispatch = useDispatch()
  const { UIConfig, width } = useResponsive()
  const theme = useSelector(currentThemeSelector)
  const { onPeriod } = useTodayPrediction()
  const { isLoggedIn } = useAuth()
  const avatarData = useAvatar()

  const [selectedAvatar, setSelectedAvatar] = React.useState(currentAvatar)

  const avatarConfig = UIConfig.avatarSelection

  // Determine friend avatar state
  const isFriendLocked = cyclesNumber < 3
  const isFriendCreated =
    !isFriendLocked && currentUser?.avatar && currentUser.avatar.customAvatarUnlocked === true

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

  const isInitialSelection = !!onConfirm
  const dynamicStyles = createSelectAvatarScreenStyles(avatarConfig)

  // Double-tap detection for friend avatar
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
    const action = setAvatarWithValidation(selectedAvatar, cyclesNumber, currentUser?.avatar?.customAvatarUnlocked)
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
              <Text style={[dynamicStyles.title, { color: '#000000' }]}>select_avatar_title</Text>
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

              const onPress = () => {
                // Don't allow selection if friend avatar is locked
                if (isFriendAvatarLocked) {
                  return
                }

                // Handle double-tap on friend avatar to navigate to customization
                if (isFriendAvatar && navigation) {
                  navigation.navigate('EditAvatar')
                  return
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
                      // Custom avatar
                      <View style={dynamicStyles.imageWrapper}>
                        <View style={dynamicStyles.friendAvatarImage}>
                          <View style={dynamicStyles.avatarOuterContainer}>
                            {(isSelected || isCurrent) && (
                              <View style={dynamicStyles.avatarGreenBorder} />
                            )}
                            <View style={dynamicStyles.avatarInnerContainer}>
                              <View style={dynamicStyles.friendAvatarContainer}>
                                <Image
                                  source={getAsset('avatars.friend.svg')}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                  }}
                                />
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
                                <FontAwesome
                                  name="check"
                                  size={avatarConfig.iconSize}
                                  color="#FFFFFF"
                                />
                              </View>
                            )}
                            {/* Show pencil icon when selected but not active */}
                            {isSelected && !isCurrent && (
                              <View style={dynamicStyles.editIconContainer}>
                                <FontAwesome
                                  name="pencil"
                                  size={avatarConfig.iconSize}
                                  color="#FFFFFF"
                                />
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    ) : (
                      // Base avatar
                      <View style={dynamicStyles.imageWrapper}>
                        <View style={dynamicStyles.avatarOuterContainer}>
                          {(isSelected || isCurrent) && (
                            <View style={dynamicStyles.avatarGreenBorder} />
                          )}
                          <View style={dynamicStyles.avatarInnerContainer}>
                            <View style={dynamicStyles.standardAvatarSvgContainer}>
                              <Image
                                source={getAsset(`avatars.${avatar}.svg`)}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                }}
                              />
                            </View>
                          </View>
                          {/* Show checkmark icon only when avatar is active (current) */}
                          {isCurrent && (
                            <View style={dynamicStyles.check}>
                              <FontAwesome
                                name="check"
                                size={avatarConfig.iconSize}
                                color="#FFFFFF"
                              />
                            </View>
                          )}
                          {/* Show pencil icon when selected but not active */}
                          {isSelected && !isCurrent && (
                            <View style={dynamicStyles.editIconContainer}>
                              <FontAwesome
                                name="pencil"
                                size={avatarConfig.iconSize}
                                color="#FFFFFF"
                              />
                            </View>
                          )}
                        </View>
                      </View>
                    )}
                    <Text style={[dynamicStyles.name, { color: '#000000' }]}>
                      {isFriendAvatar && currentUser?.avatar?.name
                        ? currentUser.avatar.name
                        : avatar}
                    </Text>
                    {isFriendAvatarLocked && <AvatarLocks />}
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
