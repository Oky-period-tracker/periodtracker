"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundTheme = BackgroundTheme;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const ThemeContext_1 = require("../context/ThemeContext");
const PredictionProvider_1 = require("../context/PredictionProvider");
const assets_1 = require("../../assets");
function getBackgroundImage(theme, onPeriod) {
    const background = assets_1.assets.backgrounds[theme];
    if (!background) {
        throw new Error(`Background not found background with theme "${theme}"`);
    }
    if (onPeriod) {
        return background.onPeriod;
    }
    return background.default;
}
function BackgroundTheme(_a) {
    var { theme = null } = _a, props = __rest(_a, ["theme"]);
    const { id } = (0, ThemeContext_1.useTheme)();
    const { onPeriod } = (0, PredictionProvider_1.useTodayPrediction)();
    const backgroundImage = getBackgroundImage(theme || id, onPeriod);
    return <Background source={backgroundImage} {...props}/>;
}
const Background = native_1.default.ImageBackground `
  width: 100%;
  height: 100%;
`;
//# sourceMappingURL=BackgroundTheme.jsx.map