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
exports.CircularElement = CircularElement;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_reanimated_1 = __importDefault(require("react-native-reanimated"));
const react_native_redash_1 = require("react-native-redash");
const ThemeContext_1 = require("../../../components/context/ThemeContext");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const i18n_1 = require("../../../i18n");
const react_redux_1 = require("react-redux");
const selectors = __importStar(require("../../../redux/selectors"));
const moment_1 = __importDefault(require("moment"));
const PredictionProvider_1 = require("../../../components/context/PredictionProvider");
const lodash_1 = __importDefault(require("lodash"));
const asset_1 = require("../../../services/asset");
const useScreenDimensions_1 = require("../../../hooks/useScreenDimensions");
const { Value, useCode, cond, Clock, and, set, add, not, clockRunning, block, stopClock, interpolate, } = react_native_reanimated_1.default;
function checkForVerifiedDay(cardValues) {
    if (lodash_1.default.has(cardValues, 'periodDay')) {
        return cardValues.periodDay;
    }
    return false;
}
function useStatusForSource(data, themeName, cardValues, hasFuturePredictionActive, currentCycleInfo, actualCurrentStartDate) {
    const isVerified = checkForVerifiedDay(cardValues);
    const themeIcon = switcher(themeName);
    let isFutureDate = null;
    if (hasFuturePredictionActive) {
        if (!(hasFuturePredictionActive === null || hasFuturePredictionActive === void 0 ? void 0 : hasFuturePredictionActive.futurePredictionStatus)) {
            if (!lodash_1.default.isEmpty(actualCurrentStartDate)) {
                const checkStartDate = (actualCurrentStartDate === null || actualCurrentStartDate === void 0 ? void 0 : actualCurrentStartDate.cycleStart)
                    ? actualCurrentStartDate.cycleStart
                    : actualCurrentStartDate === null || actualCurrentStartDate === void 0 ? void 0 : actualCurrentStartDate.startDate;
                isFutureDate = (0, moment_1.default)(data.date).isAfter((0, moment_1.default)(checkStartDate).add(actualCurrentStartDate.periodLength, 'days'));
            }
        }
        if (isFutureDate) {
            return (0, asset_1.getAsset)(`static.icons.${themeIcon}.nonPeriod`);
        }
    }
    if (data.onPeriod && isVerified)
        return (0, asset_1.getAsset)(`static.icons.${themeIcon}.period`);
    if (data.onPeriod && !isVerified)
        return (0, asset_1.getAsset)(`static.icons.${themeIcon}.notVerifiedDay`);
    if (data.onFertile)
        return (0, asset_1.getAsset)(`static.icons.${themeIcon}.fertile`);
    return (0, asset_1.getAsset)(`static.icons.${themeIcon}.nonPeriod`);
}
function switcher(value) {
    switch (value) {
        case 'mosaic':
            return 'stars';
        case 'desert':
            return 'segment';
        default:
            return 'clouds';
    }
}
function CircularElement({ radius, isActive, index, currentIndex, dataEntry, segment, cardValues, state, }) {
    const { screenHeight } = (0, useScreenDimensions_1.useScreenDimensions)();
    const currentCycleInfo = (0, PredictionProvider_1.useTodayPrediction)();
    const hasFuturePredictionActive = (0, react_redux_1.useSelector)(selectors.isFuturePredictionSelector);
    const actualCurrentStartDate = (0, PredictionProvider_1.useActualCurrentStartDateSelector)();
    const { id: themeName } = (0, ThemeContext_1.useTheme)();
    const clock = new Clock();
    const value = new Value(0);
    const margin = themeName === 'desert' ? 0 : 10; // No margin for the continuos circle
    useCode(block([
        cond(and(not(isActive), (0, react_native_redash_1.approximates)(index, currentIndex)), [
            set(value, (0, react_native_redash_1.runSpring)(clock, 0, 1)),
            cond(not(clockRunning(clock)), set(isActive, 0)),
        ]),
        cond(isActive, [stopClock(clock), set(value, 0)]),
    ]), []);
    const scale = interpolate(value, {
        inputRange: [0, 1],
        outputRange: [1, 1.3],
    });
    const InnerRotateZ = interpolate(index, {
        inputRange: [0, 12],
        outputRange: [0, 2 * Math.PI],
    });
    const source = useStatusForSource(dataEntry, themeName, cardValues, hasFuturePredictionActive, currentCycleInfo, actualCurrentStartDate);
    const cloudAdjust = themeName !== 'mosaic' && themeName !== 'desert' ? { left: -3 } : null;
    let isFutureDate = null;
    if (hasFuturePredictionActive) {
        if (!(hasFuturePredictionActive === null || hasFuturePredictionActive === void 0 ? void 0 : hasFuturePredictionActive.futurePredictionStatus)) {
            if (!lodash_1.default.isEmpty(actualCurrentStartDate)) {
                const checkStartDate = (actualCurrentStartDate === null || actualCurrentStartDate === void 0 ? void 0 : actualCurrentStartDate.cycleStart)
                    ? actualCurrentStartDate.cycleStart
                    : actualCurrentStartDate === null || actualCurrentStartDate === void 0 ? void 0 : actualCurrentStartDate.startDate;
                isFutureDate = (0, moment_1.default)(dataEntry.date).isAfter((0, moment_1.default)(checkStartDate).add(actualCurrentStartDate.periodLength, 'days'));
            }
        }
    }
    return (<react_native_1.View style={{
            width: radius * 2,
            height: radius * 2,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
      <react_native_reanimated_1.default.View 
    // @ts-ignore
    style={{
            width: (radius - margin) * 2,
            height: (radius - margin) * 2,
            justifyContent: 'center',
            alignItems: 'center',
            transform: [
                {
                    scale: themeName === 'desert' ? 1 : scale,
                    rotateZ: themeName === 'desert'
                        ? '-0.2deg'
                        : add(InnerRotateZ, new Value(-currentIndex * segment + 0.5 * Math.PI)),
                },
            ],
        }}>
        <react_native_gesture_handler_1.TouchableOpacity accessibilityLabel={`${dataEntry.date.format('DD')}\n${(0, i18n_1.translate)(dataEntry.date.format('MMM'))}`} onPress={() => null}>
          <react_native_1.ImageBackground style={{
            width: themeName === 'desert' ? 0.15 * screenHeight : 70,
            height: themeName === 'desert' ? 0.15 * screenHeight : 70,
            alignItems: 'center',
            justifyContent: 'center',
        }} resizeMode="contain" source={source}>
            <react_native_reanimated_1.default.Text style={[
            // @ts-ignore
            themeName === 'desert' && {
                transform: [
                    {
                        rotateZ: add(InnerRotateZ, new Value(-currentIndex * segment + 0.5 * Math.PI)),
                    },
                ],
            },
            {
                width: '100%',
                alignItems: 'center',
                textAlign: 'center',
                color: isFutureDate
                    ? 'white'
                    : dataEntry.onPeriod && !checkForVerifiedDay(cardValues)
                        ? '#e3629b'
                        : 'white',
                fontSize: 11,
                fontFamily: 'Roboto-Black',
            },
            themeName !== 'desert' && {
                right: -2,
            },
            cloudAdjust,
        ]}>
              {`${dataEntry.date.format('DD')}\n${(0, i18n_1.translate)(dataEntry.date.format('MMM'))}`}
            </react_native_reanimated_1.default.Text>
          </react_native_1.ImageBackground>
        </react_native_gesture_handler_1.TouchableOpacity>
      </react_native_reanimated_1.default.View>
    </react_native_1.View>);
}
//# sourceMappingURL=CircularElement.jsx.map