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
exports.AskUserInformation = AskUserInformation;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../../../components/common/Text");
const TextInput_1 = require("../../../components/common/TextInput");
const SegmentControl_1 = require("../../../components/common/SegmentControl");
const SignUpFormLayout_1 = require("./SignUpFormLayout");
const MultiStepForm_1 = require("../../../components/common/MultiStepForm");
const HttpClient_1 = require("../../../services/HttpClient");
const useDebounce_1 = require("../../../hooks/useDebounce");
const FormHeights_1 = require("./FormHeights");
const i18n_1 = require("../../../i18n");
function AskUserInformation({ step, heightInner }) {
    const [{ app: state }, dispatch] = (0, MultiStepForm_1.useMultiStepForm)();
    const [notValid, setNotValid] = react_1.default.useState(false);
    const [loading, setLoading] = react_1.default.useState(false);
    const [nameNotAvailable, setNameNotAvailable] = react_1.default.useState(false);
    const minPasswordLength = 1;
    const minNameLength = 3;
    const [usernameError, setUsernameError] = react_1.default.useState(false);
    const [passcodeMatchError, setPasscodeMatchError] = react_1.default.useState(false);
    const { name, password, passwordConfirm, gender } = state;
    const [debouncedName] = (0, useDebounce_1.useDebounce)(name, 500); // to stop fast typing calls
    react_1.default.useEffect(() => {
        let ignore = false;
        function checkUserNameAvailability() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield HttpClient_1.httpClient.getUserInfo(name);
                    // user does exist
                    if (!ignore)
                        setNameNotAvailable(true);
                }
                catch (err) {
                    // user does not exist
                    if (!ignore)
                        setNameNotAvailable(false);
                }
            });
        }
        checkUserNameAvailability();
        return () => {
            ignore = true;
        };
    }, [debouncedName]);
    // @TODO: change this logic and hasError Logic to be neater, its in a terrible state
    function checkValidity() {
        if (!(name.length >= minNameLength)) {
            setUsernameError(true);
        }
        if (passwordConfirm !== password) {
            setPasscodeMatchError(true);
        }
        return (password.length >= minPasswordLength &&
            passwordConfirm === password &&
            name.length >= minNameLength);
    }
    if (loading) {
        return null;
    }
    const genders = ['Male', 'Female', 'Other'];
    return (<SignUpFormLayout_1.SignUpFormLayout onSubmit={() => {
            if (!checkValidity()) {
                setNotValid(true);
                return;
            }
            setLoading(true);
            react_native_1.Animated.timing(heightInner, {
                toValue: FormHeights_1.formHeights.askPassword + FormHeights_1.formHeights.buttonConfirmHeight,
                duration: 350,
                useNativeDriver: false,
            }).start(() => {
                dispatch({ formAction: MultiStepForm_1.formActions.goToStep('ask-password') });
            });
        }}>
      <Container style={{
            height: FormHeights_1.formHeights.askUserInformation,
            elevation: 4,
            paddingHorizontal: 15,
            backgroundColor: 'white',
            overflow: 'hidden',
        }}>
        {nameNotAvailable && <ErrorMessage>{(0, i18n_1.translate)('name_taken_error')}</ErrorMessage>}
        {usernameError && <ErrorMessage>{(0, i18n_1.translate)('username_too_short')}</ErrorMessage>}
        <TextInput_1.TextInput inputStyle={{ color: '#555' }} onChange={(value) => {
            setUsernameError(false);
            dispatch({ type: 'change-form-data', inputName: 'name', value });
        }} label="enter_name" isValid={name.length >= minNameLength} hasError={notValid && !(name.length >= minNameLength)} showInfoButton={true} infoAccessibilityLabel={(0, i18n_1.translate)('name_info_label')} value={name} errorHeading="name" errorContent="name_info_label"/>

        <GenderText>your_gender</GenderText>
        <Row>
          {genders.map((value) => {
            return (<SegmentControl_1.SegmentControl key={value} option={value} isActive={gender === value} onPress={() => dispatch({ type: 'change-form-data', inputName: 'gender', value })}/>);
        })}
        </Row>
        <TextInput_1.TextInput onChange={(value) => dispatch({ type: 'change-form-data', inputName: 'password', value })} label="password" secureTextEntry={true} showInfoButton={true} isValid={password.length >= minPasswordLength} hasError={notValid && !(password.length >= minPasswordLength)} value={password} errorHeading="password_error_heading" errorContent="password_error_content"/>
        <TextInput_1.TextInput onChange={(value) => {
            setPasscodeMatchError(false);
            dispatch({ type: 'change-form-data', inputName: 'passwordConfirm', value });
        }} label="confirm_password" secureTextEntry={true} showInfoButton={false} isValid={passwordConfirm.length >= minPasswordLength && passwordConfirm === password} hasError={notValid &&
            !(passwordConfirm.length >= minPasswordLength && passwordConfirm === password)} value={passwordConfirm}/>
        {passcodeMatchError && <ErrorMessage>{(0, i18n_1.translate)('passcodes_mismatch')}</ErrorMessage>}
      </Container>
    </SignUpFormLayout_1.SignUpFormLayout>);
}
const Row = native_1.default.View `
  width: 80%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 10px;
`;
const Container = native_1.default.View `
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const GenderText = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Regular;
  font-size: 14;
  margin-bottom: 5px;
  color: #28b9cb;
`;
const ErrorMessage = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  font-size: 12
  margin-top: 10px;
  color: red;
`;
const PasswordDescription = (0, native_1.default)(Text_1.Text) `
  width: 95%;
  text-align: justify;
  font-size: 12;
  margin-bottom: 10px;
  color: #28b9cb;
`;
//# sourceMappingURL=AskUserInformation.jsx.map