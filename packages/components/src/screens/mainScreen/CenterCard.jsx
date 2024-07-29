"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CenterCard = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const PredictionProvider_1 = require("../../components/context/PredictionProvider");
const useColor_1 = require("../../hooks/useColor");
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../../components/common/Text");
const useScreenDimensions_1 = require("../../hooks/useScreenDimensions");
const CenterCard = ({ style = null }) => {
    const { screenWidth, screenHeight } = (0, useScreenDimensions_1.useScreenDimensions)();
    const todaysInfo = (0, PredictionProvider_1.useTodayPrediction)();
    const color = (0, useColor_1.useColor)(todaysInfo.onPeriod, todaysInfo.onFertile);
    const cardHeight = 72;
    const heightMultiplier = react_native_1.Platform.OS === 'ios' ? 0.5 : 1;
    const modifier = cardHeight * heightMultiplier;
    const wheelSectionHeight = screenHeight * 0.6 * 0.5;
    const top = wheelSectionHeight - modifier;
    const width = screenWidth * 0.3;
    return (<CenterCardContainer style={Object.assign({ width, maxWidth: 180, top }, style)}>
      <Container color={color}>
        <TextNoTranslate style={{ color, fontFamily: 'Roboto-Black' }}>
          {todaysInfo.onPeriod ? todaysInfo.daysLeftOnPeriod : todaysInfo.daysUntilNextPeriod}
        </TextNoTranslate>
        <TextTranslate style={{ color }}>{todaysInfo.onPeriod ? 'left' : 'to_go'}</TextTranslate>
      </Container>
    </CenterCardContainer>);
};
exports.CenterCard = CenterCard;
const CenterCardContainer = native_1.default.View `
  position: absolute;
  right: 12px;
  height: 72px;
  border-radius: 10px;
  flex-direction: row;
  background-color: white;
  elevation: 6;
`;
const Container = native_1.default.View `
  flex: 1;
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 4px;
`;
const TextNoTranslate = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  flex: 1;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: 40;
`;
const TextTranslate = (0, native_1.default)(Text_1.Text) `
  flex: 1;
  text-align: left;
  align-items: flex-start;
  justify-content: center;
  font-size: ${(props) => props.theme.fontSize};
`;
//# sourceMappingURL=CenterCard.jsx.map