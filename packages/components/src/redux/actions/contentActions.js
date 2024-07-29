"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStaleContent = initStaleContent;
exports.fetchSurveyContentRequest = fetchSurveyContentRequest;
exports.fetchSurveyContentSuccess = fetchSurveyContentSuccess;
exports.updateAllSurveyContent = updateAllSurveyContent;
exports.updateCompletedSurveys = updateCompletedSurveys;
exports.fetchContentRequest = fetchContentRequest;
exports.fetchContentSuccess = fetchContentSuccess;
exports.fetchContentFailure = fetchContentFailure;
const helpers_1 = require("../helpers");
function initStaleContent(payload) {
    return (0, helpers_1.createAction)('INIT_STALE_CONTENT', payload);
}
function fetchSurveyContentRequest(userID) {
    return (0, helpers_1.createAction)('FETCH_SURVEY_CONTENT_REQUEST', { userID });
}
function fetchSurveyContentSuccess(payload) {
    return (0, helpers_1.createAction)('FETCH_SURVEY_CONTENT_SUCCESS', payload);
}
function updateAllSurveyContent(allSurveys) {
    return (0, helpers_1.createAction)('UPDATE_ALL_SURVEYS_CONTENT', {
        allSurveys,
    });
}
function updateCompletedSurveys(completedSurveys) {
    return (0, helpers_1.createAction)('UPDATE_COMPLETED_SURVEYS', {
        completedSurveys,
    });
}
function fetchContentRequest(locale) {
    return (0, helpers_1.createAction)('FETCH_CONTENT_REQUEST', { locale });
}
function fetchContentSuccess(payload) {
    return (0, helpers_1.createAction)('FETCH_CONTENT_SUCCESS', payload);
}
function fetchContentFailure() {
    return (0, helpers_1.createAction)('FETCH_CONTENT_FAILURE');
}
//# sourceMappingURL=contentActions.js.map