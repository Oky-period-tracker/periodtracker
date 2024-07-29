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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalizeFLetter = exports.allTranslations = void 0;
exports.translate = translate;
exports.currentLocale = currentLocale;
exports.configureI18n = configureI18n;
const react_native_1 = require("react-native");
const RNLocalize = __importStar(require("react-native-localize"));
const react_native_tts_1 = __importDefault(require("react-native-tts"));
const i18n_js_1 = __importDefault(require("i18n-js"));
const core_1 = require("@oky/core");
const Flower_1 = require("../optional/Flower");
const combineTranslations = (translations) => {
    return translations.reduce((acc, translation) => {
        if (translation) {
            for (const locale in translation) {
                if (translation[locale]) {
                    if (acc[locale]) {
                        acc[locale] = Object.assign(Object.assign({}, acc[locale]), translation[locale]);
                    }
                    else {
                        acc[locale] = translation[locale];
                    }
                }
            }
        }
        return acc;
    }, {});
};
// TODO_ALEX fix typecasting
exports.allTranslations = combineTranslations([
    core_1.appTranslations,
    core_1.localeTranslations,
    core_1.themeTranslations,
    Flower_1.flowerTranslations,
]);
function translate(key) {
    return i18n_js_1.default.t(key);
}
const capitalizeFLetter = (inputString) => {
    if (inputString.length === 0)
        return '';
    return inputString[0].toUpperCase() + inputString.slice(1);
};
exports.capitalizeFLetter = capitalizeFLetter;
function currentLocale() {
    return i18n_js_1.default.locale;
}
function configureI18n(locale, rtl = false) {
    function findBestLanguage() {
        if (locale && exports.allTranslations[locale]) {
            return {
                languageTag: locale,
                isRTL: rtl,
            };
        }
        return (RNLocalize.findBestAvailableLanguage(Object.keys(exports.allTranslations)) || {
            languageTag: core_1.defaultLocale,
            isRTL: false,
        });
    }
    const { languageTag, isRTL } = findBestLanguage();
    // update layout direction
    react_native_1.I18nManager.forceRTL(isRTL);
    // set i18n-js config
    i18n_js_1.default.translations = { [languageTag]: exports.allTranslations[languageTag] };
    i18n_js_1.default.locale = languageTag;
    // on production, we fallback to the translation key instead of missing translation
    if (!__DEV__) {
        i18n_js_1.default.missingTranslation = (id) => id;
    }
    // tslint:disable-next-line: no-floating-promises
    configureTts(languageTag);
}
function configureTts(locale) {
    return __awaiter(this, void 0, void 0, function* () {
        yield react_native_tts_1.default.getInitStatus();
        const voices = yield react_native_tts_1.default.voices();
        const availableVoices = voices
            .filter((voice) => !voice.notInstalled)
            .map((voice) => {
            return { id: voice.id, name: voice.name, language: voice.language };
        });
        const allMyLocalVoices = availableVoices.filter((voice) => {
            return voice.language && voice.language.startsWith(`${locale}-`);
        });
        if (allMyLocalVoices.length === 0) {
            return;
        }
        const preferableVoice = allMyLocalVoices.find((voice) => {
            return voice.name && voice.name.includes('female');
        });
        const chosenVoice = preferableVoice || allMyLocalVoices[0];
        return Promise.all([
            react_native_tts_1.default.setDefaultLanguage(chosenVoice.language),
            react_native_tts_1.default.setDefaultVoice(chosenVoice.id),
        ]);
    });
}
//# sourceMappingURL=index.js.map