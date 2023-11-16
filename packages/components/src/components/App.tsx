import 'react-native-get-random-values' // Required for uuid package
import React from 'react'
import { AppProvider } from './AppProvider'
import AppNavigator from '../navigators/AppNavigator'
import { configureStore } from '../redux/store'
import { setTopLevelNavigator } from '../services/navigationService'
import { notificationListener } from '../services/notifications'
import { SafeAreaView } from 'react-navigation'
import SplashScreen from 'react-native-splash-screen'
import { Platform, StatusBar } from 'react-native'
import Orientation from 'react-native-orientation-locker'
import { isTablet } from 'react-native-device-info'

const { persistor, store } = configureStore()

export default function App() {
  React.useEffect(() => {
    if (isTablet()) {
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
    <AppProvider store={store} persistor={persistor}>
      <StatusBar hidden />
      <SafeAreaView
        forceInset={{ horizontal: 'never', vertical: 'never' }}
        style={{ flex: 1, backgroundColor: '#757575' }}
      >
        <AppNavigator
          ref={(navigatorRef) => {
            setTopLevelNavigator(navigatorRef)
          }}
          key="app-navigator"
        />
      </SafeAreaView>
    </AppProvider>
  )
}
