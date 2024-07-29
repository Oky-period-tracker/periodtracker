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
exports.ColourButtons = ColourButtons;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const ThemeContext_1 = require("../../components/context/ThemeContext");
const Text_1 = require("../../components/common/Text");
const PredictionProvider_1 = require("../../components/context/PredictionProvider");
const react_native_1 = require("react-native");
const assets_1 = require("../../assets");
const DisplayTextContext_1 = require("../../components/context/DisplayTextContext");
const InformationButton_1 = require("../../components/common/InformationButton");
const predictionLogic_1 = require("./predictionLogic/predictionLogic");
const i18n_1 = require("../../i18n");
const react_redux_1 = require("react-redux");
const actions = __importStar(require("../../redux/actions/index"));
const selectors = __importStar(require("../../redux/selectors"));
const analytics_1 = __importDefault(require("@react-native-firebase/analytics"));
const moment_1 = __importDefault(require("moment"));
const network_1 = require("../../services/network");
const useSelector_1 = require("../../hooks/useSelector");
const Flower_1 = require("../../optional/Flower");
const minBufferBetweenCycles = 2;
function useStatusForSource(themeName) {
    switch (themeName) {
        case 'mosaic':
            return assets_1.assets.static.icons.stars;
        case 'desert':
            return assets_1.assets.static.icons.circles;
        default:
            return assets_1.assets.static.icons.clouds;
    }
}
function ColourButtons({ inputDay, isDayCard = false, hide, isCalendar = false, navigateToTutorial = () => null, onPress = () => null, cardValues, selectedDayInfo, }) {
    const { id: themeName } = (0, ThemeContext_1.useTheme)();
    const source = useStatusForSource(themeName);
    const { setDisplayTextStatic } = (0, DisplayTextContext_1.useDisplayText)();
    const dispatch = (0, PredictionProvider_1.usePredictionDispatch)();
    const undoFunc = (0, PredictionProvider_1.useUndoPredictionEngine)();
    const history = (0, PredictionProvider_1.useHistoryPrediction)();
    const selectedDayInfoEngine = (0, PredictionProvider_1.usePredictDay)(inputDay);
    const isActive = (0, PredictionProvider_1.useIsActiveSelector)();
    const appDispatch = (0, react_redux_1.useDispatch)();
    const userID = (0, useSelector_1.useSelector)(selectors.currentUserSelector).id;
    const currentUser = (0, useSelector_1.useSelector)(selectors.currentUserSelector);
    const currentCycleInfo = (0, PredictionProvider_1.useTodayPrediction)();
    const inputDayStr = (0, moment_1.default)(inputDay).format('YYYY-MM-DD');
    const todayStr = (0, moment_1.default)().format('YYYY-MM-DD');
    const [isFlowerVisible, setFlowerVisible] = react_1.default.useState(false);
    const flowerState = (0, Flower_1.useFlowerStateSelector)();
    const cardAnswersToday = (0, useSelector_1.useSelector)((state) => selectors.verifyPeriodDaySelectorWithDate(state, (0, moment_1.default)(inputDayStr)));
    const predictionFullState = (0, PredictionProvider_1.usePredictionEngineState)();
    const [addNewCycleHistory, setNewCycleHistory] = react_1.default.useState(false);
    const hasFuturePredictionActive = (0, useSelector_1.useSelector)(selectors.isFuturePredictionSelector);
    const futurePredictionStatus = hasFuturePredictionActive === null || hasFuturePredictionActive === void 0 ? void 0 : hasFuturePredictionActive.futurePredictionStatus;
    react_1.default.useEffect(() => {
        if ((0, moment_1.default)(inputDay).diff((0, moment_1.default)(currentCycleInfo.cycleStart), 'days') < 0) {
            setNewCycleHistory(true);
        }
    }, [addNewCycleHistory]);
    const minimizeToTutorial = () => {
        hide();
        setTimeout(() => {
            navigateToTutorial();
        }, react_native_1.Platform.OS === 'ios' ? 500 : 300);
    };
    if (inputDay === null) {
        return <react_native_1.View />;
    }
    const errorCallBack = (err) => {
        if (err) {
            setDisplayTextStatic(err);
        }
    };
    const getPredictedCycles = (flag) => {
        if (flag) {
            if ((0, network_1.fetchNetworkConnectionStatus)()) {
                const tempHistory = [...history];
                const tempPeriodsCycles = [];
                const tempPeriodsLength = [];
                tempPeriodsCycles.push(predictionFullState.currentCycle.cycleLength);
                tempPeriodsLength.push(predictionFullState.currentCycle.periodLength);
                tempHistory.forEach((item) => {
                    tempPeriodsCycles.push(item.cycleLength);
                    tempPeriodsLength.push(item.periodLength);
                });
                tempPeriodsCycles.reverse();
                tempPeriodsLength.reverse();
                for (let i = 0; i < 10; i++) {
                    if (tempPeriodsCycles.length < 10) {
                        tempPeriodsCycles.unshift(0);
                        tempPeriodsLength.unshift(0);
                    }
                }
                appDispatch(actions.smartPredictionRequest({
                    cycle_lengths: tempPeriodsCycles,
                    period_lengths: tempPeriodsLength,
                    age: (0, moment_1.default)().diff((0, moment_1.default)(currentUser.dateOfBirth), 'years'),
                    predictionFullState,
                    futurePredictionStatus,
                }));
            }
        }
        appDispatch(actions.updateFuturePrediction(futurePredictionStatus, predictionFullState.currentCycle));
    };
    const actionPink = (0, predictionLogic_1.decisionProcessPeriod)({
        inputDay,
        selectedDayInfo: selectedDayInfoEngine,
        currentCycleInfo,
        history,
        isActive,
        // errorCallBack,
        // getPredictedCycles,
    });
    const actionBlue = (0, predictionLogic_1.decisionProcessNonPeriod)({
        inputDay,
        selectedDayInfo: selectedDayInfoEngine,
        currentCycleInfo,
        history,
        isActive,
    });
    const incFlowerProgress = () => {
        if (!flowerState) {
            return;
        }
        const { progress, maxProgress } = flowerState;
        const alreadyAnswered = (cardAnswersToday === null || cardAnswersToday === void 0 ? void 0 : cardAnswersToday.periodDay) === true;
        if (progress < maxProgress && !alreadyAnswered) {
            appDispatch((0, Flower_1.incrementFlowerProgress)());
            setFlowerVisible(true);
        }
        else {
            hide();
        }
    };
    const checkForDay = () => {
        // For Current day
        if ((0, moment_1.default)(inputDayStr).isSame((0, moment_1.default)(todayStr))) {
            if (!selectedDayInfo.onPeriod &&
                inputDay.diff((0, moment_1.default)().startOf('day'), 'days') === 0 &&
                inputDay.diff(selectedDayInfo.cycleStart, 'days') >=
                    selectedDayInfo.periodLength + minBufferBetweenCycles) {
                if ((0, moment_1.default)(todayStr).diff((0, moment_1.default)(currentCycleInfo.cycleStart), 'days') < 11) {
                    dispatch({
                        type: actionPink.type,
                        inputDay: actionPink.day,
                        errorCallBack,
                    });
                }
                else {
                    dispatch({
                        type: 'start-next-cycle',
                        inputDay,
                        errorCallBack,
                        getPredictedCycles,
                    });
                }
            }
            else {
                if (actionPink) {
                    dispatch({
                        type: actionPink.type,
                        inputDay: actionPink.day,
                        errorCallBack,
                        getPredictedCycles,
                    });
                }
            }
        }
        else {
            dispatch({
                type: actionPink.type,
                inputDay: actionPink.day,
                errorCallBack,
                getPredictedCycles,
            });
        }
        appDispatch(actions.answerVerifyDates({
            userID,
            utcDateTime: inputDay,
            periodDay: true,
        }));
    };
    function onYesPress() {
        if ((0, network_1.fetchNetworkConnectionStatus)()) {
            (0, analytics_1.default)().logEvent('periodDayCloudTap', { user: currentUser });
        }
        if ((0, moment_1.default)(inputDay).isAfter((0, moment_1.default)())) {
            setDisplayTextStatic('too_far_ahead');
            hide();
            return;
        }
        if (addNewCycleHistory) {
            if (selectedDayInfo.onPeriod) {
                appDispatch(actions.answerVerifyDates({
                    userID,
                    utcDateTime: inputDay,
                    periodDay: true,
                }));
                incFlowerProgress();
            }
            else {
                dispatch({
                    type: 'add-new-cycle-history',
                    inputDay,
                    errorCallBack,
                    getPredictedCycles,
                });
                appDispatch(actions.answerVerifyDates({
                    userID,
                    utcDateTime: inputDay,
                    periodDay: true,
                }));
                incFlowerProgress();
            }
        }
        else {
            if (selectedDayInfo.onPeriod) {
                appDispatch(actions.answerVerifyDates({
                    userID,
                    utcDateTime: inputDay,
                    periodDay: true,
                }));
                incFlowerProgress();
            }
            else {
                checkForDay();
            }
        }
        hide();
    }
    function onNoPress() {
        if ((0, network_1.fetchNetworkConnectionStatus)()) {
            (0, analytics_1.default)().logEvent('noPeriodDayCloudTap', { user: currentUser });
        }
        if ((0, moment_1.default)(inputDay).isAfter((0, moment_1.default)())) {
            setDisplayTextStatic('too_far_ahead');
            hide();
            return;
        }
        if (selectedDayInfoEngine.onPeriod) {
            if (actionBlue) {
                dispatch({
                    type: actionBlue.type,
                    inputDay: actionBlue.day,
                    errorCallBack,
                    getPredictedCycles,
                });
                appDispatch(actions.answerVerifyDates({
                    userID,
                    utcDateTime: inputDay,
                    periodDay: false,
                }));
            }
        }
        hide();
    }
    return (<Container activeOpacity={1} onPress={onPress}>
      <InformationButton_1.InformationButton style={{
            position: 'absolute',
            alignItems: 'center',
            top: 10,
            left: 10,
            flexDirection: 'row',
            zIndex: 99,
            elevation: 99,
        }} label="tutorial_launch_label" onPress={() => minimizeToTutorial()}/>
      <InstructionText>share_period_details_heading</InstructionText>
      <HeadingText>{'user_input_instructions'}</HeadingText>
      <react_native_1.View style={{
            width: '80%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
        <react_native_1.TouchableOpacity>
          <react_native_1.ImageBackground style={{
            width: 110,
            height: 110,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 50,
            paddingRight: isCalendar ? 0 : 0,
        }} resizeMode="contain" source={isCalendar ? assets_1.assets.static.icons.periodFuture : source.notVerifiedDay}>
            <CycleCardBodyText>
              {`${inputDay.format('DD')}`}
              {!isCalendar && <RNText>{`\n${(0, i18n_1.translate)(inputDay.format('MMM'))}`}</RNText>}
            </CycleCardBodyText>
          </react_native_1.ImageBackground>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
      <Row style={{
            marginBottom: 20,
            width: '60%',
        }}>
        <react_native_1.TouchableOpacity onPress={onYesPress}>
          <react_native_1.ImageBackground style={{
            width: 80,
            height: 80,
            alignItems: 'center',
            justifyContent: 'center',
        }} resizeMode="contain" source={source.period}>
            <Text_1.Text style={{
            width: '100%',
            alignItems: 'center',
            textAlign: 'center',
            color: 'white',
            fontSize: 12,
            fontFamily: 'Roboto-Black',
        }}>
              Yes
            </Text_1.Text>
          </react_native_1.ImageBackground>
        </react_native_1.TouchableOpacity>
        <react_native_1.TouchableOpacity onPress={onNoPress}>
          <react_native_1.ImageBackground style={{
            width: 80,
            height: 80,
            alignItems: 'center',
            justifyContent: 'center',
        }} resizeMode="contain" source={source.nonPeriod}>
            <Text_1.Text style={{
            width: '100%',
            alignItems: 'center',
            textAlign: 'center',
            color: 'white',
            fontSize: 12,
            fontFamily: 'Roboto-Black',
        }}>
              No
            </Text_1.Text>
          </react_native_1.ImageBackground>
        </react_native_1.TouchableOpacity>
      </Row>

      <Flower_1.FlowerModal isModalVisible={isFlowerVisible} onDismiss={() => {
            setFlowerVisible(false);
            hide();
        }}/>
    </Container>);
}
const Container = native_1.default.TouchableOpacity `
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;
const Row = native_1.default.View `
  width: 60%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const InstructionText = (0, native_1.default)(Text_1.Text) `
  color: white;
  font-size: 13;
  width: 75%;
  margin-top: 80px;
  margin-bottom: 20px;
  text-align: center;
`;
const HeadingText = (0, native_1.default)(Text_1.Text) `
  color: white;
  font-size: 19;
  width: 75%;
  margin-bottom: 50px;
  text-align: center;
  font-family: Roboto-Black;
`;
const RNText = native_1.default.Text `
  font-family: Roboto-Black;
  font-size: 16;
  text-align: center;
  color: #e3629b;
`;
const CycleCardBodyText = native_1.default.Text `
  font-family: Roboto-Black;
  text-align: center;
  color: #e3629b;
  font-size: 16;
`;
//# sourceMappingURL=ColourButtons.jsx.map