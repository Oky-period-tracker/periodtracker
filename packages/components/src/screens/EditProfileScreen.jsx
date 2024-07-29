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
exports.EditProfileScreen = EditProfileScreen;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const react_native_1 = require("react-native");
const PageContainer_1 = require("../components/layout/PageContainer");
const BackgroundTheme_1 = require("../components/layout/BackgroundTheme");
const Header_1 = require("../components/common/Header");
const Icon_1 = require("../components/common/Icon");
const SelectBox_1 = require("../components/common/SelectBox");
const DateOfBirthInput_1 = require("../components/common/DateOfBirthInput");
const index_1 = require("../assets/index");
const useSelector_1 = require("../hooks/useSelector");
const selectors = __importStar(require("../redux/selectors"));
const actions = __importStar(require("../redux/actions"));
const react_redux_1 = require("react-redux");
const navigationService_1 = require("../services/navigationService");
const HttpClient_1 = require("../services/HttpClient");
const TextInputSettings_1 = require("../components/common/TextInputSettings");
const KeyboardAwareAvoidance_1 = require("../components/common/KeyboardAwareAvoidance");
const ThemedModal_1 = require("../components/common/ThemedModal");
const Text_1 = require("../components/common/Text");
const TextInput_1 = require("../components/common/TextInput");
const VerticalSelectBox_1 = require("../components/common/VerticalSelectBox");
const i18n_1 = require("../i18n");
const lodash_1 = __importDefault(require("lodash"));
const useScreenDimensions_1 = require("../hooks/useScreenDimensions");
const tablet_1 = require("../config/tablet");
const minPasswordLength = 1;
const secretQuestions = [
    'secret_question',
    `favourite_actor`,
    `favourite_teacher`,
    `childhood_hero`,
];
function showAlert(message) {
    react_native_1.Alert.alert((0, i18n_1.translate)('something_went_wrong'), (0, i18n_1.translate)(message), [
        {
            text: (0, i18n_1.translate)('cancel'),
            onPress: () => (0, navigationService_1.BackOneScreen)(),
            style: 'cancel',
        },
        { text: (0, i18n_1.translate)('close_try_again') },
    ], { cancelable: false });
}
function showAcceptAlert(message) {
    react_native_1.Alert.alert((0, i18n_1.translate)('something_went_wrong'), (0, i18n_1.translate)(message), [
        {
            text: (0, i18n_1.translate)('confirm'),
        },
    ], { cancelable: false });
}
function runInSequence(functions) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = [];
        for (const fn of functions) {
            results.push(yield fn());
        }
        return results;
    });
}
const maxWidth = 800;
function EditProfileScreen() {
    const { screenWidth } = (0, useScreenDimensions_1.useScreenDimensions)();
    const percentWidth = tablet_1.IS_TABLET ? 0.75 : 1;
    let inputWidth = screenWidth * percentWidth;
    if (inputWidth > maxWidth) {
        inputWidth = maxWidth;
    }
    inputWidth -= 180; // 180 is the width of the icon
    const dispatch = (0, react_redux_1.useDispatch)();
    const currentUser = (0, useSelector_1.useSelector)(selectors.currentUserSelector);
    const appToken = (0, useSelector_1.useSelector)(selectors.appTokenSelector);
    const [name, setName] = react_1.default.useState(currentUser.name);
    const [notValid, setNotValid] = react_1.default.useState(false);
    const [dateOfBirth, setDateOfBirth] = react_1.default.useState(currentUser.dateOfBirth);
    const [gender, setGender] = react_1.default.useState(currentUser.gender);
    const [location, setLocation] = react_1.default.useState(currentUser.location);
    const [password, setPassword] = react_1.default.useState(currentUser.password);
    const [secretAnswer, setSecretAnswer] = react_1.default.useState('');
    const [oldSecretAnswer, setOldSecretAnswer] = react_1.default.useState('');
    const [secretQuestion, setSecretQuestion] = react_1.default.useState(currentUser.secretQuestion);
    const [isVisible, setIsVisible] = react_1.default.useState(false);
    const [secretIsVisible, setSecretIsVisible] = react_1.default.useState(false);
    const remainingGenders = ['Female', 'Male', 'Other'].filter((item) => {
        return item !== currentUser.gender;
    });
    const remainingLocations = ['Urban', 'Rural'].filter((item) => {
        return item !== currentUser.location;
    });
    remainingLocations.unshift(currentUser.location);
    const [showPasscode, setShowPasscode] = react_1.default.useState(false);
    const tryToEditUserInfo = () => __awaiter(this, void 0, void 0, function* () {
        const hasInfoChanged = name !== currentUser.name ||
            dateOfBirth !== currentUser.dateOfBirth ||
            gender !== currentUser.gender ||
            location !== currentUser.location ||
            secretQuestion !== currentUser.secretQuestion;
        if (!hasInfoChanged) {
            return null;
        }
        try {
            yield HttpClient_1.httpClient.editUserInfo({
                appToken,
                name,
                dateOfBirth,
                gender,
                location,
                secretQuestion,
            });
            dispatch(actions.editUser({
                name,
                dateOfBirth,
                gender,
                location,
                secretQuestion,
            }));
        }
        catch (err) {
            throw new Error((0, i18n_1.translate)('could_not_edit')); // TODO_ALEX: this is not displayed
        }
    });
    const tryToChangeSecretAnswer = () => __awaiter(this, void 0, void 0, function* () {
        const hasSecretAnswerChanged = secretAnswer !== '' && lodash_1.default.toLower(oldSecretAnswer).trim() !== '';
        if (!hasSecretAnswerChanged) {
            return null;
        }
        try {
            yield HttpClient_1.httpClient.editUserSecretAnswer({
                appToken,
                previousSecretAnswer: lodash_1.default.toLower(oldSecretAnswer).trim(),
                nextSecretAnswer: lodash_1.default.toLower(secretAnswer).trim(),
            });
            dispatch(actions.editUser({
                secretAnswer: lodash_1.default.toLower(secretAnswer).trim(),
            }));
            setSecretAnswer('');
        }
        catch (err) {
            setSecretAnswer('');
            if (err && err.response && err.response.data) {
                if (err.response.data.name === 'BadRequestError') {
                    if (err.response.data.message === 'wrong_previous_secret_answer') {
                        const message = (0, i18n_1.translate)('wrong_old_secret_answer');
                        throw new Error(message); // TODO_ALEX: this is not displayed
                    }
                }
            }
            throw new Error((0, i18n_1.translate)('could_not_change_secret')); // TODO_ALEX: this is not displayed
        }
    });
    const tryToChangePassword = () => __awaiter(this, void 0, void 0, function* () {
        const hasPasswordChanged = currentUser.password !== password;
        if (!hasPasswordChanged) {
            return null;
        }
        if (secretAnswer.length === 0) {
            setIsVisible(true);
            throw new Error();
        }
        try {
            yield HttpClient_1.httpClient.resetPassword({
                name,
                secretAnswer: lodash_1.default.toLower(secretAnswer).trim(),
                password: lodash_1.default.toLower(password).trim(),
            });
            dispatch(actions.editUser({
                password: lodash_1.default.toLower(password).trim(),
            }));
        }
        catch (err) {
            setSecretAnswer('');
            throw new Error('could_not_change_password'); // TODO_ALEX: this is not displayed
        }
    });
    const saveChanges = () => __awaiter(this, void 0, void 0, function* () {
        setIsVisible(false);
        // for non-logged user, save the changes locally immediately
        if (!appToken) {
            const hasSecretAnswerChanged = secretAnswer !== '' && lodash_1.default.toLower(oldSecretAnswer).trim() !== '';
            if (hasSecretAnswerChanged) {
                if (lodash_1.default.toLower(oldSecretAnswer).trim() !== lodash_1.default.toLower(currentUser.secretAnswer).trim()) {
                    showAcceptAlert((0, i18n_1.translate)('wrong_old_secret_answer'));
                    return;
                }
            }
            dispatch(actions.editUser({
                name,
                dateOfBirth,
                gender,
                password,
                location,
                secretQuestion,
                secretAnswer: secretAnswer === '' ? currentUser.secretAnswer : lodash_1.default.toLower(secretAnswer).trim(),
            }));
            (0, navigationService_1.BackOneScreen)();
            return;
        }
        try {
            yield runInSequence([tryToEditUserInfo, tryToChangeSecretAnswer, tryToChangePassword]);
            (0, navigationService_1.BackOneScreen)();
        }
        catch (err) {
            if (err.message) {
                showAlert(err.message);
            }
        }
    });
    return (<BackgroundTheme_1.BackgroundTheme>
      <PageContainer_1.PageContainer>
        <Header_1.Header screenTitle="profile_edit" onPressBackButton={() => (0, navigationService_1.BackOneScreen)()}/>
        <KeyboardAwareAvoidance_1.KeyboardAwareAvoidance contentContainerStyle={styles.keyboardAwareAvoidance}>
          <Container>
            <Row>
              <Icon_1.Icon source={index_1.assets.static.icons.profileL} style={styles.icon}/>
              <TextInputSettings_1.TextInputSettings onChange={(text) => setName(text)} label="name" isValid={false} hasError={false} style={styles.textInput} underlineStyle={{ width: inputWidth }} inputStyle={styles.textInputInput} value={name}/>
            </Row>
            <Row>
              <Icon_1.Icon source={index_1.assets.static.icons.genderL} style={styles.icon}/>
              <SelectBox_1.SelectBox itemStyle={styles.selectBoxItem} width={inputWidth} containerStyle={[
            styles.selectBoxContainer,
            {
                width: inputWidth,
            },
        ]} buttonStyle={styles.selectBoxButton} title="gender" items={[currentUser.gender, ...remainingGenders]} onValueChange={(value) => setGender(value)}/>
            </Row>
            <Row>
              <Icon_1.Icon source={index_1.assets.static.icons.calendarL} style={styles.icon}/>
              <DateOfBirthInput_1.DateOfBirthInput label={'birth_month_and_year'} textStyle={styles.dobInputText} style={[styles.dobInput, { width: inputWidth }]} value={dateOfBirth} onChange={setDateOfBirth}/>
            </Row>
            <Row>
              <Icon_1.Icon source={index_1.assets.static.icons.locationL} style={styles.icon}/>
              <SelectBox_1.SelectBox title="location" items={remainingLocations} itemStyle={styles.selectBoxItem} width={inputWidth} containerStyle={[
            styles.selectBoxContainer,
            {
                width: inputWidth,
            },
        ]} buttonStyle={styles.selectBoxButton} onValueChange={(value) => setLocation(value)} isValid={false} hasError={false}/>
            </Row>
            <Row style={styles.row}>
              <Icon_1.Icon source={index_1.assets.static.icons.lockL} style={styles.icon}/>
              <TextInputSettings_1.TextInputSettings onChange={(text) => setPassword(text)} style={[styles.textInput, { width: inputWidth }]} label="password" isValid={password.length >= minPasswordLength} hasError={notValid && !(password.length >= minPasswordLength)} onFocus={() => setShowPasscode(true)} onBlur={() => setShowPasscode(false)} secureTextEntry={!showPasscode} underlineStyle={{ width: inputWidth }} inputStyle={[styles.textInputInput, { width: inputWidth }]} value={password}/>
            </Row>
            <Row style={styles.row}>
              <Icon_1.Icon source={index_1.assets.static.icons.shieldL} style={styles.icon}/>
              <ChangeSecretButton onPress={() => setSecretIsVisible(true)}>
                <ConfirmText>change_secret</ConfirmText>
              </ChangeSecretButton>
            </Row>
          </Container>
        </KeyboardAwareAvoidance_1.KeyboardAwareAvoidance>
        <ConfirmButton onPress={() => __awaiter(this, void 0, void 0, function* () {
            setNotValid(false);
            if (password.length < minPasswordLength) {
                setNotValid(true);
                return;
            }
            yield saveChanges();
        })}>
          <ConfirmText style={styles.confirm}>confirm</ConfirmText>
        </ConfirmButton>
      </PageContainer_1.PageContainer>
      {/* --------------------------------- modals --------------------------------- */}
      <ThemedModal_1.ThemedModal {...{ isVisible, setIsVisible, onBackdropPress: () => null }}>
        <CardModal>
          <QuestionText>reset_password_question</QuestionText>
          <TextInput_1.TextInput onChange={(value) => setSecretAnswer(value)} label="secret_answer" value={secretAnswer}/>
          <Confirm onPress={saveChanges}>
            <ConfirmText>confirm</ConfirmText>
          </Confirm>
        </CardModal>
      </ThemedModal_1.ThemedModal>
      <ThemedModal_1.ThemedModal {...{ isVisible: secretIsVisible, setIsVisible: setSecretIsVisible }}>
        <CardModal>
          <QuestionText>reset_secret_question</QuestionText>

          <TextContainer>
            <TextInput_1.TextInput onChange={(value) => setOldSecretAnswer(value)} label="old_secret_answer" value={oldSecretAnswer}/>
            <VerticalSelectBox_1.VerticalSelectBox items={secretQuestions.map((questions) => (questions ? questions : ''))} containerStyle={styles.verticalSelectContainer} height={45} maxLength={20} buttonStyle={styles.verticalSelectButton} onValueChange={(value) => setSecretQuestion(value)} errorHeading="secret_q_error_heading" errorContent="secret_que_info"/>
            <TextInput_1.TextInput onChange={(value) => setSecretAnswer(value)} label="secret_answer" isValid={secretAnswer.length >= minPasswordLength} hasError={notValid && !(secretAnswer.length >= minPasswordLength)} value={secretAnswer} multiline={true}/>
          </TextContainer>
          <Confirm onPress={() => {
            if (secretAnswer.length < minPasswordLength) {
                setNotValid(true);
                return;
            }
            setSecretIsVisible(false);
        }}>
            <ConfirmText>confirm</ConfirmText>
          </Confirm>
        </CardModal>
      </ThemedModal_1.ThemedModal>
    </BackgroundTheme_1.BackgroundTheme>);
}
const TextContainer = native_1.default.View `
  justify-content: center;
  align-items: center;
  width: 100%;
  shadow-color: #efefef;
  shadow-offset: 0px 2px;
  shadow-opacity: 1;
  shadow-radius: 2px;
`;
const Container = native_1.default.View `
  background-color: #fff;
  width: ${tablet_1.IS_TABLET ? 75 : 100}%;
  max-width: ${maxWidth}px;
  elevation: 4;
  margin-horizontal: 3px;
  margin-vertical: 3px;
  margin-bottom: 5px;
  border-radius: 10px;
  padding-horizontal: 30px;
  padding-vertical: 22px;
`;
const Row = native_1.default.View `
  flex-direction: row;
  height: 57px;
  align-items: flex-end;
  margin-bottom: 4px;
`;
const Confirm = native_1.default.TouchableOpacity `
  width: 100%;
  height: 45px;
  border-radius: 22.5px;
  background-color: #a2c72d;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  margin-top: 10px;
`;
const ChangeSecretButton = native_1.default.TouchableOpacity `
  width: 100%;
  max-width: 200px;
  height: 50px;
  border-radius: 25px;
  background-color: #a2c72d;
  align-items: center;
  justify-content: center;
  margin-left: auto;
`;
const ConfirmButton = native_1.default.TouchableOpacity `
  width: ${tablet_1.IS_TABLET ? 75 : 100}%;
  max-width: ${maxWidth}px;
  height: 60px;
  border-radius: 10px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-top: 5px;
  margin-horizontal: 3px;
  elevation: 4;
`;
const CardModal = native_1.default.View `
  width: 90%;
  height: 400px;
  background-color: #fff;
  border-radius: 10px;
  padding-horizontal: 20px;
  padding-vertical: 20px;
  align-items: center;
  justify-content: space-around;
  align-self: center;
`;
const ConfirmText = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Black;
  text-align: center;
  font-size: 16;
  color: #fff;
`;
const QuestionText = (0, native_1.default)(Text_1.Text) `
  font-size: 16;
  text-align: center;
`;
const styles = react_native_1.StyleSheet.create({
    keyboardAwareAvoidance: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginRight: 38,
        height: 57,
        width: 57,
    },
    textInput: {
        height: '100%',
        justifyContent: 'space-between',
        marginBottom: 0,
    },
    textInputInput: {
        fontFamily: 'Roboto-Black',
        fontSize: 18,
    },
    selectBoxContainer: {
        height: 57,
        justifyContent: 'space-between',
    },
    selectBoxItem: {
        fontSize: 18,
        fontFamily: 'Roboto-Black',
    },
    selectBoxButton: {
        right: -10,
        bottom: 5,
    },
    dobInput: {
        height: '100%',
        justifyContent: 'space-between',
        marginBottom: 0,
    },
    dobInputText: {
        fontSize: 18,
        fontFamily: 'Roboto-Black',
        color: '#555',
    },
    row: {
        marginBottom: 10,
    },
    confirm: {
        color: '#000',
    },
    verticalSelectContainer: {
        height: 45,
        borderRadius: 22.5,
    },
    verticalSelectButton: {
        right: 5,
        bottom: 7,
    },
});
//# sourceMappingURL=EditProfileScreen.jsx.map