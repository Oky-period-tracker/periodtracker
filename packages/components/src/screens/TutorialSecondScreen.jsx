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
exports.TutorialSecondScreen = TutorialSecondScreen;
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
const DayAssetDemo_1 = require("./tutorial/DayAssetDemo");
const CalendarAssetDemo_1 = require("./tutorial/CalendarAssetDemo");
const SpinLoader_1 = require("../components/common/SpinLoader");
const NoteAssetDemo_1 = require("./tutorial/NoteAssetDemo");
const useSelector_1 = require("../hooks/useSelector");
const selectors = __importStar(require("../redux/selectors"));
const react_native_tts_1 = __importDefault(require("react-native-tts"));
const i18n_1 = require("../i18n");
const Flower_1 = require("../optional/Flower");
const PrimaryButton_1 = require("../components/common/buttons/PrimaryButton");
const useScreenDimensions_1 = require("../hooks/useScreenDimensions");
const useOrientation_1 = require("../hooks/useOrientation");
const tablet_1 = require("../config/tablet");
const arrowSize = 55;
// I apologize to anyone who gets to this level of error checking on the sequencing of this component.
// Deadline pressure had mounted beyond compare and it was working stably, It definitely can be simplified and made more declarative
function TutorialSecondScreen({ navigation }) {
    var _a;
    const { screenWidth, screenHeight } = (0, useScreenDimensions_1.useScreenDimensions)();
    const orientation = (0, useOrientation_1.useOrientation)();
    const { data, isActive, index, currentIndex, absoluteIndex } = (0, useInfiniteScroll_1.useInfiniteScroll)();
    const [step, setStep] = react_1.default.useState(0);
    const [loading, setLoading] = react_1.default.useState(false);
    const [showDayAsset, setShowDayAsset] = react_1.default.useState(true);
    const [showNoteAsset, setShowNoteAsset] = react_1.default.useState(false);
    const [showCalendarAsset, setShowCalendarAsset] = react_1.default.useState(false);
    const [showFlowerAsset, setShowFlowerAsset] = react_1.default.useState(false);
    const [positionX] = react_1.default.useState(new react_native_1.Animated.Value(-screenWidth));
    const [positionY] = react_1.default.useState(new react_native_1.Animated.Value(screenHeight / 2 - arrowSize / 2));
    const [positionZ] = react_1.default.useState(new react_native_1.Animated.Value(0));
    const [positionDemoX] = react_1.default.useState(new react_native_1.Animated.Value(-screenWidth));
    const [positionDemoY] = react_1.default.useState(new react_native_1.Animated.Value(0.15 * screenHeight));
    const [completedStep, setCompletedStep] = react_1.default.useState(0);
    const flag = react_1.default.useRef(false);
    const dispatch = (0, react_redux_1.useDispatch)();
    const hasTtsActive = (0, useSelector_1.useSelector)(selectors.isTtsActiveSelector);
    const normalizePosition = (percentage, dimension) => {
        return percentage * dimension - arrowSize / 2;
    };
    let cardWidth = 0.5 * screenWidth;
    const maxCardWidth = 320;
    if (cardWidth > maxCardWidth) {
        cardWidth = maxCardWidth;
    }
    const offset = cardWidth - 80;
    const stepInfo = {
        '0': {
            text: `tutorial_9`,
            heading: `tutorial_9_content`,
            animationPositionEnd: {
                x: normalizePosition(0.5, screenWidth),
                y: normalizePosition(0.5, screenHeight),
                z: 270,
            },
            demonstrationComponent: { isAvailable: false },
        },
        '1': {
            text: `tutorial_10`,
            heading: `tutorial_10_content`,
            animationPositionEnd: {
                x: normalizePosition(0.5, screenWidth) - offset,
                y: normalizePosition(0.5, screenHeight),
                z: 270,
            },
            demonstrationComponent: { isAvailable: false },
        },
        '2': {
            text: `tutorial_11`,
            heading: `tutorial_11_content`,
            animationPositionEnd: {
                x: normalizePosition(0.6, screenWidth),
                y: normalizePosition(0.5, screenHeight),
                z: 270,
            },
            demonstrationComponent: { isAvailable: false },
        },
        '3': {
            text: `tutorial_12`,
            heading: `tutorial_12_content`,
            animationPositionEnd: {
                x: normalizePosition(0.82, screenWidth),
                y: normalizePosition(0.4, screenHeight),
                z: 180,
            },
            demonstrationComponent: {
                isAvailable: true,
                position: { x: 0, y: normalizePosition(0.15, screenHeight) },
            },
        },
        '4': {
            text: `tutorial_13`,
            heading: `tutorial_13_content`,
            animationPositionEnd: {
                x: normalizePosition(0.82, screenWidth),
                y: normalizePosition(0.3, screenHeight),
                z: 180,
            },
            demonstrationComponent: {
                isAvailable: true,
                position: { x: 0, y: normalizePosition(0.15, screenHeight) },
            },
        },
        '5': {
            text: `tutorial_14`,
            heading: `tutorial_14_content`,
            animationPositionEnd: {
                x: normalizePosition(0.3, screenWidth),
                y: normalizePosition(0.12, screenHeight),
                z: 180,
            },
            demonstrationComponent: {
                isAvailable: true,
                position: { x: 0, y: normalizePosition(0.12, screenHeight) },
            },
        },
        // This is used to animated out after the last step
        '6': {
            text: `dummy`,
            heading: `dummy`,
            animationPositionEnd: { x: -screenWidth, y: normalizePosition(0.12, screenHeight), z: 180 },
            demonstrationComponent: {
                isAvailable: true,
                position: { x: -1500, y: normalizePosition(0.15, screenHeight) },
            },
        },
        '7': {
            text: `dummy`,
            heading: `dummy`,
            animationPositionEnd: { x: -screenWidth, y: normalizePosition(0.1, screenHeight), z: 180 },
            demonstrationComponent: {
                isAvailable: true,
                position: { x: -500, y: normalizePosition(0.15, screenHeight) },
            },
        },
    };
    // TODO: Flower submodule changes:
    /*
     '6': {
        text: `tutorial_15`,
        heading: `tutorial_15_content`,
        animationPositionEnd: {
          x: normalizePosition(0.45, screenWidth),
          y: normalizePosition(0.12, screenHeight),
          z: 180,
        },
        demonstrationComponent: {
          isAvailable: true,
          position: { x: 0, y: normalizePosition(0.2, screenHeight) },
        },
      },
      '7': {
        text: `tutorial_16`,
        heading: `tutorial_16_content`,
        animationPositionEnd: {
          x: normalizePosition(0.7, screenWidth),
          y: normalizePosition(0.8, screenHeight),
          z: 270,
        },
        demonstrationComponent: {
          isAvailable: true,
          position: { x: -screenWidth, y: normalizePosition(0.2, screenHeight) },
        },
      },
      '8': {
        text: `dummy`,
        heading: `dummy`,
        animationPositionEnd: {
          x: normalizePosition(0.7, screenWidth),
          y: screenHeight + 100,
          z: 270,
        },
        demonstrationComponent: {
          isAvailable: true,
          position: { x: 0, y: normalizePosition(1, screenHeight + 100) },
        },
      },
    }
    
    const lastTutorialStep = _.size(stepInfo) - 1
  
    */
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
        if (step === 6) {
            flag.current = true;
        }
        if (flag.current) {
            dispatch(actions.setTutorialTwoActive(false));
            setLoading(true);
            requestAnimationFrame(() => {
                setTimeout(() => {
                    (0, navigationService_1.navigateAndReset)('MainStack', null);
                }, 1000);
            });
        }
        if (step === 7)
            return;
        animateArrowPosition();
        if (stepInfo[step].demonstrationComponent.isAvailable) {
            // if ([2, 4, 5, 6, 7].includes(step)) { TODO: Flower submodule changes
            if (step === 4 || step === 5) {
                toggleDemonstrationPosition();
                return;
            }
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
    const toggleDemonstrationPosition = () => {
        react_native_1.Animated.parallel([
            react_native_1.Animated.timing(positionDemoX, {
                toValue: -500,
                duration: react_native_1.Platform.OS === 'ios' ? 200 : 400,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(positionDemoY, {
                toValue: stepInfo[step].demonstrationComponent.position.y,
                duration: react_native_1.Platform.OS === 'ios' ? 200 : 400,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setShowDayAsset(false);
            setShowNoteAsset(true);
            if (step === 5) {
                setShowNoteAsset(false);
                setShowCalendarAsset(true);
            }
            secondHalf();
            // TODO: Flower module
            /*
                  setShowNoteAsset(false)
            setShowDayAsset(false)
            setShowCalendarAsset(false)
            setShowFlowerAsset(false)
            if (step === 2) {
              setShowDayAsset(true)
            }
            if (step === 4) {
              setShowNoteAsset(true)
            }
            if (step === 5) {
              setShowCalendarAsset(true)
            }
            if (step === 6) {
              setShowFlowerAsset(true)
            }
            secondHalf()
             */
        });
    };
    const secondHalf = () => {
        react_native_1.Animated.parallel([
            react_native_1.Animated.timing(positionDemoX, {
                toValue: stepInfo[step].demonstrationComponent.position.x,
                duration: react_native_1.Platform.OS === 'ios' ? 200 : 400,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(positionDemoY, {
                toValue: stepInfo[step].demonstrationComponent.position.y,
                duration: react_native_1.Platform.OS === 'ios' ? 200 : 400,
                useNativeDriver: true,
            }),
        ]).start();
    };
    // TODO: Flower submodule changes:
    /*
     '6': {
        text: `tutorial_15`,
        heading: `tutorial_15_content`,
        animationPositionEnd: {
          x: normalizePosition(0.45, screenWidth),
          y: normalizePosition(0.12, screenHeight),
          z: 180,
        },
        demonstrationComponent: {
          isAvailable: true,
          position: { x: 0, y: normalizePosition(0.2, screenHeight) },
        },
      },
      '7': {
        text: `tutorial_16`,
        heading: `tutorial_16_content`,
        animationPositionEnd: {
          x: normalizePosition(0.7, screenWidth),
          y: normalizePosition(0.8, screenHeight),
          z: 270,
        },
        demonstrationComponent: {
          isAvailable: true,
          position: { x: -screenWidth, y: normalizePosition(0.2, screenHeight) },
        },
      },
      '8': {
        text: `dummy`,
        heading: `dummy`,
        animationPositionEnd: {
          x: normalizePosition(0.7, screenWidth),
          y: screenHeight + 100,
          z: 270,
        },
        demonstrationComponent: {
          isAvailable: true,
          position: { x: 0, y: normalizePosition(1, screenHeight + 100) },
        },
      },
    }
    */
    // const lastTutorialStep = _.size(stepInfo) - 1 // TODO:
    const skip = () => {
        dispatch(actions.setTutorialTwoActive(false));
        setLoading(true);
        requestAnimationFrame(() => {
            setTimeout(() => {
                (0, navigationService_1.navigateAndReset)('MainStack', null);
            }, 1000);
        });
    };
    const wheelSectionWidth = tablet_1.IS_TABLET ? (orientation === 'LANDSCAPE' ? '35%' : '40%') : '65%';
    return (<BackgroundTheme_1.BackgroundTheme>
      <Container>
        <TopSeparator />
        <MiddleSection>
          <Overlay />

          <AvatarSection {...{ step }}>
            {step !== 6 ? (<CircleProgress_1.CircleProgress onPress={() => null} fillColor="#FFC900" emptyFill="#F49200" style={{
                alignSelf: 'flex-start',
                marginLeft: 15,
                position: 'relative',
                zIndex: step === 5 ? 999 : 0,
                elevation: step === 5 ? 10 : 0,
            }}/>) : Flower_1.flowerAssets && ((_a = Flower_1.flowerAssets === null || Flower_1.flowerAssets === void 0 ? void 0 : Flower_1.flowerAssets.flower) === null || _a === void 0 ? void 0 : _a.btn) ? (<react_native_1.Image source={Flower_1.flowerAssets.flower.btn} style={{
                width: 50,
                height: 50,
                alignSelf: 'flex-start',
                marginLeft: 82,
                position: 'relative',
                zIndex: 999,
            }} resizeMethod={'resize'}/>) : null}

            <Avatar_1.Avatar style={{ position: 'absolute', top: 90, zIndex: 0, elevation: 0 }}/>
          </AvatarSection>
          <WheelSection {...{ step }} style={{ width: wheelSectionWidth }}>
            <CircularSelection_1.CircularSelection {...{
        data,
        index,
        isActive,
        currentIndex,
        absoluteIndex,
        disableInteraction: true,
    }}/>
            <CenterCard_1.CenterCard style={{ elevation: 0 }}/>
          </WheelSection>
        </MiddleSection>
        <CarouselSection {...{ step }}>
          <Carousel_1.Carousel {...{
        index,
        data,
        isActive,
        currentIndex,
        absoluteIndex,
        disableInteraction: true,
        showOverlay: step !== 0 && step !== 1 && step !== 2,
    }}/>
        </CarouselSection>
      </Container>
      <Empty />

      <react_native_1.Animated.View style={{
            width: 60,
            height: 60,
            zIndex: 200,
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
            transform: [{ translateX: positionDemoX }, { translateY: positionDemoY }],
        }}>
        <DemonstratedComponent>
          {showDayAsset && <DayAssetDemo_1.DayAssetDemo step={step}/>}
          {showNoteAsset && <NoteAssetDemo_1.NoteAssetDemo step={step}/>}
          {showCalendarAsset && <CalendarAssetDemo_1.CalendarAssetDemo />}
          {showFlowerAsset && <Flower_1.FlowerAssetDemo />}
        </DemonstratedComponent>
      </react_native_1.Animated.View>
      <TouchableContinueOverlay activeOpacity={1} onPress={() => {
            if (!flag.current) {
                setStep((val) => val + 1);
            }
        }}>
        {/* TODO: use lastTutorialStep */}
        {step <= 5 && (<TutorialInformation {...{ step }}>
            <Heading>{step <= 5 ? stepInfo[step].heading : null}</Heading>
            <TutorialText>{step <= 5 ? stepInfo[step].text : null}</TutorialText>
          </TutorialInformation>)}
      </TouchableContinueOverlay>
      <SkipContainer>
        <PrimaryButton_1.PrimaryButton onPress={skip} style={{
            paddingHorizontal: 12,
        }}>
          skip
        </PrimaryButton_1.PrimaryButton>
      </SkipContainer>
      <SpinLoader_1.SpinLoader backdropOpacity={0} isVisible={loading} setIsVisible={setLoading} text="please_wait_back"/>
    </BackgroundTheme_1.BackgroundTheme>);
}
const Container = native_1.default.View `
  top: 0;
  bottom: 56px;
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
`;
const AvatarSection = native_1.default.View `
  height: 100%;
  width: 35%;
  justify-content: flex-start;
`;
const WheelSection = native_1.default.View `
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;
const CarouselSection = native_1.default.View `
  z-index: 11;
  height: 30%;
  width: 100%;
  flex-direction: row;
  elevation: 0;
  background-color: ${(props) => props.step === 0 || props.step === 1 || props.step === 2
    ? 'rgba(0, 0, 0, 0.8)'
    : 'transparent'};
`;
const Overlay = native_1.default.View `
  height: 100%;
  width: 100%;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.8);
  position: absolute;
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

  ${(props) => props.step !== 3 && props.step !== 4 && props.step !== 5 ? 'top: 25;' : 'bottom: 25;'}
  background-color: #fff;
  border-radius: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: center;
  padding-vertical: 15;
  padding-horizontal: 15;
  z-index: 999;
`;
const DemonstratedComponent = native_1.default.View `
  width: 100%;
  align-items: flex-start;
  justify-content: flex-start;
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
const SkipContainer = native_1.default.View `
  width: 85%;
  position: absolute;
  bottom: 10;
  align-items: flex-end;
  justify-content: flex-end;
  align-self: center;
  z-index: 9999;
`;
//# sourceMappingURL=TutorialSecondScreen.jsx.map