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
exports.AskNewPassword = AskNewPassword;
const react_1 = __importDefault(require("react"));
const TextInput_1 = require("../../../components/common/TextInput");
const MultiStepForm_1 = require("../../../components/common/MultiStepForm");
const HttpClient_1 = require("../../../services/HttpClient");
const ForgotPasswordFormLayout_1 = require("./ForgotPasswordFormLayout");
const lodash_1 = __importDefault(require("lodash"));
function AskNewPassword({ step }) {
    const [{ app: state }, dispatch] = (0, MultiStepForm_1.useMultiStepForm)();
    const minPasswordLength = 1;
    const [repeatPassword, setRepeatPassword] = react_1.default.useState(state.password);
    const passwordIsValid = state.password.length >= minPasswordLength;
    const onSubmit = () => __awaiter(this, void 0, void 0, function* () {
        if (!passwordIsValid) {
            return;
        }
        if (!repeatPassword) {
            return;
        }
        try {
            yield HttpClient_1.httpClient.resetPassword({
                name: state.name,
                secretAnswer: lodash_1.default.toLower(state.secretAnswer).trim(),
                password: lodash_1.default.toLower(state.password).trim(),
            });
            dispatch({ formAction: MultiStepForm_1.formActions.goToStep('completed') });
        }
        catch (err) {
            dispatch({
                type: 'wrong-secret-answer',
                errorMessage: 'wrong_old_secret_answer',
                formAction: MultiStepForm_1.formActions.goToStep('ask-secret-answer'),
            });
        }
    });
    return (<ForgotPasswordFormLayout_1.ForgotPasswordFormLayout onSubmit={onSubmit}>
      <TextInput_1.TextInput style={{ marginBottom: 5, marginTop: 20 }} onChange={password => dispatch({ type: 'change-password', password })} label="password" secureTextEntry={true} isValid={passwordIsValid} hasError={state.password >= minPasswordLength && !passwordIsValid} value={state.password}/>
      <TextInput_1.TextInput style={{ marginBottom: 5 }} onChange={setRepeatPassword} label="confirm_password" secureTextEntry={true} isValid={repeatPassword.length >= minPasswordLength && repeatPassword === state.password} hasError={repeatPassword.length >= minPasswordLength && repeatPassword !== state.password} value={repeatPassword}/>
    </ForgotPasswordFormLayout_1.ForgotPasswordFormLayout>);
}
//# sourceMappingURL=AskNewPassword.jsx.map