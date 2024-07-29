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
exports.CircularSelection = CircularSelection;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_reanimated_1 = __importDefault(require("react-native-reanimated"));
const react_native_redash_1 = require("react-native-redash");
const CircularElement_1 = require("./CircularElement");
const PanGesture_1 = require("./PanGesture");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const ColourButtons_1 = require("../ColourButtons");
const useSelector_1 = require("../../../hooks/useSelector");
const selectors = __importStar(require("../../../redux/selectors"));
const navigationService_1 = require("../../../services/navigationService");
const usePredictionWarnings_1 = require("../../../hooks/usePredictionWarnings");
const ThemedModal_1 = require("../../../components/common/ThemedModal");
const SpinLoader_1 = require("../../../components/common/SpinLoader");
const moment_1 = __importDefault(require("moment"));
const tablet_1 = require("../../../config/tablet");
const useOrientation_1 = require("../../../hooks/useOrientation");
const useScreenDimensions_1 = require("../../../hooks/useScreenDimensions");
const { interpolate } = react_native_reanimated_1.default;
function CircularSelection({ data, index, isActive, currentIndex, absoluteIndex, disableInteraction = false, }) {
    const { screenWidth, screenHeight } = (0, useScreenDimensions_1.useScreenDimensions)();
    const orientation = (0, useOrientation_1.useOrientation)();
    const heightMultiplier = tablet_1.IS_TABLET && orientation === 'PORTRAIT' ? 0.6 : 0.55;
    const height = screenHeight * heightMultiplier;
    const width = tablet_1.IS_TABLET ? 0.6 * screenWidth : 0.65 * screenWidth;
    const D = height / 1.6;
    const innerR = D / 2;
    const [isVisible, setIsVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const l = Math.sin(Math.PI / data.length);
    const r = (innerR * l) / (1 - l);
    const R = innerR + 2 * r;
    const cx = width / 2 - r;
    const cy = R - r;
    const segment = (2 * Math.PI) / data.length;
    const rotateZ = interpolate(index, {
        inputRange: [0, data.length],
        outputRange: [0, -2 * Math.PI],
    });
    const isTutorialOneOn = (0, useSelector_1.useSelector)(selectors.isTutorialOneActiveSelector);
    const checkIfWarning = (0, usePredictionWarnings_1.useCheckDayWarning)();
    // automatically close the modal if the wheel start scrolling
    React.useEffect(() => {
        setIsVisible(false);
    }, [currentIndex]);
    const navigateToTutorial = () => {
        setLoading(true);
        requestAnimationFrame(() => {
            (0, navigationService_1.navigateAndReset)('TutorialFirstStack', null);
        });
    };
    const reduxState = (0, useSelector_1.useSelector)((state) => state);
    const getCardAnswersValues = (inputDay) => {
        const verifiedPeriodDaysData = selectors.verifyPeriodDaySelectorWithDate(reduxState, (0, moment_1.default)(inputDay.date));
        return verifiedPeriodDaysData;
    };
    return (<>
      <react_native_1.View style={{ height, width }}>
        <react_native_reanimated_1.default.View style={[
            {
                position: 'absolute',
                left: 2 * r,
                right: -2 * r,
                top: -10,
                bottom: 10,
            },
            // @ts-ignore
            {
                transform: (0, react_native_redash_1.transformOrigin)(0, R - height / 2, {
                    // @ts-ignore
                    rotateZ,
                }),
            },
        ]}>
          {data.map((dataEntry, key) => {
            return (<react_native_1.View {...{ key }} style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    // backgroundColor:'cyan',
                    transform: [
                        { translateX: cx },
                        { translateY: cy },
                        { rotateZ: `${key * segment - 0.5 * Math.PI}rad` }, // change the rotation of the circle by 90 degrees so active index is far left
                        { translateY: -cy },
                    ],
                }}>
                <CircularElement_1.CircularElement segment={segment} radius={r} currentIndex={key} cardValues={getCardAnswersValues(dataEntry)} state={reduxState} {...{ isActive, index, dataEntry }}/>
              </react_native_1.View>);
        })}
        </react_native_reanimated_1.default.View>
        {!disableInteraction && (<PanGesture_1.PanGesture isX={false} ratio={(2 * width) / (data.length / 2)} // the 3 is slowing the rotation speed so no crazy rotations are possible
         {...{ isActive, absoluteIndex }}>
            <react_native_gesture_handler_1.TouchableOpacity onPress={() => {
                if (isTutorialOneOn) {
                    navigateToTutorial();
                    return;
                }
                setIsVisible(true);
            }} style={{
                height: 100,
                width: 100,
                marginTop: cy,
            }}/>
          </PanGesture_1.PanGesture>)}
        <ThemedModal_1.ThemedModal {...{ isVisible, setIsVisible }}>
          <ColourButtons_1.ColourButtons navigateToTutorial={navigateToTutorial} inputDay={data[currentIndex].date} hide={() => setIsVisible(false)} isCalendar={false} onPress={() => setIsVisible(false)} selectedDayInfo={data[currentIndex]} cardValues={(0, useSelector_1.useSelector)((state) => selectors.verifyPeriodDaySelectorWithDate(state, (0, moment_1.default)(data[currentIndex].date)))}/>
        </ThemedModal_1.ThemedModal>
      </react_native_1.View>
      <SpinLoader_1.SpinLoader isVisible={loading} setIsVisible={setLoading} text="please_wait_tutorial"/>
    </>);
}
//# sourceMappingURL=CircularSelection.jsx.map