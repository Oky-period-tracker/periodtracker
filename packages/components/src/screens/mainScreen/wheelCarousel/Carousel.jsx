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
exports.Carousel = Carousel;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_reanimated_1 = __importDefault(require("react-native-reanimated"));
const CarouselElement_1 = require("./CarouselElement");
const PanGesture_1 = require("./PanGesture");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const navigationService_1 = require("../../../services/navigationService");
const moment_1 = __importDefault(require("moment"));
const DisplayTextContext_1 = require("../../../components/context/DisplayTextContext");
const useSelector_1 = require("../../../hooks/useSelector");
const selectors = __importStar(require("../../../redux/selectors"));
const SpinLoader_1 = require("../../../components/common/SpinLoader");
const useOrientation_1 = require("../../../hooks/useOrientation");
const tablet_1 = require("../../../config/tablet");
const useScreenDimensions_1 = require("../../../hooks/useScreenDimensions");
function Carousel({ data, index, isActive, currentIndex, absoluteIndex, disableInteraction = false, showOverlay = false, }) {
    const { screenWidth, screenHeight } = (0, useScreenDimensions_1.useScreenDimensions)();
    const orientation = (0, useOrientation_1.useOrientation)();
    let cardWidth = 0.5 * screenWidth;
    let cardHeight = 0.2 * screenHeight;
    const maxCardWidth = 260;
    const aspectRatio = 0.7;
    if (cardWidth > maxCardWidth) {
        cardWidth = maxCardWidth;
        cardHeight = cardWidth * aspectRatio;
    }
    if (orientation === 'LANDSCAPE') {
        cardHeight = '70%';
    }
    const { interpolate, Value } = react_native_reanimated_1.default;
    const width = cardWidth + 40;
    let translateX = new Value(0);
    const isTutorialTwoOn = (0, useSelector_1.useSelector)(selectors.isTutorialTwoActiveSelector);
    const [isVisible, setIsVisible] = React.useState(false);
    const { setDisplayTextStatic } = (0, DisplayTextContext_1.useDisplayText)();
    const left = tablet_1.IS_TABLET
        ? orientation === 'LANDSCAPE'
            ? -cardWidth / 0.35
            : -cardWidth
        : -cardWidth / 1.8;
    return (<>
      <react_native_1.View style={[
            { height: '100%', width: '100%' },
            showOverlay && { backgroundColor: 'rgba(0,0,0,0.8)' },
        ]}>
        {data.map((dataEntry, key) => {
            // The following is for the 0 index and 1 index being moved so that a linear list appears to be infinite.
            if (key === 0) {
                // @ts-ignore
                translateX = interpolate(index, {
                    inputRange: [0, 1, 2, 2, 3, 10, data.length - 1, data.length],
                    outputRange: [
                        0,
                        -width,
                        -2 * width,
                        tablet_1.IS_TABLET ? 4 * width : 2 * width,
                        tablet_1.IS_TABLET ? 4 * width : 2 * width,
                        tablet_1.IS_TABLET ? 4 * width : 2 * width,
                        width,
                        0,
                    ],
                });
            }
            else if (key === 1) {
                // @ts-ignore
                translateX = interpolate(index, {
                    inputRange: [0, 1, 2, 2, data.length - 1, data.length],
                    outputRange: [
                        width,
                        0,
                        -width,
                        tablet_1.IS_TABLET ? 4 * width : 2 * width,
                        tablet_1.IS_TABLET ? 4 * width : 2 * width,
                        width,
                    ],
                });
            }
            else {
                // @ts-ignore
                translateX = interpolate(index, {
                    inputRange: [key - 1, key, key + 1],
                    outputRange: [width, 0, -width],
                });
            }
            return (<react_native_reanimated_1.default.View 
            // @ts-ignore
            style={[
                    react_native_1.StyleSheet.absoluteFillObject,
                    // @ts-ignore
                    { transform: [{ translateX }] },
                    {
                        left,
                    },
                ]} {...{ key }}>
              <CarouselElement_1.CarouselElement index={index} dataEntry={dataEntry} isActive={isActive} currentIndex={key} width={cardWidth} height={cardHeight} showOverlay={showOverlay}/>
            </react_native_reanimated_1.default.View>);
        })}
        {!disableInteraction && (<PanGesture_1.PanGesture isX={true} ratio={width} {...{ isActive, absoluteIndex }}>
            <react_native_gesture_handler_1.TouchableOpacity onPress={() => {
                if (isTutorialTwoOn) {
                    setIsVisible(true);
                    requestAnimationFrame(() => {
                        (0, navigationService_1.navigateAndReset)('TutorialSecondStack', null);
                    });
                    return;
                }
                data[currentIndex].date.diff((0, moment_1.default)().startOf('day'), 'days') <= 0
                    ? (0, navigationService_1.navigate)('DayScreen', { data: data[currentIndex] })
                    : setDisplayTextStatic('carousel_no_access');
            }} style={{
                height: '100%',
                width: '100%',
                borderRadius: 10,
                bottom: -10,
                left: 15,
            }}/>
          </PanGesture_1.PanGesture>)}
      </react_native_1.View>
      <SpinLoader_1.SpinLoader isVisible={isVisible} setIsVisible={setIsVisible} text="please_wait_tutorial"/>
    </>);
}
//# sourceMappingURL=Carousel.jsx.map