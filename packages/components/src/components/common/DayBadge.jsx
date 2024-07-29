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
exports.DayBadge = void 0;
const react_1 = __importDefault(require("react"));
const index_1 = require("../../assets/index");
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("./Text");
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const react_redux_1 = require("react-redux");
const selectors = __importStar(require("../../redux/selectors"));
const PredictionProvider_1 = require("../../components/context/PredictionProvider");
function checkForVerifiedDay(cardValues) {
    if (lodash_1.default.has(cardValues, 'periodDay')) {
        return cardValues.periodDay;
    }
    return false;
}
function useStatusForSource(data, cardValues, hasFuturePredictionActive, currentCycleInfo, actualCurrentStartDate) {
    const isVerified = checkForVerifiedDay(cardValues);
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
                return index_1.assets.static.dayBadge.default;
            }
        }
    }
    if (data.onPeriod && isVerified)
        return index_1.assets.static.dayBadge.onPeriod;
    if (data.onPeriod && !isVerified)
        return index_1.assets.static.dayBadge.notVerifiedDay;
    if (data.onFertile)
        return index_1.assets.static.dayBadge.onFertile;
    return index_1.assets.static.dayBadge.default;
}
const DayBadge = ({ dataEntry, style, fontSizes, cardValues }) => {
    const currentCycleInfo = (0, PredictionProvider_1.useTodayPrediction)();
    const hasFuturePredictionActive = (0, react_redux_1.useSelector)(selectors.isFuturePredictionSelector);
    const actualCurrentStartDate = (0, PredictionProvider_1.useActualCurrentStartDateSelector)();
    const source = useStatusForSource(dataEntry, cardValues, hasFuturePredictionActive, currentCycleInfo, actualCurrentStartDate);
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
    return (<Background accessibilityLabel={`day ${dataEntry.cycleDay === 0 ? '-' : dataEntry.cycleDay}`} resizeMode="contain" style={style} source={source}>
      <DayText style={{
            color: isFutureDate
                ? 'white'
                : dataEntry.onPeriod && !checkForVerifiedDay(cardValues)
                    ? '#e3629b'
                    : 'white',
            fontSize: fontSizes.small,
            textTransform: 'capitalize',
        }}>
        day
      </DayText>
      <NumberText style={{
            fontSize: fontSizes.big,
            color: isFutureDate
                ? 'white'
                : dataEntry.onPeriod && !checkForVerifiedDay(cardValues)
                    ? '#e3629b'
                    : 'white',
        }}>
        {dataEntry.cycleDay === 0 ? '-' : dataEntry.cycleDay}
      </NumberText>
    </Background>);
};
exports.DayBadge = DayBadge;
const Background = native_1.default.ImageBackground `
  width: 90px;
  height: 40px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 18px;
`;
const NumberText = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  color: white;
  font-size: 28;
  font-family: Roboto-Black;
`;
const DayText = (0, native_1.default)(Text_1.Text) `
  color: white;
  font-size: 28;
  font-family: Roboto-Black;
`;
//# sourceMappingURL=DayBadge.jsx.map