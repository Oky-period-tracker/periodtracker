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
exports.DayCarouselItem = DayCarouselItem;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const TitleText_1 = require("../../components/common/TitleText");
const index_1 = require("../../assets/index");
const Text_1 = require("../../components/common/Text");
const EmojiSelector_1 = require("../../components/common/EmojiSelector");
const Icon_1 = require("../../components/common/Icon");
const selectors = __importStar(require("../../redux/selectors"));
const useSelector_1 = require("../../hooks/useSelector");
const useColor_1 = require("../../hooks/useColor");
const i18n_1 = require("../../i18n");
const useScreenDimensions_1 = require("../../hooks/useScreenDimensions");
const react_redux_1 = require("react-redux");
function DayCarouselItem({ content, cardName, dataEntry, onPress, index }) {
    const { screenWidth: deviceWidth } = (0, useScreenDimensions_1.useScreenDimensions)();
    const selectedEmojis = (0, useSelector_1.useSelector)((state) => selectors.cardAnswerSelector(state, dataEntry.date));
    const currentUser = (0, useSelector_1.useSelector)(selectors.currentUserSelector);
    const dailyCardLastUsed = (0, useSelector_1.useSelector)(selectors.dailyCardLastUsed);
    const dispatch = (0, react_redux_1.useDispatch)();
    const color = (0, useColor_1.useColor)(dataEntry.onPeriod, dataEntry.onFertile);
    const source = selectedEmojis[cardName]
        ? index_1.assets.static.icons.starOrange.full
        : index_1.assets.static.icons.starOrange.empty;
    return (<DayCarouselItemContainer style={{
            width: 0.9 * deviceWidth,
            height: '95%',
            alignSelf: 'center',
            marginLeft: index === 0 ? 15 : 5,
        }}>
      <Row style={{
            height: '42%',
            width: '100%',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            overflow: 'hidden',
        }}>
        <TitleText_1.TitleText style={{ marginBottom: 8 }} size={25}>
          {cardName}
        </TitleText_1.TitleText>
        <ContentText>{contentText[cardName]}</ContentText>
      </Row>
      <Row style={{ minHeight: 50, width: '100%', marginBottom: 5 }}>
        {dataEntry.onPeriod && (<Icon_1.Icon source={source} style={{ height: 30, width: 30, marginRight: 10 }}/>)}
        <TitleText_1.TitleText style={{ flex: 1, textTransform: null, flexWrap: 'wrap' }} size={18}>
          {headingText[cardName]}
        </TitleText_1.TitleText>
      </Row>
      <Row style={{ height: '40%', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        {Object.keys(content).map((item, ind) => (<EmojiContainer key={ind}>
            <EmojiSelector_1.EmojiSelector color={color} onPress={() => {
                onPress(cardName, item);
                const now = new Date().getTime();
                const oneDay = 24 * 60 * 60 * 1000;
                const timeSinceLastUse = now - dailyCardLastUsed;
                if (dailyCardLastUsed && timeSinceLastUse < oneDay) {
                    return;
                }
            }} isActive={Array.isArray(selectedEmojis[cardName])
                ? selectedEmojis[cardName].includes(item)
                : selectedEmojis[cardName] === item} style={{
                height: 45,
                width: 45,
                borderRadius: 22.5,
            }} title={(0, i18n_1.translate)(item)} emojiStyle={{ fontSize: 20 }} textStyle={{ fontSize: 10, width: '220%' }} emoji={content[item]}/>
          </EmojiContainer>))}
      </Row>
    </DayCarouselItemContainer>);
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
const DayCarouselItemContainer = native_1.default.View `
  background-color: #fff;
  border-radius: 10px;
  justify-content: space-between;
  elevation: 6;
  margin-horizontal: 10px;
  padding-horizontal: 30;
  padding-vertical: 30;
`;
const Row = native_1.default.View `
  width: 100%;
  flex-direction: row;
`;
const EmojiContainer = native_1.default.View `
  height: 50%;
  width: 33%;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;
const ContentText = (0, native_1.default)(Text_1.Text) `
  width: 100%;
  color: #4d4d4d;
  font-size: 12;
  text-align: justify;
`;
//# sourceMappingURL=DayCarouselItem.jsx.map