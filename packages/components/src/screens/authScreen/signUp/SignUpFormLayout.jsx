"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpFormLayout = SignUpFormLayout;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../../../components/common/Text");
function SignUpFormLayout({ children, onSubmit, isButtonDisabled = false }) {
    return (<Container>
      {children}
      <Touchable disabled={isButtonDisabled} onPress={onSubmit}>
        <HeaderText isDisabled={isButtonDisabled}>continue</HeaderText>
      </Touchable>
    </Container>);
}
const Touchable = native_1.default.TouchableOpacity `
  height: 80px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const HeaderText = (0, native_1.default)(Text_1.Text) `
  font-size: 16;
  text-align: center;
  align-self: center;
  color: ${(props) => (props.isDisabled ? `#efefef` : `#000`)};
  font-family: Roboto-Black;
`;
const Container = native_1.default.View `
  width: 100%;
  justify-content: center;
  align-items: center;
  shadow-color: #efefef;
  shadow-offset: 0px 2px;
  shadow-opacity: 1;
  shadow-radius: 2;
`;
//# sourceMappingURL=SignUpFormLayout.jsx.map