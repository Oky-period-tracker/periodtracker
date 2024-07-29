"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerReducer = answerReducer;
const redux_1 = require("redux");
const dateUtils_1 = require("../../services/dateUtils");
function surveysReducer(state = {}, action) {
    if (action.type === 'ANSWER_SURVEY') {
        return Object.assign(Object.assign({}, state), { [action.payload.id]: {
                id: action.payload.id,
                user_id: action.payload.user_id,
                isCompleted: action.payload.isCompleted,
                isSurveyAnswered: action.payload.isSurveyAnswered,
                questions: action.payload.questions,
                utcDateTime: action.payload.utcDateTime.toISOString(),
            } });
    }
    return state;
}
function quizzesReducer(state = {}, action) {
    if (action.type === 'ANSWER_QUIZ') {
        return Object.assign(Object.assign({}, state), { [action.payload.id]: {
                id: action.payload.id,
                question: action.payload.question,
                answerID: action.payload.answerID,
                emoji: action.payload.emoji,
                answer: action.payload.answer,
                isCorrect: action.payload.isCorrect,
                response: action.payload.response,
                utcDateTime: action.payload.utcDateTime.toISOString(),
            } });
    }
    return state;
}
function cardsReducer(state = {}, action) {
    if (action.type === 'ANSWER_DAILY_CARD') {
        const keyCard = (0, dateUtils_1.toShortISO)(action.payload.utcDateTime);
        let answersToInsert = [];
        // Added as a way of handling multiple selections and to account for the initial release of single selections (Painful, I know)
        if (state[keyCard] !== undefined &&
            state[keyCard][action.payload.cardName] &&
            !action.payload.mutuallyExclusive &&
            action.payload.cardName !== 'periodDay') {
            if (typeof state[keyCard][action.payload.cardName] === 'string') {
                // This is to account for old data that used to just be a string and now we need to have multiple
                // we put that string as part of an array before concatenating the new answers
                answersToInsert = [state[keyCard][action.payload.cardName]].concat(action.payload.answer);
            }
            else {
                if (state[keyCard][action.payload.cardName].includes(action.payload.answer)) {
                    // Remove if already contained (toggle ability)
                    answersToInsert = state[keyCard][action.payload.cardName].filter((item) => item !== action.payload.answer);
                }
                else {
                    answersToInsert = state[keyCard][action.payload.cardName].concat(action.payload.answer);
                }
            }
        }
        else {
            answersToInsert = [action.payload.answer];
        }
        return Object.assign(Object.assign({}, state), { [keyCard]: Object.assign(Object.assign({}, (state[keyCard] || {})), { [action.payload.cardName]: answersToInsert }) });
    }
    return state;
}
function periodVerifyReducer(state = {}, action) {
    var _a;
    if (action.type === 'REFRESH_STORE') {
        if (!((_a = action === null || action === void 0 ? void 0 : action.payload) === null || _a === void 0 ? void 0 : _a.verifiedDates)) {
            return state;
        }
        return Object.assign({}, action.payload.verifiedDates);
    }
    if (action.type === 'ANSWER_VERIFY_DATES') {
        const keyCard = (0, dateUtils_1.toShortISO)(action.payload.utcDateTime);
        const answersToInsert = [];
        // Added as a way of handling multiple selections and to account for the initial release of single selections (Painful, I know)
        return Object.assign(Object.assign({}, state), { [keyCard]: Object.assign(Object.assign({}, (state[keyCard] || {})), { periodDay: action.payload.periodDay }) });
    }
    return state;
}
function notesReducer(state = {}, action) {
    if (action.type === 'ANSWER_NOTES_CARD') {
        const keyCard = (0, dateUtils_1.toShortISO)(action.payload.utcDateTime);
        return Object.assign(Object.assign({}, state), { [keyCard]: {
                title: action.payload.title,
                notes: action.payload.notes,
                utcDateTime: action.payload.utcDateTime,
            } });
    }
    return state;
}
const answerForUserReducer = (0, redux_1.combineReducers)({
    surveys: surveysReducer,
    quizzes: quizzesReducer,
    cards: cardsReducer,
    notes: notesReducer,
    verifiedDates: periodVerifyReducer,
});
function answerReducer(state = {}, action) {
    // TODO_ALEX: survey
    if (action.type === 'ANSWER_SURVEY') {
        return Object.assign({}, state);
    }
    if (action.type === 'ANSWER_QUIZ') {
        return Object.assign(Object.assign({}, state), { [action.payload.userID]: answerForUserReducer(state[action.payload.userID], action) });
    }
    if (action.type === 'ANSWER_DAILY_CARD') {
        return Object.assign(Object.assign({}, state), { [action.payload.userID]: answerForUserReducer(state[action.payload.userID], action) });
    }
    if (action.type === 'ANSWER_VERIFY_DATES') {
        return Object.assign(Object.assign({}, state), { [action.payload.userID]: answerForUserReducer(state[action.payload.userID], action) });
    }
    if (action.type === 'ANSWER_NOTES_CARD') {
        return Object.assign(Object.assign({}, state), { [action.payload.userID]: answerForUserReducer(state[action.payload.userID], action) });
    }
    if (action.type === 'REFRESH_STORE') {
        return Object.assign(Object.assign({}, state), { [action.payload.userID]: answerForUserReducer(state[action.payload.userID], action) });
    }
    return state;
}
//# sourceMappingURL=answerReducer.js.map