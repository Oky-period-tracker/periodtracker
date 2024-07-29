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
exports.QuizCard = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../../components/common/Text");
const EmojiSelector_1 = require("../../components/common/EmojiSelector");
const TitleText_1 = require("../../components/common/TitleText");
const useSelector_1 = require("../../hooks/useSelector");
const lodash_1 = __importDefault(require("lodash"));
const selectors = __importStar(require("../../redux/selectors"));
const actions = __importStar(require("../../redux/actions"));
const react_redux_1 = require("react-redux");
const useScreenDimensions_1 = require("../../hooks/useScreenDimensions");
function useQuiz() {
    const unansweredQuizzes = (0, useSelector_1.useSelector)(selectors.quizzesWithoutAnswersSelector);
    const allQuizzes = (0, useSelector_1.useSelector)(selectors.allQuizzesSelectors);
    const randomQuiz = react_1.default.useMemo(() => {
        if (lodash_1.default.isEmpty(unansweredQuizzes)) {
            return lodash_1.default.sample(allQuizzes);
        }
        return lodash_1.default.sample(unansweredQuizzes);
    }, []);
    return randomQuiz;
}
exports.QuizCard = react_1.default.memo(({ dataEntry, index }) => {
    const { screenWidth: deviceWidth } = (0, useScreenDimensions_1.useScreenDimensions)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const userID = (0, useSelector_1.useSelector)(selectors.currentUserSelector).id;
    const selectedQuestion = useQuiz();
    const answeredQuestion = (0, useSelector_1.useSelector)((state) => selectors.quizAnswerByDate(state, dataEntry.date));
    const QuizContent = () => {
        return selectedQuestion.answers.map((item, ind) => {
            if (item.text === 'NA')
                return <Empty />;
            return (<EmojiContainer key={ind}>
          <EmojiSelector_1.EmojiSelector color={'pink'} onPress={() => dispatch(actions.answerQuiz({
                    id: selectedQuestion.id,
                    answerID: ind + 1,
                    question: selectedQuestion.question,
                    emoji: item.emoji,
                    answer: item.text,
                    isCorrect: item.isCorrect,
                    response: selectedQuestion.response[item.isCorrect ? 'correct' : 'in_correct'],
                    userID,
                    utcDateTime: dataEntry.date,
                }))} numberOfLines={3} isActive={false} style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    height: 40,
                    width: '100%',
                    marginRight: 10,
                    marginBottom: 5,
                }} title={item.text} maskStyle={{ flexDirection: 'row' }} emojiStyle={{ fontSize: 16 }} textStyle={{
                    width: '85%',
                    fontSize: 15,
                    fontFamily: 'Roboto-Black',
                    color: '#f49200',
                    marginLeft: 5,
                    textAlign: 'left',
                }} emoji={item.emoji}/>
        </EmojiContainer>);
        });
    };
    const AnsweredContent = () => {
        return (<>
        <EmojiContainer style={{ height: 50 }}>
          <EmojiSelector_1.EmojiSelector color={answeredQuestion.isCorrect ? '#e3629b' : '#f49200'} onPress={() => null} isActive={true} style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                height: 40,
                width: '100%',
                marginRight: 10,
                marginBottom: 5,
            }} title={answeredQuestion.answer} maskStyle={{ flexDirection: 'row' }} emojiStyle={{ fontSize: 16 }} textStyle={{
                width: '85%',
                fontSize: 15,
                fontFamily: 'Roboto-Black',
                color: answeredQuestion.isCorrect ? '#e3629b' : '#f49200',
                marginLeft: 5,
                textAlign: 'left',
            }} emoji={answeredQuestion.emoji}/>
        </EmojiContainer>
        <TextContainer>
          <AnswerText colorSelect={answeredQuestion.isCorrect}>
            {answeredQuestion.response}
          </AnswerText>
        </TextContainer>
      </>);
    };
    return (<QuizCardContainer style={{
            width: 0.9 * deviceWidth,
            height: '95%',
            alignSelf: 'center',
            marginLeft: index === 0 ? 15 : 5,
        }}>
      <Row style={{ height: '40%', justifyContent: 'flex-start', flexDirection: 'column' }}>
        <TitleText_1.TitleText size={25} style={{ height: 70 }}>
          quiz
        </TitleText_1.TitleText>
        <ContentText>daily_quiz_content</ContentText>
      </Row>
      <Row style={{ marginBottom: 10 }}>
        <InnerTitleText>
          {answeredQuestion ? answeredQuestion.question : selectedQuestion.question}
        </InnerTitleText>
      </Row>
      <Row style={{ flexDirection: 'column' }}>
        {answeredQuestion && <AnsweredContent />}
        {!answeredQuestion && <QuizContent />}
      </Row>
    </QuizCardContainer>);
});
const QuizCardContainer = native_1.default.View `
  background-color: #fff;
  border-radius: 10;
  elevation: 5;
  margin-horizontal: 10;
  padding-horizontal: 40;
  padding-vertical: 30;
`;
const Empty = native_1.default.View ``;
const Row = native_1.default.View `
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const EmojiContainer = native_1.default.View `
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const AnswerText = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  font-size: 13;
  width: 100%;
  font-family: Roboto-Black;
  text-align: left;
  color: ${(props) => (props.colorSelect ? '#e3629b' : '#f49200')};
`;
const TextContainer = native_1.default.View `
  height: 95;
  margin-top: 5;
  width: 100%;
  overflow: hidden;
`;
const InnerTitleText = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  flex: 1;
  font-size: 18;
  color: #f49200;
  font-family: Roboto-Black;
`;
const ContentText = (0, native_1.default)(Text_1.Text) `
  width: 100%;
  color: #4d4d4d;
  font-size: 12;
  text-align: left;
`;
//# sourceMappingURL=QuizCard.jsx.map