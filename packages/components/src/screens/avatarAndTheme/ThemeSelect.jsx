"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeSelect = ThemeSelect;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const ThemeSelectItem_1 = require("./ThemeSelectItem");
const Icon_1 = require("../../components/common/Icon");
const index_1 = require("../../assets/index");
const Text_1 = require("../../components/common/Text");
const react_native_1 = require("react-native");
function ThemeSelect({ themes, value, onSelect, }) {
    return (<Container>
      {themes.map((theme) => (<Option key={theme} onPress={() => onSelect(theme)} activeOpacity={0.8}>
          <ThemeSelectItem_1.ThemeSelectItem theme={theme}/>
          <ThemeText>{theme}</ThemeText>
          {value === theme && (<Tick>
              <Icon_1.Icon source={index_1.assets.static.icons.tick} style={styles.icon}/>
            </Tick>)}
        </Option>))}
    </Container>);
}
const Container = native_1.default.View `
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 8px;
`;
const Option = native_1.default.TouchableOpacity `
  flex-basis: 44%;
  max-height: 200px;
  aspect-ratio: 1.5;
  margin: 4px;
  border-radius: 8px;
  elevation: 4;
`;
const ThemeText = (0, native_1.default)(Text_1.Text) `
  color: #f49200;
  font-size: 14;
  font-family: Roboto-Black;
  top: 4px;
  right: 28px;
  position: absolute;
  text-transform: capitalize;
`;
const Tick = native_1.default.View `
  position: absolute;
  top: 8;
  left: 8;
  justify-content: center;
  align-items: center;
  border-radius: 15;
  width: 28px;
  height: 28px;
  background-color: #fff;
`;
const styles = react_native_1.StyleSheet.create({
    icon: { width: 20, height: 20 },
});
//# sourceMappingURL=ThemeSelect.jsx.map