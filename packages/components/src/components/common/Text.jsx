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
exports.Text = Text;
exports.TextWithoutTranslation = TextWithoutTranslation;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const i18n_1 = require("../../i18n");
function Text(_a) {
    var { children, style = null, enableTranslate = true } = _a, props = __rest(_a, ["children", "style", "enableTranslate"]);
    return (<react_native_1.Text style={[{ fontFamily: 'Roboto-Medium' }, style]} {...props}>
      {enableTranslate ? (0, i18n_1.translate)(children) : children}
    </react_native_1.Text>);
}
function TextWithoutTranslation(props) {
    return <Text style={{ color: '#000' }} enableTranslate={false} {...props}/>;
}
//# sourceMappingURL=Text.jsx.map