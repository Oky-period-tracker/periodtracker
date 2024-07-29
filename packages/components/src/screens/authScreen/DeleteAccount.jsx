"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAccount = DeleteAccount;
const react_1 = __importDefault(require("react"));
const MultiStepForm_1 = require("../../components/common/MultiStepForm");
const AskName_1 = require("./deleteAccount/AskName");
const AskPassword_1 = require("./deleteAccount/AskPassword");
const DeleteSuccess_1 = require("./deleteAccount/DeleteSuccess");
const initialState = {
    name: '',
    password: '',
    errorMessage: null,
    isLoading: false,
};
function DeleteAccount({ toggle, setContentState }) {
    return (<MultiStepForm_1.MultiStepForm initialStep={'ask-name'} appReducer={(state = initialState, action) => {
            if (action.type === 'change-name') {
                return Object.assign(Object.assign({}, state), { name: action.name });
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
            if (action.type === 'wrong-password') {
                return Object.assign(Object.assign({}, state), { errorMessage: action.errorMessage });
            }
            return state;
        }}>
      <AskName_1.AskName step={'ask-name'}/>
      <AskPassword_1.AskPassword step={'ask-password'}/>
      <DeleteSuccess_1.DeleteSuccess step={'completed'} {...{ toggle, setContentState }}/>
    </MultiStepForm_1.MultiStepForm>);
}
//# sourceMappingURL=DeleteAccount.jsx.map