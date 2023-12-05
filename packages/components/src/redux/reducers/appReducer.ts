import _ from 'lodash'
import { Actions } from '../types'
import { currentLocale } from '../../i18n'
import DeviceInfo from 'react-native-device-info'
import { AvatarName, ThemeName, defaultAvatar, defaultTheme } from '@oky/core'
import { v4 as uuidv4 } from 'uuid'
import { RehydrateAction, REHYDRATE } from 'redux-persist'

export interface AppState {
  appLocale: string
  locale: string
  chosenRegion: string
  appVersionName: string
  appVersionCode: string
  firebaseToken: string
  hasOpened: boolean
  isTutorialOneActive: boolean
  isTutorialTwoActive: boolean
  isLoginPasswordActive: boolean
  isTtsActive: boolean
  isFuturePredictionActive: boolean
  theme: ThemeName
  avatar: AvatarName
  verifiedDates: any
  predicted_cycles: any
  predicted_periods: any
  deviceId?: string
  dailyCardLastUsed?: number
}

const initialState: AppState = {
  appVersionName: DeviceInfo.getVersion(),
  appVersionCode: DeviceInfo.getBuildNumber(),
  firebaseToken: null,
  appLocale: currentLocale(),
  locale: currentLocale(),
  chosenRegion: 'en', // @TODO: PENAL CODE change to currentLocale() if no penal code   // @TODO: LANGUAGES This is commented in case the client wants multiple languages
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
}

export function appReducer(state = initialState, action: Actions | RehydrateAction): AppState {
  switch (action.type) {
    case REHYDRATE: {
      return {
        ...(action.payload && action.payload.app),
        deviceId: action.payload?.app?.deviceId ? action.payload.app.deviceId : uuidv4(),
      }
    }
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload.theme,
      }
    case 'SET_AVATAR':
      return {
        ...state,
        avatar: action.payload.avatar,
      }
    case 'SET_UPDATED_VERSION':
      return {
        ...state,
        appVersionName: DeviceInfo.getVersion(),
        appVersionCode: DeviceInfo.getBuildNumber(),
      }
    case 'STORE_FIREBASE_KEY':
      return {
        ...state,
        firebaseToken: action.payload.firebaseToken,
      }
    case 'SET_LOCALE':
      return {
        ...state,
        locale: action.payload.locale,
      }
    case 'SET_CHOSEN_REGION':
      return {
        ...state,
        chosenRegion: action.payload.region,
      }
    case 'SET_HAS_OPENED':
      return {
        ...state,
        hasOpened: action.payload.hasOpened,
      }
    case 'SET_TUTORIAL_ONE_ACTIVE':
      return {
        ...state,
        isTutorialOneActive: action.payload.isTutorialActive,
      }
    case 'SET_TUTORIAL_TWO_ACTIVE':
      return {
        ...state,
        isTutorialTwoActive: action.payload.isTutorialActive,
      }
    case 'SET_LOGIN_PASSWORD_ACTIVE':
      return {
        ...state,
        isLoginPasswordActive: action.payload.isLoginPasswordActive,
      }
    case 'SET_TTS_ACTIVE':
      return {
        ...state,
        isTtsActive: action.payload.isTtsActive,
      }
    case 'SET_FUTURE_PREDICTION_ACTIVE':
      return {
        ...state,
        isFuturePredictionActive: action.payload.isFuturePredictionActive,
      }
    case 'VERIFY_PERIOD_DAY':
      return {
        ...state,
        verifiedDates: action.payload.date,
      }
    case 'DAILY_CARD_USED': {
      return {
        ...state,
        dailyCardLastUsed: new Date().getTime(),
      }
    }
    default:
      return state
  }
}
