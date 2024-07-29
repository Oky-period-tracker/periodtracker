"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUp = SignUp;
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const uuid_1 = require("uuid");
const MultiStepForm_1 = require("../../components/common/MultiStepForm");
const AskUserInformation_1 = require("./signUp/AskUserInformation");
const AskPassword_1 = require("./signUp/AskPassword");
const AskAge_1 = require("./signUp/AskAge");
const AskLocation_1 = require("./signUp/AskLocation");
const AskUserConfirmation_1 = require("./signUp/AskUserConfirmation");
const navigationService_1 = require("../../services/navigationService");
const actions = __importStar(require("../../redux/actions"));
const lodash_1 = __importDefault(require("lodash"));
const config_1 = require("../../config");
const randomLetters = () => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    return `${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}`;
};
const fastSignUpInitialState = {
    name: randomLetters(),
    password: 'aaa',
    passwordConfirm: 'aaa',
    selectedQuestion: 'favourite_actor',
    answer: 'a',
    gender: 'Female',
    location: 'Urban',
    country: 'AF',
    province: '0',
    dateOfBirth: '2015-12-31T17:00:00.000Z',
};
const defaultState = {
    name: '',
    password: '',
    passwordConfirm: '',
    selectedQuestion: '',
    answer: '',
    gender: 'Female',
    location: 'Urban',
    country: null,
    province: null,
    dateOfBirth: '',
};
const initialState = config_1.FAST_SIGN_UP ? fastSignUpInitialState : defaultState;
function SignUp({ heightInner }) {
    const dispatch = (0, react_redux_1.useDispatch)();
    const createAccount = ({ name, dateOfBirth, gender, location, country, province, password, selectedQuestion, answer, }) => {
        dispatch(actions.createAccountRequest({
            id: (0, uuid_1.v4)(),
            name,
            dateOfBirth,
            gender,
            location,
            country,
            province,
            password: lodash_1.default.toLower(password).trim(),
            secretQuestion: selectedQuestion,
            secretAnswer: lodash_1.default.toLower(answer).trim(),
        }));
        (0, navigationService_1.navigate)('AvatarAndThemeScreen', { signingUp: true, newUser: { gender } }); // @TODO: wait on isCreatingAccount
    };
    return (<MultiStepForm_1.MultiStepForm initialStep={'ask-user-confirmation'} appReducer={(state = initialState, action) => {
            if (action.type === 'change-form-data') {
                return Object.assign(Object.assign({}, state), { [action.inputName]: action.value });
            }
            return state;
        }}>
      <AskUserConfirmation_1.AskUserConfirmation step={'ask-user-confirmation'} heightInner={heightInner}/>
      <AskUserInformation_1.AskUserInformation step={'ask-user-information'} heightInner={heightInner}/>
      <AskPassword_1.AskPassword step={'ask-password'} heightInner={heightInner}/>
      <AskAge_1.AskAge step={'ask-age'} heightInner={heightInner}/>
      <AskLocation_1.AskLocation step={'ask-location'} createAccount={createAccount}/>
    </MultiStepForm_1.MultiStepForm>);
}
//# sourceMappingURL=SignUp.jsx.map