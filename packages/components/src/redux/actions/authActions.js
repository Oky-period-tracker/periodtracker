"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRequest = loginRequest;
exports.loginSuccess = loginSuccess;
exports.loginSuccessAsGuestAccount = loginSuccessAsGuestAccount;
exports.loginFailure = loginFailure;
exports.logoutRequest = logoutRequest;
exports.logout = logout;
exports.createAccountRequest = createAccountRequest;
exports.deleteAccountRequest = deleteAccountRequest;
exports.createAccountSuccess = createAccountSuccess;
exports.createAccountFailure = createAccountFailure;
exports.convertGuestAccount = convertGuestAccount;
exports.editUser = editUser;
exports.journeyCompletion = journeyCompletion;
exports.setAuthError = setAuthError;
const helpers_1 = require("../helpers");
function loginRequest({ name, password }) {
    return (0, helpers_1.createAction)('LOGIN_REQUEST', { name, password });
}
function loginSuccess({ appToken, user: { id, name, dateOfBirth, gender, location, country, province, password, secretQuestion, secretAnswer, dateSignedUp, }, }) {
    return (0, helpers_1.createAction)('LOGIN_SUCCESS', {
        appToken,
        user: {
            id,
            name,
            dateOfBirth,
            gender,
            location,
            country,
            province,
            password,
            secretQuestion,
            secretAnswer,
            dateSignedUp,
        },
    });
}
function loginSuccessAsGuestAccount({ id, name, dateOfBirth, gender, location, country, province, password, secretQuestion, secretAnswer, dateSignedUp, }) {
    return (0, helpers_1.createAction)('LOGIN_SUCCESS_AS_GUEST_ACCOUNT', {
        id,
        name,
        dateOfBirth,
        gender,
        location,
        country,
        province,
        password,
        secretQuestion,
        secretAnswer,
        dateSignedUp,
    });
}
function loginFailure({ error }) {
    return (0, helpers_1.createAction)('LOGIN_FAILURE', { error });
}
function logoutRequest() {
    return (0, helpers_1.createAction)('LOGOUT_REQUEST');
}
function logout() {
    return (0, helpers_1.createAction)('LOGOUT');
}
function createAccountRequest({ id = null, name, dateOfBirth, gender, location, country, province, password, secretQuestion, secretAnswer, }) {
    return (0, helpers_1.createAction)('CREATE_ACCOUNT_REQUEST', {
        id,
        name,
        dateOfBirth,
        gender,
        location,
        country,
        province,
        password,
        secretQuestion,
        secretAnswer,
    });
}
function deleteAccountRequest({ name, password, setLoading }) {
    return (0, helpers_1.createAction)('DELETE_ACCOUNT_REQUEST', {
        name,
        password,
        setLoading,
    });
}
function createAccountSuccess({ appToken, user: { id, name, password, dateOfBirth, gender, location, country, province, secretQuestion, secretAnswer, dateSignedUp, }, }) {
    return (0, helpers_1.createAction)('CREATE_ACCOUNT_SUCCESS', {
        appToken,
        user: {
            id,
            name,
            dateOfBirth,
            gender,
            location,
            country,
            province,
            password,
            secretQuestion,
            secretAnswer,
            dateSignedUp,
        },
    });
}
function createAccountFailure() {
    return (0, helpers_1.createAction)('CREATE_ACCOUNT_FAILURE');
}
function convertGuestAccount({ id, name, dateOfBirth, gender, location, country, province, password, secretQuestion, secretAnswer, }) {
    return (0, helpers_1.createAction)('CONVERT_GUEST_ACCOUNT', {
        id,
        name,
        password,
        dateOfBirth,
        gender,
        location,
        country,
        province,
        secretQuestion,
        secretAnswer,
    });
}
function editUser({ name = null, dateOfBirth = null, gender = null, location = null, password = null, secretQuestion = null, secretAnswer = null, }) {
    return (0, helpers_1.createAction)('EDIT_USER', {
        name,
        dateOfBirth,
        gender,
        location,
        password,
        secretQuestion,
        secretAnswer,
    });
}
function journeyCompletion({ data = null }) {
    return (0, helpers_1.createAction)('JOURNEY_COMPLETION', { data });
}
function setAuthError({ error }) {
    return (0, helpers_1.createAction)('SET_AUTH_ERROR', { error });
}
//# sourceMappingURL=authActions.js.map