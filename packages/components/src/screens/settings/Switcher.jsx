"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switcher = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const index_1 = require("../../assets/index");
const Text_1 = require("../../components/common/Text");
const Switcher = ({ value = false, onSwitch }) => {
    return (<Row>
      <Col>
        <Button activeOpacity={0.9} style={{ backgroundColor: value ? '#A2C72D' : '#EDEDED' }} onPress={() => onSwitch(true)}>
          <Background source={index_1.assets.static.icons.roundedMask}>
            <Icon source={index_1.assets.static.icons.tick} style={{ opacity: value ? 1 : 0.6 }}/>
          </Background>
        </Button>
        <Label>on</Label>
      </Col>
      <Col>
        <Button activeOpacity={0.9} style={{ backgroundColor: value ? '#EDEDED' : '#E3629B' }} onPress={() => onSwitch(false)}>
          <Background source={index_1.assets.static.icons.roundedMask}>
            <Icon resizeMode="contain" source={index_1.assets.static.icons.closeLine}/>
          </Background>
        </Button>
        <Label>off</Label>
      </Col>
    </Row>);
};
exports.Switcher = Switcher;
const Row = native_1.default.View `
  flex-direction: row;
`;
const Col = native_1.default.View `
  margin-horizontal: 3px;
`;
const Button = native_1.default.TouchableOpacity `
  width: 32;
  height: 32px;
  border-radius: 32px;
`;
const Background = native_1.default.ImageBackground `
  width: 32;
  height: 32px;
  justify-content: center;
  align-items: center;
`;
const Label = (0, native_1.default)(Text_1.Text) `
  font-size: 8;
  text-align: center;
  color: #000;
`;
const Icon = native_1.default.Image `
  width: 21px;
  height: 16px;
`;
//# sourceMappingURL=Switcher.jsx.map