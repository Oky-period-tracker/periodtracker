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
exports.moderateScale = void 0;
exports.ThemeProvider = ThemeProvider;
exports.useTheme = useTheme;
const react_1 = __importDefault(require("react"));
const styled_components_1 = require("styled-components");
const useSelector_1 = require("../../hooks/useSelector");
const selectors = __importStar(require("../../redux/selectors"));
const core_1 = require("@oky/core");
function ThemeProvider({ children }) {
    const themeName = (0, useSelector_1.useSelector)((state) => state.app.theme);
    const locale = (0, useSelector_1.useSelector)(selectors.currentLocaleSelector);
    return (<styled_components_1.ThemeProvider theme={Object.assign(Object.assign({}, core_1.themes[themeName]), { fontSize: (0, exports.moderateScale)(core_1.themes[themeName].fontSize, locale) })}>
      {children}
    </styled_components_1.ThemeProvider>);
}
function useTheme() {
    const themeContext = react_1.default.useContext(styled_components_1.ThemeContext);
    if (themeContext === undefined) {
        throw new Error(`useTheme must be used within a ThemeProvider`);
    }
    return themeContext;
}
// TODO_ALEX apply this to more languages, have a config file for it?
const moderateScale = (fontSize, locale) => {
    // why have this? Because everything said in 1 word in english takes 4 words at triple the length in mongolian so lets reduce the size for neatening up
    if (locale === 'mn') {
        return fontSize * 0.8;
    }
    return fontSize;
};
exports.moderateScale = moderateScale;
//# sourceMappingURL=ThemeContext.jsx.map