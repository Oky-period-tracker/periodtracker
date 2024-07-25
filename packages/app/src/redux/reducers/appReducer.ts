// TODO:
// eslint-disable-next-line
// @ts-nocheck
import { Actions } from "../types";
// import DeviceInfo from "react-native-device-info";
// import { AvatarName, ThemeName, defaultAvatar, defaultTheme } from "@oky/core";
import { v4 as uuidv4 } from "uuid";
import { RehydrateAction, REHYDRATE } from "redux-persist";
import {
  AvatarName,
  ThemeName,
  defaultAvatar,
  defaultTheme,
} from "../../core/modules/translations";
import { initialLocale } from "../../translations";

export interface AppState {
  locale: string;
  appVersionName: string;
  appVersionCode: string;
  firebaseToken: string;
  hasOpened: boolean;
  isTutorialOneActive: boolean;
  isTutorialTwoActive: boolean;
  isLoginPasswordActive: boolean; // @deprecated
  isTtsActive: boolean;
  isFuturePredictionActive: boolean;
  theme: ThemeName;
  avatar: AvatarName;
  // TODO:
  // eslint-disable-next-line
  verifiedDates: any; // unused(?)
  // TODO:
  // eslint-disable-next-line
  predicted_cycles: any;
  // TODO:
  // eslint-disable-next-line
  predicted_periods: any;
  deviceId?: string;
  dailyCardLastUsed?: number;
  isHapticActive?: boolean;
  isSoundActive?: boolean;
}

const initialState: AppState = {
  appVersionName: "", // DeviceInfo.getVersion(),
  appVersionCode: "", //DeviceInfo.getBuildNumber(),
  firebaseToken: null,
  locale: initialLocale,
  hasOpened: false,
  isTutorialOneActive: true,
  isTutorialTwoActive: true,
  isLoginPasswordActive: true,
  isTtsActive: false,
  isFuturePredictionActive: true,
  theme: defaultTheme,
  avatar: defaultAvatar,
  verifiedDates: [],
  predicted_cycles: [],
  predicted_periods: [],
  deviceId: uuidv4(),
  isHapticActive: true,
  isSoundActive: true,
};

export function appReducer(
  state = initialState,
  action: Actions | RehydrateAction
): AppState {
  switch (action.type) {
    case REHYDRATE: {
      return {
        ...state,
        ...(action.payload && action.payload.app),
        deviceId: action.payload?.app?.deviceId
          ? action.payload.app.deviceId
          : uuidv4(),
      };
    }
    case "REFRESH_STORE": {
      if (!action?.payload?.app) {
        return state;
      }
      return {
        ...state,
        ...action.payload.app,
      };
    }
    case "SET_THEME":
      return {
        ...state,
        theme: action.payload.theme,
      };
    case "SET_AVATAR":
      return {
        ...state,
        avatar: action.payload.avatar,
      };
    case "SET_UPDATED_VERSION":
      return {
        ...state,
        appVersionName: "", //DeviceInfo.getVersion(),  TODO:
        appVersionCode: "", //DeviceInfo.getBuildNumber(), TODO:
      };
    case "STORE_FIREBASE_KEY":
      return {
        ...state,
        firebaseToken: action.payload.firebaseToken,
      };
    case "SET_LOCALE":
      return {
        ...state,
        locale: action.payload.locale,
      };
    case "SET_HAS_OPENED":
      return {
        ...state,
        hasOpened: action.payload.hasOpened,
      };
    case "SET_TUTORIAL_ONE_ACTIVE":
      return {
        ...state,
        isTutorialOneActive: action.payload.isTutorialActive,
      };
    case "SET_TUTORIAL_TWO_ACTIVE":
      return {
        ...state,
        isTutorialTwoActive: action.payload.isTutorialActive,
      };
    case "SET_LOGIN_PASSWORD_ACTIVE":
      return {
        ...state,
        isLoginPasswordActive: action.payload.isLoginPasswordActive,
      };
    case "SET_TTS_ACTIVE":
      return {
        ...state,
        isTtsActive: action.payload.isTtsActive,
      };
    case "SET_FUTURE_PREDICTION_ACTIVE":
      return {
        ...state,
        isFuturePredictionActive: action.payload.isFuturePredictionActive,
      };

    case "DAILY_CARD_USED": {
      return {
        ...state,
        dailyCardLastUsed: new Date().getTime(),
      };
    }
    case "TOGGLE_HAPTIC":
      return {
        ...state,
        isHapticActive: action.payload.isHapticActive,
      };
    case "TOGGLE_SOUND":
      return {
        ...state,
        isSoundActive: action.payload.isSoundActive,
      };
    default:
      return state;
  }
}
