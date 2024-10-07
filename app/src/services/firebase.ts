/* eslint-disable @typescript-eslint/no-var-requires */
import { ReactNativeFirebase } from '@react-native-firebase/app'
import { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics'
import { FirebaseCrashlyticsTypes } from '@react-native-firebase/crashlytics'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

// Check if running in Expo Go or Web
const isExpoGo = Constants?.executionEnvironment === 'storeClient'
const isWeb = Platform.OS === 'web'

const shouldImportRNF = !isExpoGo && !isWeb

let analytics:
  | ReactNativeFirebase.FirebaseModuleWithStatics<
      FirebaseAnalyticsTypes.Module,
      FirebaseAnalyticsTypes.Statics
    >
  | undefined

try {
  if (shouldImportRNF) {
    analytics = require('@react-native-firebase/analytics').default
  }
} catch (e) {
  //
}

let crashlytics:
  | ReactNativeFirebase.FirebaseModuleWithStatics<
      FirebaseCrashlyticsTypes.Module,
      FirebaseCrashlyticsTypes.Statics
    >
  | undefined

try {
  if (shouldImportRNF) {
    crashlytics = require('@react-native-firebase/crashlytics').default

    // Enable this to check crashlytics is working or not
    crashlytics?.().crash()
  }
} catch (e) {
  //
}

let messaging:
  | ReactNativeFirebase.FirebaseModuleWithStatics<
      FirebaseMessagingTypes.Module,
      FirebaseMessagingTypes.Statics
    >
  | undefined

try {
  if (shouldImportRNF) {
    messaging = require('@react-native-firebase/messaging').default
  }
} catch (e) {
  //
}

export { analytics, crashlytics, messaging }
