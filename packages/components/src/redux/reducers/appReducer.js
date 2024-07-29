"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appReducer = appReducer;
const i18n_1 = require("../../i18n");
const react_native_device_info_1 = __importDefault(require("react-native-device-info"));
const core_1 = require("@oky/core");
const uuid_1 = require("uuid");
const redux_persist_1 = require("redux-persist");
const initialState = {
    appVersionName: react_native_device_info_1.default.getVersion(),
    appVersionCode: react_native_device_info_1.default.getBuildNumber(),
    firebaseToken: null,
    appLocale: (0, i18n_1.currentLocale)(),
    locale: (0, i18n_1.currentLocale)(),
    chosenRegion: 'en', // @TODO: PENAL CODE change to currentLocale() if no penal code   // @TODO: LANGUAGES This is commented in case the client wants multiple languages
    hasOpened: false,
    isTutorialOneActive: true,
    isTutorialTwoActive: true,
    isLoginPasswordActive: true,
    isTtsActive: false,
    isFuturePredictionActive: true,
    theme: core_1.defaultTheme,
    avatar: core_1.defaultAvatar,
    verifiedDates: [],
    predicted_cycles: [],
    predicted_periods: [],
    deviceId: (0, uuid_1.v4)(),
};
function appReducer(state = initialState, action) {
    var _a, _b, _c;
    switch (action.type) {
        case redux_persist_1.REHYDRATE: {
            return Object.assign(Object.assign(Object.assign({}, state), (action.payload && action.payload.app)), { deviceId: ((_b = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.app) === null || _b === void 0 ? void 0 : _b.deviceId) ? action.payload.app.deviceId : (0, uuid_1.v4)() });
        }
        case 'REFRESH_STORE': {
            if (!((_c = action === null || action === void 0 ? void 0 : action.payload) === null || _c === void 0 ? void 0 : _c.app)) {
                return state;
            }
            return Object.assign(Object.assign({}, state), action.payload.app);
        }
        case 'SET_THEME':
            return Object.assign(Object.assign({}, state), { theme: action.payload.theme });
        case 'SET_AVATAR':
            return Object.assign(Object.assign({}, state), { avatar: action.payload.avatar });
        case 'SET_UPDATED_VERSION':
            return Object.assign(Object.assign({}, state), { appVersionName: react_native_device_info_1.default.getVersion(), appVersionCode: react_native_device_info_1.default.getBuildNumber() });
        case 'STORE_FIREBASE_KEY':
            return Object.assign(Object.assign({}, state), { firebaseToken: action.payload.firebaseToken });
        case 'SET_LOCALE':
            return Object.assign(Object.assign({}, state), { locale: action.payload.locale });
        case 'SET_CHOSEN_REGION':
            return Object.assign(Object.assign({}, state), { chosenRegion: action.payload.region });
        case 'SET_HAS_OPENED':
            return Object.assign(Object.assign({}, state), { hasOpened: action.payload.hasOpened });
        case 'SET_TUTORIAL_ONE_ACTIVE':
            return Object.assign(Object.assign({}, state), { isTutorialOneActive: action.payload.isTutorialActive });
        case 'SET_TUTORIAL_TWO_ACTIVE':
            return Object.assign(Object.assign({}, state), { isTutorialTwoActive: action.payload.isTutorialActive });
        case 'SET_LOGIN_PASSWORD_ACTIVE':
            return Object.assign(Object.assign({}, state), { isLoginPasswordActive: action.payload.isLoginPasswordActive });
        case 'SET_TTS_ACTIVE':
            return Object.assign(Object.assign({}, state), { isTtsActive: action.payload.isTtsActive });
        case 'SET_FUTURE_PREDICTION_ACTIVE':
            return Object.assign(Object.assign({}, state), { isFuturePredictionActive: action.payload.isFuturePredictionActive });
        default:
            return state;
    }
}
//# sourceMappingURL=appReducer.js.map