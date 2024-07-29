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
exports.PasswordRequestScreen = PasswordRequestScreen;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const react_redux_1 = require("react-redux");
const actions = __importStar(require("../redux/actions"));
const Text_1 = require("../components/common/Text");
const TextInput_1 = require("../components/common/TextInput");
const selectors = __importStar(require("../redux/selectors"));
const navigationService_1 = require("../services/navigationService");
const BackgroundTheme_1 = require("../components/layout/BackgroundTheme");
const PageContainer_1 = require("../components/layout/PageContainer");
const useSelector_1 = require("../hooks/useSelector");
const KeyboardAwareAvoidance_1 = require("../components/common/KeyboardAwareAvoidance");
const SpinLoader_1 = require("../components/common/SpinLoader");
const lodash_1 = __importDefault(require("lodash"));
const react_native_1 = require("react-native");
const tablet_1 = require("../config/tablet");
function PasswordRequestScreen() {
    const dispatch = (0, react_redux_1.useDispatch)();
    const user = (0, useSelector_1.useSelector)(selectors.currentUserSelector);
    const [loading, setLoading] = react_1.default.useState(false);
    const [valid, setValid] = react_1.default.useState(false);
    const [passwordError, setPasswordError] = react_1.default.useState(false);
    const [nameError, setNameError] = react_1.default.useState(false);
    const [name, setName] = react_1.default.useState(user.name);
    const [password, setPassword] = react_1.default.useState('');
    return (<BackgroundTheme_1.BackgroundTheme>
      <PageContainer_1.PageContainer style={styles.page}>
        <KeyboardAwareAvoidance_1.KeyboardAwareAvoidance contentContainerStyle={styles.pageInner}>
          <Container>
            <UpperContent>
              <HeaderText>password_request</HeaderText>
            </UpperContent>
            <LowerContent>
              <Container style={styles.containerInner}>
                <TextInput_1.TextInput style={styles.input} onChange={(text) => setName(text)} label="name" isValid={valid} hasError={nameError} value={name}/>
                <TextInput_1.TextInput onChange={(text) => setPassword(text)} label="password" secureTextEntry={true} isValid={valid} hasError={passwordError} value={password}/>
              </Container>
              <Touchable onPress={() => {
            const trimmedPassword = lodash_1.default.toLower(password).trim();
            setLoading(true);
            if (trimmedPassword === user.password && name === user.name) {
                setNameError(false);
                setPasswordError(false);
                setValid(true);
                requestAnimationFrame(() => {
                    (0, navigationService_1.navigateAndReset)('MainStack', null);
                });
            }
            else if (trimmedPassword === user.password && name !== user.name) {
                setLoading(false);
                setPasswordError(false);
                setNameError(true);
            }
            else if (trimmedPassword !== user.password && name === user.name) {
                setLoading(false);
                setNameError(false);
                setPasswordError(true);
            }
            else {
                setNameError(true);
                setPasswordError(true);
                setLoading(false);
            }
        }}>
                <HeaderText style={styles.confirmButton}>confirm</HeaderText>
              </Touchable>
            </LowerContent>
          </Container>
        </KeyboardAwareAvoidance_1.KeyboardAwareAvoidance>
        <Row>
          <Column>
            <TouchableText onPress={() => {
            dispatch(actions.logoutRequest());
        }}>
              <Text_1.Text style={styles.text}>back_to_signup</Text_1.Text>
            </TouchableText>
          </Column>
        </Row>
        <SpinLoader_1.SpinLoader isVisible={loading} setIsVisible={setLoading}/>
      </PageContainer_1.PageContainer>
    </BackgroundTheme_1.BackgroundTheme>);
}
const HeaderText = (0, native_1.default)(Text_1.Text) `
  font-size: 16;
  text-align: center;
  align-self: center;
  color: #fff;
  font-family: Roboto-Black;
`;
const UpperContent = native_1.default.View `
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: #e3629b;
  height: 80px;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  elevation: 4;
`;
const LowerContent = native_1.default.View `
  width: 100%;
  height: 260px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: #fff;
  justify-content: center;
  align-items: center;
`;
const Container = native_1.default.View `
  justify-content: center;
  align-items: center;
  width: ${tablet_1.IS_TABLET ? 75 : 100}%;
  max-width: 520px;
  shadow-color: #efefef;
  shadow-offset: 0px 2px;
  shadow-opacity: 10px;
  shadow-radius: 2px;
  background-color: #fff;
  elevation: 4;
  border-radius: 10px;
`;
const Touchable = native_1.default.TouchableOpacity `
  height: 80px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const TouchableText = native_1.default.TouchableOpacity ``;
const Row = native_1.default.View `
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const Column = native_1.default.View `
  width: ${tablet_1.IS_TABLET ? 75 : 100}%;
  max-width: 520px;
  margin-top: 10px;
  align-items: flex-end;
  padding-right: 8px;
`;
const styles = react_native_1.StyleSheet.create({
    page: {
        justifyContent: 'center',
    },
    pageInner: {
        alignItems: 'center',
    },
    containerInner: {
        height: 180,
        paddingHorizontal: 15,
    },
    input: {
        marginTop: 20,
    },
    text: {
        marginBottom: 10,
        fontFamily: 'Roboto-Black',
        textDecorationLine: 'underline',
    },
    confirmButton: {
        color: '#000',
    },
});
//# sourceMappingURL=PasswordRequestScreen.jsx.map