"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordFormLayout = ForgotPasswordFormLayout;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../../../components/common/Text");
function ForgotPasswordFormLayout({ children, onSubmit }) {
    return (<Container>
      <Container style={{
            height: 180,
            backgroundColor: 'white',
            paddingHorizontal: 15,
            elevation: 4,
        }}>
        {children}
      </Container>
      {onSubmit && (<Touchable onPress={onSubmit}>
          <HeaderText>confirm</HeaderText>
        </Touchable>)}
    </Container>);
}
const Container = native_1.default.View `
  justify-content: center;
  align-items: center;
  width: 100%;
  shadow-color: #d2d2d2;
  shadow-offset: 0px 2px;
  shadow-opacity: 2;
  shadow-radius: 2;
`;
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
  color: ${(props) => (props.expanded ? `#fff` : `#000`)};
  font-family: Roboto-Black;
`;
//# sourceMappingURL=ForgotPasswordFormLayout.jsx.map