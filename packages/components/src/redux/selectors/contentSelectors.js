"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allDidYouKnowsSelectors = exports.allQuizzesSelectors = exports.aboutBanner = exports.completedSurveys = exports.allSurveys = exports.aboutContent = exports.termsAndConditionsContent = exports.privacyContent = exports.allAvatarText = exports.subCategoryByIDSelector = exports.categoryByIDSelector = exports.allSubCategoriesObjectSelector = exports.allSubCategoriesSelector = exports.allCategoryEmojis = exports.allCategoriesSelector = exports.allHelpCentersForCurrentLocale = exports.articlesObjectByIDSelector = exports.videoByIDSelector = exports.articleByIDSelector = exports.allVideosSelector = exports.allArticlesSelector = void 0;
const lodash_1 = __importDefault(require("lodash"));
const s = (state) => state.content;
const allArticlesSelector = (state) => s(state).articles.allIds.map((id) => s(state).articles.byId[id]);
exports.allArticlesSelector = allArticlesSelector;
const allVideosSelector = (state) => {
    var _a, _b, _c, _d;
    if (!((_b = (_a = s(state)) === null || _a === void 0 ? void 0 : _a.videos) === null || _b === void 0 ? void 0 : _b.allIds) || !((_d = (_c = s(state)) === null || _c === void 0 ? void 0 : _c.videos) === null || _d === void 0 ? void 0 : _d.byId))
        return [];
    return s(state).videos.allIds.map((id) => s(state).videos.byId[id]);
};
exports.allVideosSelector = allVideosSelector;
const articleByIDSelector = (state, id) => s(state).articles.byId[id];
exports.articleByIDSelector = articleByIDSelector;
const videoByIDSelector = (state, id) => { var _a, _b; return (_b = (_a = s(state)) === null || _a === void 0 ? void 0 : _a.videos) === null || _b === void 0 ? void 0 : _b.byId[id]; };
exports.videoByIDSelector = videoByIDSelector;
const articlesObjectByIDSelector = (state) => s(state).articles.byId;
exports.articlesObjectByIDSelector = articlesObjectByIDSelector;
// @ts-ignore
const allHelpCentersForCurrentLocale = (state) => s(state).helpCenters.filter((item) => item.lang === state.app.locale);
exports.allHelpCentersForCurrentLocale = allHelpCentersForCurrentLocale;
const allCategoriesSelector = (state) => s(state).categories.allIds.map((id) => s(state).categories.byId[id]);
exports.allCategoriesSelector = allCategoriesSelector;
const allCategoryEmojis = (state) => {
    const categories = (0, exports.allCategoriesSelector)(state);
    return categories.map((item) => {
        return { tag: item.tags.primary.name, emoji: item.tags.primary.emoji };
    });
};
exports.allCategoryEmojis = allCategoryEmojis;
const allSubCategoriesSelector = (state) => s(state).subCategories.allIds.map((id) => s(state).subCategories.byId[id]);
exports.allSubCategoriesSelector = allSubCategoriesSelector;
const allSubCategoriesObjectSelector = (state) => s(state).subCategories.byId;
exports.allSubCategoriesObjectSelector = allSubCategoriesObjectSelector;
const categoryByIDSelector = (state, id) => s(state).categories.byId[id];
exports.categoryByIDSelector = categoryByIDSelector;
const subCategoryByIDSelector = (state, id) => s(state).subCategories.byId[id];
exports.subCategoryByIDSelector = subCategoryByIDSelector;
const allAvatarText = (state) => s(state).avatarMessages;
exports.allAvatarText = allAvatarText;
const privacyContent = (state) => s(state).privacyPolicy;
exports.privacyContent = privacyContent;
const termsAndConditionsContent = (state) => s(state).termsAndConditions;
exports.termsAndConditionsContent = termsAndConditionsContent;
const aboutContent = (state) => s(state).about;
exports.aboutContent = aboutContent;
const allSurveys = (state) => s(state).allSurveys;
exports.allSurveys = allSurveys;
const completedSurveys = (state) => s(state).completedSurveys;
exports.completedSurveys = completedSurveys;
const aboutBanner = (state) => s(state).aboutBanner;
exports.aboutBanner = aboutBanner;
const allQuizzesSelectors = (state) => {
    // TODO: FIXME
    const isUserYoungerThan15 = true;
    // moment()
    //   .utc()
    //   .diff(state.auth.user.dateOfBirth) < 15
    const tempArr = [];
    const filteredArray = s(state).quizzes.allIds.reduce((acc, id) => {
        var _a;
        if ((!((_a = s(state).quizzes.byId[id]) === null || _a === void 0 ? void 0 : _a.isAgeRestricted) && isUserYoungerThan15) ||
            !isUserYoungerThan15) {
            tempArr.push(s(state).quizzes.byId[id]);
        }
        if ((!s(state).quizzes.byId[id].isAgeRestricted && isUserYoungerThan15) ||
            !isUserYoungerThan15) {
            acc.push(s(state).quizzes.byId[id]);
        }
        return acc;
    }, []);
    // In the extreme event of all content being age restricted return the first quiz/ did you know instead of crashing the app
    if (lodash_1.default.isEmpty(filteredArray)) {
        return [s(state).quizzes.byId[s(state).quizzes.allIds[0]]];
    }
    return filteredArray;
};
exports.allQuizzesSelectors = allQuizzesSelectors;
const allDidYouKnowsSelectors = (state) => {
    // TODO_ALEX: FIXME
    const isUserYoungerThan15 = true;
    // moment()
    //   .utc()
    //   .diff(state.auth.user.dateOfBirth) < 15
    const filteredArray = s(state).didYouKnows.allIds.reduce((acc, id) => {
        var _a;
        if ((!((_a = s(state).didYouKnows.byId[id]) === null || _a === void 0 ? void 0 : _a.isAgeRestricted) && isUserYoungerThan15) ||
            !isUserYoungerThan15) {
            acc.push(s(state).didYouKnows.byId[id]);
        }
        return acc;
    }, []);
    // In the extreme event of all content being age restricted return the first quiz/ did you know instead of crashing the app
    if (lodash_1.default.isEmpty(filteredArray)) {
        return [s(state).didYouKnows.byId[s(state).didYouKnows.allIds[0]]];
    }
    return filteredArray;
};
exports.allDidYouKnowsSelectors = allDidYouKnowsSelectors;
//# sourceMappingURL=contentSelectors.js.map