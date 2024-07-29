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
exports.SplashScreen = SplashScreen;
const react_1 = __importDefault(require("react"));
const BackgroundTheme_1 = require("../components/layout/BackgroundTheme");
const PageContainer_1 = require("../components/layout/PageContainer");
const index_1 = require("../assets/index");
const native_1 = __importDefault(require("styled-components/native"));
const react_redux_1 = require("react-redux");
const selectors = __importStar(require("../redux/selectors"));
const actions = __importStar(require("../redux/actions"));
const navigationService_1 = require("../services/navigationService");
const react_native_1 = require("react-native");
const notifications_1 = require("../services/notifications");
const analytics_1 = __importDefault(require("@react-native-firebase/analytics"));
const react_native_device_info_1 = __importDefault(require("react-native-device-info"));
const AlertContext_1 = require("../components/context/AlertContext");
const HttpClient_1 = require("../services/HttpClient");
const network_1 = require("../services/network");
const messaging_1 = __importDefault(require("@react-native-firebase/messaging"));
function SplashScreen() {
    const dispatch = (0, react_redux_1.useDispatch)();
    const user = (0, react_redux_1.useSelector)(selectors.currentUserSelector);
    const Alert = (0, AlertContext_1.useAlert)();
    const locale = (0, react_redux_1.useSelector)(selectors.currentLocaleSelector);
    const hasOpened = (0, react_redux_1.useSelector)(selectors.hasOpenedSelector);
    const currentAppVersion = (0, react_redux_1.useSelector)(selectors.currentAppVersion);
    const currentFirebaseToken = (0, react_redux_1.useSelector)(selectors.currentFirebaseToken);
    const hasPasswordRequestOn = (0, react_redux_1.useSelector)(selectors.isLoginPasswordActiveSelector);
    const [animatedValue] = react_1.default.useState(new react_native_1.Animated.Value(0));
    function checkForPermanentAlerts() {
        return __awaiter(this, void 0, void 0, function* () {
            const versionName = react_native_device_info_1.default.getVersion();
            try {
                const { message = '', isPermanent = false } = yield HttpClient_1.httpClient.getPermanentAlert(versionName, locale, user);
                if (message !== '') {
                    Alert.showDissolveAlert(message, isPermanent);
                }
            }
            catch (_a) {
                // do nothing
            }
        });
    }
    react_1.default.useEffect(() => {
        if ((0, network_1.fetchNetworkConnectionStatus)()) {
            (0, analytics_1.default)().logEvent('app_open', { user });
        }
        checkForPermanentAlerts();
        (0, notifications_1.requestUserPermission)();
        (0, notifications_1.createNotificationChannel)();
        // TODO_ALEX dynamic locale names for all?
        (0, messaging_1.default)().unsubscribeFromTopic('oky_en_notifications');
        (0, messaging_1.default)().unsubscribeFromTopic('oky_id_notifications');
        (0, messaging_1.default)().unsubscribeFromTopic('oky_mn_notifications');
        (0, messaging_1.default)().subscribeToTopic(`oky_${locale}_notifications`);
        if (currentAppVersion !== react_native_device_info_1.default.getVersion()) {
            dispatch(actions.setUpdatedVersion());
            dispatch(actions.updateFuturePrediction(true, null));
        }
        if ((0, network_1.fetchNetworkConnectionStatus)()) {
            if (currentFirebaseToken === null) {
                dispatch(actions.requestStoreFirebaseKey());
            }
        }
        Spin();
        requestAnimationFrame(() => {
            if (!hasOpened) {
                (0, navigationService_1.navigateAndReset)('OnboardingScreen', null);
                return;
            }
            if (user) {
                if (hasPasswordRequestOn) {
                    (0, navigationService_1.navigateAndReset)('PasswordRequestScreen', null);
                    return;
                }
                (0, navigationService_1.navigateAndReset)('MainStack', null);
                return;
            }
            (0, navigationService_1.navigateAndReset)('LoginStack', null);
        });
        return () => {
            animatedValue.stopAnimation();
        };
    }, []);
    const Spin = () => {
        react_native_1.Animated.timing(animatedValue, {
            duration: 50000,
            toValue: 36000,
            easing: react_native_1.Easing.linear,
            useNativeDriver: true,
        }).start();
    };
    const rotation = animatedValue.interpolate({
        inputRange: [0, 36000],
        outputRange: ['0deg', '36000deg'],
    });
    return (<BackgroundTheme_1.BackgroundTheme>
      <PageContainer_1.PageContainer>
        <Container>
          <Face resizeMode="contain" source={index_1.assets.static.spin_load_face}/>
          <AnimatedContainer style={{
            transform: [{ rotate: rotation }],
        }}>
            <Spinner resizeMode="contain" source={index_1.assets.static.spin_load_circle}/>
          </AnimatedContainer>
        </Container>
      </PageContainer_1.PageContainer>
    </BackgroundTheme_1.BackgroundTheme>);
}
const Container = native_1.default.View `
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const Face = native_1.default.Image `
  height: 120px;
  width: 120px;
  align-self: center;
`;
const Spinner = native_1.default.Image `
  height: 123px;
  width: 123px;
`;
const AnimatedContainer = (0, native_1.default)(react_native_1.Animated.View) `
  height: 123px;
  width: 123px;
  position: absolute;
  align-self: center;
`;
//# sourceMappingURL=SplashScreen.jsx.map