/* eslint-disable @typescript-eslint/no-var-requires */
import { ReactNativeFirebase } from "@react-native-firebase/app";
import { FirebaseAnalyticsTypes } from "@react-native-firebase/analytics";
import { FirebaseCrashlyticsTypes } from "@react-native-firebase/crashlytics";
import Constants from "expo-constants";

let analytics:
  | ReactNativeFirebase.FirebaseModuleWithStatics<
      FirebaseAnalyticsTypes.Module,
      FirebaseAnalyticsTypes.Statics
    >
  | undefined;

try {
  // Don't use firebase with ExpoGo, causes a crash on iOS
  if (Constants.appOwnership != "expo") {
    analytics = require("@react-native-firebase/analytics").default;
  }
} catch (e) {
  //
}

let crashlytics:
  | ReactNativeFirebase.FirebaseModuleWithStatics<
      FirebaseCrashlyticsTypes.Module,
      FirebaseCrashlyticsTypes.Statics
    >
  | undefined;

try {
  // Don't use firebase with ExpoGo, causes a crash on iOS
  if (Constants.appOwnership != "expo") {
    crashlytics = require("@react-native-firebase/crashlytics").default;
    // Enable this to check crashlytics is working or not
    // crashlytics?.().crash();
  }
} catch (e) {
  //
}

export { analytics, crashlytics };
