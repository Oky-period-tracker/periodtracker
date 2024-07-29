"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyCardLastUsed = exports.isFuturePredictionActiveSelector = exports.isFuturePredictionSelector = exports.userVerifiedDates = exports.currentFirebaseToken = exports.currentAppVersion = exports.isLoginPasswordActiveSelector = exports.isTtsActiveSelector = exports.isTutorialTwoActiveSelector = exports.isTutorialOneActiveSelector = exports.hasOpenedSelector = exports.currentAvatarSelector = exports.currentThemeSelector = exports.currentChosenRegionSelector = exports.currentLocaleSelector = void 0;
const s = (state) => state.app;
const predictionS = (state) => state.prediction;
const currentLocaleSelector = (state) => s(state).locale;
exports.currentLocaleSelector = currentLocaleSelector;
const currentChosenRegionSelector = (state) => s(state).chosenRegion;
exports.currentChosenRegionSelector = currentChosenRegionSelector;
const currentThemeSelector = (state) => s(state).theme;
exports.currentThemeSelector = currentThemeSelector;
const currentAvatarSelector = (state) => s(state).avatar;
exports.currentAvatarSelector = currentAvatarSelector;
const hasOpenedSelector = (state) => s(state).hasOpened;
exports.hasOpenedSelector = hasOpenedSelector;
const isTutorialOneActiveSelector = (state) => s(state).isTutorialOneActive;
exports.isTutorialOneActiveSelector = isTutorialOneActiveSelector;
const isTutorialTwoActiveSelector = (state) => s(state).isTutorialTwoActive;
exports.isTutorialTwoActiveSelector = isTutorialTwoActiveSelector;
const isTtsActiveSelector = (state) => s(state).isTtsActive;
exports.isTtsActiveSelector = isTtsActiveSelector;
const isLoginPasswordActiveSelector = (state) => s(state).isLoginPasswordActive;
exports.isLoginPasswordActiveSelector = isLoginPasswordActiveSelector;
const currentAppVersion = (state) => s(state).appVersionName;
exports.currentAppVersion = currentAppVersion;
const currentFirebaseToken = (state) => s(state).firebaseToken;
exports.currentFirebaseToken = currentFirebaseToken;
const userVerifiedDates = (state) => s(state).verifiedDates;
exports.userVerifiedDates = userVerifiedDates;
// Smart precition selectors
const isFuturePredictionSelector = (state) => predictionS(state);
exports.isFuturePredictionSelector = isFuturePredictionSelector;
const isFuturePredictionActiveSelector = (state) => { var _a; return (_a = predictionS(state)) === null || _a === void 0 ? void 0 : _a.futurePredictionStatus; };
exports.isFuturePredictionActiveSelector = isFuturePredictionActiveSelector;
// export const smartPredictedPeriods = (state: ReduxState) => s(state).predicted_periods
const dailyCardLastUsed = (state) => { var _a; return (_a = s(state)) === null || _a === void 0 ? void 0 : _a.dailyCardLastUsed; };
exports.dailyCardLastUsed = dailyCardLastUsed;
//# sourceMappingURL=appSelectors.js.map