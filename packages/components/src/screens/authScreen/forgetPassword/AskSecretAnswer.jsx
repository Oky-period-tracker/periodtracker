"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskSecretAnswer = AskSecretAnswer;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../../../components/common/Text");
const TextInput_1 = require("../../../components/common/TextInput");
const MultiStepForm_1 = require("../../../components/common/MultiStepForm");
const ForgotPasswordFormLayout_1 = require("./ForgotPasswordFormLayout");
function AskSecretAnswer({ step }) {
    const [{ app: state }, dispatch] = (0, MultiStepForm_1.useMultiStepForm)();
    const onSubmit = () => dispatch({ formAction: MultiStepForm_1.formActions.goToStep('ask-new-password') });
    return (<ForgotPasswordFormLayout_1.ForgotPasswordFormLayout onSubmit={onSubmit}>
      <TextInput_1.TextInput onChange={(secretAnswer) => dispatch({ type: 'change-secret-answer', secretAnswer })} label="secret_answer" value={state.secretAnswer}/>
      {state.errorMessage && <ErrorMessage>{state.errorMessage}</ErrorMessage>}
    </ForgotPasswordFormLayout_1.ForgotPasswordFormLayout>);
}
const QuestionText = (0, native_1.default)(Text_1.Text) `
  font-size: 16;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const ErrorMessage = (0, native_1.default)(Text_1.Text) `
  font-size: 14;
  margin-top: 20px;
  margin-bottom: 20px;
  color: red;
`;
//# sourceMappingURL=AskSecretAnswer.jsx.map