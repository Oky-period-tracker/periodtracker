import messaging from '@react-native-firebase/messaging'
import pushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios'

export const createNotificationChannel = () => {
  const channel = pushNotification.createChannel(
    {
      channelId: 'Scheduled', // channelId
      channelName: 'Scheduled Notifications Channel', // channel name
      channelDescription: 'Used for getting reminder notification', // channel description
      importance: 4,
    },
    (created) => {
      // console.log('created', created);
    },
  )
  return channel
}

export const cancelAllScheduledNotifications = () => {
  return pushNotification.cancelAllLocalNotifications()
}

export const setScheduledNotification = async ({ time, title, body }) => {
  return pushNotification.scheduleLocalNotification({
    title,
    message: body,
    date: time.valueOf,
    soundName: 'default',
    priority: 'high',
    channelId: 'Scheduled',
    autoCancel: true,
    ignoreInForeground: false,
  })
  // return firebase.notifications().scheduleNotification(buildNotification({ title, body }), {
  //   fireDate: time.valueOf(),
  //   // @ts-ignore
  //   exact: true, // this was for a exact timing issue with notifications may become deprecated as it doesn't exist on the type
  // })
}

export const notificationListener = () => {
  pushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    // (required) Called when a remote or local notification is opened or received
    onNotification(notification) {
      // process the notification here
      const { message, subText } = notification

      // required on iOS only
      notification.finish(PushNotificationIOS.FetchResult.NoData)
    },
    // iOS only
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  })

  pushNotification.configure({
    onNotification(notification) {
      const { foreground, userInteraction, subText, message } = notification
      if (foreground && (subText || message) && !userInteraction)
        pushNotification.localNotification({
          // title: subText,
          message: subText,
          // date: time.valueOf,
          soundName: 'default',
          priority: 'high',
          channelId: 'Scheduled',
          autoCancel: true,
          ignoreInForeground: false,
        })
      notification.finish(PushNotificationIOS.FetchResult.NoData)
    },
    // iOS only
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  })
}

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission()
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL

  if (enabled) {
    // console.log('Notification Authorization status Error:', authStatus)
  }
}
