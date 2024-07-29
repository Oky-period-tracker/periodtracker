"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTheme = setTheme;
exports.setAvatar = setAvatar;
exports.setLocale = setLocale;
exports.setUpdatedVersion = setUpdatedVersion;
exports.requestStoreFirebaseKey = requestStoreFirebaseKey;
exports.storeFirebaseKey = storeFirebaseKey;
exports.setChosenRegion = setChosenRegion;
exports.setHasOpened = setHasOpened;
exports.setTutorialOneActive = setTutorialOneActive;
exports.setTutorialTwoActive = setTutorialTwoActive;
exports.setLoginPassword = setLoginPassword;
exports.setTtsActive = setTtsActive;
exports.setFuturePredictionActive = setFuturePredictionActive;
exports.refreshStore = refreshStore;
const helpers_1 = require("../helpers");
function setTheme(theme) {
    return (0, helpers_1.createAction)('SET_THEME', { theme });
}
function setAvatar(avatar) {
    return (0, helpers_1.createAction)('SET_AVATAR', { avatar });
}
function setLocale(locale) {
    return (0, helpers_1.createAction)('SET_LOCALE', { locale });
}
function setUpdatedVersion() {
    return (0, helpers_1.createAction)('SET_UPDATED_VERSION');
}
function requestStoreFirebaseKey() {
    return (0, helpers_1.createAction)('REQUEST_STORE_FIREBASE_KEY');
}
function storeFirebaseKey(firebaseToken) {
    return (0, helpers_1.createAction)('STORE_FIREBASE_KEY', { firebaseToken });
}
function setChosenRegion(region) {
    return (0, helpers_1.createAction)('SET_CHOSEN_REGION', { region });
}
function setHasOpened(hasOpened) {
    return (0, helpers_1.createAction)('SET_HAS_OPENED', { hasOpened });
}
function setTutorialOneActive(isTutorialActive) {
    return (0, helpers_1.createAction)('SET_TUTORIAL_ONE_ACTIVE', { isTutorialActive });
}
function setTutorialTwoActive(isTutorialActive) {
    return (0, helpers_1.createAction)('SET_TUTORIAL_TWO_ACTIVE', { isTutorialActive });
}
function setLoginPassword(isLoginPasswordActive) {
    return (0, helpers_1.createAction)('SET_LOGIN_PASSWORD_ACTIVE', { isLoginPasswordActive });
}
function setTtsActive(isTtsActive) {
    return (0, helpers_1.createAction)('SET_TTS_ACTIVE', { isTtsActive });
}
function setFuturePredictionActive(isFuturePredictionActive) {
    return (0, helpers_1.createAction)('SET_FUTURE_PREDICTION_ACTIVE', { isFuturePredictionActive });
}
function refreshStore(payload) {
    return (0, helpers_1.createAction)('REFRESH_STORE', payload);
}
//# sourceMappingURL=appActions.js.map