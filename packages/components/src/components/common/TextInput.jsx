"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextInput = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const Icon_1 = require("./Icon");
const index_1 = require("../../assets/index");
const i18n_1 = require("../../i18n");
const react_native_1 = require("react-native");
const Text_1 = require("./Text");
const ThemedModal_1 = require("./ThemedModal");
const TextInput = ({ onChange = null, onEndEditing = null, label, secureTextEntry = false, hasError = false, isValid = false, style = null, inputStyle = null, keyboardType = null, onFocus = null, onBlur = null, multiline = false, showInfoButton = false, numberOfLines = 2, value, errorHeading = 'No error Heading', errorContent = 'No message', placeholderColor = '#28b9cb', infoAccessibilityLabel = '', }) => {
    const [isVisible, setIsVisible] = react_1.default.useState(false);
    return (<>
      <FormControl style={style}>
        <Row>
          <Input onFocus={onFocus} onBlur={onBlur} autoCorrect={false} placeholder={(0, i18n_1.translate)(label)} multiline={multiline} numberOfLines={numberOfLines} onChangeText={onChange} onEndEditing={onEndEditing} placeholderTextColor={placeholderColor || '#28b9cb'} keyboardType={keyboardType || 'default'} style={Object.assign({ color: '#555' }, inputStyle)} secureTextEntry={secureTextEntry} value={value}/>
          {isValid && !hasError && (<Icon_1.Icon source={index_1.assets.static.icons.tick} style={{ position: 'absolute', right: 8, bottom: 10 }}/>)}
          {hasError && (<Icon_1.Icon source={index_1.assets.static.icons.closeLine} style={{ position: 'absolute', right: 8, bottom: 10 }}/>)}
          {showInfoButton && (<react_native_1.TouchableOpacity accessibilityLabel={infoAccessibilityLabel} style={{
                height: '90%',
                aspectRatio: 1,
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 5,
                zIndex: 999,
                bottom: '5%',
            }} onPress={() => setIsVisible(true)}>
              <Icon_1.Icon style={{ height: 25, aspectRatio: 1 }} source={index_1.assets.static.icons.infoPink}/>
            </react_native_1.TouchableOpacity>)}
        </Row>
      </FormControl>
      <ThemedModal_1.ThemedModal {...{ isVisible, setIsVisible }}>
        <CardPicker>
          <Heading accessibilityLabel={errorHeading}>{errorHeading}</Heading>
          <TextContent>{errorContent}</TextContent>
        </CardPicker>
      </ThemedModal_1.ThemedModal>
    </>);
};
exports.TextInput = TextInput;
const FormControl = native_1.default.View `
  height: 45px;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const Row = native_1.default.View `
  height: 100%;
  width: 100%;
  flex-direction: column;
`;
const Input = native_1.default.TextInput `
  height: 45px;
  width: 100%;
  padding-left: 30px;
  padding-right: 30px;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 22.5px;
  background-color: #efefef;
  border-width: 0px;
  font-family: Roboto-Regular;
  font-size: 15;
  padding-vertical: 0px;
  padding-horizontal: 10px;
`;
const CardPicker = native_1.default.View `
  width: 95%;
  background-color: #fff;
  border-radius: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: center;
  padding-vertical: 15px;
  padding-horizontal: 15px;
`;
const Heading = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Black;
  font-size: 18;
  margin-bottom: 10px;
  color: #a2c72d;
`;
const TextContent = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Regular;
  font-size: 16;
  margin-bottom: 10px;
`;
//# sourceMappingURL=TextInput.jsx.map