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
exports.authSaga = authSaga;
const effects_1 = require("redux-saga/effects");
const redux_persist_1 = require("redux-persist");
const react_native_1 = require("react-native");
const uuid_1 = require("uuid");
const HttpClient_1 = require("../../services/HttpClient");
const actions = __importStar(require("../actions"));
const selectors = __importStar(require("../selectors"));
const navigationService_1 = require("../../services/navigationService");
const prediction_1 = require("../../prediction");
const moment_1 = __importDefault(require("moment"));
const textToSpeech_1 = require("../../services/textToSpeech");
const network_1 = require("../../services/network");
function* onRehydrate() {
    const state = yield (0, effects_1.select)();
    const appToken = selectors.appTokenSelector(state);
    const user = selectors.currentUserSelector(state);
    // convert guest account
    if (!appToken && user && user.isGuest) {
        yield (0, effects_1.put)(actions.convertGuestAccount(user));
    }
}
function* onConvertGuestAccount(action) {
    const { id, name, dateOfBirth, gender, location, country, province, password, secretAnswer, secretQuestion, } = action.payload;
    yield (0, effects_1.put)(actions.createAccountRequest({
        id,
        name,
        dateOfBirth,
        gender,
        location,
        country,
        province,
        password,
        secretAnswer,
        secretQuestion,
    }));
}
function* onLoginRequest(action) {
    const { name, password } = action.payload;
    const stateRedux = yield (0, effects_1.select)();
    const localeapp = selectors.currentLocaleSelector(stateRedux);
    yield actions.setLocale(localeapp);
    try {
        const { appToken, user, store, } = yield HttpClient_1.httpClient.login({
            name,
            password,
        });
        yield (0, effects_1.put)(actions.loginSuccess({
            appToken,
            user: {
                id: user.id,
                name,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                location: user.location,
                country: user.country,
                province: user.province,
                secretQuestion: user.secretQuestion,
                secretAnswer: user.secretAnswer,
                dateSignedUp: user.dateSignedUp,
                password,
            },
        }));
        if (store && store.storeVersion && store.appState) {
            const partialState = Object.assign(Object.assign({}, store.appState), { app: Object.assign(Object.assign({}, store.appState.app), { appLocale: localeapp, locale: localeapp }) });
            // @TODO: execute migration based on storeVersion
            yield (0, effects_1.put)(actions.refreshStore(Object.assign({ userID: user.id }, partialState)));
        }
        yield (0, effects_1.delay)(5000); // !!! THis is here for a bug on slower devices that cause the app to crash on sign up. Did no debug further. Note only occurs on much older phones
        yield (0, effects_1.call)(navigationService_1.navigateAndReset, 'MainStack', null);
    }
    catch (error) {
        let errorMessage = 'request_fail';
        if (error && error.response && error.response.data) {
            if (error.response.data.name === 'BadRequestError') {
                errorMessage = 'login_failed';
            }
            if (error.response.data.name !== 'BadRequestError') {
                errorMessage = error.response.data.message;
            }
        }
        yield (0, effects_1.put)(actions.loginFailure({
            error: errorMessage,
        }));
    }
}
function* onCreateAccountRequest(action) {
    const dateSignedUp = moment_1.default.utc().toISOString();
    const { id, name, dateOfBirth, gender, location, country, province, password, secretAnswer, secretQuestion, } = action.payload;
    try {
        const { appToken, user } = yield HttpClient_1.httpClient.signup({
            name,
            password,
            dateOfBirth,
            gender,
            location,
            country,
            province,
            secretAnswer,
            secretQuestion,
            preferredId: id || null,
            dateSignedUp,
        });
        if (!appToken || !user || !user.id) {
            throw new Error(`Invalid data`);
        }
        yield (0, effects_1.put)(actions.createAccountSuccess({
            appToken,
            user: {
                id: user.id,
                name,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                location: user.location,
                country: user.country,
                province: user.province,
                secretQuestion: user.secretQuestion,
                secretAnswer: user.secretAnswer,
                password,
                dateSignedUp,
            },
        }));
    }
    catch (error) {
        const errorStatusCode = error && error.response && error.response.status ? error.response.status : null; // to check various error codes and respond accordingly
        yield (0, effects_1.put)(actions.setAuthError({ error: errorStatusCode }));
        yield (0, effects_1.put)(actions.createAccountFailure());
        yield (0, effects_1.put)(actions.loginSuccessAsGuestAccount({
            id: id || (0, uuid_1.v4)(),
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
        }));
    }
}
function* onCreateAccountSuccess(action) {
    const { appToken, user } = action.payload;
    yield (0, effects_1.put)(actions.loginSuccess({
        appToken,
        user: {
            id: user.id,
            name: user.name,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            location: user.location,
            country: user.country,
            province: user.province,
            password: user.password,
            secretQuestion: user.secretQuestion,
            secretAnswer: user.secretAnswer,
            dateSignedUp: user.dateSignedUp,
        },
    }));
}
function* onDeleteAccountRequest(action) {
    const { setLoading } = action.payload;
    const state = yield (0, effects_1.select)();
    const user = selectors.currentUserSelector(state);
    setLoading(true);
    try {
        const { name, password } = action.payload;
        yield HttpClient_1.httpClient.deleteUserFromPassword({
            name,
            password,
        });
        yield (0, effects_1.put)(actions.updateAllSurveyContent([])); // TODO_ALEX
        yield (0, effects_1.put)(actions.updateCompletedSurveys([])); // TODO_ALEX
        yield (0, effects_1.put)(actions.fetchSurveyContentSuccess({
            surveys: null,
        }));
        yield (0, effects_1.call)(navigationService_1.navigateAndReset, 'LoginStack', null);
        if (user) {
            yield (0, effects_1.put)(actions.logout());
        }
    }
    catch (err) {
        setLoading(false);
        react_native_1.Alert.alert('Error', 'Unable to delete the account');
    }
}
function* onLogoutRequest() {
    const isTtsActive = yield (0, effects_1.select)(selectors.isTtsActiveSelector);
    if (isTtsActive) {
        yield (0, effects_1.call)(textToSpeech_1.closeOutTTs);
        yield (0, effects_1.put)(actions.setTtsActive(false));
    }
    yield (0, effects_1.put)(actions.updateAllSurveyContent([])); // TODO_ALEX: survey
    yield (0, effects_1.put)(actions.fetchSurveyContentSuccess({
        surveys: null,
    }));
    yield (0, effects_1.put)(actions.updateCompletedSurveys([])); // TODO_ALEX: survey
    yield (0, effects_1.call)(navigationService_1.navigateAndReset, 'LoginStack', null);
    yield (0, effects_1.put)(actions.logout());
}
function* onJourneyCompletion(action) {
    const { data } = action.payload;
    const currentUser = yield (0, effects_1.select)(selectors.currentUserSelector);
    let periodResult = null;
    if (yield (0, network_1.fetchNetworkConnectionStatus)()) {
        try {
            periodResult = yield HttpClient_1.httpClient.getPeriodCycles({
                age: (0, moment_1.default)().diff((0, moment_1.default)(currentUser.dateOfBirth), 'years'),
                period_lengths: [0, 0, 0, 0, 0, 0, 0, 0, 0, data[2].answer + 1],
                cycle_lengths: [0, 0, 0, 0, 0, 0, 0, 0, 0, (data[3].answer + 1) * 7 + data[2].answer + 1],
            });
        }
        catch (error) {
            // console.log( error);
        }
    }
    const stateToSet = prediction_1.PredictionState.fromData({
        isActive: data[0].answer === 'Yes' ? true : false,
        startDate: (0, moment_1.default)(data[1].answer, 'DD-MMM-YYYY'),
        periodLength: data[2].answer + 1,
        cycleLength: (data[3].answer + 1) * 7 + data[2].answer + 1,
        smaCycleLength: periodResult
            ? periodResult.predicted_cycles[0]
            : (data[3].answer + 1) * 7 + data[2].answer + 1,
        smaPeriodLength: periodResult ? periodResult.predicted_periods[0] : data[2].answer + 1,
        history: [],
    });
    yield (0, effects_1.put)(actions.setPredictionEngineState(stateToSet));
    yield (0, effects_1.put)(actions.updateFuturePrediction(true, null));
    yield (0, effects_1.put)(actions.setTutorialOneActive(true));
    yield (0, effects_1.put)(actions.setTutorialTwoActive(true));
    yield (0, effects_1.delay)(5000); // !!! THis is here for a bug on slower devices that cause the app to crash on sign up. Did no debug further. Note only occurs on much older phones
    yield (0, effects_1.call)(navigationService_1.navigateAndReset, 'MainStack', null);
}
function* authSaga() {
    yield (0, effects_1.all)([
        (0, effects_1.takeLatest)(redux_persist_1.REHYDRATE, onRehydrate),
        (0, effects_1.takeLatest)('LOGOUT_REQUEST', onLogoutRequest),
        (0, effects_1.takeLatest)('LOGIN_REQUEST', onLoginRequest),
        (0, effects_1.takeLatest)('DELETE_ACCOUNT_REQUEST', onDeleteAccountRequest),
        (0, effects_1.takeLatest)('CREATE_ACCOUNT_REQUEST', onCreateAccountRequest),
        (0, effects_1.takeLatest)('CREATE_ACCOUNT_SUCCESS', onCreateAccountSuccess),
        (0, effects_1.takeLatest)('CONVERT_GUEST_ACCOUNT', onConvertGuestAccount),
        (0, effects_1.takeLatest)('JOURNEY_COMPLETION', onJourneyCompletion),
    ]);
}
//# sourceMappingURL=authSaga.js.map