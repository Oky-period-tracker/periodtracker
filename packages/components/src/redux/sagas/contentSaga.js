"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentSaga = contentSaga;
const effects_1 = require("redux-saga/effects");
const redux_persist_1 = require("redux-persist");
const core_1 = require("@oky/core");
const HttpClient_1 = require("../../services/HttpClient");
const selectors = __importStar(require("../selectors"));
const actions = __importStar(require("../actions"));
const lodash_1 = __importDefault(require("lodash"));
const messaging_1 = __importDefault(require("@react-native-firebase/messaging"));
const textToSpeech_1 = require("../../services/textToSpeech");
function* onRehydrate(action) {
    var _a;
    const locale = yield (0, effects_1.select)(selectors.currentLocaleSelector);
    const hasPreviousContentFromStorage = action.payload && action.payload.content;
    if (!hasPreviousContentFromStorage) {
        yield (0, effects_1.put)(actions.initStaleContent(core_1.liveContent[locale]));
    }
    const now = new Date().getTime();
    // TODO_ALEX what time interval should we use?
    const fetchInterval = 0; // 1000 * 60 * 60 * 24 // 24 hours
    const timeFetched = action.payload && ((_a = action.payload.content) === null || _a === void 0 ? void 0 : _a.timeFetched);
    const shouldFetch = !timeFetched || timeFetched + fetchInterval < now;
    if (shouldFetch) {
        yield (0, effects_1.put)(actions.fetchContentRequest(locale));
    }
}
// TODO_ALEX: survey
function* onFetchSurveyContent(action) {
    const locale = yield (0, effects_1.select)(selectors.currentLocaleSelector);
    const userID = yield (0, effects_1.select)(selectors.currentUserSelector);
    try {
        const surveys = yield HttpClient_1.httpClient.fetchSurveys({
            locale,
            userID,
        });
        const previousSurveys = yield (0, effects_1.select)(selectors.allSurveys);
        const completedSurveys = yield (0, effects_1.select)(selectors.completedSurveys);
        const newSurveyArr = (previousSurveys === null || previousSurveys === void 0 ? void 0 : previousSurveys.length) ? previousSurveys : [];
        surveys.forEach((item) => {
            const itemExits = lodash_1.default.find(previousSurveys, { id: item.id });
            if (!itemExits) {
                newSurveyArr.push(item);
            }
        });
        const finalArr = [];
        newSurveyArr.forEach((item) => {
            const itemExits = lodash_1.default.find(completedSurveys, { id: item.id });
            if (!itemExits) {
                finalArr.push(item);
            }
        });
        yield (0, effects_1.put)(actions.updateAllSurveyContent(finalArr));
    }
    catch (error) {
        //
    }
}
function* onFetchContentRequest(action) {
    const { locale } = action.payload;
    function* fetchEncyclopedia() {
        const encyclopediaResponse = yield HttpClient_1.httpClient.fetchEncyclopedia({ locale });
        const videosResponse = yield HttpClient_1.httpClient.fetchVideos({ locale });
        return (0, core_1.fromEncyclopedia)({ encyclopediaResponse, videosResponse });
    }
    function* fetchPrivacyPolicy() {
        const privacyPolicy = yield HttpClient_1.httpClient.fetchPrivacyPolicy({
            locale,
        });
        return privacyPolicy;
    }
    function* fetchTermsAndConditions() {
        const termsAndConditions = yield HttpClient_1.httpClient.fetchTermsAndConditions({
            locale,
        });
        return termsAndConditions;
    }
    function* fetchAbout() {
        const about = yield HttpClient_1.httpClient.fetchAbout({
            locale,
        });
        return about;
    }
    function* fetchAboutBannerConditional() {
        const timestamp = yield (0, effects_1.select)((s) => s.content.aboutBannerTimestamp);
        const aboutBanner = yield HttpClient_1.httpClient.fetchAboutBannerConditional({
            locale,
            timestamp,
        });
        return aboutBanner;
    }
    function* fetchHelpCenters() {
        const helpCenterResponse = yield HttpClient_1.httpClient.fetchHelpCenters({
            locale,
        });
        return (0, core_1.fromHelpCenters)(helpCenterResponse);
    }
    function* fetchQuizzes() {
        const quizzesResponse = yield HttpClient_1.httpClient.fetchQuizzes({
            locale,
        });
        return (0, core_1.fromQuizzes)(quizzesResponse);
    }
    function* fetchDidYouKnows() {
        const didYouKnows = yield HttpClient_1.httpClient.fetchDidYouKnows({
            locale,
        });
        return (0, core_1.fromDidYouKnows)(didYouKnows);
    }
    function* fetchAvatarMessages() {
        const avatarMessages = yield HttpClient_1.httpClient.fetchAvatarMessages({
            locale,
        });
        return (0, core_1.fromAvatarMessages)(avatarMessages);
    }
    try {
        const { articles, categories, subCategories, videos } = yield fetchEncyclopedia();
        const { quizzes } = yield fetchQuizzes();
        const { didYouKnows } = yield fetchDidYouKnows();
        const { helpCenters } = yield fetchHelpCenters();
        const { avatarMessages } = yield fetchAvatarMessages();
        const privacyPolicy = yield fetchPrivacyPolicy();
        const termsAndConditions = yield fetchTermsAndConditions();
        const about = yield fetchAbout();
        const aboutBannerData = yield fetchAboutBannerConditional();
        yield (0, effects_1.put)(actions.fetchContentSuccess({
            timeFetched: new Date().getTime(),
            articles: lodash_1.default.isEmpty(articles.allIds) ? core_1.liveContent[locale].articles : articles,
            videos: lodash_1.default.isEmpty(videos.allIds) ? core_1.liveContent[locale].videos : videos,
            categories: lodash_1.default.isEmpty(categories.allIds) ? core_1.liveContent[locale].categories : categories,
            subCategories: lodash_1.default.isEmpty(subCategories.allIds)
                ? core_1.liveContent[locale].subCategories
                : subCategories,
            quizzes: lodash_1.default.isEmpty(quizzes.allIds) ? core_1.liveContent[locale].quizzes : quizzes,
            didYouKnows: lodash_1.default.isEmpty(didYouKnows.allIds) ? core_1.liveContent[locale].didYouKnows : didYouKnows,
            helpCenters: lodash_1.default.isEmpty(helpCenters) ? core_1.liveContent[locale].helpCenters : helpCenters,
            avatarMessages: lodash_1.default.isEmpty(avatarMessages)
                ? core_1.liveContent[locale].avatarMessages
                : avatarMessages,
            privacyPolicy: lodash_1.default.isEmpty(privacyPolicy)
                ? core_1.liveContent[locale].privacyPolicy
                : privacyPolicy,
            termsAndConditions: lodash_1.default.isEmpty(termsAndConditions)
                ? core_1.liveContent[locale].termsAndConditions
                : termsAndConditions,
            about: lodash_1.default.isEmpty(about) ? core_1.liveContent[locale].about : about,
            aboutBanner: aboutBannerData === null || aboutBannerData === void 0 ? void 0 : aboutBannerData.aboutBanner,
            aboutBannerTimestamp: aboutBannerData === null || aboutBannerData === void 0 ? void 0 : aboutBannerData.aboutBannerTimestamp,
        }));
    }
    catch (error) {
        yield (0, effects_1.put)(actions.fetchContentFailure());
        const aboutContent = yield (0, effects_1.select)(selectors.aboutContent);
        if (!aboutContent) {
            const localeInit = yield (0, effects_1.select)(selectors.currentLocaleSelector);
            yield (0, effects_1.put)(actions.initStaleContent(core_1.liveContent[localeInit]));
        }
    }
}
function* onSetLocale(action) {
    const { locale } = action.payload;
    const isTtsActive = yield (0, effects_1.select)(selectors.isTtsActiveSelector);
    if (isTtsActive) {
        // TODO_ALEX why?
        yield (0, effects_1.call)(textToSpeech_1.closeOutTTs);
        yield (0, effects_1.put)(actions.setTtsActive(false));
    }
    // unsubscribe from topic
    // TODO_ALEX: use locales from submodule
    (0, messaging_1.default)().unsubscribeFromTopic('oky_en_notifications');
    (0, messaging_1.default)().unsubscribeFromTopic('oky_id_notifications');
    (0, messaging_1.default)().unsubscribeFromTopic('oky_mn_notifications');
    (0, messaging_1.default)().subscribeToTopic(`oky_${locale}_notifications`);
    yield (0, effects_1.put)(actions.initStaleContent(core_1.liveContent[locale]));
    yield (0, effects_1.put)(actions.fetchContentRequest(locale));
}
function* contentSaga() {
    yield (0, effects_1.all)([
        (0, effects_1.takeLatest)(redux_persist_1.REHYDRATE, onRehydrate),
        (0, effects_1.takeLatest)('SET_LOCALE', onSetLocale),
        (0, effects_1.takeLatest)('FETCH_CONTENT_REQUEST', onFetchContentRequest),
        (0, effects_1.takeLatest)('FETCH_SURVEY_CONTENT_REQUEST', onFetchSurveyContent),
    ]);
}
//# sourceMappingURL=contentSaga.js.map