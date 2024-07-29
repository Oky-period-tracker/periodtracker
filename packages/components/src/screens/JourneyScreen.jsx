"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JourneyScreen = JourneyScreen;
const react_1 = __importDefault(require("react"));
const PageContainer_1 = require("../components/layout/PageContainer");
const BackgroundTheme_1 = require("../components/layout/BackgroundTheme");
const JourneyCard_1 = require("./journeyScreen/JourneyCard");
const Header_1 = require("../components/common/Header");
const FinalJourneyCard_1 = require("./journeyScreen/FinalJourneyCard");
const SwiperContainer_1 = require("../components/common/SwiperContainer");
const native_1 = __importDefault(require("styled-components/native"));
const moment_1 = __importDefault(require("moment"));
const assets_1 = require("../assets");
const cards = [
    {
        id: 1,
        question: 'survey_question_1',
        description: 'survey_description',
        image: assets_1.assets.static.icons.profileL,
        pickerLabel: null,
        initialOption: 'No',
        pickerType: 'non_period',
        defaultAnswerMessage: 'survey_default_answer_1',
        confirmMessage: 'survey_default_answer_1_1',
        leftButtonTitle: 'no',
        rightButtonTitle: 'yes',
        answerType: 'string',
    },
    {
        id: 2,
        question: 'survey_question_2',
        description: 'survey_description',
        image: assets_1.assets.static.icons.calendarL,
        pickerLabel: 'survey_label_2',
        pickerType: 'calendar',
        initialOption: moment_1.default.utc().startOf('day').clone().subtract(14, 'days').format('DD-MMM-YYYY'),
        defaultAnswerMessage: 'survey_default_answer_2',
        confirmMessage: null,
        answerType: 'date',
    },
    {
        id: 3,
        question: 'survey_question_3',
        description: 'survey_description',
        image: assets_1.assets.static.icons.news,
        pickerLabel: 'survey_label_3',
        pickerType: 'options',
        optionsRange: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        optionsUnit: ['day', 'days'],
        initialOption: 4,
        defaultAnswerMessage: 'survey_default_answer_3',
        confirmMessage: null,
        answerType: 'numeric',
    },
    {
        id: 4,
        question: 'survey_question_4',
        description: 'survey_description',
        image: assets_1.assets.static.icons.send,
        pickerLabel: 'survey_label_4',
        pickerType: 'options',
        optionsRange: [1, 2, 3, 4, 5, 6],
        optionsUnit: ['week', 'weeks'],
        initialOption: 2,
        defaultAnswerMessage: 'survey_default_answer_4',
        confirmMessage: null,
        answerType: 'numeric',
    },
];
function JourneyScreen({ navigation }) {
    const newUser = navigation.getParam('newUser');
    let earlyFinishCheck = false;
    const swiper = react_1.default.useRef(null);
    const [questionStatuses, setQuestionStatus] = react_1.default.useState({
        data: cards.map((card) => ({ id: card.id, status: 'initial' })),
    });
    const [questionAnswers, setQuestionAnswer] = react_1.default.useState({
        data: cards.map((card) => ({ id: card.id, answer: card.initialOption })),
    });
    const [currentQuestionIndex, setQuestionIndex] = react_1.default.useState(0);
    const [isSurveyCompleted, setSurveyCompleted] = react_1.default.useState(false);
    const goToTheNext = () => {
        let nextIndexQuestionIndex = currentQuestionIndex + 1;
        if (nextIndexQuestionIndex === 4) {
            setSurveyCompleted(true);
        }
        if (earlyFinishCheck) {
            setSurveyCompleted(true);
        }
        setQuestionStatus({
            data: questionStatuses.data.map((item, index) => index === nextIndexQuestionIndex || index === currentQuestionIndex
                ? Object.assign(Object.assign({}, item), { status: 'initial' }) : item),
        });
        setQuestionIndex(nextIndexQuestionIndex);
        if (isSurveyCompleted)
            nextIndexQuestionIndex = 4;
        earlyFinishCheck
            ? swiper.current.scrollBy(4)
            : swiper.current.scrollBy(nextIndexQuestionIndex - currentQuestionIndex);
        if (earlyFinishCheck) {
            earlyFinishCheck = false;
            setSurveyCompleted(false);
        }
    };
    const goToQuestion = (questionNumber) => {
        setQuestionIndex(questionNumber - 1);
        setQuestionStatus({
            data: questionStatuses.data.map((item, _) => item.id === questionNumber ? Object.assign(Object.assign({}, item), { status: 'initial' }) : item),
        });
        swiper.current.scrollBy(questionNumber - 5);
    };
    const [hasAutoSkipped, setHasAutoSkipped] = react_1.default.useState(false);
    react_1.default.useEffect(() => {
        if (hasAutoSkipped) {
            return;
        }
        if ((newUser === null || newUser === void 0 ? void 0 : newUser.gender) === 'Male') {
            setQuestionStatus({
                data: questionStatuses.data.map((item) => (Object.assign(Object.assign({}, item), { status: 'not_remember' }))),
            });
            setHasAutoSkipped(true);
            earlyFinishCheck = true;
            setSurveyCompleted(true);
            goToTheNext();
        }
    }, []);
    return (<BackgroundTheme_1.BackgroundTheme>
      <PageContainer_1.PageContainer>
        <Header_1.Header showScreenTitle={false} screenTitle="" showGoBackButton={false}/>
        <Container>
          <SwiperContainer_1.SwiperContainer setIndex={(ind) => setQuestionIndex(ind)} scrollEnabled={true} pagingEnabled={true} ref={swiper}>
            {[
            ...cards.map((card, index) => {
                return (<JourneyCard_1.JourneyCard key={card.id} {...card} status={questionStatuses.data[index].status} onRemember={() => {
                        setQuestionStatus({
                            data: questionStatuses.data.map((item) => item.id === card.id ? Object.assign(Object.assign({}, item), { status: 'remember' }) : item),
                        });
                    }} onForget={() => {
                        setQuestionStatus({
                            data: questionStatuses.data.map((item) => item.id === card.id
                                ? Object.assign(Object.assign({}, item), { status: card.pickerType ? 'not_remember' : 'remember' }) : item),
                        });
                    }} onChange={() => {
                        setQuestionStatus({
                            data: questionStatuses.data.map((item) => item.id === card.id ? Object.assign(Object.assign({}, item), { status: 'remember' }) : item),
                        });
                    }} onConfirm={() => {
                        if (card.pickerType === 'non_period') {
                            setQuestionAnswer({
                                data: questionAnswers.data.map((item) => item.id === card.id ? Object.assign(Object.assign({}, item), { answer: 'Yes' }) : item),
                            });
                            if (questionStatuses.data[0].id === card.id &&
                                questionStatuses.data[0].status === 'not_remember') {
                                setQuestionAnswer({
                                    data: questionAnswers.data.map((item) => item.id === card.id ? Object.assign(Object.assign({}, item), { answer: 'No' }) : item),
                                });
                                earlyFinishCheck = true;
                            }
                        }
                        goToTheNext();
                    }} questionAnswer={questionAnswers.data[index].answer} setQuestionAnswer={setQuestionAnswer} answersData={questionAnswers} defaultAnswerMessage={card.defaultAnswerMessage} confirmMessage={card.confirmMessage}/>);
            }),
            <FinalJourneyCard_1.FinalJourneyCard goToQuestion={goToQuestion} questionAnswers={questionAnswers} cards={cards} key={5}/>,
        ]}
          </SwiperContainer_1.SwiperContainer>
        </Container>
      </PageContainer_1.PageContainer>
    </BackgroundTheme_1.BackgroundTheme>);
}
const Container = native_1.default.View `
  flex: 1;
  position: absolute;
  left: 0;
  right: 0;
  top: 35;
  bottom: 5;
`;
//# sourceMappingURL=JourneyScreen.jsx.map