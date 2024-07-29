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
exports.TutorialFirstScreen = TutorialFirstScreen;
const react_1 = __importDefault(require("react"));
const BackgroundTheme_1 = require("../components/layout/BackgroundTheme");
const CircleProgress_1 = require("./mainScreen/CircleProgress");
const native_1 = __importDefault(require("styled-components/native"));
const CircularSelection_1 = require("./mainScreen/wheelCarousel/CircularSelection");
const Carousel_1 = require("./mainScreen/wheelCarousel/Carousel");
const CenterCard_1 = require("./mainScreen/CenterCard");
const Avatar_1 = require("../components/common/Avatar/Avatar");
const useInfiniteScroll_1 = require("./mainScreen/wheelCarousel/useInfiniteScroll");
const navigationService_1 = require("../services/navigationService");
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const actions = __importStar(require("../redux/actions"));
const Text_1 = require("../components/common/Text");
const Icon_1 = require("../components/common/Icon");
const assets_1 = require("../assets");
const ColourButtonsDemo_1 = require("./tutorial/ColourButtonsDemo");
const SpinLoader_1 = require("../components/common/SpinLoader");
const react_native_device_info_1 = __importDefault(require("react-native-device-info"));
const useSelector_1 = require("../hooks/useSelector");
const selectors = __importStar(require("../redux/selectors"));
const react_native_tts_1 = __importDefault(require("react-native-tts"));
const i18n_1 = require("../i18n");
const PrimaryButton_1 = require("../components/common/buttons/PrimaryButton");
const useScreenDimensions_1 = require("../hooks/useScreenDimensions");
const tablet_1 = require("../config/tablet");
const useOrientation_1 = require("../hooks/useOrientation");
const arrowSize = 55;
// I apologize to anyone who gets to this level of error checking on the sequencing of this component.
// Deadline pressure had mounted beyond compare and it was working stably, It definitely can be simplified and made more declarative
function TutorialFirstScreen() {
    const { screenWidth, screenHeight } = (0, useScreenDimensions_1.useScreenDimensions)();
    const orientation = (0, useOrientation_1.useOrientation)();
    const { data, isActive, index, currentIndex, absoluteIndex } = (0, useInfiniteScroll_1.useInfiniteScroll)();
    const [step, setStep] = react_1.default.useState(0);
    const [loading, setLoading] = react_1.default.useState(false);
    const [positionX] = react_1.default.useState(new react_native_1.Animated.Value(-screenWidth));
    const [positionY] = react_1.default.useState(new react_native_1.Animated.Value(screenHeight / 2 - arrowSize / 2));
    const [positionZ] = react_1.default.useState(new react_native_1.Animated.Value(0));
    const [positionDemoX] = react_1.default.useState(new react_native_1.Animated.Value(-screenWidth));
    const [positionDemoY] = react_1.default.useState(new react_native_1.Animated.Value(0.2 * screenHeight));
    const flag = react_1.default.useRef(false);
    const dispatch = (0, react_redux_1.useDispatch)();
    const [completedStep, setCompletedStep] = react_1.default.useState(0);
    const hasTtsActive = (0, useSelector_1.useSelector)(selectors.isTtsActiveSelector);
    const normalizePosition = (percentage, dimension) => {
        return percentage * dimension - arrowSize / 2;
    };
    const cloudSize = 85;
    const cloudMargin = 10;
    const cloudWidth = cloudSize + cloudMargin * 2;
    const stepInfo = {
        '0': {
            text: `tutorial_0`,
            heading: `tutorial_0_content`,
            animationPositionEnd: {
                x: normalizePosition(0.42, screenWidth),
                y: normalizePosition(0.33, screenHeight),
                z: 180,
            },
            demonstrationComponent: { isAvailable: false },
        },
        '1': {
            text: `tutorial_1`,
            heading: `tutorial_1_content`,
            animationPositionEnd: {
                x: normalizePosition(0.15, screenWidth),
                y: normalizePosition(react_native_1.Platform.OS === 'ios' ? (react_native_device_info_1.default.hasNotch() ? 0.4 : 0.35) : 0.33, screenHeight),
                z: 0,
            },
            demonstrationComponent: { isAvailable: false },
        },
        '2': {
            text: `tutorial_3`,
            heading: `tutorial_3_content`,
            animationPositionEnd: {
                x: normalizePosition(0.4, screenWidth),
                y: normalizePosition(react_native_1.Platform.OS === 'ios' ? (react_native_device_info_1.default.hasNotch() ? 0.4 : 0.37) : 0.33, screenHeight),
                z: 0,
            },
            demonstrationComponent: { isAvailable: false },
        },
        '3': {
            text: `tutorial_2`,
            heading: `tutorial_2_content`,
            animationPositionEnd: tablet_1.IS_TABLET
                ? {
                    x: normalizePosition(0.4, screenWidth),
                    y: normalizePosition(react_native_1.Platform.OS === 'ios' ? (react_native_device_info_1.default.hasNotch() ? 0.4 : 0.37) : 0.33, screenHeight),
                    z: 0,
                }
                : {
                    x: normalizePosition(0.4, screenWidth),
                    y: normalizePosition(0.52, screenHeight),
                    z: 90,
                },
            demonstrationComponent: { isAvailable: false },
        },
        '4': {
            text: `tutorial_4`,
            heading: `tutorial_4_content`,
            animationPositionEnd: {
                x: normalizePosition(0.5, screenWidth),
                y: normalizePosition(0.52, screenHeight),
                z: 90,
            },
            demonstrationComponent: {
                isAvailable: true,
                position: { x: 0, y: normalizePosition(0.2, screenHeight) },
            },
        },
        '5': {
            text: `tutorial_5`,
            heading: `tutorial_5_content`,
            animationPositionEnd: {
                x: normalizePosition(0.5, screenWidth),
                y: normalizePosition(0.52, screenHeight),
                z: 90,
            },
            demonstrationComponent: {
                isAvailable: true,
                position: { x: 0, y: normalizePosition(0.2, screenHeight) },
            },
        },
        '6': {
            text: `tutorial_6`,
            heading: `tutorial_6_content`,
            animationPositionEnd: {
                x: normalizePosition(0.5, screenWidth) - cloudWidth,
                y: normalizePosition(0.5, screenHeight),
                z: 90,
            },
            demonstrationComponent: {
                isAvailable: true,
                position: { x: 0, y: normalizePosition(0.2, screenHeight) },
            },
        },
        '7': {
            text: `tutorial_7`,
            heading: `tutorial_7_content`,
            animationPositionEnd: {
                x: normalizePosition(0.5, screenWidth),
                y: normalizePosition(0.5, screenHeight),
                z: 90,
            },
            demonstrationComponent: {
                isAvailable: true,
                position: { x: 0, y: normalizePosition(0.2, screenHeight) },
            },
        },
        '8': {
            text: `tutorial_8`,
            heading: `tutorial_8_content`,
            animationPositionEnd: {
                x: normalizePosition(0.5, screenWidth) + cloudWidth,
                y: normalizePosition(0.5, screenHeight),
                z: 90,
            },
            demonstrationComponent: {
                isAvailable: true,
                position: { x: 0, y: normalizePosition(0.2, screenHeight) },
            },
        },
        '9': {
            text: `closeOut`,
            heading: `closeOut`,
            animationPositionEnd: { x: -100, y: normalizePosition(0.5, screenHeight), z: 0 },
            demonstrationComponent: {
                isAvailable: true,
                position: { x: -screenWidth, y: normalizePosition(0.2, screenHeight) },
            },
        },
        '10': {
            text: `dummy`,
            heading: `dummy`,
            animationPositionEnd: { x: -100, y: normalizePosition(0.5, screenHeight), z: 0 },
            demonstrationComponent: {
                isAvailable: true,
                position: { x: -screenWidth, y: normalizePosition(0.2, screenHeight) },
            },
        },
    };
    react_1.default.useEffect(() => {
        if (hasTtsActive) {
            if (completedStep === step) {
                setCompletedStep(step + 1);
                react_native_tts_1.default.speak((0, i18n_1.translate)(stepInfo[step].heading));
                react_native_tts_1.default.speak((0, i18n_1.translate)(stepInfo[step].text));
            }
        }
    }, [completedStep, stepInfo, step, hasTtsActive]);
    react_1.default.useEffect(() => {
        if (step === 9) {
            flag.current = true;
        }
        if (flag.current) {
            dispatch(actions.setTutorialOneActive(false));
            setLoading(true);
            requestAnimationFrame(() => {
                setTimeout(() => {
                    (0, navigationService_1.navigateAndReset)('MainStack', null);
                }, 2000);
            });
        }
        if (step === 10)
            return;
        animateArrowPosition();
        if (stepInfo[step].demonstrationComponent.isAvailable) {
            animateDemonstrationPosition();
        }
    }, [step]);
    const animateArrowPosition = () => {
        react_native_1.Animated.parallel([
            react_native_1.Animated.timing(positionX, {
                toValue: stepInfo[step].animationPositionEnd.x,
                duration: 600,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(positionY, {
                toValue: stepInfo[step].animationPositionEnd.y,
                duration: 600,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(positionZ, {
                toValue: stepInfo[step].animationPositionEnd.z,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    };
    const animateDemonstrationPosition = () => {
        react_native_1.Animated.parallel([
            react_native_1.Animated.timing(positionDemoX, {
                toValue: stepInfo[step].demonstrationComponent.position.x,
                duration: 600,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(positionDemoY, {
                toValue: stepInfo[step].demonstrationComponent.position.y,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    };
    const rotation = positionZ.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '-360deg'],
    });
    const skip = () => {
        flag.current = true;
        dispatch(actions.setTutorialOneActive(false));
        setLoading(true);
        requestAnimationFrame(() => {
            setTimeout(() => {
                (0, navigationService_1.navigateAndReset)('MainStack', null);
            }, 2000);
        });
    };
    const wheelSectionWidth = tablet_1.IS_TABLET ? (orientation === 'LANDSCAPE' ? '35%' : '40%') : '65%';
    return (<BackgroundTheme_1.BackgroundTheme>
      <Container>
        <TopSeparator style={{ height: react_native_device_info_1.default.hasNotch() ? screenHeight * 0.13 : '10%' }}/>
        <MiddleSection>
          <AvatarSection {...{ step }}>
            <CircleProgress_1.CircleProgress onPress={() => null} fillColor="#FFC900" emptyFill="#F49200" style={{
            alignSelf: 'flex-start',
            marginLeft: 15,
            position: 'relative',
            zIndex: step === 0 ? 999 : 0,
        }}/>
            <Avatar_1.Avatar style={{
            position: 'absolute',
            top: 90,
            elevation: step === 0 ? 20 : 0,
            zIndex: step === 0 ? 999 : 0,
        }}/>
            <Overlay />
          </AvatarSection>

          <MiddleOverlay />

          <WheelSection {...{ step }} style={{ width: wheelSectionWidth }}>
            <CircularSelection_1.CircularSelection {...{
        data,
        index,
        isActive,
        currentIndex,
        absoluteIndex,
        disableInteraction: true,
    }}/>
            <CenterCard_1.CenterCard style={step === 2 ? { elevation: 20, zIndex: 999 } : { elevation: -20, zIndex: 0 }}/>
            {step !== 1 && step !== 3 && <Overlay />}
          </WheelSection>
        </MiddleSection>
        <CarouselSection {...{ step }}>
          <Carousel_1.Carousel {...{ index, data, isActive, currentIndex, absoluteIndex }} disableInteraction showOverlay/>
        </CarouselSection>
      </Container>
      <Empty />
      <react_native_1.Animated.View style={{
            width: 60,
            height: 60,
            zIndex: 200,
            elevation: 200,
            transform: [{ translateX: positionX }, { translateY: positionY }],
        }}>
        <react_native_1.Animated.View style={{
            transform: [{ rotate: rotation }],
        }}>
          <Icon_1.Icon style={{
            zIndex: 200,
            height: arrowSize,
            width: arrowSize,
            transform: [{ rotateY: '180deg' }],
        }} source={assets_1.assets.static.icons.arrow}/>
        </react_native_1.Animated.View>
      </react_native_1.Animated.View>

      <react_native_1.Animated.View style={{
            zIndex: 200,
            elevation: 200,
            transform: [{ translateX: positionDemoX }, { translateY: positionDemoY }],
        }}>
        <DemonstratedComponent>
          <ColourButtonsDemo_1.ColourButtonsDemo showBlue={step === 4}/>
        </DemonstratedComponent>
      </react_native_1.Animated.View>
      <TouchableContinueOverlay activeOpacity={1} onPress={() => {
            if (!flag.current) {
                setStep((val) => val + 1);
            }
        }}>
        {step <= 8 && (<TutorialInformation>
            <Heading>{step <= 9 ? stepInfo[step].heading : null}</Heading>
            <TutorialText>{step <= 9 ? stepInfo[step].text : null}</TutorialText>
          </TutorialInformation>)}
        <PrimaryButton_1.PrimaryButton onPress={skip} style={{ position: 'absolute', top: 12, left: 12, padding: 12 }}>
          skip
        </PrimaryButton_1.PrimaryButton>
      </TouchableContinueOverlay>
      <SpinLoader_1.SpinLoader backdropOpacity={0} isVisible={loading} setIsVisible={setLoading} text="please_wait_back"/>
    </BackgroundTheme_1.BackgroundTheme>);
}
const Container = native_1.default.View `
  top: 0;
  bottom: 56;
  right: 0;
  left: 0;
  position: absolute;
`;
const Empty = native_1.default.View `
  height: 56px;
  bottom: 0;
  right: 0;
  left: 0;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
`;
const TopSeparator = native_1.default.View `
  height: 10%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 10;
`;
const MiddleSection = native_1.default.View `
  height: 60%;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  z-index: 9;
`;
const AvatarSection = native_1.default.View `
  height: 100%;
  width: 35%;
  justify-content: flex-start;
  z-index: 999;
`;
const WheelSection = native_1.default.View `
  height: 100%;
  width: 65%;
  align-items: center;
  elevation: 0;
  z-index: ${(props) => (props.step === 1 || props.step === 3 ? 999999 : 0)};
  justify-content: center;
  background-color: ${(props) => props.step === 1 || props.step === 3 ? 'rgba(0, 0, 0, 0.8) ' : 'transparent'};
  flex-direction: row;
`;
const CarouselSection = native_1.default.View `
  z-index: 11;
  height: 30%;
  width: 100%;
  flex-direction: row;
  elevation: 0;
`;
const Overlay = native_1.default.View `
  height: 100%;
  width: 100%;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.8);
  position: absolute;
`;
const MiddleOverlay = native_1.default.View `
  flex: 1;
  height: 100%;
  width: 100%;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.8);
`;
const TouchableContinueOverlay = native_1.default.TouchableOpacity `
  height: 100%;
  width: 100%;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0);
  position: absolute;
`;
const TutorialInformation = native_1.default.View `
  min-height: 150;
  width: 85%;
  position: absolute;
  bottom: 25;
  background-color: #fff;
  border-radius: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: center;
  padding-vertical: 15;
  padding-horizontal: 15;
`;
const DemonstratedComponent = native_1.default.View `
  width: 100%;
  align-items: center;
  justify-content: center;
  position: absolute;
`;
const Heading = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Black;
  font-size: 18;
  margin-bottom: 10;
  color: #a2c72d;
`;
const TutorialText = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Regular;
  font-size: 16;
  margin-bottom: 10;
`;
//# sourceMappingURL=TutorialFirstScreen.jsx.map