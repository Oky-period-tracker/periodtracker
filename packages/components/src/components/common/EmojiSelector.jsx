"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmojiSelector = void 0;
const react_1 = __importDefault(require("react"));
const index_1 = require("../../assets/index");
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("./Text");
exports.EmojiSelector = react_1.default.memo(({ isActive = false, onPress = null, emoji, style = null, maskStyle = null, isTextVisible = true, disabled = false, numberOfLines = 1, emojiStyle, textStyle, title, color, }) => {
    return (<Container disabled={disabled} onPress={onPress} style={Object.assign(Object.assign({}, style), { height: undefined })}>
        <Mask color={color} isActive={isActive} style={maskStyle} resizeMode="contain" source={index_1.assets.static.icons.roundedMask} size={style.height}>
          <Emoji style={emojiStyle}>{emoji}</Emoji>
        </Mask>
        {isTextVisible && (<EmojiText numberOfLines={numberOfLines} style={textStyle}>
            {title}
          </EmojiText>)}
      </Container>);
});
const Container = native_1.default.TouchableOpacity `
  justify-content: center;
  align-items: center;
  margin-bottom: 14;
`;
const Emoji = native_1.default.Text `
  font-size: 18;
  text-align: center;
  color: #ffffff;
`;
const EmojiText = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  font-size: 10;
  width: 120%;
  align-self: center;
  text-align: center;
  color: #000;
`;
const Mask = native_1.default.ImageBackground `
  width: ${(props) => (props.size ? props.size : 10)};
  height: ${(props) => (props.size ? props.size : 10)};
  border-radius: ${(props) => (props.size ? props.size / 2 : 10)};
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.isActive ? props.color : '#EAEAEA')};
`;
//# sourceMappingURL=EmojiSelector.jsx.map