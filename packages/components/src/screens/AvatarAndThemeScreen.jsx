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
exports.AvatarAndThemeScreen = AvatarAndThemeScreen;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const AvatarSelect_1 = require("./avatarAndTheme/AvatarSelect");
const ThemeSelect_1 = require("./avatarAndTheme/ThemeSelect");
const PageContainer_1 = require("../components/layout/PageContainer");
const BackgroundTheme_1 = require("../components/layout/BackgroundTheme");
const PrimaryButton_1 = require("../components/common/buttons/PrimaryButton");
const actions = __importStar(require("../redux/actions/index"));
const Header_1 = require("../components/common/Header");
const ThemeContext_1 = require("../components/context/ThemeContext");
const navigationService_1 = require("../services/navigationService");
const useSelector_1 = require("../hooks/useSelector");
const selectors = __importStar(require("../redux/selectors"));
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../components/common/Text");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const core_1 = require("@oky/core");
function AvatarAndThemeScreen({ navigation }) {
    const signingUp = navigation.getParam('signingUp');
    const newUser = navigation.getParam('newUser');
    const [loading, setLoading] = react_1.default.useState(false);
    const selectedAvatar = (0, useSelector_1.useSelector)(selectors.currentAvatarSelector);
    const dispatch = (0, react_redux_1.useDispatch)();
    const { id } = (0, ThemeContext_1.useTheme)();
    react_1.default.useEffect(() => {
        setLoading(false);
    }, [id]);
    return (<BackgroundTheme_1.BackgroundTheme>
      <PageContainer_1.PageContainer>
        <react_native_gesture_handler_1.ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
          <Header_1.Header screenTitle={signingUp ? 'empty' : 'avatar_amp_themes'} showGoBackButton={!signingUp}/>
          {signingUp && <Text_1.Text style={styles.text}>avatar_amp_themes_login</Text_1.Text>}
          <AvatarSelect_1.AvatarSelect avatars={core_1.avatarNames} value={selectedAvatar} onSelect={(avatar) => dispatch(actions.setAvatar(avatar))}/>
          <ThemeSelect_1.ThemeSelect themes={core_1.themeNames} value={(0, ThemeContext_1.useTheme)().id} onSelect={(theme) => {
            if (theme !== id) {
                setLoading(true);
                requestAnimationFrame(() => {
                    dispatch(actions.setTheme(theme));
                });
            }
        }}/>
          <ButtonContainer>
            <PrimaryButton_1.PrimaryButton style={styles.flex} onPress={() => (signingUp ? (0, navigationService_1.navigate)('JourneyScreen', { newUser }) : (0, navigationService_1.BackOneScreen)())}>
              confirm
            </PrimaryButton_1.PrimaryButton>
          </ButtonContainer>
          {loading && (<Overlay>
              <react_native_1.ActivityIndicator size="large" color="#f49200"/>
            </Overlay>)}
        </react_native_gesture_handler_1.ScrollView>
      </PageContainer_1.PageContainer>
    </BackgroundTheme_1.BackgroundTheme>);
}
const Overlay = native_1.default.View `
  position: absolute;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  elevation: 6;
`;
const ButtonContainer = native_1.default.View `
  margin-top: 12px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const styles = react_native_1.StyleSheet.create({
    scrollView: { justifyContent: 'center' },
    text: {
        width: '80%',
        alignSelf: 'center',
        color: '#F49200',
        fontFamily: 'Roboto-Black',
        fontSize: 20,
        marginTop: 8,
        marginBottom: 16,
        textAlign: 'center',
    },
    flex: {
        flex: 1,
    },
});
//# sourceMappingURL=AvatarAndThemeScreen.jsx.map