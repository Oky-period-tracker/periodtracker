"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleText = void 0;
const react_1 = __importDefault(require("react"));
const Text_1 = require("./Text");
const TitleText = ({ children, size = 26, style = null }) => (<Text_1.Text style={Object.assign({ color: '#F49200', textTransform: 'uppercase', fontFamily: 'Roboto-Black', fontSize: size }, style)}>
    {children}
  </Text_1.Text>);
exports.TitleText = TitleText;
//# sourceMappingURL=TitleText.jsx.map