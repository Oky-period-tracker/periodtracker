"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Icon = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const Icon = ({ source, style = null }) => {
    return <ImageContainer resizeMode="contain" source={source} style={style}/>;
};
exports.Icon = Icon;
const ImageContainer = native_1.default.Image `
  height: 20px;
  width: 20px;
`;
//# sourceMappingURL=Icon.jsx.map