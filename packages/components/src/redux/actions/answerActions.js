"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerSurvey = answerSurvey;
exports.answerQuiz = answerQuiz;
exports.answerDailyCard = answerDailyCard;
exports.answerVerifyDates = answerVerifyDates;
exports.answerNotesCard = answerNotesCard;
exports.shareApp = shareApp;
exports.migrateAnswerData = migrateAnswerData;
const helpers_1 = require("../helpers");
function answerSurvey(payload) {
    return (0, helpers_1.createAction)('ANSWER_SURVEY', payload);
}
function answerQuiz(payload) {
    return (0, helpers_1.createAction)('ANSWER_QUIZ', payload);
}
function answerDailyCard(payload) {
    return (0, helpers_1.createAction)('ANSWER_DAILY_CARD', payload);
}
function answerVerifyDates(payload) {
    return (0, helpers_1.createAction)('ANSWER_VERIFY_DATES', payload);
}
function answerNotesCard(payload) {
    return (0, helpers_1.createAction)('ANSWER_NOTES_CARD', payload);
}
function shareApp() {
    return (0, helpers_1.createAction)('SHARE_APP');
}
function migrateAnswerData(payload) {
    return (0, helpers_1.createAction)('MIGRATE_ANSWER_DATA', payload);
}
//# sourceMappingURL=answerActions.js.map