"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
require("react-native-get-random-values"); // Required for uuid package
const react_1 = __importDefault(require("react"));
const AppProvider_1 = require("./AppProvider");
const AppNavigator_1 = __importDefault(require("../navigators/AppNavigator"));
const store_1 = require("../redux/store");
const notifications_1 = require("../services/notifications");
const react_navigation_1 = require("react-navigation");
const react_native_splash_screen_1 = __importDefault(require("react-native-splash-screen"));
const react_native_1 = require("react-native");
const react_native_orientation_locker_1 = __importDefault(require("react-native-orientation-locker"));
const tablet_1 = require("../config/tablet");
const { persistor, store } = (0, store_1.configureStore)();
function App() {
    react_1.default.useEffect(() => {
        if (tablet_1.IS_TABLET) {
            return;
        }
        react_native_orientation_locker_1.default.lockToPortrait();
        return () => {
            react_native_orientation_locker_1.default.unlockAllOrientations();
        };
    }, []);
    react_1.default.useEffect(() => {
        (0, notifications_1.notificationListener)();
        if (react_native_1.Platform.OS === 'ios') {
            react_native_splash_screen_1.default.hide();
        }
    }, []);
    return (<AppProvider_1.AppProvider store={store} persistor={persistor}>
      <react_native_1.StatusBar hidden/>
      <react_navigation_1.SafeAreaView forceInset={{ horizontal: 'never', vertical: 'never' }} style={{ flex: 1, backgroundColor: '#757575' }}>
        <AppNavigator_1.default />
      </react_navigation_1.SafeAreaView>
    </AppProvider_1.AppProvider>);
}
//# sourceMappingURL=App.jsx.map