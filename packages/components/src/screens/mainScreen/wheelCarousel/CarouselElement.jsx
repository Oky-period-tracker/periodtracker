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
exports.CarouselElement = CarouselElement;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_reanimated_1 = __importDefault(require("react-native-reanimated"));
const react_native_redash_1 = require("react-native-redash");
const DayBadge_1 = require("../../../components/common/DayBadge");
const DateBadge_1 = require("../../../components/common/DateBadge");
const index_1 = require("../../../assets/index");
const EmojiSelector_1 = require("../../../components/common/EmojiSelector");
const useSelector_1 = require("../../../hooks/useSelector");
const config_1 = require("../../../config");
const selectors = __importStar(require("../../../redux/selectors"));
const useColor_1 = require("../../../hooks/useColor");
const native_1 = __importDefault(require("styled-components/native"));
const moment_1 = __importDefault(require("moment"));
const i18n_1 = require("../../../i18n");
const lodash_1 = __importDefault(require("lodash"));
const navigationService_1 = require("../../../services/navigationService");
const ThemedModal_1 = require("../../../components/common/ThemedModal");
const ColourButtons_1 = require("../ColourButtons");
const styles_1 = require("../../../config/styles");
const { Value, useCode, cond, Clock, and, set, not, clockRunning, block, stopClock, interpolate, } = react_native_reanimated_1.default;
const cardNames = ['mood', 'body', 'activity', 'flow'];
function CarouselElement({ dataEntry, index, isActive, currentIndex, width, height, showOverlay, }) {
    const clock = new Clock();
    const value = new Value(0);
    const color = (0, useColor_1.useColor)(dataEntry.onPeriod, dataEntry.onFertile);
    const cardAnswersValues = (0, useSelector_1.useSelector)((state) => selectors.cardAnswerSelector(state, (0, moment_1.default)(dataEntry.date)));
    const [isVisible, setIsVisible] = React.useState(false);
    // TODO_ALEX redundant useState
    const [loading, setLoading] = React.useState(false);
    useCode(block([
        cond(and(not(isActive), (0, react_native_redash_1.approximates)(index, currentIndex)), [
            set(value, (0, react_native_redash_1.runSpring)(clock, 0, 1)),
            cond(not(clockRunning(clock)), set(isActive, 0)),
        ]),
        cond(isActive, [stopClock(clock), set(value, 0)]),
    ]), []);
    const scale = interpolate(value, { inputRange: [0, 1], outputRange: [1, 1.2] });
    const translation = interpolate(value, { inputRange: [0, 1], outputRange: [0, -10] });
    const navigateToTutorial = () => {
        setLoading(true);
        requestAnimationFrame(() => {
            (0, navigationService_1.navigateAndReset)('TutorialFirstStack', null);
        });
    };
    const verifiedPeriodDaysData = (0, useSelector_1.useSelector)((state) => selectors.verifyPeriodDaySelectorWithDate(state, (0, moment_1.default)(dataEntry.date)));
    return (<react_native_1.View style={[
            {
                height: '100%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-end',
            },
            styles_1.globalStyles.shadow,
        ]}>
      <AnimatedContainer 
    // @ts-ignore
    style={{
            height,
            width,
            transform: [{ scale, translateY: translation }],
        }}>
        {showOverlay ? <Shadow /> : null}
        <Row>
          <DayBadge_1.DayBadge fontSizes={{ small: 14, big: 20 }} style={{ width: 90, height: 35 }} dataEntry={dataEntry} cardValues={verifiedPeriodDaysData}/>
          <DateBadge_1.DateBadge textStyle={{ fontSize: 9 }} style={{ width: 55, height: 55 }} dataEntry={dataEntry} showModal={() => setIsVisible(true)} cardValues={verifiedPeriodDaysData}/>
          {dataEntry.onPeriod ? (<react_native_1.Image resizeMode="contain" source={starImageFill(Object.keys(cardAnswersValues).length)} style={{ height: 25, width: 40 }}/>) : (<Empty />)}
        </Row>
        <Row>
          {cardNames.map((item, ind) => {
            const isArray = Array.isArray(cardAnswersValues[item]);
            const isEmojiActive = isArray
                ? !lodash_1.default.isEmpty(cardAnswersValues[item])
                : !!config_1.emojis[cardAnswersValues[item]];
            const emoji = isArray
                ? isEmojiActive
                    ? config_1.emojis[cardAnswersValues[item][0]]
                    : '💁🏻'
                : config_1.emojis[cardAnswersValues[item]] || '💁🏻';
            return (<EmojiSelector_1.EmojiSelector color={color} key={ind} isActive={isEmojiActive} style={{
                    height: 38,
                    width: 38,
                    borderRadius: 19,
                }} emojiStyle={{ fontSize: 18 }} title={(0, i18n_1.translate)(item)} emoji={emoji} textStyle={{ fontSize: 10 }}/>);
        })}
        </Row>
      </AnimatedContainer>
      <ThemedModal_1.ThemedModal {...{ isVisible, setIsVisible }}>
        <ColourButtons_1.ColourButtons navigateToTutorial={navigateToTutorial} inputDay={dataEntry.date} isCalendar={false} hide={() => setIsVisible(false)} onPress={() => setIsVisible(false)} selectedDayInfo={dataEntry} cardValues={cardAnswersValues}/>
      </ThemedModal_1.ThemedModal>
    </react_native_1.View>);
}
function starImageFill(numberOfElements) {
    if (numberOfElements === null)
        return index_1.assets.static.icons.starOrange.empty;
    if (numberOfElements < 2)
        return index_1.assets.static.icons.starOrange.empty;
    if (numberOfElements >= 2 && numberOfElements < 4)
        return index_1.assets.static.icons.starOrange.half;
    if (numberOfElements >= 4)
        return index_1.assets.static.icons.starOrange.full;
}
const AnimatedContainer = (0, native_1.default)(react_native_reanimated_1.default.View) `
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  elevation: 5;
`;
const Shadow = (0, native_1.default)(react_native_reanimated_1.default.View) `
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 999;
`;
const Empty = native_1.default.View `
  height: 25px;
  width: 40px;
`;
const Row = native_1.default.View `
  height: 50%;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
//# sourceMappingURL=CarouselElement.jsx.map