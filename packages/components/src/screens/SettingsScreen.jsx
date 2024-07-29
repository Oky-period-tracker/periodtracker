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
exports.SettingsScreen = SettingsScreen;
const react_1 = __importDefault(require("react"));
const BackgroundTheme_1 = require("../components/layout/BackgroundTheme");
const native_1 = __importDefault(require("styled-components/native"));
const ListItem_1 = require("../components/common/ListItem");
const Header_1 = require("../components/common/Header");
const PrimaryButton_1 = require("../components/common/buttons/PrimaryButton");
const Switcher_1 = require("./settings/Switcher");
const navigationService_1 = require("../services/navigationService");
const react_redux_1 = require("react-redux");
const actions = __importStar(require("../redux/actions"));
const ConfirmAlert_1 = require("../components/common/ConfirmAlert");
const useSelector_1 = require("../hooks/useSelector");
const selectors = __importStar(require("../redux/selectors"));
const index_1 = require("../i18n/index");
const SpinLoader_1 = require("../components/common/SpinLoader");
const config_1 = require("../config");
const useTextToSpeechHook_1 = require("../hooks/useTextToSpeechHook");
const analytics_1 = __importDefault(require("@react-native-firebase/analytics"));
const network_1 = require("../services/network");
const PredictionProvider_1 = require("../components/context/PredictionProvider");
const react_native_1 = require("react-native");
function SettingsScreen({ navigation }) {
    const dispatch = (0, react_redux_1.useDispatch)();
    const [loading, setLoading] = react_1.default.useState(false);
    const currentCycleInfo = (0, PredictionProvider_1.useTodayPrediction)();
    const currentUser = (0, useSelector_1.useSelector)(selectors.currentUserSelector);
    const hasTtsActive = (0, useSelector_1.useSelector)(selectors.isTtsActiveSelector);
    const hasFuturePredictionActive = (0, useSelector_1.useSelector)(selectors.isFuturePredictionSelector);
    (0, useTextToSpeechHook_1.useTextToSpeechHook)({
        navigation,
        text: (0, config_1.settingsScreenText)({ hasTtsActive }),
    });
    return (<BackgroundTheme_1.BackgroundTheme>
      <ScrollContainer>
        <Header_1.Header showGoBackButton={false} screenTitle="settings"/>
        <Container>
          <NavigationLink onPress={() => (0, navigationService_1.navigate)('AboutScreen', null)}>
            <ListItem_1.ListItem title="about" description="about_info"/>
          </NavigationLink>
          <NavigationLink onPress={() => (0, navigationService_1.navigate)('TermsScreen', null)}>
            <ListItem_1.ListItem title="t_and_c" description="t_and_c_info"/>
          </NavigationLink>
          <NavigationLink onPress={() => (0, navigationService_1.navigate)('PrivacyScreen', null)}>
            <ListItem_1.ListItem title="privacy_policy" description="privacy_info"/>
          </NavigationLink>
          <NavigationLink onPress={() => (0, navigationService_1.navigate)('AccessScreen', null)}>
            <ListItem_1.ListItem title="access_setting" description="settings_info"/>
          </NavigationLink>
          {/* <ListItem
          title="text_to_speech"
          description="text_to_speech_info"
          renderControls={() => (
            <Switcher
              value={hasTtsActive}
              onSwitch={(val) => {
                if (val) {
                  if (fetchNetworkConnectionStatus()) {
                    analytics().logEvent('enable_text_to_speech', { user: currentUser })
                  }
                }
                closeOutTTs()
                dispatch(actions.setTtsActive(val))
              }}
            />
          )}
        /> */}
          <ListItem_1.ListItem title="future_prediciton" description="future_prediciton_info" renderControls={() => (<Switcher_1.Switcher value={hasFuturePredictionActive === null || hasFuturePredictionActive === void 0 ? void 0 : hasFuturePredictionActive.futurePredictionStatus} onSwitch={(val) => {
                const currentStartDate = currentCycleInfo;
                dispatch(actions.userUpdateFuturePrediction(val, currentStartDate));
            }}/>)}/>
        </Container>
        <Row>
          <PrimaryButton_1.PrimaryButton style={styles.logoutButton} textStyle={styles.logoutButtonText} onPress={() => (0, ConfirmAlert_1.ConfirmAlert)((0, index_1.translate)('are_you_sure'), (0, index_1.translate)('logout_account_description'), () => {
            setLoading(true);
            setTimeout(() => {
                dispatch(actions.logoutRequest());
            }, 100);
        })}>
            logout
          </PrimaryButton_1.PrimaryButton>
          <PrimaryButton_1.PrimaryButton style={styles.deleteAccountButton} onPress={() => {
            (0, ConfirmAlert_1.ConfirmAlert)((0, index_1.translate)('are_you_sure'), (0, index_1.translate)('delete_account_description'), () => {
                setTimeout(() => {
                    if ((0, network_1.fetchNetworkConnectionStatus)()) {
                        (0, analytics_1.default)().logEvent('delete_account', { user: currentUser });
                    }
                    dispatch(actions.deleteAccountRequest({
                        name: currentUser.name,
                        password: currentUser.password,
                        setLoading,
                    }));
                }, 100);
            });
        }}>
            delete_account_button
          </PrimaryButton_1.PrimaryButton>
          <PrimaryButton_1.PrimaryButton style={styles.contactButton} textStyle={{ color: 'white' }} onPress={() => (0, navigationService_1.navigate)('ContactUsScreen', null)}>
            contact_us
          </PrimaryButton_1.PrimaryButton>
        </Row>
      </ScrollContainer>
      <SpinLoader_1.SpinLoader isVisible={loading} setIsVisible={setLoading}/>
    </BackgroundTheme_1.BackgroundTheme>);
}
const ScrollContainer = native_1.default.View `
  height: 100%;
  width: 100%;
  padding-horizontal: 10px;
`;
const Container = native_1.default.View `
  height: 75%;
  border-radius: 10px;
  elevation: 3;
  background: #fff;
  margin-horizontal: 2px;
`;
const Row = native_1.default.View `
  flex-direction: row;
  justify-content: center;
  margin-top: 10px;
`;
const NavigationLink = native_1.default.TouchableOpacity `
  flex: 1;
`;
const styles = react_native_1.StyleSheet.create({
    logoutButton: {
        flex: 1,
        backgroundColor: '#f49200',
        marginRight: 5,
    },
    logoutButtonText: {
        color: 'white',
    },
    deleteAccountButton: {
        flex: 1,
        backgroundColor: '#EFEFEF',
    },
    contactButton: {
        flex: 1,
        marginLeft: 5,
        backgroundColor: '#a2c72d',
    },
});
//# sourceMappingURL=SettingsScreen.jsx.map