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
exports.IconButton = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const assets_1 = require("../../../assets");
const tablet_1 = require("../../../config/tablet");
const defaultSize = tablet_1.IS_TABLET ? 32 : 20;
const IconButton = (_a) => {
    var { name, onPress, width = defaultSize, height = defaultSize, touchableStyle = null, disabled = false } = _a, props = __rest(_a, ["name", "onPress", "width", "height", "touchableStyle", "disabled"]);
    return (<react_native_1.TouchableOpacity disabled={disabled} style={[styles.default, touchableStyle]} onPress={onPress}>
      <react_native_1.Image source={assets_1.assets.static.icons[name]} style={{ width, height }} {...props}/>
    </react_native_1.TouchableOpacity>);
};
exports.IconButton = IconButton;
const styles = react_native_1.StyleSheet.create({
    default: {
        zIndex: 999,
    },
});
//# sourceMappingURL=IconButton.jsx.map