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
exports.ContactUsScreen = ContactUsScreen;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const native_1 = __importDefault(require("styled-components/native"));
const BackgroundTheme_1 = require("../components/layout/BackgroundTheme");
const Header_1 = require("../components/common/Header");
const VerticalSelectBox_1 = require("../components/common/VerticalSelectBox");
const PrimaryButton_1 = require("../components/common/buttons/PrimaryButton");
const PageContainer_1 = require("../components/layout/PageContainer");
const TextInput_1 = require("../components/common/TextInput");
const KeyboardAwareAvoidance_1 = require("../components/common/KeyboardAwareAvoidance");
const HttpClient_1 = require("../services/HttpClient");
const useSelector_1 = require("../hooks/useSelector");
const selectors = __importStar(require("../redux/selectors"));
const moment_1 = __importDefault(require("moment"));
const Text_1 = require("../components/common/Text");
const ThemedModal_1 = require("../components/common/ThemedModal");
const useTextToSpeechHook_1 = require("../hooks/useTextToSpeechHook");
const config_1 = require("../config");
const navigationService_1 = require("../services/navigationService");
const Reasons = ['reason', 'report_bug', 'request_topic', 'Other', 'problem_app'];
function ContactUsScreen({ navigation }) {
    const [email, setEmail] = react_1.default.useState('');
    const user = (0, useSelector_1.useSelector)(selectors.currentUserSelector);
    const locale = (0, useSelector_1.useSelector)(selectors.currentLocaleSelector);
    const [reason, setReason] = react_1.default.useState('');
    const [message, setMessage] = react_1.default.useState('');
    const [notValid, setNotValid] = react_1.default.useState(false);
    const [error, setError] = react_1.default.useState(false);
    const [isVisible, setIsVisible] = react_1.default.useState(false);
    (0, useTextToSpeechHook_1.useTextToSpeechHook)({ navigation, text: (0, config_1.contactUsScreenText)({ isVisible }) });
    function sendForm() {
        return __awaiter(this, void 0, void 0, function* () {
            setError(false);
            setIsVisible(false);
            if (reason === '' || reason === 'reason' || message === '') {
                setNotValid(true);
                return;
            }
            try {
                yield HttpClient_1.httpClient.sendContactUsForm({
                    name: user.name,
                    dateRec: (0, moment_1.default)().utc().startOf('day'),
                    organization: 'user',
                    platform: 'mobile',
                    reason,
                    email: email !== '' ? email : 'NA',
                    status: 'open',
                    content: message,
                    lang: locale,
                });
                setMessage('');
                setEmail('');
                setIsVisible(true);
            }
            catch (err) {
                setError(true);
            }
        });
    }
    return (<BackgroundTheme_1.BackgroundTheme>
      <PageContainer_1.PageContainer>
        <Header_1.Header screenTitle="contact_us"/>
        <KeyboardAwareAvoidance_1.KeyboardAwareAvoidance>
          <MiddleSection>
            <VerticalSelectBox_1.VerticalSelectBox height={45} maxLength={20} items={Reasons} itemStyle={styles.selectBoxItem} buttonStyle={styles.selectBoxButton} containerStyle={styles.selectBoxContainer} onValueChange={(value) => setReason(value)}/>
            <TextInput_1.TextInput label="message" value={message} multiline={true} numberOfLines={7} hasError={notValid && !(message.length >= 3)} onChange={(text) => setMessage(text)} inputStyle={styles.inputInput} style={styles.input} isValid={message.length >= 3}/>
            {error && <ErrorText>request_error</ErrorText>}
          </MiddleSection>
        </KeyboardAwareAvoidance_1.KeyboardAwareAvoidance>
        <PrimaryButton_1.PrimaryButton onPress={sendForm} style={styles.send} rightIcon="send">
          send
        </PrimaryButton_1.PrimaryButton>
      </PageContainer_1.PageContainer>
      <ThemedModal_1.ThemedModal {...{ isVisible, setIsVisible }}>
        <react_native_1.TouchableWithoutFeedback style={styles.thanks} onPress={() => (0, navigationService_1.navigate)('SettingsScreen', null)}>
          <InfoCardPicker>
            <Heading>thank_you</Heading>
            <TextContent>thank_you_content</TextContent>
          </InfoCardPicker>
        </react_native_1.TouchableWithoutFeedback>
      </ThemedModal_1.ThemedModal>
    </BackgroundTheme_1.BackgroundTheme>);
}
const MiddleSection = native_1.default.View `
  border-radius: 10px;
  elevation: 4;
  background-color: #fff;
  width: 100%;
  align-items: center;
  margin-top: 15px;
  padding-vertical: 20px;
  padding-horizontal: 15px;
  margin-bottom: 7px;
`;
const ErrorText = (0, native_1.default)(Text_1.Text) `
  color: red;
  text-align: center;
`;
const InfoCardPicker = native_1.default.View `
  width: 95%;
  background-color: #fff;
  border-radius: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: center;
  padding-vertical: 15px;
  padding-horizontal: 15px;
`;
const Heading = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Black;
  font-size: 18;
  margin-bottom: 10px;
  color: #a2c72d;
`;
const TextContent = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Regular;
  font-size: 16;
  margin-bottom: 10px;
`;
const styles = react_native_1.StyleSheet.create({
    selectBoxItem: {
        fontSize: 16,
    },
    selectBoxButton: {
        right: 10,
    },
    selectBoxContainer: {
        height: 45,
        borderRadius: 22.5,
    },
    input: {
        height: 200,
    },
    inputInput: {
        fontSize: 16,
        textAlignVertical: 'top',
        height: 200,
    },
    send: {
        width: '100%',
        maxWidth: undefined,
    },
    thanks: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
//# sourceMappingURL=ContactUsScreen.jsx.map