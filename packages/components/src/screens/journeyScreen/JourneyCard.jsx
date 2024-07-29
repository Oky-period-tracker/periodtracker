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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JourneyCard = JourneyCard;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../../components/common/Text");
const CalendarCardContent_1 = require("./CalendarCardContent");
const WheelPickerContent_1 = require("../../components/WheelPickerContent");
const Avatar_1 = require("../../components/common/Avatar/Avatar");
const useSelector_1 = require("../../hooks/useSelector");
const selectors = __importStar(require("../../redux/selectors"));
const asset_1 = require("../../services/asset");
const tablet_1 = require("../../config/tablet");
function JourneyCard({ question, onRemember, onForget, onChange, optionsRange = null, optionsUnit = [], questionAnswer, setQuestionAnswer, status = 'initial', description, onConfirm, answersData, id, confirmMessage, defaultAnswerMessage, pickerLabel = null, pickerType = 'options', leftButtonTitle = 'i_dont_remember', rightButtonTitle = 'i_remember', }) {
    const selectedAvatar = (0, useSelector_1.useSelector)(selectors.currentAvatarSelector);
    return (<>
      {status === 'initial' && (<Container>
          <WhiteContainer>
            <BubbleAvatarImage resizeMode="contain" source={(0, asset_1.getAsset)(`avatars.${selectedAvatar}.bubbles`)}/>
            <Text_1.Text style={{ fontSize: 14, textAlign: 'left', color: '#000' }}>{description}</Text_1.Text>
            <BigOrangeText>{question}</BigOrangeText>
          </WhiteContainer>
          <ButtonContainer>
            <LeftButton onPress={onForget} title={leftButtonTitle}/>
            <RightButton onPress={onRemember} title={rightButtonTitle}/>
          </ButtonContainer>
        </Container>)}
      {status === 'remember' && (<Container>
          <WhiteContainer>
            {pickerLabel && (<Text_1.Text style={{
                    textAlign: 'center',
                    fontFamily: 'Roboto-Black',
                    color: '#f49200',
                    fontSize: 26,
                }}>
                {pickerLabel}
              </Text_1.Text>)}
            {pickerType === 'options' && (<WheelPickerContent_1.WheelPickerContent {...{
                id,
                answersData,
                optionsRange,
                optionsUnit,
                questionAnswer,
                setQuestionAnswer,
            }}/>)}
            {pickerType === 'calendar' && (<CalendarCardContent_1.CalendarCardContent {...{ answersData, questionAnswer, setQuestionAnswer, id }}/>)}
            {pickerType === 'non_period' && (<>
                <Avatar_1.Avatar style={{ height: 140, width: 130 }} alertTextVisible={false} stationary={true} isProgressVisible={false}/>
                <BigOrangeText>{confirmMessage}</BigOrangeText>
              </>)}
          </WhiteContainer>
          <ButtonContainer>
            <RightButton onPress={onConfirm} title={'confirm'}/>
          </ButtonContainer>
        </Container>)}
      {status === 'not_remember' && (<Container>
          <WhiteContainer>
            <Avatar_1.Avatar style={{ height: 140, width: 130 }} stationary={true} isProgressVisible={false} alertTextVisible={false}/>
            <Text_1.Text style={{
                textAlign: 'justify',
                fontSize: 20,
            }}>
              {defaultAnswerMessage}
            </Text_1.Text>
          </WhiteContainer>
          <ButtonContainer>
            {pickerType !== 'non_period' && <LeftButton onPress={onChange} title={'change'}/>}
            <RightButton onPress={onConfirm} title={'confirm'}/>
          </ButtonContainer>
        </Container>)}
    </>);
}
const RightButton = (_a) => {
    var { onPress, title } = _a, props = __rest(_a, ["onPress", "title"]);
    return (<Button activeOpacity={0.8} onPress={onPress} {...props}>
    <ButtonTitle style={Object.assign({ fontSize: 16 }, props.textStyle)}>{title}</ButtonTitle>
  </Button>);
};
const LeftButton = ({ title, onPress }) => (<RightButton onPress={onPress} title={title} style={{ borderRightWidth: 2, borderRightColor: '#AAA' }}/>);
const Container = native_1.default.View `
  flex: 1;
  background-color: #fff;
  border-radius: 10px;
  elevation: 4;
  margin-bottom: 60px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 10px;
  align-items: center;
`;
const WhiteContainer = native_1.default.View `
  flex: 1;
  width: 100%;
  background-color: #fff;
  padding: ${tablet_1.IS_TABLET ? '56px' : '28px'};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  align-items: center;
  justify-content: space-around;
  elevation: 4;
`;
const ButtonContainer = native_1.default.View `
  background-color: #efefef;
  border-bottom-left-radius: 10;
  border-bottom-right-radius: 10;
  flex-direction: row;
`;
const Button = native_1.default.TouchableOpacity `
  flex: 1;
  height: 70px;
  justify-content: center;
  padding-horizontal: 30px;
`;
const ButtonTitle = (0, native_1.default)(Text_1.Text) `
  text-align: center;
  font-family: Roboto-Black;
  font-size: 16;
  color: black;
`;
const BubbleAvatarImage = native_1.default.Image `
  width: 90%;
  height: 100px;
`;
const BigOrangeText = (0, native_1.default)(Text_1.Text) `
  font-size: 30;
  font-family: Roboto-Black;
  color: #f49200;
`;
//# sourceMappingURL=JourneyCard.jsx.map