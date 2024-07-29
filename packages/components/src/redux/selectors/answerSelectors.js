"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mostAnsweredSelector = exports.notesAnswerSelector = exports.allCardAnswersSelector = exports.verifyPeriodDaySelectorWithDate = exports.cardAnswerSelector = exports.quizzesWithoutAnswersSelector = exports.surveyAnswerByDate = exports.quizAnswerByDate = exports.quizHasAnswerSelector = exports.surveyHasAnswerSelector = void 0;
// import { allSurveysSelectors, allQuizzesSelectors } from './contentSelectors'
const contentSelectors_1 = require("./contentSelectors");
const dateUtils_1 = require("../../services/dateUtils");
const lodash_1 = __importDefault(require("lodash"));
const s = (state) => state.answer;
const surveyHasAnswerSelector = (state, id) => {
    if (!s(state)[state.auth.user.id])
        return false;
    return id in s(state)[state.auth.user.id].surveys;
};
exports.surveyHasAnswerSelector = surveyHasAnswerSelector;
// export const surveysWithoutAnswersSelector = (state: ReduxState) => {
//   return allSurveysSelectors(state).filter(({ id }) => !surveyHasAnswerSelector(state, id))
// }
const quizHasAnswerSelector = (state, id) => {
    if (!s(state)[state.auth.user.id])
        return false;
    return id in s(state)[state.auth.user.id].quizzes;
};
exports.quizHasAnswerSelector = quizHasAnswerSelector;
// Had a type error here had to add any to avoid
const quizAnswerByDate = (state, date) => {
    if (!s(state)[state.auth.user.id])
        return null;
    return Object.values(s(state)[state.auth.user.id].quizzes).filter(({ utcDateTime }) => utcDateTime === date.toISOString())[0];
};
exports.quizAnswerByDate = quizAnswerByDate;
// Had a type error here had to add any to avoid
const surveyAnswerByDate = (state, date) => {
    if (!s(state)[state.auth.user.id])
        return null;
    return Object.values(s(state)[state.auth.user.id].surveys).filter(({ utcDateTime }) => utcDateTime === date.toISOString())[0];
};
exports.surveyAnswerByDate = surveyAnswerByDate;
const quizzesWithoutAnswersSelector = (state) => {
    return (0, contentSelectors_1.allQuizzesSelectors)(state).filter(({ id }) => !(0, exports.quizHasAnswerSelector)(state, id));
};
exports.quizzesWithoutAnswersSelector = quizzesWithoutAnswersSelector;
const cardAnswerSelector = (state, date) => {
    var _a;
    if (!state.auth.user)
        return {}; // for the use case on info screen where there is no authed user
    if (!s(state)[state.auth.user.id])
        return {};
    return ((_a = s(state)[state.auth.user.id]) === null || _a === void 0 ? void 0 : _a.cards[(0, dateUtils_1.toShortISO)(date)]) || {};
};
exports.cardAnswerSelector = cardAnswerSelector;
const verifyPeriodDaySelectorWithDate = (state, date) => {
    var _a, _b;
    if (!state.auth.user)
        return {}; // for the use case on info screen where there is no authed user
    if (!s(state)[state.auth.user.id])
        return {};
    if ((_a = s(state)[state.auth.user.id]) === null || _a === void 0 ? void 0 : _a.verifiedDates) {
        return (_b = s(state)[state.auth.user.id]) === null || _b === void 0 ? void 0 : _b.verifiedDates[(0, dateUtils_1.toShortISO)(date)];
    }
    else
        return {};
    // return s(state)[state.auth.user.id]?.verifiedDates[toShortISO(date)] || {}
};
exports.verifyPeriodDaySelectorWithDate = verifyPeriodDaySelectorWithDate;
const allCardAnswersSelector = (state) => {
    var _a;
    if (!state.auth.user)
        return {}; // for the use case on info screen where there is no authed user
    if (!s(state)[state.auth.user.id])
        return {};
    return ((_a = s(state)[state.auth.user.id]) === null || _a === void 0 ? void 0 : _a.verifiedDates) || {};
};
exports.allCardAnswersSelector = allCardAnswersSelector;
const notesAnswerSelector = (state, date) => {
    if (!s(state)[state.auth.user.id])
        return {};
    return s(state)[state.auth.user.id].notes[(0, dateUtils_1.toShortISO)(date)] || {};
};
exports.notesAnswerSelector = notesAnswerSelector;
const mostAnsweredSelector = (state, startDate, endDate) => {
    if (!s(state)[state.auth.user.id])
        return {};
    const dates = Object.keys(s(state)[state.auth.user.id].cards);
    const filteredDates = dates.filter((item) => {
        return (parseInt(item, 10) > parseInt(startDate.format('YYYYMMDD'), 10) &&
            parseInt(item, 10) <= parseInt(endDate.format('YYYYMMDD'), 10));
    });
    // This creates an array of all the selected moods (now that there are multiple)
    const moodsInDateRange = filteredDates.reduce((acc, filteredDate) => {
        return acc.concat(s(state)[state.auth.user.id].cards[filteredDate].mood);
    }, []);
    // This counts occurrences of each item
    const moodCountedObject = lodash_1.default.countBy(moodsInDateRange, (mood) => mood);
    const bodyInDateRange = filteredDates.reduce((acc, filteredDate) => {
        return acc.concat(s(state)[state.auth.user.id].cards[filteredDate].body);
    }, []);
    const bodyCountedObject = lodash_1.default.countBy(bodyInDateRange, (body) => body);
    const activityInDateRange = filteredDates.reduce((acc, filteredDate) => {
        return acc.concat(s(state)[state.auth.user.id].cards[filteredDate].activity);
    }, []);
    const activityCountedObject = lodash_1.default.countBy(activityInDateRange, (activity) => activity);
    const flowInDateRange = filteredDates.reduce((acc, filteredDate) => {
        return acc.concat(s(state)[state.auth.user.id].cards[filteredDate].flow);
    }, []);
    const flowCountedObject = lodash_1.default.countBy(flowInDateRange, (flow) => flow);
    delete moodCountedObject.undefined;
    delete bodyCountedObject.undefined;
    delete activityCountedObject.undefined;
    delete flowCountedObject.undefined;
    const highestMood = Object.keys(moodCountedObject).reduce((a, b) => (moodCountedObject[a] > moodCountedObject[b] ? a : b), null);
    const highestBody = Object.keys(bodyCountedObject).reduce((a, b) => (bodyCountedObject[a] > bodyCountedObject[b] ? a : b), null);
    const highestActivity = Object.keys(activityCountedObject).reduce((a, b) => (activityCountedObject[a] > activityCountedObject[b] ? a : b), null);
    const highestFlow = Object.keys(flowCountedObject).reduce((a, b) => (flowCountedObject[a] > flowCountedObject[b] ? a : b), null);
    return {
        mood: highestMood,
        body: highestBody,
        activity: highestActivity,
        flow: highestFlow,
    };
};
exports.mostAnsweredSelector = mostAnsweredSelector;
//# sourceMappingURL=answerSelectors.js.map