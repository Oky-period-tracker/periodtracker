"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceFontScale = void 0;
const react_native_1 = require("react-native");
const getDeviceFontScale = () => {
    const fontScale = react_native_1.PixelRatio.getFontScale();
    if (fontScale > 1.15) {
        return 'EXTRA_LARGE';
    }
    if (fontScale > 1) {
        return 'LARGE';
    }
    return 'NORMAL';
};
exports.getDeviceFontScale = getDeviceFontScale;
//# sourceMappingURL=font.js.map