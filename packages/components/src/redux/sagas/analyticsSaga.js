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
exports.analyticsSaga = analyticsSaga;
const effects_1 = require("redux-saga/effects");
const uuid_1 = require("uuid");
const moment_1 = __importDefault(require("moment"));
const network_1 = require("../../services/network");
const HttpClient_1 = require("../../services/HttpClient");
const actions = __importStar(require("../actions"));
const selectors = __importStar(require("../selectors"));
const ACTIONS_TO_TRACK = [
    // app
    'SET_THEME',
    'SET_LOCALE',
    // answers
    'ANSWER_SURVEY',
    'ANSWER_QUIZ',
    'SHARE_APP',
    // 'ANSWER_DAILY_CARD', // removed for privacy
    // prediction
    'ADJUST_PREDICTION',
];
function* onTrackAction(action) {
    const currentUser = yield (0, effects_1.select)(selectors.currentUserSelector);
    yield (0, effects_1.put)(actions.queueEvent({
        id: (0, uuid_1.v4)(),
        type: action.type,
        payload: action.payload || {},
        metadata: {
            date: moment_1.default.utc(),
            user: currentUser && currentUser.id ? currentUser.id : null,
        },
    }));
}
function* processEventQueue() {
    while (true) {
        // process queue every minute
        yield (0, effects_1.delay)(60 * 1000);
        const appToken = yield (0, effects_1.select)(selectors.appTokenSelector);
        const events = yield (0, effects_1.select)(selectors.allAnalyticsEventsSelector);
        const isQueueEmpty = events.length === 0;
        if (isQueueEmpty) {
            // nothing to send
            continue;
        }
        if (!(yield (0, network_1.fetchNetworkConnectionStatus)())) {
            // no internet connection
            continue;
        }
        try {
            yield HttpClient_1.httpClient.appendEvents({ events, appToken });
            yield (0, effects_1.put)(actions.resetQueue());
        }
        catch (err) {
            // ignore error, we'll try later
        }
    }
}
function* analyticsSaga() {
    yield (0, effects_1.all)([(0, effects_1.fork)(processEventQueue), (0, effects_1.takeLatest)(ACTIONS_TO_TRACK, onTrackAction)]);
}
//# sourceMappingURL=analyticsSaga.js.map