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
exports.DisplayTextProvider = DisplayTextProvider;
exports.useDisplayText = useDisplayText;
const react_1 = __importDefault(require("react"));
const react_native_tts_1 = __importDefault(require("react-native-tts"));
const lodash_1 = __importDefault(require("lodash"));
const i18n_1 = require("../../i18n");
const useSelector_1 = require("../../hooks/useSelector");
const selectors = __importStar(require("../../redux/selectors"));
const DisplayTextContext = react_1.default.createContext(undefined);
function DisplayTextProvider({ children }) {
    const availableText = (0, useSelector_1.useSelector)(selectors.allAvatarText);
    const [text, setText] = react_1.default.useState(null);
    const hasTtsActive = (0, useSelector_1.useSelector)(selectors.isTtsActiveSelector);
    const setDisplayTextRandom = () => {
        var _a;
        setText((_a = lodash_1.default.sample(availableText)) === null || _a === void 0 ? void 0 : _a.content);
    };
    const setDisplayTextStatic = (translationKey) => {
        setText((0, i18n_1.translate)(translationKey));
    };
    const hideDisplayText = () => {
        setText(null);
    };
    react_1.default.useEffect(() => {
        if (!hasTtsActive || !text) {
            return;
        }
        const translateText = (0, i18n_1.translate)(text);
        react_native_tts_1.default.speak(translateText);
    }, [text]);
    return (<DisplayTextContext.Provider value={{
            text,
            setDisplayTextRandom,
            setDisplayTextStatic,
            hideDisplayText,
        }}>
      {children}
    </DisplayTextContext.Provider>);
}
function useDisplayText() {
    const displayTextContext = react_1.default.useContext(DisplayTextContext);
    if (displayTextContext === undefined) {
        throw new Error(`useDisplayText must be used within a DisplayTextProvider`);
    }
    return displayTextContext;
}
//# sourceMappingURL=DisplayTextContext.jsx.map