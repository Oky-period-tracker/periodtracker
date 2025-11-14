import * as React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { DisplayButton } from '../../../components/Button'
import { Hr } from '../../../components/Hr'
import { ScreenProps } from '../../../navigation/RootNavigator'
import { CircleProgress } from '../../MainScreen/components/CircleProgress'
import { UserIcon } from '../../../components/icons/UserIcon'
import { Text } from '../../../components/Text'
import { useSelector } from '../../../redux/useSelector'
import {
  currentAvatarSelector,
  currentThemeSelector,
  currentUserSelector,
} from '../../../redux/selectors'
import { useTodayPrediction } from '../../../contexts/PredictionProvider'
import { getAsset } from '../../../services/asset'
import { SaveAccountButton } from './SaveAccountButton'
import { useTranslate } from '../../../hooks/useTranslate'
import { useFormatDate } from '../../../hooks/useFormatDate'
import { globalStyles } from '../../../config/theme'
import { InfoButton } from '../../../components/InfoButton'
import { useColor } from '../../../hooks/useColor'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useResponsive } from '../../../contexts/ResponsiveContext'
import { createProfileDetailsStyles } from './ProfileDetails.styles'
import { AvatarPreview } from '../../../components/AvatarPreview'
import { useAvatar } from '../../../hooks/useAvatar'

export const ProfileDetails = ({ navigation }: ScreenProps<'Profile'>) => {
  const currentUser = useSelector(currentUserSelector)
  const avatar = useSelector(currentAvatarSelector)
  const theme = useSelector(currentThemeSelector)
  const todayInfo = useTodayPrediction()
  const translate = useTranslate()
  const { formatMonthYear } = useFormatDate()
  const { backgroundColor } = useColor()
  const { UIConfig } = useResponsive()
  const avatarConfig = UIConfig.avatarSelection
  const { width } = useResponsive()
  const avatarData = useAvatar()
  const styles = createProfileDetailsStyles(avatarConfig, width)

  const goToEdit = () => {
    navigation.navigate('EditProfile')
  }

  const goToAvatar = () => {
    navigation.navigate('SelectAvatar')
  }

  const goToTheme = () => {
    navigation.navigate('SelectTheme')
  }

  const days = translate('days')

  const cycleLength = todayInfo.cycleLength === 100 ? '-' : `${todayInfo.cycleLength} ${days}`
  const periodLength = todayInfo.periodLength === 0 ? '-' : `${todayInfo.periodLength} ${days}`

  return (
    <View style={[styles.container, { backgroundColor }, globalStyles.shadow]}>
      {currentUser?.isGuest && (
        <>
          <View style={styles.column}>
            <View style={styles.row}>
              <View style={styles.column}>
                <InfoButton title={'alert'} content={'connect_account_info'} />
                <Text style={styles.infoLabel}>guest_mode_user_alert</Text>
              </View>

              <View style={styles.column}>
                <SaveAccountButton />
              </View>
            </View>
          </View>
          <Hr />
        </>
      )}

      {/* ===== Top Section ===== */}
      <TouchableOpacity style={styles.row} onPress={goToEdit}>
        <View style={styles.iconColumn}>
          <DisplayButton style={styles.icon}>
            <UserIcon size={28} />
          </DisplayButton>
        </View>
        <View style={styles.column}>
          <View>
            <Text style={styles.text}>name</Text>
            <Text style={styles.text}>age</Text>
            <Text style={styles.text}>gender</Text>
            <Text style={styles.text}>location</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View>
            <Text enableTranslate={false} style={[styles.text, styles.bold]}>
              {currentUser?.name}
            </Text>
            <Text enableTranslate={false} style={[styles.text, styles.bold]}>
              {formatMonthYear(currentUser?.dateOfBirth)}
            </Text>
            <Text style={[styles.text, styles.bold]}>{currentUser?.gender}</Text>
            <Text style={[styles.text, styles.bold]}>{currentUser?.location}</Text>
          </View>
        </View>
        <View style={styles.editIconContainer}>
          <DisplayButton style={styles.editIcon}>
            <FontAwesome name="pencil" size={12} color="#FFFFFF" />
          </DisplayButton>
        </View>
      </TouchableOpacity>
      <Hr />

      {/* ===== Cycle Section ===== */}
      <View style={styles.row}>
        <View style={styles.iconColumn}>
          <CircleProgress />
        </View>
        <View style={styles.column}>
          <View>
            <Text style={styles.text}>cycle_length</Text>
            <Text style={styles.text}>period_length</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View>
            <Text enableTranslate={false} style={[styles.text, styles.bold]}>
              {cycleLength}
            </Text>
            <Text enableTranslate={false} style={[styles.text, styles.bold]}>
              {periodLength}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.infoTextRow}>
        <View style={styles.column}>
          <View />
        </View>
        <View style={styles.infoTextColumn}>
          <Text style={[styles.text, styles.bold, styles.infoText]}>
            track_regularly_cycle_updates
          </Text>
        </View>
      </View>
      <Hr />

      {/* ===== Avatar Section ===== */}
      <TouchableOpacity style={styles.row} onPress={goToAvatar}>
        <View style={styles.column}>
          {(() => {
            if (avatar === 'friend') {
              // Custom avatar
              return (
                <View style={styles.imageWrapper}>
                  <View style={styles.friendAvatarImage}>
                    <View style={styles.friendAvatarContainer}>
                      {/* Base avatar */}
                      <Image source={getAsset('avatars.friend.svg')} style={styles.avatarImage} />
                      {/* Custom avatar style */}
                      {avatarData && (
                        <View style={styles.avatarPreviewContainer}>
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
                            style={styles.avatarPreview}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              )
            } else {
              // Base avatar
              return <Image source={getAsset(`avatars.${avatar}.svg`)} style={styles.avatarImage} />
            }
          })()}
        </View>
        <View style={styles.column}>
          <View>
            <Text style={styles.text}>change_oky_friend</Text>
            <Text style={[styles.text, styles.bold]}>
              {avatar === 'friend' && currentUser?.avatar?.name ? currentUser.avatar.name : avatar}
            </Text>
          </View>
        </View>
        <View style={styles.editIconContainer}>
          <DisplayButton style={styles.editIcon}>
            <FontAwesome name="pencil" size={12} color="#FFFFFF" />
          </DisplayButton>
        </View>
      </TouchableOpacity>
      <Hr />

      {/* ===== Theme Section ===== */}
      <TouchableOpacity style={styles.row} onPress={goToTheme}>
        <View style={styles.column}>
          <View style={styles.themeWrapper}>
            <Image source={getAsset(`backgrounds.${theme}.svg`)} style={styles.themeImage} />
          </View>
        </View>
        <View style={styles.column}>
          <View>
            <Text style={styles.text}>change_background</Text>
            <Text style={[styles.text, styles.bold]}>{theme}</Text>
          </View>
        </View>
        <View style={styles.editIconContainer}>
          <DisplayButton style={styles.editIcon}>
            <FontAwesome name="pencil" size={12} color="#FFFFFF" />
          </DisplayButton>
        </View>
      </TouchableOpacity>
    </View>
  )
}
