import * as React from 'react'
import { View, StyleSheet, Alert, ScrollView } from 'react-native'
import { Button } from '../../components/Button'
import { Hr } from '../../components/Hr'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { TouchableRow, TouchableRowProps } from '../../components/TouchableRow'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Switch } from '../../components/Switch'
import { useDispatch } from 'react-redux'
import { deleteAccountRequest, logoutRequest } from '../../redux/actions'
import { useAuth } from '../../contexts/AuthContext'
import { useSelector } from '../../redux/useSelector'
import {
  appTokenSelector,
  currentUserSelector,
  notificationReminderFrequencySelector,
} from '../../redux/selectors'
import { useTranslate } from '../../hooks/useTranslate'
import { globalStyles } from '../../config/theme'
import { useColor } from '../../hooks/useColor'
import { NotificationsPermissionModal } from './components/NotificationsPermissionModal'
import { NotificationsPreferencesModal } from './components/NotificationsPreferencesModal'

const SettingsScreen: ScreenComponent<'Settings'> = ({ navigation }) => {
  const currentUser = useSelector(currentUserSelector)
  const appToken = useSelector(appTokenSelector)
  const dispatch = useDispatch()
  const { setIsLoggedIn } = useAuth()
  const translate = useTranslate()
  const { palette, backgroundColor } = useColor()
  const reminderFrequency = useSelector(notificationReminderFrequencySelector)
  const [showPermissionModal, setShowPermissionModal] = React.useState(false)
  const [showPreferencesModal, setShowPreferencesModal] = React.useState(false)

  const logOut = () => {
    dispatch(logoutRequest())
    setIsLoggedIn(false)
  }

  const deleteAccount = () => {
    if (!currentUser) {
      return
    }
    dispatch(
      deleteAccountRequest({
        name: currentUser.name,
        password: currentUser.password,
      }),
    )
  }

  const logOutAlert = () => {
    const isOfflineAccount = currentUser?.isGuest || !appToken
    Alert.alert(
      translate(isOfflineAccount ? 'logout_account_title' : 'are_you_sure'),
      isOfflineAccount ? translate('logout_account_description') : '',
      [
        {
          text: translate('cancel'),
          style: 'cancel',
        },
        {
          text: translate('yes'),
          onPress: logOut,
        },
      ],
      { cancelable: false },
    )
  }

  const deleteAccountAlert = () => {
    Alert.alert(
      translate('are_you_sure'),
      translate('delete_account_description'),
      [
        {
          text: translate('cancel'),
          style: 'cancel',
        },
        {
          text: translate('yes'),
          onPress: deleteAccount,
        },
      ],
      { cancelable: false },
    )
  }

  const openNotificationSettings = () => {
    if (reminderFrequency) {
      setShowPreferencesModal(true)
      return
    }

    setShowPermissionModal(true)
  }

  const rows: TouchableRowProps[] = [
    {
      title: 'about',
      description: 'about_info',
      onPress: () => navigation.navigate('About'),
      component: <ArrowRight color={palette.basic.base} />,
    },
    {
      title: 't_and_c',
      description: 't_and_c_info',
      onPress: () => navigation.navigate('Terms'),
      component: <ArrowRight color={palette.basic.base} />,
    },
    {
      title: 'privacy_policy',
      description: 'privacy_info',
      onPress: () => navigation.navigate('Privacy'),
      component: <ArrowRight color={palette.basic.base} />,
    },
    {
      title: 'access_setting',
      description: 'settings_info',
      onPress: () => navigation.navigate('Access'),
      component: <ArrowRight color={palette.basic.base} />,
    },
    {
      title: 'Period notification and reminder',
      description: 'Oky will send you messages to remind you to log in to Oky and to take care of yourself.',
      onPress: openNotificationSettings,
      component: <ArrowRight color={palette.basic.base} />,
    },
    {
      title: 'future_prediciton',
      description: 'future_prediciton_info',
      component: <PredictionControls />,
      disabled: true,
    },
  ]

  return (
    <>
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={[styles.container, globalStyles.shadow, { backgroundColor }]}>
          {rows.map((props, i) => {
            const isLast = i === rows.length - 1
            return (
              <React.Fragment key={`settings-${i}`}>
                <TouchableRow {...props} />
                {!isLast && <Hr />}
              </React.Fragment>
            )
          })}
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={logOutAlert} status={'secondary'} style={styles.button}>
            logout
          </Button>
          <Button
            onPress={deleteAccountAlert}
            status={'basic'}
            style={[styles.button, styles.deleteButton]}
          >
            delete_account
          </Button>
          <Button
            status={'primary'}
            style={styles.button}
            onPress={() => navigation.navigate('Contact')}
          >
            contact_us
          </Button>
        </View>
      </ScrollView>

      <NotificationsPermissionModal
        visible={showPermissionModal}
        onCancel={() => setShowPermissionModal(false)}
        onProceed={() => {
          setShowPermissionModal(false)
          setShowPreferencesModal(true)
        }}
      />

      <NotificationsPreferencesModal
        visible={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
      />
    </>
  )
}

export default SettingsScreen

const ArrowRight = ({ color }: { color: string }) => (
  <FontAwesome size={12} name={'arrow-right'} color={color} />
)

const PredictionControls = () => {
  return <Switch />
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  container: {
    borderRadius: 20,
    width: '100%',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    paddingBottom: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  deleteButton: {
    marginHorizontal: 8,
  },
})
