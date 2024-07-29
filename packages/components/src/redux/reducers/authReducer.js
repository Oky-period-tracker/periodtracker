"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authReducer = authReducer;
const redux_persist_1 = require("redux-persist");
const lodash_1 = __importDefault(require("lodash"));
const initialState = {
    appToken: null,
    error: null,
    isCreatingAccount: false,
    isLoggingIn: false,
    loginFailedCount: 0,
    connectAccountAttempts: 0,
    user: null,
};
function authReducer(state = initialState, action) {
    switch (action.type) {
        case redux_persist_1.REHYDRATE:
            return Object.assign(Object.assign({}, (action.payload && action.payload.auth)), lodash_1.default.pick(initialState, ['error', 'isLoggingIn', 'loginFailedCount', 'isCreatingAccount']));
        case 'LOGIN_REQUEST':
            return Object.assign(Object.assign({}, state), { error: null, isLoggingIn: true });
        case 'LOGIN_SUCCESS':
            return Object.assign(Object.assign({}, state), { appToken: action.payload.appToken, error: null, isLoggingIn: false, loginFailedCount: 0, connectAccountAttempts: 0, user: {
                    id: action.payload.user.id,
                    name: action.payload.user.name,
                    dateOfBirth: action.payload.user.dateOfBirth,
                    gender: action.payload.user.gender,
                    location: action.payload.user.location,
                    country: action.payload.user.country,
                    province: action.payload.user.province,
                    password: action.payload.user.password,
                    secretQuestion: action.payload.user.secretQuestion,
                    secretAnswer: action.payload.user.secretAnswer,
                    dateSignedUp: action.payload.user.dateSignedUp,
                    isGuest: false,
                } });
        case 'LOGIN_SUCCESS_AS_GUEST_ACCOUNT':
            return Object.assign(Object.assign({}, state), { appToken: null, isLoggingIn: false, loginFailedCount: 0, user: {
                    id: action.payload.id,
                    name: action.payload.name,
                    dateOfBirth: action.payload.dateOfBirth,
                    gender: action.payload.gender,
                    location: action.payload.location,
                    country: action.payload.country,
                    province: action.payload.province,
                    password: action.payload.password,
                    secretQuestion: action.payload.secretQuestion,
                    secretAnswer: action.payload.secretAnswer,
                    dateSignedUp: action.payload.dateSignedUp,
                    isGuest: true,
                } });
        case 'LOGIN_FAILURE':
            return Object.assign(Object.assign({}, state), { appToken: null, loginFailedCount: state.loginFailedCount + 1, error: action.payload.error, isLoggingIn: false, user: null });
        case 'LOGOUT':
            return Object.assign(Object.assign({}, state), { appToken: null, isLoggingIn: false, user: null });
        case 'SET_AUTH_ERROR':
            return Object.assign(Object.assign({}, state), { error: action.payload.error });
        case 'CREATE_ACCOUNT_REQUEST':
            return Object.assign(Object.assign({}, state), { isCreatingAccount: true, error: null });
        case 'CREATE_ACCOUNT_SUCCESS':
            return Object.assign(Object.assign({}, state), { isCreatingAccount: false });
        case 'CREATE_ACCOUNT_FAILURE':
            return Object.assign(Object.assign({}, state), { connectAccountAttempts: state.connectAccountAttempts + 1, isCreatingAccount: false });
        case 'EDIT_USER':
            return Object.assign(Object.assign({}, state), { user: Object.assign(Object.assign({}, state.user), lodash_1.default.omitBy(action.payload, lodash_1.default.isNil)) });
        default:
            return state;
    }
}
//# sourceMappingURL=authReducer.js.map