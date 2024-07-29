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
exports.DayAssetDemo = DayAssetDemo;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../../components/common/Text");
const index_1 = require("../../assets/index");
const TitleText_1 = require("../../components/common/TitleText");
const Icon_1 = require("../../components/common/Icon");
const EmojiSelector_1 = require("../../components/common/EmojiSelector");
const i18n_1 = require("../../i18n");
const react_native_tts_1 = __importDefault(require("react-native-tts"));
const useSelector_1 = require("../../hooks/useSelector");
const selectors = __importStar(require("../../redux/selectors"));
const useScreenDimensions_1 = require("../../hooks/useScreenDimensions");
function DayAssetDemo({ step }) {
    const { screenWidth, screenHeight } = (0, useScreenDimensions_1.useScreenDimensions)();
    const hasTtsActive = (0, useSelector_1.useSelector)(selectors.isTtsActiveSelector);
    react_1.default.useEffect(() => {
        if (hasTtsActive) {
            if (step === 3) {
                react_native_tts_1.default.speak((0, i18n_1.translate)('activity'));
                react_native_tts_1.default.speak((0, i18n_1.translate)('daily_activity_content'));
                react_native_tts_1.default.speak((0, i18n_1.translate)('daily_activity_heading'));
                Object.keys(activity).map((item) => {
                    react_native_tts_1.default.speak((0, i18n_1.translate)(item));
                });
            }
        }
    }, [step, hasTtsActive]);
    return (<DayCarouselItemContainer style={{
            width: 0.6 * screenWidth,
            height: 0.4 * screenHeight,
        }}>
      <Row style={{
            height: '40%',
            width: '100%',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            overflow: 'hidden',
        }}>
        <TitleText_1.TitleText size={15} style={{ marginBottom: 3 }}>
          activity
        </TitleText_1.TitleText>
        <ContentText>daily_activity_content</ContentText>
      </Row>
      <Row style={{ height: 40, marginBottom: 2 }}>
        <Icon_1.Icon source={index_1.assets.static.icons.starOrange.full} style={{ height: 17, width: 17, marginRight: 5 }}/>
        <TitleText_1.TitleText style={{ flex: 1, height: '100%' }} size={14}>
          daily_activity_heading
        </TitleText_1.TitleText>
      </Row>
      <Row style={{ height: '40%', alignItems: 'center', flexWrap: 'wrap' }}>
        {Object.keys(activity).map((item, ind) => (<EmojiContainer key={ind}>
            <EmojiSelector_1.EmojiSelector color={'#e3629b'} onPress={() => null} isActive={ind === 0} style={{
                height: 22,
                width: 22,
                borderRadius: 11,
            }} title={(0, i18n_1.translate)(item)} emojiStyle={{ fontSize: 12 }} textStyle={{ fontSize: 6, width: '260%' }} emoji={activity[item]}/>
          </EmojiContainer>))}
      </Row>
    </DayCarouselItemContainer>);
}
const activity = {
    exercise: '🏃',
    'healthy food': '🍏',
    'good sleep': '😴',
    socialising: '👋',
    "couldn't sleep": '😴',
    'unhealthy food': '🍰',
};
const DayCarouselItemContainer = native_1.default.View `
  background-color: #fff;
  border-radius: 10px;
  elevation: 6;
  margin-left: 30;
  justify-content: space-between;
  padding-horizontal: 20;
  padding-vertical: 15;
`;
const Row = native_1.default.View `
  flex-direction: row;
  width: 100%;
`;
const EmojiContainer = native_1.default.View `
  height: 50%;
  width: 33%;
  justify-content: center;
  align-items: center;
`;
const ContentText = (0, native_1.default)(Text_1.Text) `
  width: 100%;
  color: #4d4d4d;
  font-size: 9;
  text-align: justify;
`;
//# sourceMappingURL=DayAssetDemo.jsx.map