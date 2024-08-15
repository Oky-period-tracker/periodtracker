/* eslint-disable @typescript-eslint/no-var-requires */
import { FirebaseAnalyticsTypes } from "@react-native-firebase/analytics";
import { ReactNativeFirebase } from "@react-native-firebase/app";
import Constants from "expo-constants";
import { config } from "./config";

const firebaseConfig = {
  apiKey: config.FIREBASE_API_KEY,
  projectId: config.FIREBASE_PROJECT_ID,
  messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
  appId: config.FIREBASE_APP_ID,
};

let firebase: ReactNativeFirebase.Module | undefined;

try {
  // Don't use firebase with ExpoGo, causes a crash on iOS
  if (Constants.appOwnership != "expo") {
    firebase = require("@react-native-firebase/app").default;

    if (firebase && !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }
} catch (e) {
  //
}

export default firebase;

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
