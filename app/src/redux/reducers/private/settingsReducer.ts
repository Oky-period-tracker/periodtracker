import { Actions } from '../../types'
import { AvatarName, ThemeName, defaultAvatar, defaultTheme } from '../../../resources/translations'
import { initialLocale } from '../../../hooks/useTranslate'
import { RehydrateAction } from 'redux-persist'

export interface SettingsState {
  locale: string
  isTutorialOneActive: boolean
  isTutorialTwoActive: boolean
  isFuturePredictionActive: boolean
  theme: ThemeName
  avatar: AvatarName
  dailyCardLastUsed?: number
  isHapticActive?: boolean
  isSoundActive?: boolean
  lastPressedCardDate: null | string
  lastPressedEmojiDate: null | string
}

const initialState: SettingsState = {
  locale: initialLocale,
  isTutorialOneActive: true,
  isTutorialTwoActive: true,
  isFuturePredictionActive: true,
  theme: defaultTheme,
  avatar: defaultAvatar,
  isHapticActive: true,
  isSoundActive: true,
  lastPressedCardDate: null,
  lastPressedEmojiDate: null,
}

export function settingsReducer(
  state = initialState,
  action: Actions | RehydrateAction,
): SettingsState {
  switch (action.type) {
    case 'LOGOUT_CLEANUP': {
      return initialState
    }
    case 'MIGRATE_STORE':
      return {
        ...state,
        ...action.payload.settings,
      }
    case 'SYNC_STORES': {
      return {
        ...state,
        ...(action.payload.oldStore.settings ?? initialState),
        ...(action.payload.newStore.settings ?? initialState),
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
    case 'SET_LOCALE':
      return {
        ...state,
        locale: action.payload.locale,
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
    case 'SET_FUTURE_PREDICTION_ACTIVE':
      return {
        ...state,
        isFuturePredictionActive: action.payload.isFuturePredictionActive,
      }
    case 'DAILY_CARD_USED':
      return {
        ...state,
        dailyCardLastUsed: new Date().getTime(),
      }
    case 'TOGGLE_HAPTIC':
      return {
        ...state,
        isHapticActive: action.payload.isHapticActive,
      }
    case 'TOGGLE_SOUND':
      return {
        ...state,
        isSoundActive: action.payload.isSoundActive,
      }
    case 'UPDATE_LAST_PRESSED_CARD_DATE':
      return {
        ...state,
        lastPressedCardDate: action.payload,
      }
    case 'UPDATE_LAST_PRESSED_EMOJI_DATE':
      return {
        ...state,
        lastPressedEmojiDate: action.payload,
      }

    default:
      return state
  }
}
