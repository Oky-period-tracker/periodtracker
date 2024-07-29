"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPassword = ForgotPassword;
const react_1 = __importDefault(require("react"));
const MultiStepForm_1 = require("../../components/common/MultiStepForm");
const AskName_1 = require("./forgetPassword/AskName");
const AskSecretAnswer_1 = require("./forgetPassword/AskSecretAnswer");
const AskNewPassword_1 = require("./forgetPassword/AskNewPassword");
const ResetPasswordSuccess_1 = require("./forgetPassword/ResetPasswordSuccess");
const initialState = {
    name: '',
    secretAnswer: '',
    password: '',
    secretQuestion: null,
    errorMessage: null,
    isLoading: false,
};
function ForgotPassword({ toggle, setContentState }) {
    return (<MultiStepForm_1.MultiStepForm initialStep={'ask-name'} appReducer={(state = initialState, action) => {
            if (action.type === 'change-name') {
                return Object.assign(Object.assign({}, state), { name: action.name });
            }
            if (action.type === 'change-secret-answer') {
                return Object.assign(Object.assign({}, state), { secretAnswer: action.secretAnswer });
            }
            if (action.type === 'change-password') {
                return Object.assign(Object.assign({}, state), { password: action.password });
            }
            if (action.type === 'fetch-request') {
                return Object.assign(Object.assign({}, state), { errorMessage: null, isLoading: true });
            }
            if (action.type === 'fetch-success') {
                return Object.assign(Object.assign(Object.assign({}, state), action.data), { isLoading: false });
            }
            if (action.type === 'fetch-failure') {
                return Object.assign(Object.assign({}, state), { errorMessage: action.errorMessage, isLoading: false });
            }
            if (action.type === 'wrong-secret-answer') {
                return Object.assign(Object.assign({}, state), { errorMessage: action.errorMessage });
            }
            return state;
        }}>
      <AskName_1.AskName step={'ask-name'}/>
      <AskSecretAnswer_1.AskSecretAnswer step={'ask-secret-answer'}/>
      <AskNewPassword_1.AskNewPassword step={'ask-new-password'}/>
      <ResetPasswordSuccess_1.ResetPasswordSuccess step={'completed'} {...{ toggle, setContentState }}/>
    </MultiStepForm_1.MultiStepForm>);
}
//# sourceMappingURL=ForgotPassword.jsx.map