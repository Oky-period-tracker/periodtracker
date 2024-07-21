import firebase from "@react-native-firebase/app";
import { config } from "./config";

const firebaseConfig = {
  apiKey: config.FIREBASE_API_KEY,
  projectId: config.FIREBASE_PROJECT_ID,
  messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
  appId: config.FIREBASE_APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
