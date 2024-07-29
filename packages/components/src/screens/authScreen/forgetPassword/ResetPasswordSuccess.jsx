"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordSuccess = ResetPasswordSuccess;
const react_1 = __importDefault(require("react"));
const ForgotPasswordFormLayout_1 = require("./ForgotPasswordFormLayout");
const Text_1 = require("../../../components/common/Text");
const Icon_1 = require("../../../components/common/Icon");
const index_1 = require("../../../assets/index");
const native_1 = __importDefault(require("styled-components/native"));
function ResetPasswordSuccess({ step, toggle, setContentState }) {
    const onSubmit = () => {
        toggle();
        setContentState(0);
    };
    return (<ForgotPasswordFormLayout_1.ForgotPasswordFormLayout onSubmit={onSubmit}>
      <QuestionText>forgot_password_completed</QuestionText>
      <Icon_1.Icon source={index_1.assets.static.icons.tick} style={{ alignItems: 'center', justifyContent: 'center' }}/>
    </ForgotPasswordFormLayout_1.ForgotPasswordFormLayout>);
}
const QuestionText = (0, native_1.default)(Text_1.Text) `
  font-size: 16;
  margin-top: 20px;
  margin-bottom: 20px;
`;
//# sourceMappingURL=ResetPasswordSuccess.jsx.map