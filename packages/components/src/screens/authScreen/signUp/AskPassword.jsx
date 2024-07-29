"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskPassword = AskPassword;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const native_1 = __importDefault(require("styled-components/native"));
const TextInput_1 = require("../../../components/common/TextInput");
const SignUpFormLayout_1 = require("./SignUpFormLayout");
const MultiStepForm_1 = require("../../../components/common/MultiStepForm");
const FormHeights_1 = require("./FormHeights");
const VerticalSelectBox_1 = require("../../../components/common/VerticalSelectBox");
const secretQuestions = [
    'secret_question',
    `favourite_actor`,
    `favourite_teacher`,
    `childhood_hero`,
];
function AskPassword({ step, heightInner }) {
    const [{ app: state }, dispatch] = (0, MultiStepForm_1.useMultiStepForm)();
    const { selectedQuestion, answer } = state;
    const [notValid, setNotValid] = react_1.default.useState(false);
    const [loading, setLoading] = react_1.default.useState(false);
    const minPasswordLength = 1;
    function checkValidity() {
        return selectedQuestion !== '' && answer.length >= minPasswordLength;
    }
    if (loading) {
        return null;
    }
    return (<SignUpFormLayout_1.SignUpFormLayout onSubmit={() => {
            if (!checkValidity()) {
                setNotValid(true);
                return;
            }
            setLoading(true);
            react_native_1.Animated.timing(heightInner, {
                toValue: FormHeights_1.formHeights.askAge + FormHeights_1.formHeights.buttonConfirmHeight,
                duration: 350,
                useNativeDriver: false,
            }).start(() => {
                dispatch({ formAction: MultiStepForm_1.formActions.goToStep('ask-age') });
            });
        }}>
      <Container style={{
            height: FormHeights_1.formHeights.askPassword,
            paddingHorizontal: 15,
            elevation: 4,
            backgroundColor: 'white',
            overflow: 'hidden',
        }}>
        <VerticalSelectBox_1.VerticalSelectBox items={secretQuestions.map((questions) => (questions ? questions : ''))} containerStyle={{
            height: 45,
            borderRadius: 22.5,
        }} height={45} maxLength={20} buttonStyle={{ right: 5, bottom: 7 }} onValueChange={(value) => dispatch({ type: 'change-form-data', inputName: 'selectedQuestion', value })} hasError={true} // this is to permanently display the i button
     errorHeading="secret_q_error_heading" errorContent="secret_que_info"/>
        <TextInput_1.TextInput inputStyle={{ color: '#555' }} onChange={(value) => dispatch({ type: 'change-form-data', inputName: 'answer', value })} label="secret_answer" isValid={answer.length >= minPasswordLength} hasError={notValid && !(answer.length >= minPasswordLength)} showInfoButton={true} value={answer} errorHeading="secret_error_heading" errorContent="secret_error_content"/>
      </Container>
    </SignUpFormLayout_1.SignUpFormLayout>);
}
const Container = native_1.default.View `
  width: 100%;
  justify-content: center;
  align-items: center;
`;
//# sourceMappingURL=AskPassword.jsx.map