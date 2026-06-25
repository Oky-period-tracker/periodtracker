/* eslint-disable @typescript-eslint/no-var-requires */
import { ReactNativeFirebase } from '@react-native-firebase/app'
import { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics'
import { FirebaseCrashlyticsTypes } from '@react-native-firebase/crashlytics'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

// Firebase native modules are not available in every runtime. We detect the two
// environments where they must NOT be loaded and guard against them below.

// Don't use firebase with ExpoGo, causes a crash on iOS
const isExpoGo = Constants?.executionEnvironment === 'storeClient'
// @react-native-firebase doesn't support web
const isWeb = Platform.OS === 'web'

// Parameter keys that could identify a user/device and therefore must never be
// sent to Firebase Analytics (privacy compliance). They are stripped before any
// analytics event leaves the app.
const SENSITIVE_ANALYTICS_KEYS = new Set(['userId', 'deviceId', 'user', 'user_id', 'device_id'])

// Recursively walks an analytics payload (object/array/primitive) and removes
// any property whose key is in SENSITIVE_ANALYTICS_KEYS. Arrays and nested
// objects are traversed so sensitive data can't hide deeper in the structure.
export const sanitizeAnalyticsParams = (params: unknown): unknown => {
  if (Array.isArray(params)) {
    return params.map(sanitizeAnalyticsParams)
  }

  if (params && typeof params === 'object') {
    return Object.entries(params).reduce<Record<string, unknown>>((acc, [key, value]) => {
      // Drop the key entirely if it is flagged as sensitive.
      if (SENSITIVE_ANALYTICS_KEYS.has(key)) {
        return acc
      }

      acc[key] = sanitizeAnalyticsParams(value)
      return acc
    }, {})
  }

  // Primitives (string/number/etc.) are returned untouched.
  return params
}

type FirebaseAnalyticsFactory = () => FirebaseAnalyticsTypes.Module

// Wraps the raw analytics factory so that every event/screen-view logged through
// it is sanitized first. The returned factory behaves like the original but the
// instance it produces has `logEvent` and `logScreenView` overridden.
const wrapAnalytics = (rawAnalytics: FirebaseAnalyticsFactory): FirebaseAnalyticsFactory => {
  return () => {
    const instance = rawAnalytics?.()
    if (!instance) {
      // Factory yielded nothing (module unavailable) — pass the undefined through.
      return (undefined as unknown) as FirebaseAnalyticsTypes.Module
    }

    // Object.create keeps the real instance as the prototype (so all other
    // methods/props still work) while overriding only the two logging methods
    // to run params through sanitizeAnalyticsParams first.
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

// --- Analytics ---
// Only loaded outside ExpoGo/web. The require is dynamic + wrapped in try/catch
// so a missing native module never crashes the app; `analytics` simply stays
// undefined and callers must handle that.
let analytics: FirebaseAnalyticsFactory | undefined

try {
  if (!isExpoGo && !isWeb) {
    const rawAnalytics = require('@react-native-firebase/analytics').default
    analytics = wrapAnalytics(rawAnalytics)
  }
} catch (e) {
  //
}

// --- Crashlytics ---
// Same guarded, lazy-loaded pattern. Exposed as the raw module (no wrapping).
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

// --- Messaging (push notifications) ---
// Same guarded, lazy-loaded pattern.
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

// Consumers import these; each may be `undefined` when running in ExpoGo, on web,
// or if the native module failed to load, so always check before using.
export { analytics, crashlytics, messaging }
