import 'react-native-get-random-values' // Required for uuid package
import React from 'react'
import { AppProvider } from './AppProvider'
import AppNavigator from '../navigators/AppNavigator'
import { setTopLevelNavigator } from '../services/navigationService'
import { notificationListener } from '../services/notifications'
import { SafeAreaView } from 'react-navigation'
import SplashScreen from 'react-native-splash-screen'
import { Platform, StatusBar } from 'react-native'
import Orientation from 'react-native-orientation-locker'
import { IS_TABLET } from '../config/tablet'

export default function App() {
  React.useEffect(() => {
    if (IS_TABLET) {
      return
    }

    Orientation.lockToPortrait()

    return () => {
      Orientation.unlockAllOrientations()
    }
  }, [])

  React.useEffect(() => {
    notificationListener()
    if (Platform.OS === 'ios') {
      SplashScreen.hide()
    }
  }, [])

  return (
    <AppProvider>
      <StatusBar hidden />
      <SafeAreaView
        forceInset={{ horizontal: 'never', vertical: 'never' }}
        style={{ flex: 1, backgroundColor: '#757575' }}
      >
        <AppNavigator />
      </SafeAreaView>
    </AppProvider>
  )
}
