"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoundedInput = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const RoundedInput = (props) => {
    return (<FormContainer>
      <TextInput {...props.inputProps}/>
    </FormContainer>);
};
exports.RoundedInput = RoundedInput;
const FormContainer = native_1.default.View `
  background-color: #fff;
  padding-horizontal: 42px;
  elevation: 2;
  margin-horizontal: 2px;
  flex: 1;
  border-radius: 50px;
  height: 46px;
  justify-content: center;
`;
const TextInput = native_1.default.TextInput `
  font-size: 16;
  border-width: 0;
  padding-vertical: 0px;
`;
//# sourceMappingURL=RoundedInput.jsx.map