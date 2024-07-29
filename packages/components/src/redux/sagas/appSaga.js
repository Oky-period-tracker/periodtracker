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
exports.appSaga = appSaga;
const lodash_1 = __importDefault(require("lodash"));
const effects_1 = require("redux-saga/effects");
const HttpClient_1 = require("../../services/HttpClient");
const network_1 = require("../../services/network");
const store_1 = require("../store");
const actions = __importStar(require("../actions"));
const selectors = __importStar(require("../selectors"));
const messaging_1 = __importDefault(require("@react-native-firebase/messaging"));
function* syncAppState() {
    var _a;
    let lastAppState;
    while (true) {
        // process queue every minute
        yield (0, effects_1.delay)(60 * 1000);
        const appToken = yield (0, effects_1.select)(selectors.appTokenSelector);
        const currentUser = yield (0, effects_1.select)(selectors.currentUserSelector);
        if (!appToken || !currentUser) {
            // not logged
            continue;
        }
        const state = yield (0, effects_1.select)();
        const appState = {
            app: state.app,
            prediction: state.prediction,
            verifiedDates: (_a = state.answer[currentUser === null || currentUser === void 0 ? void 0 : currentUser.id]) === null || _a === void 0 ? void 0 : _a.verifiedDates,
        };
        if (lodash_1.default.isEqual(appState, lastAppState)) {
            // bailout, nothing changed from last sync
            continue;
        }
        if (!(yield (0, network_1.fetchNetworkConnectionStatus)())) {
            // no internet connection
            continue;
        }
        try {
            yield HttpClient_1.httpClient.replaceStore({
                storeVersion: store_1.version,
                appState,
                appToken,
            });
            lastAppState = appState;
        }
        catch (err) {
            // ignore error, we'll try later
        }
    }
}
function* onRequestStoreFirebaseKey() {
    if (yield (0, network_1.fetchNetworkConnectionStatus)()) {
        // no internet connection
        const firebaseToken = yield (0, messaging_1.default)().getToken();
        yield (0, effects_1.put)(actions.storeFirebaseKey(firebaseToken));
    }
}
function* appSaga() {
    yield (0, effects_1.all)([
        (0, effects_1.fork)(syncAppState),
        (0, effects_1.takeLatest)('REQUEST_STORE_FIREBASE_KEY', onRequestStoreFirebaseKey),
    ]);
}
//# sourceMappingURL=appSaga.js.map