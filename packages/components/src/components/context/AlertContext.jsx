"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertContext = void 0;
exports.AlertContextProvider = AlertContextProvider;
exports.useAlert = useAlert;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../common/Text");
exports.AlertContext = react_1.default.createContext(null);
function AlertContextProvider({ children }) {
    // ---- sliding self dissolving alert message ----
    const [bounceValue] = react_1.default.useState(new react_native_1.Animated.Value(-160));
    const [isDissolveAlertVisible, setIsDissolveAlertVisible] = react_1.default.useState(false);
    const [dissolveAlertMessage, setDissolveAlertMessage] = react_1.default.useState('');
    const [dissolveAlertIsDismissed, setDissolveAlertIsDismissed] = react_1.default.useState(false);
    const showDissolveAlert = (message, isPermanentAlert = false, timing = 4000) => {
        setDissolveAlertIsDismissed(false);
        setDissolveAlertMessage(message);
        setIsDissolveAlertVisible(true);
        react_native_1.Animated.timing(bounceValue, {
            toValue: -50,
            duration: 500,
            useNativeDriver: true,
        }).start();
        if (!isPermanentAlert) {
            setTimeout(() => {
                if (!dissolveAlertIsDismissed) {
                    hideDissolveAlert();
                }
            }, timing);
        }
    };
    const hideDissolveAlert = () => {
        react_native_1.Animated.timing(bounceValue, {
            toValue: -160,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setDissolveAlertMessage('');
            setIsDissolveAlertVisible(false);
        });
    };
    return (<exports.AlertContext.Provider value={{ showDissolveAlert }}>
      {children}
      {isDissolveAlertVisible && (<DissolveAlertComponent {...{ dissolveAlertMessage, bounceValue }}/>)}
    </exports.AlertContext.Provider>);
}
function useAlert() {
    const alertContext = react_1.default.useContext(exports.AlertContext);
    if (alertContext === undefined) {
        throw new Error(`useAlert must be used within a AlertProvider`);
    }
    return alertContext;
}
const DissolveAlertComponent = ({ dissolveAlertMessage, bounceValue }) => (<react_native_1.SafeAreaView style={{ position: 'absolute', top: 0, width: '100%' }}>
    <react_native_1.Animated.View style={[{ transform: [{ translateY: bounceValue }] }]}>
      <DissolvingPopUp>
        <Text_1.TextWithoutTranslation>{dissolveAlertMessage}</Text_1.TextWithoutTranslation>
      </DissolvingPopUp>
    </react_native_1.Animated.View>
  </react_native_1.SafeAreaView>);
const DissolvingPopUp = native_1.default.View `
  width: 100%;
  padding: 25px;
  padding-top: 60px;
  z-index: 100000;
  elevation: 5;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-width: 8;
  border-color: #e3629b;
  border-bottom-left-radius: 20;
  border-bottom-right-radius: 20;
`;
//# sourceMappingURL=AlertContext.jsx.map