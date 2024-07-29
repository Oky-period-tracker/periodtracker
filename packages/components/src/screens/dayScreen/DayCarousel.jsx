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
exports.DayCarousel = DayCarousel;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const DayCarouselItem_1 = require("./DayCarouselItem");
const react_redux_1 = require("react-redux");
const actions = __importStar(require("../../redux/actions"));
const NoteCard_1 = require("./NoteCard");
const QuizCard_1 = require("./QuizCard");
const DidYouKnowCard_1 = require("./DidYouKnowCard");
const SurveyCard_1 = require("./SurveyCard");
const useSelector_1 = require("../../hooks/useSelector");
const selectors = __importStar(require("../../redux/selectors"));
const useTextToSpeechHook_1 = require("../../hooks/useTextToSpeechHook");
const i18n_1 = require("../../i18n");
const ThemedModal_1 = require("../../components/common/ThemedModal");
const ColourButtons_1 = require("../mainScreen/ColourButtons");
const SpinLoader_1 = require("../../components/common/SpinLoader");
const navigationService_1 = require("../../services/navigationService");
const useScreenDimensions_1 = require("../../hooks/useScreenDimensions");
// TODO_ALEX: survey
function DayCarousel({ navigation, dataEntry }) {
    const { screenWidth } = (0, useScreenDimensions_1.useScreenDimensions)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const [textToSpeak, setTextToSpeak] = react_1.default.useState([]);
    const [isVisible, setIsVisible] = react_1.default.useState(false);
    const [loading, setLoading] = react_1.default.useState(false);
    const [tempCardName, setTempCardName] = react_1.default.useState(null);
    const [tempCardAnswer, setTempCardAnswer] = react_1.default.useState(null);
    const viewConfigRef = react_1.default.useRef({ viewAreaCoveragePercentThreshold: 50 });
    const userID = (0, useSelector_1.useSelector)(selectors.currentUserSelector).id;
    const allSurveys = (0, useSelector_1.useSelector)(selectors.allSurveys);
    const completedSurveys = (0, useSelector_1.useSelector)(selectors.completedSurveys);
    const newSurveys = (allSurveys === null || allSurveys === void 0 ? void 0 : allSurveys.length) ? allSurveys[0] : null;
    const cards = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (dataEntry.date.day() % 2 === 0 && !dataEntry.onPeriod && { quiz: null })), (dataEntry.date.day() % 2 !== 0 && !dataEntry.onPeriod && { didYouKnow: null })), { mood: {
            happy: '😊',
            blah: '😑',
            sad: '😔',
            stressed: '😤',
            worried: '😟',
            fabulous: '😎',
        }, body: {
            tired: '💤',
            cramps: '💥',
            bloating: '🎈',
            spots: '💢',
            headache: '⚡',
            sore_breasts: '🍒',
        }, activity: {
            exercise: '🏃',
            'healthy food': '🍏',
            'good sleep': '🛏️',
            socialising: '👋',
            "couldn't sleep": '😴',
            'unhealthy food': '🍰',
        }, flow: {
            none: '🌂',
            spotting: '🔹',
            light: '💧',
            medium: '💦',
            heavy: '☔',
        } }), (dataEntry.date.day() % 2 === 0 && dataEntry.onPeriod && { quiz: null })), (dataEntry.date.day() % 2 !== 0 && dataEntry.onPeriod && { didYouKnow: null })), { notes: null });
    const [endSurvey, setEndSurvey] = react_1.default.useState(false);
    const [showEndButton, setShowEndButton] = react_1.default.useState(false);
    const [surveyTempQuestions, setSurveyTempQuestions] = react_1.default.useState(null);
    const [currentSurveyQuestionIndex, setCurrentQuestionIndex] = react_1.default.useState(null);
    const [answeredSurvey, setAnsweredSurveyQuestions] = react_1.default.useState(null);
    const lastQuestion = {
        question: (0, i18n_1.translate)('thank_you_msg'),
        options: null,
        is_multiple: false,
        next_question: null,
        endSurvey: true,
    };
    react_1.default.useEffect(() => {
        const dayCardText = Object.keys(cards).reduce((acc, item) => {
            let heading = '';
            let caption = '';
            let subheading = '';
            if (item === 'quiz') {
                heading = (0, i18n_1.translate)('quiz');
                caption = (0, i18n_1.translate)('daily_quiz_content');
                return acc.concat([heading, caption]);
            }
            if (item === 'didYouKnow') {
                heading = (0, i18n_1.translate)('didYouKnow');
                caption = (0, i18n_1.translate)('daily_didYouKnow_content');
                return acc.concat([heading, caption]);
            }
            if (item === 'survey') {
                heading = (0, i18n_1.translate)('survey');
                caption = (0, i18n_1.translate)('daily_survey_content');
                return acc.concat([heading, caption]);
            }
            if (item === 'notes') {
                return acc;
            }
            heading = (0, i18n_1.translate)(item);
            caption = (0, i18n_1.translate)(contentText[item]);
            subheading = (0, i18n_1.translate)(headingText[item]);
            const emojis = Object.keys(cards[item]).map((key) => (0, i18n_1.translate)(key));
            return acc.concat([heading, caption, subheading, ...emojis]);
        }, []);
        setTextToSpeak(dayCardText);
        updateSurveyQuestion();
        return () => {
            setSurveyTempQuestions({}); // This worked for me
        };
    }, []);
    const updateSurveyQuestion = () => {
        var _a;
        // No new surveys
        if (!((_a = newSurveys === null || newSurveys === void 0 ? void 0 : newSurveys.questions) === null || _a === void 0 ? void 0 : _a.length)) {
            setEndSurvey(true);
            return;
        }
        // Survey in progress
        if (newSurveys === null || newSurveys === void 0 ? void 0 : newSurveys.inProgress) {
            const { currentQuestionIndex, questions } = newSurveys;
            let currentQuestion = null;
            questions.forEach((element, index) => {
                if (index === currentQuestionIndex) {
                    currentQuestion = element;
                }
            });
            setSurveyTempQuestions(currentQuestion);
            setCurrentQuestionIndex(currentQuestionIndex);
            setAnsweredSurveyQuestions(newSurveys.answeredQuestion);
            return;
        }
        // Start new survey
        setSurveyTempQuestions({
            question: (0, i18n_1.translate)('will_you_answer_survey_questions'),
            options: [{ option1: (0, i18n_1.translate)('Yes') }, { option2: (0, i18n_1.translate)('not_now') }],
            response: 'response',
            is_multiple: true,
            next_question: {
                option1: '2',
            },
            thankYouMsg: (0, i18n_1.translate)('thank_you_msg'),
            sort_number: '1',
            utcDateTime: dataEntry.date,
            surveyId: newSurveys === null || newSurveys === void 0 ? void 0 : newSurveys.id,
        });
    };
    (0, useTextToSpeechHook_1.useTextToSpeechHook)({ navigation, text: textToSpeak });
    const navigateToTutorial = () => {
        setLoading(true);
        requestAnimationFrame(() => {
            (0, navigationService_1.navigateAndReset)('TutorialFirstStack', null);
        });
    };
    const onEndSurvey = () => {
        setEndSurvey(true);
    };
    const onOpenAnswer = (openAnswer) => {
        const currQuestion = surveyTempQuestions;
        const tempAnswer = answeredSurvey ? answeredSurvey : [];
        // prettier-ignore
        tempAnswer.push({
            "questionId": (currQuestion === null || currQuestion === void 0 ? void 0 : currQuestion.id) || '',
            "question": currQuestion === null || currQuestion === void 0 ? void 0 : currQuestion.question,
            "answerID": '',
            "answer": openAnswer,
            "response": currQuestion === null || currQuestion === void 0 ? void 0 : currQuestion.response,
            "isMultiple": currQuestion === null || currQuestion === void 0 ? void 0 : currQuestion.is_multiple
        });
        setAnsweredSurveyQuestions(tempAnswer);
        getNextQuestion(currQuestion, true, 0, tempAnswer);
    };
    const onSelectSurvey = (isProcced, selectedOption, selectedOptionIndex) => {
        if (isProcced) {
            const currQuestion = surveyTempQuestions;
            if (isProcced && currentSurveyQuestionIndex === null) {
                setCurrentQuestionIndex(0);
                // prettier-ignore
                setSurveyTempQuestions(newSurveys === null || newSurveys === void 0 ? void 0 : newSurveys.questions[0]);
            }
            else {
                getNextQuestion(currQuestion, isProcced, selectedOptionIndex, null);
            }
        }
    };
    const onEndPress = () => {
        setEndSurvey(true);
    };
    const getNextQuestion = (currQuestion, isProcced, selectedOptionIndex, answersArray) => {
        if (currQuestion === null || currQuestion === void 0 ? void 0 : currQuestion.next_question) {
            const nextQuestionKeys = Object.keys(currQuestion.next_question);
            const nextQuestionValues = Object.values(currQuestion.next_question);
            const tempAnswer = answeredSurvey ? answeredSurvey : [];
            if (currQuestion === null || currQuestion === void 0 ? void 0 : currQuestion.is_multiple) {
                const optionnKeys = Object.keys(currQuestion.options[selectedOptionIndex]);
                const optionnValues = Object.values(currQuestion.options[selectedOptionIndex]);
                tempAnswer.push({
                    questionId: (currQuestion === null || currQuestion === void 0 ? void 0 : currQuestion.id) || '',
                    question: currQuestion === null || currQuestion === void 0 ? void 0 : currQuestion.question,
                    answerID: (selectedOptionIndex + 1).toString(),
                    answer: optionnValues[0],
                    response: currQuestion === null || currQuestion === void 0 ? void 0 : currQuestion.response,
                    isMultiple: currQuestion === null || currQuestion === void 0 ? void 0 : currQuestion.is_multiple,
                });
                setAnsweredSurveyQuestions(tempAnswer);
            }
            if (nextQuestionValues.join('').replace(/\s/gi, '').length === 0 ||
                nextQuestionValues[selectedOptionIndex] === '') {
                setSurveyTempQuestions(lastQuestion);
                setShowEndButton(true);
                dispatch(actions.answerSurvey({
                    id: newSurveys === null || newSurveys === void 0 ? void 0 : newSurveys.id,
                    isCompleted: true,
                    isSurveyAnswered: true,
                    questions: answeredSurvey,
                    user_id: userID,
                    utcDateTime: dataEntry.date,
                }));
                if (allSurveys === null || allSurveys === void 0 ? void 0 : allSurveys.length) {
                    const tempData = allSurveys;
                    const tempCompletedSurveys = completedSurveys ? completedSurveys : [];
                    dispatch(actions.updateCompletedSurveys([tempData[0], ...tempCompletedSurveys]));
                    tempData.shift();
                    dispatch(actions.updateAllSurveyContent(tempData));
                }
            }
            else {
                let nextQuestionIndex;
                // prettier-ignore
                nextQuestionKeys === null || nextQuestionKeys === void 0 ? void 0 : nextQuestionKeys.forEach((item, index) => {
                    return index === selectedOptionIndex ? nextQuestionIndex = nextQuestionValues[selectedOptionIndex] : null;
                });
                // prettier-ignore
                const currentQuestion = newSurveys === null || newSurveys === void 0 ? void 0 : newSurveys.questions[nextQuestionIndex - 1];
                setCurrentQuestionIndex(nextQuestionIndex);
                setSurveyTempQuestions(currentQuestion);
                const currentSurvey = allSurveys[0];
                currentSurvey.inProgress = true;
                currentSurvey.currentQuestionIndex = nextQuestionIndex - 1;
                currentSurvey.answeredQuestion = (currQuestion === null || currQuestion === void 0 ? void 0 : currQuestion.is_multiple) ? tempAnswer : answersArray;
                const tempData = [...allSurveys];
                tempData[0] = currentSurvey;
                dispatch(actions.updateAllSurveyContent(tempData));
            }
        }
    };
    return (<react_native_1.KeyboardAvoidingView behavior="position">
      {!endSurvey ? (<react_native_1.FlatList horizontal={true} decelerationRate={0} snapToInterval={0.9 * screenWidth + 15} snapToAlignment={'center'} pagingEnabled={true} data={[surveyTempQuestions]} extraData={[surveyTempQuestions]} keyExtractor={(_ignore, index) => index.toString()} viewabilityConfig={viewConfigRef.current} renderItem={({ item, index }) => {
                return (<SurveyCard_1.SurveyCard dataEntry={item} index={index} selectAnswer={(item === null || item === void 0 ? void 0 : item.is_multiple) ? onSelectSurvey : onOpenAnswer} startSurveyQuestion={currentSurveyQuestionIndex === null ? false : true} endSurvey={onEndSurvey} showEndButton={showEndButton} onEndPress={onEndPress}/>);
            }} style={{ width: screenWidth }} showsHorizontalScrollIndicator={false} removeClippedSubviews={false}/>) : (<react_native_1.FlatList horizontal={true} decelerationRate={0} snapToInterval={0.9 * screenWidth + 15} snapToAlignment={'center'} pagingEnabled={true} data={Object.keys(cards)} keyExtractor={(_ignore, index) => index.toString()} viewabilityConfig={viewConfigRef.current} renderItem={({ item, index }) => {
                if (item === 'notes') {
                    return <NoteCard_1.NoteCard dataEntry={dataEntry}/>;
                }
                if (item === 'quiz') {
                    return <QuizCard_1.QuizCard index={index} dataEntry={dataEntry}/>;
                }
                if (item === 'didYouKnow') {
                    return <DidYouKnowCard_1.DidYouKnowCard index={index}/>;
                }
                return (<DayCarouselItem_1.DayCarouselItem index={index} content={cards[item]} cardName={item} dataEntry={dataEntry} onPress={(cardName, answer) => {
                        if (
                        // To change period based on flow input
                        ((answer === 'light' || answer === 'medium' || answer === 'heavy') &&
                            !dataEntry.onPeriod) ||
                            ((answer === 'none' || answer === 'spotting') && dataEntry.onPeriod)) {
                            setTempCardName(cardName);
                            setTempCardAnswer(answer);
                            setIsVisible(true);
                            dispatch(actions.answerDailyCard({
                                cardName: tempCardName,
                                answer: tempCardAnswer,
                                userID,
                                utcDateTime: dataEntry.date,
                                mutuallyExclusive: cardName === 'flow',
                                periodDay: dataEntry.onPeriod,
                            }));
                            return;
                        }
                        dispatch(actions.answerDailyCard({
                            cardName,
                            answer,
                            userID,
                            utcDateTime: dataEntry.date,
                            mutuallyExclusive: cardName === 'flow',
                            periodDay: dataEntry.onPeriod,
                        }));
                    }}/>);
            }} style={{ width: screenWidth }} showsHorizontalScrollIndicator={false}/>)}

      <ThemedModal_1.ThemedModal {...{ isVisible, setIsVisible }}>
        <ColourButtons_1.ColourButtons isDayCard navigateToTutorial={navigateToTutorial} inputDay={dataEntry.date} hide={() => {
            setIsVisible(false);
            dispatch(actions.answerDailyCard({
                cardName: tempCardName,
                answer: tempCardAnswer,
                userID,
                utcDateTime: dataEntry.date,
                mutuallyExclusive: tempCardName === 'flow',
                periodDay: dataEntry.onPeriod,
            }));
        }} isCalendar={false} onPress={() => {
            setIsVisible(false);
        }} selectedDayInfo={dataEntry} cardValues={null}/>
      </ThemedModal_1.ThemedModal>
      <SpinLoader_1.SpinLoader isVisible={loading} setIsVisible={setLoading} text="please_wait_tutorial"/>
    </react_native_1.KeyboardAvoidingView>);
}
const contentText = {
    mood: 'daily_mood_content',
    body: 'daily_body_content',
    activity: 'daily_activity_content',
    flow: 'daily_flow_content',
    // survey: 'daily_survey_content',
    // notes: 'daily_notes_content',
};
const headingText = {
    mood: 'daily_mood_heading',
    body: 'daily_body_heading',
    activity: 'daily_activity_heading',
    flow: 'daily_flow_heading',
    survey: 'daily_survey_heading',
    notes: 'daily_notes_heading',
};
//# sourceMappingURL=DayCarousel.jsx.map