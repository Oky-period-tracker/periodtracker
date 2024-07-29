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
exports.DateBadge = DateBadge;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const ThemeContext_1 = require("../context/ThemeContext");
const i18n_1 = require("../../i18n");
const react_native_1 = require("react-native");
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const react_redux_1 = require("react-redux");
const selectors = __importStar(require("../../redux/selectors"));
const PredictionProvider_1 = require("../../components/context/PredictionProvider");
const asset_1 = require("../../services/asset");
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
            if (isFutureDate) {
                return (0, asset_1.getAsset)(`static.icons.${themeIcon}.nonPeriod`);
            }
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
// TODO_ALEX This needs to allow for different themes from different submodules
function switcher(value) {
    switch (value) {
        case 'mosaic':
            return 'stars';
        case 'desert':
            return 'circles';
        default:
            return 'clouds';
    }
}
function DateBadge({ dataEntry, style, textStyle = null, showModal, cardValues }) {
    const { id: themeName } = (0, ThemeContext_1.useTheme)();
    const currentCycleInfo = (0, PredictionProvider_1.useTodayPrediction)();
    const actualCurrentStartDate = (0, PredictionProvider_1.useActualCurrentStartDateSelector)();
    const hasFuturePredictionActive = (0, react_redux_1.useSelector)(selectors.isFuturePredictionSelector);
    const source = useStatusForSource(dataEntry, themeName, cardValues, hasFuturePredictionActive, currentCycleInfo, actualCurrentStartDate);
    const cloudAdjust = themeName !== 'mosaic' && themeName !== 'desert' ? { left: -3 } : { fontSize: 8, right: -2 };
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
    return (<react_native_1.TouchableOpacity accessibilityLabel={`${dataEntry.date.format('DD')}\n${(0, i18n_1.translate)(dataEntry.date.format('MMM'))}`} onPress={() => {
            showModal();
        }}>
      <Background resizeMode="contain" style={[
            style,
            themeName === 'mosaic' && { height: 52, width: 52 },
            themeName === 'desert' && { height: 40, width: 40 },
        ]} source={source}>
        <DateText style={[
            textStyle,
            cloudAdjust,
            {
                color: isFutureDate
                    ? 'white'
                    : dataEntry.onPeriod && !checkForVerifiedDay(cardValues)
                        ? '#e3629b'
                        : 'white',
            },
        ]}>
          {`${dataEntry.date.format('DD')}\n${(0, i18n_1.translate)(dataEntry.date.format('MMM'))}`}
        </DateText>
      </Background>
    </react_native_1.TouchableOpacity>);
}
const Background = native_1.default.ImageBackground `
  width: 55px;
  justify-content: center;
  align-items: center;
`;
const DateText = native_1.default.Text `
  align-items: center;
  text-align: center;
  width: 100%;
  color: white;
  font-size: 10;
  font-family: Roboto-Black;
`;
//# sourceMappingURL=DateBadge.jsx.map