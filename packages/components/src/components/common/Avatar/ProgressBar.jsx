"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressBar = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const ProgressBar = ({ value = 50, borderRadius = 20, height = 8, width = 55, color = '#F49200', emptyFill = '#FFF', }) => {
    const fill = value !== 100;
    const borderLeftRadius = fill ? borderRadius : 0;
    const borderRightRadius = fill ? 0 : borderRadius;
    const progress = Math.floor(value / 5) * 5;
    return (<react_native_1.View style={{
            width,
            flexDirection: 'row',
            height,
            borderRadius,
            backgroundColor: fill ? emptyFill : color,
            justifyContent: fill ? 'flex-start' : 'flex-end',
            borderWidth: 1,
            borderColor: color,
        }}>
      <react_native_1.View style={{
            width: fill ? progress + '%' : 100 - progress + '%',
            height: height - 2,
            backgroundColor: fill ? color : emptyFill,
            borderTopRightRadius: borderRightRadius,
            borderBottomRightRadius: borderRightRadius,
            borderBottomLeftRadius: borderLeftRadius,
            borderTopLeftRadius: borderLeftRadius,
        }}/>
    </react_native_1.View>);
};
exports.ProgressBar = ProgressBar;
//# sourceMappingURL=ProgressBar.jsx.map