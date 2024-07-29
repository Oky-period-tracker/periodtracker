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
exports.FinalJourneyCard = FinalJourneyCard;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../../components/common/Text");
const index_1 = require("../../assets/index");
const index_2 = require("../../i18n/index");
const actions = __importStar(require("../../redux/actions/index"));
const react_redux_1 = require("react-redux");
const moment_1 = __importDefault(require("moment"));
const SpinLoader_1 = require("../../components/common/SpinLoader");
const getQuestionAnswer = ({ card, index, questionAnswers }) => {
    if (card.answerType === 'string') {
        return (0, index_2.translate)(questionAnswers.data[index].answer);
    }
    if (card.answerType === 'numeric') {
        const answer = questionAnswers.data[index].answer;
        const unit = answer === 0 ? card.optionsUnit[0] : card.optionsUnit[1];
        return `${answer + 1} ${(0, index_2.translate)(unit)}`;
    }
    const answerDate = (0, moment_1.default)(questionAnswers.data[index].answer, 'DD-MMM-YYYY');
    const day = answerDate.format('DD');
    const month = (0, index_2.translate)(answerDate.format('MMM'));
    const year = answerDate.format('YYYY');
    return `${day} - ${month} ${year}`;
};
function FinalJourneyCard({ cards, questionAnswers, goToQuestion }) {
    const dispatch = (0, react_redux_1.useDispatch)();
    const [loading, setLoading] = react_1.default.useState(false);
    return (<FinalSurveyCard>
      <WhiteContainer>
        {cards.map((card, index) => {
            const questionAnswer = getQuestionAnswer({
                card,
                index,
                questionAnswers,
            });
            return (<ItemContainer key={index}>
              <ItemRow onPress={() => {
                    if (questionAnswers.data[0].answer === 'No' && index !== 0)
                        return;
                    goToQuestion(card.id);
                }}>
                <QuestionIcon source={card.image}/>
                <QuestionArea>
                  <Question>{card.question}</Question>
                  <Answer style={{
                    opacity: questionAnswers.data[0].answer === 'No' ? 0.8 : 1,
                }}>
                    {questionAnswers.data[0].answer === 'No' && index !== 0
                    ? 'N/A'
                    : questionAnswer}
                  </Answer>
                </QuestionArea>
                <EditButton>
                  <EditIcon source={index_1.assets.static.icons.edit}/>
                </EditButton>
              </ItemRow>
            </ItemContainer>);
        })}
      </WhiteContainer>
      <ButtonContainer>
        <TouchableOpacity onPress={() => {
            setLoading(true);
            requestAnimationFrame(() => {
                dispatch(actions.journeyCompletion(questionAnswers));
            });
        }}>
          <Title>confirm</Title>
        </TouchableOpacity>
      </ButtonContainer>
      <SpinLoader_1.SpinLoader isVisible={loading} setIsVisible={setLoading}/>
    </FinalSurveyCard>);
}
const FinalSurveyCard = native_1.default.View `
  flex: 1;
  border-radius: 10px;
  background-color: #fff;
  elevation: 4;
  margin-bottom: 60px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 10px;
  justify-content: space-between;
`;
const WhiteContainer = native_1.default.View `
  flex: 1;
  background-color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  elevation: 4;
`;
const ItemContainer = native_1.default.View `
  padding-horizontal: 36px;
  justify-content: space-around;
`;
const ItemRow = native_1.default.TouchableOpacity `
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #eaeaea;
  align-items: center;
  padding-bottom: 10px;
  padding-top: 22px;
`;
const QuestionIcon = native_1.default.Image `
  width: 44px;
  height: 44px;
`;
const QuestionArea = native_1.default.View `
  flex: 1;
`;
const Question = (0, native_1.default)(Text_1.Text) `
  font-size: 12;
  padding-horizontal: 10px;
  text-align: justify;
  color: #000;
`;
const Answer = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  font-size: 16;
  font-family: Roboto-Black;
  padding-horizontal: 10px;
  color: #000;
`;
const EditButton = native_1.default.View `
  margin-right: -16;
`;
const EditIcon = native_1.default.Image `
  width: 30px;
  height: 30px;
`;
const ButtonContainer = native_1.default.View ``;
const TouchableOpacity = native_1.default.TouchableOpacity `
  elevation: 2;
  padding-vertical: 12px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: #efefef;
`;
const Title = (0, native_1.default)(Text_1.Text) `
  color: #4a4a4a;
  text-align: center;
  font-family: Roboto-Black;
  font-size: 16;
  padding-vertical: 10px;
`;
//# sourceMappingURL=FinalJourneyCard.jsx.map