"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarOption = AvatarOption;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const native_1 = __importDefault(require("styled-components/native"));
const AvatarSelectItem_1 = require("../AvatarSelectItem");
const Icon_1 = require("../../../components/common/Icon");
const index_1 = require("../../../assets/index");
const Text_1 = require("../../../components/common/Text");
function AvatarOption({ avatar, isSelected, onSelect = null, style = null, nameStyle = null, isDisabled = false, }) {
    return (<Option disabled={isDisabled} style={style} onPress={onSelect} isSelected={isSelected} activeOpacity={1}>
      <AvatarSelectItem_1.AvatarSelectItem avatarName={avatar}/>
      <AvatarName style={Object.assign({ textTransform: 'capitalize' }, nameStyle)}>{avatar}</AvatarName>
      {isSelected && (<Tick>
          <Icon_1.Icon source={index_1.assets.static.icons.tick} style={styles.icon}/>
        </Tick>)}
    </Option>);
}
const Option = (0, native_1.default)(react_native_1.TouchableOpacity) `
  align-items: center;
  margin-bottom: 8px;
  width: 24%;
  max-width: 100px;
  max-height: 100px;
`;
const Tick = native_1.default.View `
  position: absolute;
  top: 10;
  left: 10;
  justify-content: center;
  align-items: center;
`;
const AvatarName = (0, native_1.default)(Text_1.Text) `
  color: #f49200;
  font-size: 12;
  font-family: Roboto-Black;
  top: 2px;
  position: absolute;
`;
const styles = react_native_1.StyleSheet.create({
    icon: { width: 20, height: 20 },
});
//# sourceMappingURL=AvatarOption.jsx.map