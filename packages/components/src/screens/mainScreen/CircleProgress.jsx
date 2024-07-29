"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleProgress = void 0;
const react_1 = __importDefault(require("react"));
const Text_1 = require("../../components/common/Text");
const react_native_pie_chart_1 = __importDefault(require("react-native-pie-chart"));
const Icon_1 = require("../../components/common/Icon");
const PredictionProvider_1 = require("../../components/context/PredictionProvider");
const native_1 = __importDefault(require("styled-components/native"));
const index_1 = require("../../assets/index");
const CircleProgress = ({ onPress = null, fillColor, emptyFill, size = 50, style = null, isCalendarTextVisible = false, disabled = false, }) => {
    const { cycleDay, cycleLength } = (0, PredictionProvider_1.useTodayPrediction)();
    const series = [cycleDay, cycleLength - cycleDay];
    const sliceColor = [fillColor, emptyFill];
    return (<TouchableContainer disabled={disabled} onPress={onPress} size={size} style={style}>
      <react_native_pie_chart_1.default widthAndHeight={size} series={series} sliceColor={sliceColor}/>
      <Icon_1.Icon source={index_1.assets.static.icons.roundedMask} style={{ width: size, height: size, position: 'absolute', top: 0 }}/>
      <TextContainer size={size}>
        <NumberText>{cycleLength === 100 ? '-' : cycleLength}</NumberText>
        <DayText>days</DayText>
      </TextContainer>
      {isCalendarTextVisible && (<DayText style={{ fontSize: 10, position: 'absolute', bottom: -20, width: 100 }}>
          calendar
        </DayText>)}
    </TouchableContainer>);
};
exports.CircleProgress = CircleProgress;
const TouchableContainer = native_1.default.TouchableOpacity `
  height: ${(props) => props.size};
  width: ${(props) => props.size};
  border-radius: ${(props) => props.size / 2};
  align-items: center;
`;
const NumberText = native_1.default.Text `
  min-height: 17px;
  font-size: 14;
  text-align: center;
  font-family: Roboto-Black;
`;
const DayText = (0, native_1.default)(Text_1.Text) `
  min-height: 14px;
  font-size: 11;
  text-align: center;
  color: #000;
`;
const TextContainer = native_1.default.View `
  min-height: ${(props) => props.size};
  position: absolute;
  justify-content: center;
  align-items: center;
`;
//# sourceMappingURL=CircleProgress.jsx.map