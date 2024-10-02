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
import { appTokenSelector, currentUserSelector } from '../../redux/selectors'
import { useTranslate } from '../../hooks/useTranslate'
import { globalStyles } from '../../config/theme'
import { useColor } from '../../hooks/useColor'

const SettingsScreen: ScreenComponent<'Settings'> = ({ navigation }) => {
  const currentUser = useSelector(currentUserSelector)
  const appToken = useSelector(appTokenSelector)
  const dispatch = useDispatch()
  const { setIsLoggedIn } = useAuth()
  const translate = useTranslate()
  const { palette, backgroundColor } = useColor()

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
        // setLoading, TODO: ?
      }),
    )
  }

  const logOutAlert = () => {
    Alert.alert(
      translate('are_you_sure'),
      currentUser?.isGuest || !appToken ? translate('logout_account_description') : '',
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
      title: 'future_prediciton',
      description: 'future_prediciton_info',
      component: <PredictionControls />,
      disabled: true,
    },
  ]

  return (
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
  },
  container: {
    borderRadius: 20,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: 600,
    marginTop: 12,
  },
  button: {},
  deleteButton: {
    marginHorizontal: 8,
  },
})
