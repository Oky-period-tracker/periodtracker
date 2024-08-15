/* eslint-disable @typescript-eslint/no-var-requires */
import { FirebaseAnalyticsTypes } from "@react-native-firebase/analytics";
import { ReactNativeFirebase } from "@react-native-firebase/app";
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

export { analytics };
