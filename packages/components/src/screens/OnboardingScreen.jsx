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
exports.OnboardingScreen = OnboardingScreen;
const react_1 = __importDefault(require("react"));
const BackgroundTheme_1 = require("../components/layout/BackgroundTheme");
const PageContainer_1 = require("../components/layout/PageContainer");
const native_1 = __importDefault(require("styled-components/native"));
const SwiperContainer_1 = require("../components/common/SwiperContainer");
const OnboardingCard_1 = require("./onboardingScreen/OnboardingCard");
const index_1 = require("../assets/index");
const PrimaryButton_1 = require("../components/common/buttons/PrimaryButton");
const navigationService_1 = require("../services/navigationService");
const actions = __importStar(require("../redux/actions"));
const react_redux_1 = require("react-redux");
const react_native_1 = require("react-native");
const Text_1 = require("../components/common/Text");
function OnboardingScreen() {
    const ref = react_1.default.useRef();
    const dispatch = (0, react_redux_1.useDispatch)();
    const [index, setIndex] = react_1.default.useState(0);
    const [isButtonVisible, setIsButtonVisible] = react_1.default.useState(false);
    react_1.default.useEffect(() => {
        if (index === 2) {
            setIsButtonVisible(true);
        }
    }, [index]);
    return (<BackgroundTheme_1.BackgroundTheme>
      <PageContainer_1.PageContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Container>
          <SwiperContainer_1.SwiperContainer scrollEnabled={true} setIndex={setIndex} pagingEnabled={true} ref={ref}>
            <OnboardingCard_1.OnboardingCard image={index_1.assets.static.icons.calendar} heading="calendar" content="calendar_onboard"/>
            <OnboardingCard_1.OnboardingCard image={index_1.assets.static.icons.news} heading="the_facts" content="the_facts_onboard"/>
            <OnboardingCard_1.OnboardingCard image={index_1.assets.static.icons.profileL} heading="friend" content="friends_onboard"/>
          </SwiperContainer_1.SwiperContainer>
        </Container>
        {isButtonVisible && (<PrimaryButton_1.PrimaryButton style={{
                backgroundColor: '#f49200',
                width: 100,
                position: 'absolute',
                bottom: 20,
                right: 15,
            }} textStyle={{ color: 'white' }} onPress={() => {
                dispatch(actions.setHasOpened(true));
                (0, navigationService_1.navigateAndReset)('LoginStack', null);
            }}>
            continue
          </PrimaryButton_1.PrimaryButton>)}
      </PageContainer_1.PageContainer>
      <FadeOverlay />
    </BackgroundTheme_1.BackgroundTheme>);
}
const FadeOverlay = () => {
    const [opacity] = react_1.default.useState(new react_native_1.Animated.Value(1));
    const [zIndex, setZIndex] = react_1.default.useState(10);
    react_1.default.useEffect(() => {
        const intervalID = setTimeout(() => {
            fadeOut();
        }, 3000);
        return () => clearTimeout(intervalID);
    }, []);
    const fadeOut = () => {
        react_native_1.Animated.timing(opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            setZIndex(-100);
        });
    };
    return (<react_native_1.Animated.View style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex,
            opacity,
        }}>
      <BackgroundTheme_1.BackgroundTheme>
        <WelcomeContainer>
          <WelcomeText>welcome_heading</WelcomeText>
          <LaunchLogo resizeMode="contain" source={index_1.assets.static.launch_icon}/>
        </WelcomeContainer>
      </BackgroundTheme_1.BackgroundTheme>
    </react_native_1.Animated.View>);
};
const Container = native_1.default.View `
  position: absolute;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
`;
const WelcomeContainer = native_1.default.View `
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const LaunchLogo = native_1.default.Image `
  height: 100px;
  aspect-ratio: 1;
`;
const WelcomeText = (0, native_1.default)(Text_1.Text) `
  font-size: 35;
  text-align: center;
  font-family: Roboto-Black;
  color: #e3629b;
  margin-bottom: 30;
`;
//# sourceMappingURL=OnboardingScreen.jsx.map