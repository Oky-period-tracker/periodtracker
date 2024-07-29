"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextInputSettings = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const Icon_1 = require("./Icon");
const Text_1 = require("./Text");
const index_1 = require("../../assets/index");
const TextInputSettings = ({ onChange, onEndEditing = null, label, secureTextEntry = false, hasError = false, isValid = false, style = null, inputStyle = null, underlineStyle = null, keyboardType = null, onFocus = null, onBlur = null, multiline = false, numberOfLines = 2, value, }) => {
    return (<FormControl style={style}>
      <Label>{label}</Label>
      <Row>
        <Input onFocus={onFocus} onBlur={onBlur} autoCorrect={false} multiline={multiline} numberOfLines={numberOfLines} onChangeText={onChange} onEndEditing={onEndEditing} keyboardType={keyboardType || 'default'} style={Object.assign({ color: '#555' }, inputStyle)} secureTextEntry={secureTextEntry} value={value}/>
        {isValid && !hasError ? (<Icon_1.Icon source={index_1.assets.static.icons.tick} style={{ position: 'absolute', right: 0, bottom: 5 }}/>) : null}
        {hasError ? (<Icon_1.Icon source={index_1.assets.static.icons.closeLine} style={{ position: 'absolute', right: 0, bottom: 5 }}/>) : null}
      </Row>
      <Underline style={underlineStyle}/>
    </FormControl>);
};
exports.TextInputSettings = TextInputSettings;
const FormControl = native_1.default.View `
  width: 150;
  margin-bottom: 10;
`;
const Row = native_1.default.View `
  flex-direction: row;
`;
const Label = (0, native_1.default)(Text_1.Text) `
  color: #28b9cb;
  width: 150;
  font-size: 12;
`;
const Input = native_1.default.TextInput `
  height: 25px;
  width: 100%;
  border-width: 0;
  font-size: 18;
  padding-vertical: 0;
  padding-horizontal: 0;
`;
const Underline = native_1.default.View `
  height: 1px;
  width: 100%;
  background: #eaeaea;
`;
//# sourceMappingURL=TextInputSettings.jsx.map