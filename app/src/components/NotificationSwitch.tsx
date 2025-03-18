import { StyleSheet, View } from 'react-native'
import { Button } from './Button'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import React from 'react'
import { useSelector } from '../redux/useSelector'
import { useDispatch } from 'react-redux'
import { isNotificationStatusActiveSelector } from '../redux/selectors'
import { setNotificationStatusActive, updateNotificationsStatusRequest } from '../redux/actions'
import { currentUserSelector } from '../redux/selectors'

export const NotificaitonSwitch = () => {
  const hasNotificationsActive = useSelector(isNotificationStatusActiveSelector)
  const dispatch = useDispatch()

  const user = useSelector(currentUserSelector)

  const onYesPress = () => {
    if (!user || hasNotificationsActive) {
      return
    }

    setTimeout(() => {
      dispatch(setNotificationStatusActive(true))
      dispatch(
        updateNotificationsStatusRequest({
          user_id: user.id,
          isActive: true,
        }),
      )
    }, 100)
  }

  const onNoPress = () => {
    if (!user || !hasNotificationsActive) {
      return
    }

    setTimeout(() => {
      dispatch(setNotificationStatusActive(false))
      dispatch(
        updateNotificationsStatusRequest({
          user_id: user.id,
          isActive: false,
        }),
      )
    }, 100)
  }

  return (
    <View style={styles.container}>
      <Button
        status={hasNotificationsActive ? 'primary' : 'basic'}
        style={styles.iconContainer}
        onPress={onYesPress}
      >
        <FontAwesome size={20} name={'check'} color={'#fff'} />
      </Button>
      <Button
        status={!hasNotificationsActive ? 'danger' : 'basic'}
        style={styles.iconContainer}
        onPress={onNoPress}
      >
        <FontAwesome size={20} name={'close'} color={'#fff'} />
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    margin: 4,
  },
})
