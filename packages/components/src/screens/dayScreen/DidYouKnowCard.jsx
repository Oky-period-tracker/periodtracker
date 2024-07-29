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
exports.DidYouKnowCard = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../../components/common/Text");
const useSelector_1 = require("../../hooks/useSelector");
const lodash_1 = __importDefault(require("lodash"));
const selectors = __importStar(require("../../redux/selectors"));
const TitleText_1 = require("../../components/common/TitleText");
const useScreenDimensions_1 = require("../../hooks/useScreenDimensions");
function useDidYouKnow() {
    const allDidYouKnows = (0, useSelector_1.useSelector)(selectors.allDidYouKnowsSelectors);
    const randomDidYouKnow = react_1.default.useMemo(() => {
        return lodash_1.default.sample(allDidYouKnows);
    }, []);
    return randomDidYouKnow;
}
exports.DidYouKnowCard = react_1.default.memo(({ index }) => {
    const { screenWidth: deviceWidth } = (0, useScreenDimensions_1.useScreenDimensions)();
    const selectedDidYouKnow = useDidYouKnow();
    if (!selectedDidYouKnow) {
        return null;
    }
    return (<DidYouKnowCardContainer style={{
            width: 0.9 * deviceWidth,
            height: '95%',
            alignSelf: 'center',
            marginLeft: index === 0 ? 15 : 5,
        }}>
      <Row style={{ height: '40%', justifyContent: 'flex-start', flexDirection: 'column' }}>
        <TitleContainer>
          <TitleText_1.TitleText size={25}>didYouKnow</TitleText_1.TitleText>
        </TitleContainer>
        <ContentText>daily_didYouKnow_content</ContentText>
      </Row>
      <Row style={{ marginBottom: 10 }}>
        <InnerTitleText>{selectedDidYouKnow.title}</InnerTitleText>
      </Row>
      <Row style={{ height: '45%', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <TextContainer>
          <AnswerText>{selectedDidYouKnow.content}</AnswerText>
        </TextContainer>
      </Row>
    </DidYouKnowCardContainer>);
});
const DidYouKnowCardContainer = native_1.default.View `
  background-color: #fff;
  border-radius: 10px;
  elevation: 5;
  margin-horizontal: 10px;
  padding-horizontal: 40;
  padding-vertical: 30;
`;
const Row = native_1.default.View `
  width: 100%;
  justify-content: center;
`;
const AnswerText = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  font-size: 15;
  text-align: left;
  font-family: Roboto-Black;
  color: #e3629b;
`;
const TextContainer = native_1.default.View `
  width: 100%;
`;
const TitleContainer = native_1.default.View `
  width: 100%;
  margin-bottom: 10;
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
//# sourceMappingURL=DidYouKnowCard.jsx.map