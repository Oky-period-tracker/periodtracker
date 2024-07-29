"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootReducer = rootReducer;
const lodash_1 = __importDefault(require("lodash"));
const redux_1 = require("redux");
const analyticsReducer_1 = require("./analyticsReducer");
const answerReducer_1 = require("./answerReducer");
const appReducer_1 = require("./appReducer");
const authReducer_1 = require("./authReducer");
const contentReducer_1 = require("./contentReducer");
const predictionReducer_1 = require("./predictionReducer");
const reducer = (0, redux_1.combineReducers)({
    analytics: analyticsReducer_1.analyticsReducer,
    answer: answerReducer_1.answerReducer,
    app: appReducer_1.appReducer,
    auth: authReducer_1.authReducer,
    content: contentReducer_1.contentReducer,
    prediction: predictionReducer_1.predictionReducer,
    // flower: flowerReducer, TODO: Flower state should be saved per user
});
function rootReducer(state, action) {
    switch (action.type) {
        case 'LOGOUT':
            // @ts-ignore
            return reducer(lodash_1.default.pick(state, 'app', 'content', 'answer'), action);
        default:
            return reducer(state, action);
    }
}
//# sourceMappingURL=index.js.map