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
exports.CycleCard = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../../components/common/Text");
const Icon_1 = require("../../components/common/Icon");
const index_1 = require("../../assets/index");
const selectors = __importStar(require("../../redux/selectors"));
const EmojiSelector_1 = require("../../components/common/EmojiSelector");
const useSelector_1 = require("../../hooks/useSelector");
const config_1 = require("../../config");
const i18n_1 = require("../../i18n");
const cardNames = ['mood', 'body', 'activity', 'flow'];
const CycleCard = ({ item, cycleNumber }) => {
    const cardAnswersValues = (0, useSelector_1.useSelector)((state) => selectors.mostAnsweredSelector(state, item.cycleStartDate, item.cycleEndDate));
    return (<CycleCardContainer>
      <CycleCardHeader>
        <Col style={{ flexDirection: 'row', flex: 0 }}>
          <Icon_1.Icon source={index_1.assets.static.icons.cycle}/>
          <Text_1.Text style={{
            fontSize: 14,
            fontFamily: 'Roboto-Black',
            color: 'white',
            marginLeft: 10,
            marginRight: 5,
        }}>
            cycle
          </Text_1.Text>
          <CycleCardHeadingText>{cycleNumber}</CycleCardHeadingText>
        </Col>
        <Col style={{ flexDirection: 'row', alignItems: 'center', flex: 0 }}>
          <CycleCardHeadingText>{item.cycleLength}</CycleCardHeadingText>
          <Text_1.Text style={{ fontSize: 12, color: 'white', marginLeft: 3 }}>day_cycle</Text_1.Text>
        </Col>
        <DateIntervalText startDate={item.cycleStartDate} endDate={item.cycleEndDate} color="white"/>
      </CycleCardHeader>
      <CycleCardBody style={{ paddingRight: 10 }}>
        <Col style={{ justifyContent: 'space-between', flex: 2 }}>
          <Row style={{ paddingVertical: 5 }}>
            <Icon_1.Icon source={index_1.assets.static.icons.periodLength} style={{ marginRight: 15 }}/>
            <CycleCardBodyText>{item.periodLength}</CycleCardBodyText>
            <CycleCardBodyText style={{ marginLeft: 5 }}>
              {(0, i18n_1.translate)('day_period')}
            </CycleCardBodyText>
          </Row>
          <Row style={{ paddingVertical: 5 }}>
            <Icon_1.Icon source={index_1.assets.static.icons.periodDays} style={{ marginRight: 15 }}/>
            <DateIntervalText startDate={item.cycleStartDate} endDate={item.cycleStartDate.clone().add(item.periodLength, 'days')}/>
          </Row>
        </Col>
        <Col style={{
            height: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
        }}>
          {cardNames.map((cardItem, ind) => (<EmojiSelector_1.EmojiSelector disabled={true} color={config_1.emojis[cardAnswersValues[cardItem]] ? '#e3629b' : '#fff'} key={ind} isActive={!!config_1.emojis[cardAnswersValues[cardItem]]} style={{ height: 35, width: 35, marginRight: 5, borderRadius: 17.5 }} emojiStyle={{ fontSize: 16 }} title={(0, i18n_1.translate)(cardItem)} emoji={config_1.emojis[cardAnswersValues[cardItem]] || '💁🏻‍'} textStyle={{ position: 'absolute', bottom: -10, fontSize: 8 }}/>))}
        </Col>
      </CycleCardBody>
    </CycleCardContainer>);
};
exports.CycleCard = CycleCard;
const DateIntervalText = ({ startDate, endDate, color = 'black' }) => {
    return (<Col style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
      <CycleCardBodyText style={{ color }}>
        {`${startDate.format('DD')} `}
        <RNText>{`${(0, i18n_1.translate)(startDate.format('MMM'))} -  `}</RNText>
      </CycleCardBodyText>
      <CycleCardBodyText style={{ color }}>
        {`${endDate.format('DD')} `}
        <RNText>{`${(0, i18n_1.translate)(endDate.format('MMM'))}`}</RNText>
      </CycleCardBodyText>
    </Col>);
};
const Col = native_1.default.View ``;
const Row = native_1.default.View `
  flex-direction: row;
  flex-wrap: wrap;
`;
const CycleCardContainer = native_1.default.View `
  margin-top: 15px;
  background-color: #fff;
  elevation: 3;
  margin-horizontal: 3px;
  border-radius: 10px;
  min-height: 140px;
`;
const CycleCardHeader = native_1.default.View `
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  width: 100%;
  min-height: 40px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: #e3629b;
  padding-horizontal: 20px;
`;
const CycleCardBody = native_1.default.View `
  flex-direction: row;
  width: 100%;
  padding-left: 20px;
  padding-right: 10px;
  padding-vertical: 15px;
`;
const CycleCardHeadingText = native_1.default.Text `
  font-family: Roboto-Black;
  font-size: 14;
  color: white;
`;
const RNText = native_1.default.Text `
  font-weight: normal;
  font-size: 12;
`;
const CycleCardBodyText = native_1.default.Text `
  font-family: Roboto-Black;
  font-size: 14;
`;
//# sourceMappingURL=CycleCard.jsx.map