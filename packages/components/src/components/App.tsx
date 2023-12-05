import 'react-native-get-random-values' // Required for uuid package
import React from 'react'
import { AppProvider } from './AppProvider'
import AppNavigator from '../navigators/AppNavigator'
import { configureStore } from '../redux/store'
import { setTopLevelNavigator } from '../services/navigationService'
import { notificationListener } from '../services/notifications'
import { SafeAreaView } from 'react-navigation'
import SplashScreen from 'react-native-splash-screen'
import { Platform } from 'react-native'
import Orientation from 'react-native-orientation-locker'

const { persistor, store } = configureStore()

export default function App() {
  React.useEffect(() => {
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
      <SafeAreaView
        forceInset={{ bottom: 'never' }}
        style={{ flex: 1, backgroundColor: '#757575' }}
      >
        <AppNavigator />
      </SafeAreaView>
    </AppProvider>
  )
}
