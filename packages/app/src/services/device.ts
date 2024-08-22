import { deviceType } from "expo-device";
import { Platform } from "react-native";

export const IS_TABLET = deviceType === 2;
export const IS_WEB = Platform.OS === "web";
export const IS_ANDROID = Platform.OS === "android";
