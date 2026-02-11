/* eslint-disable @typescript-eslint/no-var-requires */
import Constants from 'expo-constants'
import { Platform } from 'react-native'

// Don't use firebase with ExpoGo, causes a crash on iOS
// Don't use firebase on web, @react-native-firebase doesn't support web
const isExpoGo = Constants?.executionEnvironment === 'storeClient'
const isWeb = Platform.OS === 'web'
const isFirebaseEnabled = !isExpoGo && !isWeb

// ===== Analytics helpers (modular API) =====

export function firebaseLogEvent(eventName: string, params?: Record<string, unknown>) {
  if (!isFirebaseEnabled) return
  try {
    const { getAnalytics, logEvent } = require('@react-native-firebase/analytics')
    logEvent(getAnalytics(), eventName, params)
  } catch (e) {
    //
  }
}

export function firebaseLogScreenView(params: {
  screen_name: string
  screen_class: string
}) {
  if (!isFirebaseEnabled) return
  try {
    const { getAnalytics, logScreenView } = require('@react-native-firebase/analytics')
    logScreenView(getAnalytics(), params)
  } catch (e) {
    //
  }
}

export function firebaseLogAppOpen() {
  if (!isFirebaseEnabled) return
  try {
    const { getAnalytics, logEvent } = require('@react-native-firebase/analytics')
    logEvent(getAnalytics(), 'app_open')
  } catch (e) {
    //
  }
}

// ===== Messaging helpers (modular API) =====

export function firebaseSubscribeToTopic(topic: string) {
  if (!isFirebaseEnabled) return
  try {
    const { getMessaging, subscribeToTopic } = require('@react-native-firebase/messaging')
    subscribeToTopic(getMessaging(), topic)
  } catch (e) {
    //
  }
}

export function firebaseUnsubscribeFromTopic(topic: string) {
  if (!isFirebaseEnabled) return
  try {
    const { getMessaging, unsubscribeFromTopic } = require('@react-native-firebase/messaging')
    unsubscribeFromTopic(getMessaging(), topic)
  } catch (e) {
    //
  }
}

export async function firebaseHasPermission(): Promise<number | null> {
  if (!isFirebaseEnabled) return null
  try {
    const { getMessaging, hasPermission } = require('@react-native-firebase/messaging')
    return await hasPermission(getMessaging())
  } catch (e) {
    return null
  }
}

export async function firebaseRequestPermission(): Promise<number | null> {
  if (!isFirebaseEnabled) return null
  try {
    const { getMessaging, requestPermission } = require('@react-native-firebase/messaging')
    return await requestPermission(getMessaging())
  } catch (e) {
    return null
  }
}

/**
 * Authorization status constants matching Firebase Messaging values:
 * NOT_DETERMINED: -1, DENIED: 0, AUTHORIZED: 1, PROVISIONAL: 2, EPHEMERAL: 3
 */
export const FirebaseAuthorizationStatus = {
  NOT_DETERMINED: -1,
  DENIED: 0,
  AUTHORIZED: 1,
  PROVISIONAL: 2,
  EPHEMERAL: 3,
} as const

// ===== Crashlytics helpers (modular API) =====

export function firebaseCrashlyticsCrash() {
  if (!isFirebaseEnabled) return
  try {
    const { getCrashlytics, crash } = require('@react-native-firebase/crashlytics')
    crash(getCrashlytics())
  } catch (e) {
    //
  }
}

export { isFirebaseEnabled }
