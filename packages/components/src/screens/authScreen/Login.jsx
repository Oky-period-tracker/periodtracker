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
exports.Login = Login;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../../components/common/Text");
const TextInput_1 = require("../../components/common/TextInput");
const react_redux_1 = require("react-redux");
const actions = __importStar(require("../../redux/actions"));
const useSelector_1 = require("../../hooks/useSelector");
const SpinLoader_1 = require("../../components/common/SpinLoader");
const lodash_1 = __importDefault(require("lodash"));
function Login() {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { error: loginError, isLoggingIn } = (0, useSelector_1.useSelector)((state) => state.auth);
    const [loading, setLoading] = react_1.default.useState(false);
    const [name, setName] = react_1.default.useState('');
    const [password, setPassword] = react_1.default.useState('');
    react_1.default.useEffect(() => {
        if (loginError) {
            setLoading(false);
        }
    }, [isLoggingIn]);
    return (<Container>
      <Container style={{
            height: 220,
            paddingHorizontal: 15,
            backgroundColor: 'white',
            elevation: 4,
            overflow: 'hidden',
        }}>
        <TextInput_1.TextInput onChange={(text) => setName(text)} label="name" value={name}/>
        <TextInput_1.TextInput onChange={(text) => setPassword(text)} label="password" secureTextEntry={true} value={password}/>
        {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
      </Container>
      <Touchable onPress={() => {
            setLoading(true);
            requestAnimationFrame(() => {
                dispatch(actions.loginRequest({ name, password: lodash_1.default.toLower(password).trim() }));
            });
        }}>
        <HeaderText>confirm</HeaderText>
      </Touchable>
      <SpinLoader_1.SpinLoader isVisible={loading} setIsVisible={setLoading}/>
    </Container>);
}
const Container = native_1.default.View `
  justify-content: center;
  align-items: center;
  width: 100%;
  shadow-color: #d2d2d2;
  shadow-offset: 0px 2px;
  shadow-opacity: 2;
  shadow-radius: 2;
`;
const Touchable = native_1.default.TouchableOpacity `
  height: 80px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const HeaderText = (0, native_1.default)(Text_1.Text) `
  font-size: 16;
  text-align: center;
  align-self: center;
  color: ${(props) => (props.expanded ? `#fff` : `#000`)};
  font-family: Roboto-Black;
`;
const Overlay = native_1.default.View `
  position: absolute;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;
const ErrorMessage = (0, native_1.default)(Text_1.Text) `
  font-size: 14;
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
  color: red;
`;
//# sourceMappingURL=Login.jsx.map