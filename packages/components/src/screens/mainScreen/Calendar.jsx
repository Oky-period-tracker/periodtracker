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
exports.Calendar = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const native_1 = __importDefault(require("styled-components/native"));
const moment_1 = __importDefault(require("moment"));
const BackgroundTheme_1 = require("../../components/layout/BackgroundTheme");
const Text_1 = require("../../components/common/Text");
const PredictionProvider_1 = require("../../components/context/PredictionProvider");
const DisplayTextContext_1 = require("../../components/context/DisplayTextContext");
const ColourButtons_1 = require("./ColourButtons");
const Header_1 = require("../../components/common/Header");
const CalendarList_1 = require("../../components/common/CalendarList");
const usePredictionWarnings_1 = require("../../hooks/usePredictionWarnings");
const ThemedModal_1 = require("../../components/common/ThemedModal");
const navigationService_1 = require("../../services/navigationService");
const SpinLoader_1 = require("../../components/common/SpinLoader");
const assets_1 = require("../../assets");
const i18n_1 = require("../../i18n");
const useTextToSpeechHook_1 = require("../../hooks/useTextToSpeechHook");
const config_1 = require("../../config");
const react_redux_1 = require("react-redux");
const selectors = __importStar(require("../../redux/selectors"));
const useScreenDimensions_1 = require("../../hooks/useScreenDimensions");
const font_1 = require("../../services/font");
const startDate = (0, moment_1.default)().startOf('day').subtract(24, 'months');
const endDate = (0, moment_1.default)().startOf('day').add(12, 'months');
const FONT_SCALE = (0, font_1.getDeviceFontScale)();
const OVAL_ASPECT_RATIO = 90 / 40;
const Calendar = ({ navigation }) => {
    const { screenWidth: width, screenHeight: height } = (0, useScreenDimensions_1.useScreenDimensions)();
    const calendarWidth = 0.95 * width;
    const hasFuturePredictionActive = (0, react_redux_1.useSelector)(selectors.isFuturePredictionSelector);
    const verifiedPeriodsData = (0, react_redux_1.useSelector)((state) => selectors.allCardAnswersSelector(state));
    const highlightedDates = (0, PredictionProvider_1.useCalculateStatusForDateRange)(startDate, endDate, verifiedPeriodsData, hasFuturePredictionActive === null || hasFuturePredictionActive === void 0 ? void 0 : hasFuturePredictionActive.futurePredictionStatus);
    const checkIfWarning = (0, usePredictionWarnings_1.useCheckDayWarning)();
    const [isVisible, setIsVisible] = react_1.default.useState(false);
    const [opacity, setOpacity] = react_1.default.useState(1);
    const [calendarText, setCalendarText] = react_1.default.useState(null);
    const [currentMonth, setMonth] = react_1.default.useState((0, moment_1.default)().format());
    const [inputDay, setInputDay] = react_1.default.useState((0, moment_1.default)().startOf('day'));
    const animateControl = new react_native_1.Animated.Value(0);
    const { text: displayedText } = (0, DisplayTextContext_1.useDisplayText)();
    const [loading, setLoading] = react_1.default.useState(false);
    const currentDayInfo = (0, PredictionProvider_1.usePredictDay)(inputDay);
    const currentCycleInfo = (0, PredictionProvider_1.useTodayPrediction)();
    const { setDisplayTextStatic } = (0, DisplayTextContext_1.useDisplayText)();
    const currentDate = (0, moment_1.default)(currentMonth);
    const currentMonthStartDate = currentDate.startOf('month');
    const monthDaysInfo = [
        currentMonthStartDate.format('DD MMMM'),
        ...Array(365)
            .fill(1)
            .map((i) => currentMonthStartDate.add(i, 'days').format('DD MMMM')),
    ];
    const weekStartDay = currentMonthStartDate.startOf('week');
    const weekDays = [
        weekStartDay.format('dddd'),
        ...Array(6)
            .fill(1)
            .map((i) => weekStartDay.add(i, 'day').format('dddd')),
    ];
    (0, useTextToSpeechHook_1.useTextToSpeechHook)({
        navigation,
        text: (0, config_1.calendarScreenSpeech)({
            opacity,
            isVisible,
            weekDays,
            monthDaysInfo,
            currentDay: (0, moment_1.default)(currentMonth),
        }),
    });
    const navigateToTutorial = () => {
        setLoading(true);
        requestAnimationFrame(() => {
            (0, navigationService_1.navigateAndReset)('TutorialFirstStack', null);
        });
    };
    const manageNavigationToDayCards = () => {
        setIsVisible(false);
        if (inputDay.diff((0, moment_1.default)().startOf('day'), 'days') <= 0) {
            (0, navigationService_1.navigate)('DayScreen', { data: currentDayInfo });
        }
        else {
            setCalendarText((0, i18n_1.translate)(`too_far_ahead`));
        }
    };
    const manageAnimationToColourButtons = () => {
        // @TODO: may cause issues on never started period state (check)
        // if (
        //   inputDay.diff(currentCycleInfo.cycleStart, 'days') < -14 &&
        //   currentCycleInfo.cycleDay !== 0
        // ) {
        //   setIsVisible(false)
        //   setCalendarText(translate(`too_far_behind`))
        //   return
        // }
        AnimateOffScreen();
    };
    react_1.default.useEffect(() => {
        setCalendarText(displayedText);
    }, [displayedText]);
    react_1.default.useEffect(() => {
        const intervalId = setTimeout(() => {
            setCalendarText(null);
        }, 3000);
        return () => {
            clearTimeout(intervalId);
        };
    }, [calendarText]);
    // This was to get around the opacity overlaying from modal dismissing. This will cause a re render on dismiss to ensure the next open has the buttons visible
    react_1.default.useEffect(() => {
        if (isVisible === true) {
            setOpacity(1);
        }
    }, [isVisible]);
    const AnimateOffScreen = () => {
        react_native_1.Animated.timing(animateControl, {
            duration: 500,
            toValue: 1,
            useNativeDriver: true,
        }).start(() => {
            setOpacity(0);
        });
    };
    const positionY = animateControl.interpolate({
        inputRange: [0, 1],
        outputRange: [0, height],
    });
    const positionYLower = animateControl.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -height],
    });
    const positionX = animateControl.interpolate({
        inputRange: [0, 1],
        outputRange: [width, 0],
    });
    const handleMonthChange = (type) => {
        if (type === 'sub')
            setMonth((0, moment_1.default)(currentMonth).subtract(1, 'month').format());
        else
            setMonth((0, moment_1.default)(currentMonth).add(1, 'month').format());
    };
    return (<BackgroundTheme_1.BackgroundTheme>
      <Header_1.Header screenTitle="calendar"/>
      <Container>
        <CalendarContainer width={calendarWidth}>
          <CalendarList_1.CalendarList handleMonthChange={handleMonthChange} currentMonth={currentMonth} highlightedDates={highlightedDates} setInputDay={(day) => {
            setInputDay(day);
            setIsVisible(true);
        }} width={calendarWidth}/>
        </CalendarContainer>
      </Container>
      {calendarText !== null && (<CalendarText>
          <Dialog>
            <Text_1.TextWithoutTranslation>{calendarText}</Text_1.TextWithoutTranslation>
          </Dialog>
          <Triangle />
        </CalendarText>)}
      <ThemedModal_1.ThemedModal {...{ isVisible, setIsVisible }}>
        <react_native_1.Animated.View style={{ opacity, transform: [{ translateY: positionYLower }] }}>
          <LongButton onPress={() => manageNavigationToDayCards()}>
            <Mask resizeMode="contain" source={assets_1.assets.static.icons.undoOval}>
              <InnerText style={{ fontSize: 14, color: '#f49200' }}>to_daily_card</InnerText>
            </Mask>
          </LongButton>
        </react_native_1.Animated.View>
        <react_native_1.Animated.View style={{ opacity, transform: [{ translateY: positionY }] }}>
          <LongButton onPress={() => manageAnimationToColourButtons()}>
            <Mask resizeMode="contain" source={assets_1.assets.static.icons.undoOval}>
              <InnerText style={{ fontSize: 14, color: '#e3629b' }}>change_period</InnerText>
            </Mask>
          </LongButton>
        </react_native_1.Animated.View>

        <react_native_1.Animated.View style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            transform: [{ translateX: positionX }],
        }}>
          <ColourButtons_1.ColourButtons onPress={() => setIsVisible(false)} navigateToTutorial={navigateToTutorial} inputDay={inputDay} hide={() => setIsVisible(false)} isCalendar={true} selectedDayInfo={currentDayInfo} cardValues={null}/>
        </react_native_1.Animated.View>
      </ThemedModal_1.ThemedModal>

      <SpinLoader_1.SpinLoader isVisible={loading} setIsVisible={setLoading} text="please_wait_tutorial"/>
    </BackgroundTheme_1.BackgroundTheme>);
};
exports.Calendar = Calendar;
const Container = native_1.default.View `
  height: 90%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;
const CalendarText = native_1.default.View `
  position: absolute;
  width: 50%;
  elevation: 5;
  z-index: 100;
  left: 25%;
  top: 20;
`;
const CalendarContainer = native_1.default.View `
  height: 400px;
  align-self: center;
  align-items: center;
  justify-content: center;
  background-color: #ffff;
  border-radius: 10px;
  elevation: 5;
  border-width: 0;
  overflow: hidden;
`;
const Dialog = native_1.default.View `
  padding-horizontal: 16px;
  padding-vertical: 10px;
  border-radius: 14px;
  background: #ffffff;
  elevation: 3;
  position: relative;
`;
const Triangle = native_1.default.View `
  flex-direction: row;
  width: 0;
  height: 0;
  background-color: transparent;
  border-style: solid;
  border-top-width: 22px;
  border-right-width: 13px;
  border-bottom-width: 0;
  border-left-width: 0;
  border-top-color: white;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-left-color: transparent;
  position: relative;
  left: 20px;
  z-index: 100;
`;
const LongButton = native_1.default.TouchableOpacity `
  height: ${FONT_SCALE === 'NORMAL' ? 70 : 100}px;
  aspect-ratio: ${OVAL_ASPECT_RATIO};
  margin-top: 20px;
  align-items: center;
  align-self: center;
  justify-content: center;
`;
const Mask = native_1.default.ImageBackground `
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;
const InnerText = (0, native_1.default)(Text_1.Text) `
  color: white;
  font-size: 14;
  position: absolute;
  text-align: center;
  font-family: Roboto-Black;
`;
//# sourceMappingURL=Calendar.jsx.map