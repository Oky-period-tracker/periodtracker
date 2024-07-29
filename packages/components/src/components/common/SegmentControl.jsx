"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SegmentControl = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const index_1 = require("../../assets/index");
const Text_1 = require("./Text");
const SegmentControl = ({ option, onPress, isActive = false, }) => {
    const opacity = 0.4 + Number(isActive) * 0.6;
    return (<Touchable onPress={onPress}>
      <Block style={{ opacity }}>
        <Icon source={isActive ? index_1.assets.static.icons[option] : index_1.assets.static.icons[option + 'Grey']} resizeMode="contain"/>
        <Text_1.Text style={{ fontFamily: 'Roboto-Regular', fontSize: 10, textAlign: 'center' }}>
          {option}
        </Text_1.Text>
      </Block>
    </Touchable>);
};
exports.SegmentControl = SegmentControl;
const Block = native_1.default.View `
  width: 80;
  align-items: center;
`;
const Touchable = native_1.default.TouchableOpacity ``;
const Icon = native_1.default.ImageBackground `
  height: 40px;
  width: 40px;
  justify-content: center;
  align-items: center;
`;
//# sourceMappingURL=SegmentControl.jsx.map