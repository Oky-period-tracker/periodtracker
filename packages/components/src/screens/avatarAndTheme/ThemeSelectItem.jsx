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
exports.ThemeSelectItem = ThemeSelectItem;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const ThemeContext_1 = require("../../components/context/ThemeContext");
const PredictionProvider_1 = require("../../components/context/PredictionProvider");
const index_1 = require("../../assets/index");
const react_native_fast_image_1 = __importDefault(require("react-native-fast-image"));
function getBackgroundImage(theme, onPeriod) {
    const background = index_1.assets.backgrounds[theme];
    if (!background) {
        throw new Error(`Background not found background with theme "${theme}"`);
    }
    if (onPeriod) {
        return background.onPeriod;
    }
    return background.default;
}
function ThemeSelectItem(_a) {
    var { theme = null } = _a, props = __rest(_a, ["theme"]);
    const { id } = (0, ThemeContext_1.useTheme)();
    const { onPeriod } = (0, PredictionProvider_1.useTodayPrediction)();
    const backgroundImage = getBackgroundImage(theme || id, onPeriod);
    return <ImageFast source={backgroundImage} {...props}/>;
}
const ImageFast = (0, native_1.default)(react_native_fast_image_1.default) `
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;
//# sourceMappingURL=ThemeSelectItem.jsx.map