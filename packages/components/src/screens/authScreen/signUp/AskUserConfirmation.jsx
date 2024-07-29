"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskUserConfirmation = AskUserConfirmation;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../../../components/common/Text");
const SignUpFormLayout_1 = require("./SignUpFormLayout");
const MultiStepForm_1 = require("../../../components/common/MultiStepForm");
const navigationService_1 = require("../../../services/navigationService");
const FormHeights_1 = require("./FormHeights");
const i18n_1 = require("../../../i18n");
const config_1 = require("../../../config");
const font_1 = require("../../../services/font");
const tablet_1 = require("../../../config/tablet");
function AskUserConfirmation({ step, heightInner }) {
    const [, dispatch] = (0, MultiStepForm_1.useMultiStepForm)();
    const [loading, setLoading] = react_1.default.useState(false);
    const [isAgreed, setIsAgreed] = react_1.default.useState(config_1.FAST_SIGN_UP);
    if (loading) {
        return null;
    }
    return (<SignUpFormLayout_1.SignUpFormLayout isButtonDisabled={!isAgreed} onSubmit={() => {
            setLoading(true);
            react_native_1.Animated.timing(heightInner, {
                toValue: FormHeights_1.formHeights.askUserInformation + FormHeights_1.formHeights.buttonConfirmHeight,
                duration: 350,
                useNativeDriver: false,
            }).start(() => {
                dispatch({ formAction: MultiStepForm_1.formActions.goToStep('ask-user-information') });
            });
        }}>
      <Container style={{
            height: FormHeights_1.formHeights.askUserConfirmation,
            elevation: 4,
            paddingHorizontal: 40,
            backgroundColor: 'white',
            overflow: 'hidden',
        }}>
        <Row style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          <GenderText>accept_conditions_1</GenderText>
          <react_native_1.TouchableOpacity accessibilityLabel={(0, i18n_1.translate)(`privacy_and_policy_link`)} onPress={() => (0, navigationService_1.navigate)('PrivacyScreen', null)}>
            <GenderText style={{ color: '#28b9cb' }}>accept_conditions_2</GenderText>
          </react_native_1.TouchableOpacity>
          <GenderText>accept_conditions_3</GenderText>
          <react_native_1.TouchableOpacity accessibilityLabel={(0, i18n_1.translate)('t_and_c_link')} onPress={() => (0, navigationService_1.navigate)('TermsScreen', null)}>
            <GenderText style={{ color: '#28b9cb' }}>accept_conditions_4</GenderText>
          </react_native_1.TouchableOpacity>
          <GenderText>accept_conditions_5</GenderText>
        </Row>

        <Row accessibilityLabel={(0, i18n_1.translate)('i_agree')} style={{ marginTop: 20 }}>
          <RadioButton selected={isAgreed} onPress={(val) => setIsAgreed(val)}/>
          <AgreeText style={{ marginLeft: 20 }}>i_agree</AgreeText>
        </Row>
      </Container>
    </SignUpFormLayout_1.SignUpFormLayout>);
}
const FONT_SCALE = (0, font_1.getDeviceFontScale)();
const NORMAL = FONT_SCALE === 'NORMAL' || tablet_1.IS_TABLET;
const RadioButton = ({ selected, onPress }) => {
    return <RadioCircle onPress={() => onPress(true)}>{selected && <RadioFill />}</RadioCircle>;
};
const Row = native_1.default.View `
  flex-direction: row;
`;
const Container = native_1.default.View `
  width: 100%;
  align-items: center;
  justify-content: center;
`;
const RadioCircle = native_1.default.TouchableOpacity `
  width: 25;
  aspect-ratio: 1;
  border-radius: 12.5;
  background-color: #efefef;
  border-width: 1px;
  border-color: grey;
  elevation: 5;
  align-items: center;
  justify-content: center;
`;
const RadioFill = native_1.default.View `
  width: 80%;
  aspect-ratio: 1;
  border-radius: 100px;
  background-color: rgb(143, 175, 5);
`;
const GenderText = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Regular;
  text-align: center;
  font-size: ${NORMAL ? 14 : 12};
  color: black;
`;
const AgreeText = (0, native_1.default)(Text_1.Text) `
  font-size: ${NORMAL ? 16 : 14};
  text-align: center;
  align-self: center;
  color: #000;
  font-family: Roboto-Black;
`;
//# sourceMappingURL=AskUserConfirmation.jsx.map