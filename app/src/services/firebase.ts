/* eslint-disable @typescript-eslint/no-var-requires */
import { ReactNativeFirebase } from '@react-native-firebase/app'
import { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics'
import { FirebaseCrashlyticsTypes } from '@react-native-firebase/crashlytics'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

// Don't use firebase with ExpoGo, causes a crash on iOS
const isExpoGo = Constants?.executionEnvironment === 'storeClient'
// @react-native-firebase doesn't support web
const isWeb = Platform.OS === 'web'

const SENSITIVE_ANALYTICS_KEYS = new Set([
  'userId',
  'deviceId',
  'user',
  'user_id',
  'device_id',
])

const sanitizeAnalyticsParams = (params: unknown): unknown => {
  if (Array.isArray(params)) {
    return params.map(sanitizeAnalyticsParams)
  }

  if (params && typeof params === 'object') {
    return Object.entries(params).reduce<Record<string, unknown>>((acc, [key, value]) => {
      if (SENSITIVE_ANALYTICS_KEYS.has(key)) {
        return acc
      }

      acc[key] = sanitizeAnalyticsParams(value)
      return acc
    }, {})
  }

  return params
}

type FirebaseAnalyticsFactory = () => FirebaseAnalyticsTypes.Module

const wrapAnalytics = (rawAnalytics: FirebaseAnalyticsFactory): FirebaseAnalyticsFactory => {
  return () => {
    const instance = rawAnalytics?.()
    if (!instance) {
      return undefined as unknown as FirebaseAnalyticsTypes.Module
    }

    return Object.create(instance, {
      logEvent: {
        value: (
          name: string,
          params?: unknown,
          options?: FirebaseAnalyticsTypes.AnalyticsCallOptions,
        ) =>
          instance.logEvent(
            name,
            sanitizeAnalyticsParams(params) as Record<string, unknown>,
            options,
          ),
      },
      logScreenView: {
        value: (params?: unknown) =>
          instance.logScreenView(
            sanitizeAnalyticsParams(params) as FirebaseAnalyticsTypes.ScreenViewParameters,
          ),
      },
    }) as FirebaseAnalyticsTypes.Module
  }
}

let analytics: FirebaseAnalyticsFactory | undefined

try {
  if (!isExpoGo && !isWeb) {
    const rawAnalytics = require('@react-native-firebase/analytics').default
    analytics = wrapAnalytics(rawAnalytics)
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
  if (!isExpoGo && !isWeb) {
    crashlytics = require('@react-native-firebase/crashlytics').default
    // Enable this to check crashlytics is working or not
    // crashlytics?.().crash();
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
  if (!isExpoGo && !isWeb) {
    messaging = require('@react-native-firebase/messaging').default
  }
} catch (e) {
  //
}

export { analytics, crashlytics, messaging }
