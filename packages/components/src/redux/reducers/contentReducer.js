"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentReducer = contentReducer;
const initialState = {
    timeFetched: undefined,
    aboutBannerTimestamp: undefined,
    articles: {
        byId: {},
        allIds: [],
    },
    categories: {
        byId: {},
        allIds: [],
    },
    subCategories: {
        byId: {},
        allIds: [],
    },
    surveys: {
        date_created: '',
        id: 'string',
        isAgeRestricted: false,
        is_multiple: true,
        lang: 'string',
        live: true,
        option1: 'string',
        option2: 'string',
        option3: 'string',
        option4: 'string',
        option5: 'string',
        question: 'string',
        questions: [],
    },
    allSurveys: [],
    completedSurveys: [],
    quizzes: {
        byId: {},
        allIds: [],
    },
    didYouKnows: {
        byId: {},
        allIds: [],
    },
    helpCenters: [],
    avatarMessages: [],
    privacyPolicy: [],
    termsAndConditions: [],
    about: [],
    aboutBanner: '',
    videos: {
        byId: {},
        allIds: [],
    },
};
function contentReducer(state = initialState, action) {
    switch (action.type) {
        case 'INIT_STALE_CONTENT':
            return Object.assign(Object.assign({}, state), action.payload);
        case 'FETCH_CONTENT_SUCCESS': {
            const shouldUpdateBanner = action.payload.aboutBanner !== undefined;
            return Object.assign(Object.assign({}, state), { timeFetched: action.payload.timeFetched, articles: action.payload.articles, videos: action.payload.videos, categories: action.payload.categories, subCategories: action.payload.subCategories, quizzes: action.payload.quizzes, didYouKnows: action.payload.didYouKnows, helpCenters: action.payload.helpCenters, avatarMessages: action.payload.avatarMessages, privacyPolicy: action.payload.privacyPolicy, termsAndConditions: action.payload.termsAndConditions, about: action.payload.about, aboutBanner: shouldUpdateBanner ? action.payload.aboutBanner : state.aboutBanner, aboutBannerTimestamp: shouldUpdateBanner
                    ? action.payload.aboutBannerTimestamp
                    : state.aboutBannerTimestamp });
        }
        case 'FETCH_SURVEY_CONTENT_SUCCESS':
            return Object.assign(Object.assign({}, state), { surveys: action.payload.surveys });
        case 'UPDATE_ALL_SURVEYS_CONTENT':
            return Object.assign(Object.assign({}, state), { allSurveys: action.payload.allSurveys });
        case 'UPDATE_COMPLETED_SURVEYS':
            return Object.assign(Object.assign({}, state), { completedSurveys: action.payload.completedSurveys });
        default:
            return state;
    }
}
//# sourceMappingURL=contentReducer.js.map