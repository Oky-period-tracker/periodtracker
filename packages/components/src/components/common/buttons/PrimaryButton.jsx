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
exports.PrimaryButton = PrimaryButton;
const react_1 = __importDefault(require("react"));
const Text_1 = require("../Text");
const native_1 = __importDefault(require("styled-components/native"));
const Icon_1 = require("../Icon");
const index_1 = require("../../../assets/index");
function PrimaryButton(_a) {
    var { children } = _a, props = __rest(_a, ["children"]);
    return (<Button {...props} activeOpacity={0.7}>
      <Text style={props.textStyle}>{children}</Text>
      {props.rightIcon ? (<Icon_1.Icon style={{
                position: 'absolute',
                right: 10,
                top: 7,
                width: 35,
                height: 35,
            }} source={index_1.assets.static.icons[props.rightIcon]}/>) : null}
    </Button>);
}
const Button = native_1.default.TouchableOpacity `
  margin-horizontal: 2px;
  margin-vertical: 2px;
  align-items: center;
  justify-content: center;
  height: 50px;
  background-color: white;
  elevation: 4;
  border-radius: 10px;
  max-width: 200px;
`;
const Text = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Black;
  font-size: 16;
  text-align: center;
  color: #000;
`;
//# sourceMappingURL=PrimaryButton.jsx.map