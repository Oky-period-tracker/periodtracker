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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpClient = createHttpClient;
const axios_1 = __importDefault(require("axios"));
__exportStar(require("./types"), exports);
function createHttpClient(endpoint, cmsEndpoint, { predictionEndpoint }) {
    return {
        login: (_a) => __awaiter(this, [_a], void 0, function* ({ name, password }) {
            const response = yield axios_1.default.post(`${endpoint}/account/login`, {
                name,
                password,
            });
            return response.data;
        }),
        signup: (_a) => __awaiter(this, [_a], void 0, function* ({ name, dateOfBirth, gender, location, country, province, password, secretQuestion, secretAnswer, dateSignedUp, preferredId = null, }) {
            const response = yield axios_1.default.post(`${endpoint}/account/signup`, {
                name,
                dateOfBirth,
                gender,
                location,
                country,
                province,
                password,
                secretAnswer,
                secretQuestion,
                dateSignedUp,
                preferredId,
            });
            return response.data;
        }),
        resetPassword: (_a) => __awaiter(this, [_a], void 0, function* ({ name, secretAnswer, password }) {
            const response = yield axios_1.default.post(`${endpoint}/account/reset-password`, {
                name,
                secretAnswer,
                password,
            });
            return response.data;
        }),
        deleteUser: (_a) => __awaiter(this, [_a], void 0, function* ({ appToken }) {
            yield axios_1.default.post(`${endpoint}/account/delete`, null, {
                headers: { Authorization: `Bearer ${appToken}` },
            });
        }),
        deleteUserFromPassword: (_a) => __awaiter(this, [_a], void 0, function* ({ name, password }) {
            yield axios_1.default.post(`${endpoint}/account/delete-from-password`, {
                name,
                password,
            });
        }),
        getUserInfo: (userName) => __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${endpoint}/account/info/${encodeURIComponent(userName)}`);
            return response.data;
        }),
        getPermanentAlert: (versionName, locale, user) => __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${cmsEndpoint}/mobile/permanent-notification/${versionName}&${locale}&${user}`);
            return response.data;
        }),
        replaceStore: (_a) => __awaiter(this, [_a], void 0, function* ({ storeVersion, appState, appToken }) {
            const response = yield axios_1.default.post(`${endpoint}/account/replace-store`, {
                storeVersion,
                appState: JSON.stringify(appState),
            }, {
                headers: { Authorization: `Bearer ${appToken}` },
            });
            return response.data;
        }),
        editUserInfo: (_a) => __awaiter(this, [_a], void 0, function* ({ appToken, name, dateOfBirth, gender, location, secretQuestion, }) {
            const response = yield axios_1.default.post(`${endpoint}/account/edit-info`, {
                name,
                dateOfBirth,
                gender,
                location,
                secretQuestion,
            }, {
                headers: { Authorization: `Bearer ${appToken}` },
            });
            return response.data;
        }),
        editUserSecretAnswer: (_a) => __awaiter(this, [_a], void 0, function* ({ appToken, previousSecretAnswer, nextSecretAnswer }) {
            const response = yield axios_1.default.post(`${endpoint}/account/edit-secret-answer`, {
                previousSecretAnswer,
                nextSecretAnswer,
            }, {
                headers: { Authorization: `Bearer ${appToken}` },
            });
            return response.data;
        }),
        fetchAvatarMessages: (_a) => __awaiter(this, [_a], void 0, function* ({ locale }) {
            const response = yield axios_1.default.get(`${cmsEndpoint}/mobile/avatar-messages/${locale}`);
            return response.data;
        }),
        fetchEncyclopedia: (_a) => __awaiter(this, [_a], void 0, function* ({ locale }) {
            const response = yield axios_1.default.get(`${cmsEndpoint}/mobile/articles/${locale}`);
            return response.data;
        }),
        fetchVideos: (_a) => __awaiter(this, [_a], void 0, function* ({ locale }) {
            const response = yield axios_1.default.get(`${cmsEndpoint}/mobile/videos/${locale}`);
            return response.data;
        }),
        fetchSurveys: (_a) => __awaiter(this, [_a], void 0, function* ({ locale, userID }) {
            const response = yield axios_1.default.get(`${cmsEndpoint}/mobile/new-surveys/${locale}?user_id=${userID.id}`);
            return response.data;
        }),
        fetchPrivacyPolicy: (_a) => __awaiter(this, [_a], void 0, function* ({ locale }) {
            const response = yield axios_1.default.get(`${cmsEndpoint}/mobile/privacy-policy/${locale}`);
            return response.data;
        }),
        fetchTermsAndConditions: (_a) => __awaiter(this, [_a], void 0, function* ({ locale }) {
            const response = yield axios_1.default.get(`${cmsEndpoint}/mobile/terms-and-conditions/${locale}`);
            return response.data;
        }),
        fetchAbout: (_a) => __awaiter(this, [_a], void 0, function* ({ locale }) {
            const response = yield axios_1.default.get(`${cmsEndpoint}/mobile/about/${locale}`);
            return response.data;
        }),
        fetchAboutBanner: (_a) => __awaiter(this, [_a], void 0, function* ({ locale }) {
            // @deprecated
            const response = yield axios_1.default.get(`${cmsEndpoint}/mobile/about-banner/${locale}`);
            return response.data;
        }),
        fetchAboutBannerConditional: (_a) => __awaiter(this, [_a], void 0, function* ({ locale, timestamp = 0 }) {
            const response = yield axios_1.default.get(`${cmsEndpoint}/mobile/about-banner-conditional/${locale}?timestamp=${timestamp}`);
            return response.data;
        }),
        fetchQuizzes: (_a) => __awaiter(this, [_a], void 0, function* ({ locale }) {
            const response = yield axios_1.default.get(`${cmsEndpoint}/mobile/quizzes/${locale}`);
            return response.data;
        }),
        fetchDidYouKnows: (_a) => __awaiter(this, [_a], void 0, function* ({ locale }) {
            const response = yield axios_1.default.get(`${cmsEndpoint}/mobile/didyouknows/${locale}`);
            return response.data;
        }),
        fetchHelpCenters: (_a) => __awaiter(this, [_a], void 0, function* ({ locale }) {
            const response = yield axios_1.default.get(`${cmsEndpoint}/mobile/help-center/${locale}`);
            return response.data;
        }),
        fetchSingleNotification: (_a) => __awaiter(this, [_a], void 0, function* ({ locale }) {
            const response = yield axios_1.default.get(`${cmsEndpoint}/mobile/notification/${locale}`);
            return response.data;
        }),
        appendEvents: (_a) => __awaiter(this, [_a], void 0, function* ({ events, appToken }) {
            yield axios_1.default.post(`${endpoint}/analytics/append-events`, { events }, {
                headers: appToken ? { Authorization: `Bearer ${appToken}` } : {},
            });
        }),
        sendContactUsForm: (payload) => __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${cmsEndpoint}/mobile/suggestions`, payload);
            return response.data;
        }),
        getPeriodCycles: (_a) => __awaiter(this, [_a], void 0, function* ({ cycle_lengths, period_lengths, age }) {
            const response = yield axios_1.default.post(predictionEndpoint, {
                cycle_lengths,
                period_lengths,
                age,
            }, {
                headers: {
                    'content-type': 'application/json',
                },
            });
            return response.data;
        }),
    };
}
//# sourceMappingURL=index.js.map