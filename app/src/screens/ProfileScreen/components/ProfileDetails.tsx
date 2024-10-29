import * as React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
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

export const ProfileDetails = ({ navigation }: ScreenProps<'Profile'>) => {
  const currentUser = useSelector(currentUserSelector)
  const avatar = useSelector(currentAvatarSelector)
  const theme = useSelector(currentThemeSelector)
  const todayInfo = useTodayPrediction()
  const translate = useTranslate()
  const { formatMonthYear } = useFormatDate()
  const { backgroundColor } = useColor()

  const goToEdit = () => {
    navigation.navigate('EditProfile')
  }

  const goToAvatarAndTheme = () => {
    navigation.navigate('AvatarAndTheme')
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
        <View style={styles.column}>
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
      </TouchableOpacity>
      <Hr />

      {/* ===== Middle Section ===== */}
      <View style={styles.row}>
        <View style={styles.column}>
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
      <Hr />

      {/* ===== Bottom Section ===== */}
      <TouchableOpacity style={styles.row} onPress={goToAvatarAndTheme}>
        <View style={styles.column}>
          <Image source={getAsset(`avatars.${avatar}.theme`)} style={styles.avatarImage} />
        </View>
        <View style={styles.column}>
          <View style={styles.themeWrapper}>
            <Image source={getAsset(`backgrounds.${theme}.default`)} style={styles.themeImage} />
          </View>
        </View>
        <View style={styles.column}>
          <View>
            <Text style={[styles.text, styles.bold]}>{avatar}</Text>
            <Text style={[styles.text, styles.bold]}>{theme}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    width: '100%',
    marginVertical: 4,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    minHeight: 100,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    marginTop: 12,
  },
  icon: {
    width: 52,
    height: 52,
  },
  text: {
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  avatarImage: {
    width: '100%',
    height: 80,
    alignSelf: 'center',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  themeWrapper: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  themeImage: {
    width: '100%',
    height: 80,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
})
