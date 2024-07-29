"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessibilityLabel = exports.closeOutTTs = exports.clearTTSQueue = exports.speakArray = void 0;
const react_native_tts_1 = __importDefault(require("react-native-tts"));
const i18n_1 = require("../i18n");
const react_native_1 = require("react-native");
let globalSpeakInstance = 0;
const speakArray = (screenText) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, screenText_1, screenText_1_1;
    var _b, e_1, _c, _d;
    globalSpeakInstance++;
    try {
        const currentGlobalInstance = globalSpeakInstance;
        try {
            for (_a = true, screenText_1 = __asyncValues(screenText); screenText_1_1 = yield screenText_1.next(), _b = screenText_1_1.done, !_b; _a = true) {
                _d = screenText_1_1.value;
                _a = false;
                const textEntry = _d;
                if (currentGlobalInstance !== globalSpeakInstance) {
                    throw new Error();
                }
                yield speakTts(textEntry.replace(/oky/gi, 'oh key'));
                yield sleep(1000);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = screenText_1.return)) yield _c.call(screenText_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    catch (err) {
        // nothing..
    }
});
exports.speakArray = speakArray;
const clearTTSQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    return react_native_tts_1.default.stop();
});
exports.clearTTSQueue = clearTTSQueue;
const closeOutTTs = () => __awaiter(void 0, void 0, void 0, function* () {
    yield react_native_tts_1.default.stop();
    (0, exports.speakArray)([(0, i18n_1.translate)('thank_you')]);
});
exports.closeOutTTs = closeOutTTs;
const speakTts = (speech) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        react_native_tts_1.default.speak(speech);
        const cb = (event) => {
            resolve(event);
            react_native_tts_1.default.removeEventListener('tts-finish', cb);
        };
        react_native_tts_1.default.addEventListener('tts-finish', cb);
    });
});
const sleep = (ms) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => setTimeout(resolve, ms));
});
const getAccessibilityLabel = (defaultLabel) => {
    if (react_native_1.Platform.OS === 'ios') {
        return `${defaultLabel}. ${(0, i18n_1.translate)('accessibility_prompt')}`;
    }
    return defaultLabel;
};
exports.getAccessibilityLabel = getAccessibilityLabel;
//# sourceMappingURL=textToSpeech.js.map