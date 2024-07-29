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
exports.SurveyCard = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../../components/common/Text");
const EmojiSelector_1 = require("../../components/common/EmojiSelector");
const TitleText_1 = require("../../components/common/TitleText");
const useSelector_1 = require("../../hooks/useSelector");
const selectors = __importStar(require("../../redux/selectors"));
const actions = __importStar(require("../../redux/actions"));
const react_redux_1 = require("react-redux");
const TextInput_1 = require("../../components/common/TextInput");
const SurveyInformationButton_1 = require("../../components/common/SurveyInformationButton");
const useScreenDimensions_1 = require("../../hooks/useScreenDimensions");
const PrimaryButton_1 = require("../../components/common/buttons/PrimaryButton");
const react_native_1 = require("react-native");
// TODO_ALEX: survey
const fetchOptionKey = (data, dataIndex) => {
    // TODO_ALEX: survey temp key not used ?
    const tempKey = `${data.option}${dataIndex + 1}`;
    const value = Object.values(data);
    return value;
};
exports.SurveyCard = react_1.default.memo(({ dataEntry, index, selectAnswer, startSurveyQuestion, endSurvey, showEndButton, onEndPress, }) => {
    const { screenWidth: width } = (0, useScreenDimensions_1.useScreenDimensions)();
    const [title, setTitle] = react_1.default.useState('');
    const [titlePlaceholder, setTitlePlaceholder] = react_1.default.useState('type_answer_placeholder');
    const [isSkip, setSkip] = react_1.default.useState(null);
    const userID = (0, useSelector_1.useSelector)(selectors.currentUserSelector).id;
    const dispatch = (0, react_redux_1.useDispatch)();
    const [showThankYouMsg, setThankYouMsg] = react_1.default.useState(null);
    const [selectedIndex, setSelectedIndex] = react_1.default.useState(null);
    const completedSurveys = (0, useSelector_1.useSelector)(selectors.completedSurveys);
    const allSurveys = (0, useSelector_1.useSelector)(selectors.allSurveys);
    const checkUserPermission = (option, optionIndex) => {
        setSelectedIndex(optionIndex);
        if (!startSurveyQuestion) {
            if (optionIndex === 0) {
                setTimeout(() => {
                    selectAnswer(true, option, optionIndex);
                    setSelectedIndex(null);
                }, 500);
            }
            else {
                setThankYouMsg(true);
                setTimeout(() => {
                    endSurvey();
                }, 5000);
                // TODO_ALEX: Does this do anything?
                dispatch(actions.answerSurvey({
                    id: dataEntry.surveyId,
                    isCompleted: true,
                    isSurveyAnswered: false,
                    questions: [],
                    user_id: userID,
                    utcDateTime: dataEntry.utcDateTime,
                }));
                const tempData = allSurveys;
                const tempCompletedSurveys = completedSurveys ? completedSurveys : [];
                dispatch(actions.updateCompletedSurveys([tempData[0], ...tempCompletedSurveys]));
                tempData.shift();
                dispatch(actions.updateAllSurveyContent(tempData));
                dispatch(actions.fetchSurveyContentRequest(userID));
            }
        }
        else {
            setTimeout(() => {
                selectAnswer(true, option, optionIndex);
                setSelectedIndex(null);
            }, 500);
        }
    };
    const onSelectAnswer = (flag, item, ind) => {
        setSelectedIndex(ind);
        setTimeout(() => {
            selectAnswer(true, item, ind);
            setSelectedIndex(null);
        }, 500);
    };
    react_1.default.useEffect(() => {
        if (!(dataEntry === null || dataEntry === void 0 ? void 0 : dataEntry.question)) {
            return;
        }
        react_native_1.AccessibilityInfo.announceForAccessibility(dataEntry === null || dataEntry === void 0 ? void 0 : dataEntry.question);
    }, [dataEntry]);
    const SurveyContent = () => {
        if ((dataEntry === null || dataEntry === void 0 ? void 0 : dataEntry.thankYouMsg) && selectedIndex === 1) {
            return (<EmojiContainer>
            <EmojiSelector_1.EmojiSelector color={'#f49200'} isActive={true} style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    height: 40,
                    width: '100%',
                    marginRight: 10,
                    marginBottom: 8,
                }} maskStyle={{ flexDirection: 'row' }} emojiStyle={{ fontSize: 16 }} title={fetchOptionKey(dataEntry === null || dataEntry === void 0 ? void 0 : dataEntry.options[1], 0)} textStyle={{
                    width: '85%',
                    fontSize: 15,
                    fontFamily: 'Roboto-Black',
                    color: '#f49200',
                    marginLeft: 10,
                    textAlign: 'left',
                }} emoji={''}/>
          </EmojiContainer>);
        }
        return dataEntry === null || dataEntry === void 0 ? void 0 : dataEntry.options.map((item, ind) => {
            if (item[`option${ind + 1}`].replace(/ /g, '').toLowerCase() === 'na')
                return <Empty />;
            return (<EmojiContainer key={ind}>
            <EmojiSelector_1.EmojiSelector color={ind === selectedIndex ? '#f49200' : '#f49200'} onPress={() => {
                    !startSurveyQuestion
                        ? checkUserPermission(item, ind)
                        : onSelectAnswer(true, item, ind);
                }} isActive={ind === selectedIndex ? true : false} style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    height: 40,
                    width: '100%',
                    marginRight: 10,
                    marginBottom: 8,
                }} title={fetchOptionKey(item, ind)} maskStyle={{ flexDirection: 'row' }} emojiStyle={{ fontSize: 16 }} textStyle={{
                    width: '85%',
                    fontSize: 15,
                    fontFamily: 'Roboto-Black',
                    color: '#f49200',
                    marginLeft: 10,
                    textAlign: 'left',
                }} emoji={''}/>
          </EmojiContainer>);
        });
    };
    return (<SurveyCardContainer style={{
            width: 0.9 * width,
            height: '95%',
            alignSelf: 'center',
            marginLeft: index === 0 ? 15 : 5,
            justifyContent: 'space-between',
            marginTop: 10,
        }}>
        <Row style={{
            height: '20%',
            justifyContent: 'flex-start',
            flexDirection: 'column',
        }}>
          <Row style={{ justifyContent: 'flex-start' }}>
            <TitleText_1.TitleText size={26} style={{ width: 150, height: 50 }}>
              survey
            </TitleText_1.TitleText>
            <SurveyInformationButton_1.SurveyInformationButton iconStyle={{ height: 25, width: 25 }} style={{
            marginLeft: 10,
            paddingVertical: 0,
        }}/>
          </Row>

          <ContentText>anonymous_answer</ContentText>
          {(dataEntry === null || dataEntry === void 0 ? void 0 : dataEntry.is_multiple) ? <ContentText>choose_one</ContentText> : null}
        </Row>
        <Row style={{
            flexDirection: 'column',
            height: '85%',
            justifyContent: 'center',
        }}>
          <Row style={{ marginBottom: 10 }}>
            <InnerTitleText>{dataEntry === null || dataEntry === void 0 ? void 0 : dataEntry.question}</InnerTitleText>
          </Row>
          {!(dataEntry === null || dataEntry === void 0 ? void 0 : dataEntry.is_multiple) && !(dataEntry === null || dataEntry === void 0 ? void 0 : dataEntry.endSurvey) && (<UpperContent>
              <RowTextInput style={{ flex: 1, width: '100%' }}>
                <TextInput_1.TextInput onFocus={() => setTitlePlaceholder('empty')} onBlur={() => setTitlePlaceholder('title')} onChange={(text) => {
                setTitle(text);
                setSkip(false);
            }} label={titlePlaceholder} value={title} inputStyle={{
                paddingTop: 20,
                textAlignVertical: 'top',
                textAlign: 'left',
                height: '100%',
                fontStyle: 'italic',
            }} style={{
                height: '95%',
                marginTop: 0,
            }} multiline={true} placeholderColor="#ADAEAD"/>
              </RowTextInput>
            </UpperContent>)}
          {(dataEntry === null || dataEntry === void 0 ? void 0 : dataEntry.is_multiple) && !(dataEntry === null || dataEntry === void 0 ? void 0 : dataEntry.endSurvey) && (<Row style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
              {(dataEntry === null || dataEntry === void 0 ? void 0 : dataEntry.options) && <SurveyContent />}
            </Row>)}

          {!(dataEntry === null || dataEntry === void 0 ? void 0 : dataEntry.is_multiple) && !(dataEntry === null || dataEntry === void 0 ? void 0 : dataEntry.endSurvey) && (<LowerContent>
              <LowerContentButton onPress={() => {
                selectAnswer(title, isSkip);
                setTitle('');
            }}>
                <HeaderText>skip</HeaderText>
              </LowerContentButton>

              <LowerContentButton onPress={() => {
                selectAnswer(title, isSkip);
                setTitle('');
            }}>
                <HeaderText>submit</HeaderText>
              </LowerContentButton>
            </LowerContent>)}
          {showEndButton ? (<PrimaryButton_1.PrimaryButton style={{ marginTop: 12 }} onPress={() => onEndPress()}>
              continue
            </PrimaryButton_1.PrimaryButton>) : null}

          {/* TODO_ALEX This is never actually displayed ?? is actually shown via DayCarousel lastQuestion */}
          {showThankYouMsg && (<Row>
              <ThankYouContainer>thank_you_msg</ThankYouContainer>
            </Row>)}
        </Row>
      </SurveyCardContainer>);
});
const RowTextInput = native_1.default.View `
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`;
const UpperContent = native_1.default.View `
  flex: 1;
  width: 100%;
  flex-direction: column;
  background-color: #fff;
  justify-content: center;
  align-items: center;
`;
const Empty = native_1.default.View ``;
const SurveyCardContainer = native_1.default.View `
  background-color: #fff;
  border-radius: 10px;
  elevation: 5;
  margin-horizontal: 10px;
  padding-horizontal: 40px;
  padding-vertical: 20px;
`;
const LowerContent = native_1.default.View `
  height: 40px;
  width: 100%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  margin-bottom: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const LowerContentButton = native_1.default.TouchableOpacity `
  height: 40px;
  padding-horizontal: 20px;
  margin-vertical: 10px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const HeaderText = (0, native_1.default)(Text_1.Text) `
  text-align: center;
  align-self: center;
  font-size: 16;
  color: #f49200;
  font-family: Roboto-Black;
`;
const Row = native_1.default.View `
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const EmojiContainer = native_1.default.View `
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;
const ThankYouContainer = (0, native_1.default)(Text_1.Text) `
  width: 85%;
  font-size: 19;
  color: #f49200;
  margin-left: 5px;
  text-align: left;
  margin-top: 50px;
  font-family: Roboto-Black;
`;
const InnerTitleText = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  flex: 1;
  font-size: 20;
  margin-bottom: 15px;
  color: #f49200;
  font-family: Roboto-Black;
`;
const ContentText = (0, native_1.default)(Text_1.Text) `
  width: 100%;
  color: #4d4d4d;
  font-size: 14;
  text-align: justify;
`;
//# sourceMappingURL=SurveyCard.jsx.map