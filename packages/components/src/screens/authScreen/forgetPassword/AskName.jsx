"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskName = AskName;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../../../components/common/Text");
const TextInput_1 = require("../../../components/common/TextInput");
const MultiStepForm_1 = require("../../../components/common/MultiStepForm");
const HttpClient_1 = require("../../../services/HttpClient");
const ForgotPasswordFormLayout_1 = require("./ForgotPasswordFormLayout");
function AskName({ step }) {
    const [{ app: state }, dispatch] = (0, MultiStepForm_1.useMultiStepForm)();
    const onSubmit = () => __awaiter(this, void 0, void 0, function* () {
        dispatch({ type: 'fetch-request' });
        let errorMessage = 'empty';
        try {
            const { secretQuestion } = yield HttpClient_1.httpClient.getUserInfo(state.name);
            dispatch({
                type: 'fetch-success',
                data: { secretQuestion },
                formAction: MultiStepForm_1.formActions.goToStep('ask-secret-answer'),
            });
        }
        catch (error) {
            // @TODO: add translation
            errorMessage =
                error.response && error.response.status === 404 ? 'user_not_found' : error.message;
            errorMessage = error.message === 'Network Error' && 'request_fail';
            dispatch({ type: 'fetch-failure', errorMessage });
        }
    });
    if (state.isLoading) {
        return <react_native_1.ActivityIndicator />;
    }
    return (<ForgotPasswordFormLayout_1.ForgotPasswordFormLayout onSubmit={onSubmit}>
      <Row>
        <TextInput_1.TextInput style={{ marginTop: 20 }} onChange={(name) => dispatch({ type: 'change-name', name })} label="name" value={state.name}/>
      </Row>
      {state.errorMessage && <ErrorMessage>{state.errorMessage}</ErrorMessage>}
    </ForgotPasswordFormLayout_1.ForgotPasswordFormLayout>);
}
const Row = native_1.default.View `
  width: 80%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 10px;
`;
const ErrorMessage = (0, native_1.default)(Text_1.Text) `
  font-size: 14;
  margin-top: 20px;
  margin-bottom: 20px;
  color: red;
`;
//# sourceMappingURL=AskName.jsx.map