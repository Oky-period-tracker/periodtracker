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
exports.AccessScreen = AccessScreen;
const react_1 = __importDefault(require("react"));
const PageContainer_1 = require("../../components/layout/PageContainer");
const BackgroundTheme_1 = require("../../components/layout/BackgroundTheme");
const native_1 = __importDefault(require("styled-components/native"));
const ListItem_1 = require("./accessScreen/ListItem");
const Header_1 = require("../../components/common/Header");
const useSelector_1 = require("../../hooks/useSelector");
const selectors = __importStar(require("../../redux/selectors"));
const actions = __importStar(require("../../redux/actions/index"));
const react_redux_1 = require("react-redux");
const navigationService_1 = require("../../services/navigationService");
const react_native_1 = require("react-native");
const Text_1 = require("../../components/common/Text");
const react_native_share_1 = __importDefault(require("react-native-share"));
const i18n_1 = require("../../i18n");
const SpinLoader_1 = require("../../components/common/SpinLoader");
const LanguageSelect_1 = require("../../components/common/LanguageSelect");
const useTextToSpeechHook_1 = require("../../hooks/useTextToSpeechHook");
const config_1 = require("../../config");
function AccessScreen({ navigation }) {
    const locale = (0, useSelector_1.useSelector)(selectors.currentLocaleSelector);
    const dispatch = (0, react_redux_1.useDispatch)();
    const [loading, setLoading] = react_1.default.useState(false);
    const privacyContent = (0, useSelector_1.useSelector)(selectors.privacyContent);
    const speechText = privacyContent.map((item) => item.content);
    const shareLink = () => {
        // @TODO: app event
        dispatch(actions.shareApp());
        const options = {
            url: config_1.WEBSITE_URL,
            message: (0, i18n_1.translate)('join_oky_message'),
        };
        react_native_share_1.default.open(options)
            .then((res) => null)
            .catch((err) => null);
    };
    // useTextToSpeechHook({ navigation, text: speechText })
    (0, useTextToSpeechHook_1.useTextToSpeechHook)({
        navigation,
        text: (0, config_1.acessSettingsScreenText)(),
    });
    return (<BackgroundTheme_1.BackgroundTheme>
      <PageContainer_1.PageContainer>
        <Header_1.Header screenTitle="access_setting"/>
        <Container>
          <ListItem_1.ListItem title="language" subtitle="language_subtitle" renderControls={() => (<LanguageSelect_1.LanguageSelect onPress={(lang) => {
                if (lang !== locale) {
                    setLoading(true);
                    requestAnimationFrame(() => {
                        dispatch(actions.setLocale(lang));
                    });
                }
            }} textStyle={styles.languageButtonText} style={styles.languageButton}/>)}/>
          <ListItem_1.ListItem title="tutorial" subtitle="tutorial_subtitle" renderControls={() => (<ShareButton onPress={() => {
                setLoading(true);
                requestAnimationFrame(() => {
                    (0, navigationService_1.navigateAndReset)('TutorialSecondStack', null);
                });
            }}>
                <ShareButtonText>launch</ShareButtonText>
              </ShareButton>)}/>
          <ListItem_1.ListItem title="share" subtitle="share_qr_description" style={styles.lastItem} innerStyle={styles.lastItemInner} renderControls={() => (<ShareButton onPress={() => shareLink()}>
                <ShareButtonText>share_setting</ShareButtonText>
              </ShareButton>)}/>
          <Empty />
        </Container>
      </PageContainer_1.PageContainer>
      <SpinLoader_1.SpinLoader isVisible={loading} setIsVisible={setLoading}/>
    </BackgroundTheme_1.BackgroundTheme>);
}
const Container = native_1.default.View `
  border-radius: 10px;
  elevation: 3;
  background: #fff;
  margin-horizontal: 2px;
  margin-bottom: 30px;
`;
const Empty = native_1.default.View `
  flex: 1;
`;
const ShareButtonText = (0, native_1.default)(Text_1.Text) `
  font-size: 16;
  font-style: normal;
  color: #fff;
`;
const ShareButton = (0, native_1.default)(react_native_1.TouchableOpacity) `
  height: 55px;
  width: 100px;
  align-self: center;
  margin-top: 20px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: #a2c72d;
`;
const styles = react_native_1.StyleSheet.create({
    languageButton: {
        height: 55,
        width: 100,
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#a2c72d',
    },
    languageButtonText: {
        fontSize: 16,
        fontStyle: 'normal',
        color: '#fff',
    },
    lastItem: {
        paddingBottom: 10,
    },
    lastItemInner: {
        borderBottomWidth: 0,
    },
});
//# sourceMappingURL=AccessScreen.jsx.map