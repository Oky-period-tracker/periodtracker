"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingCard = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../../components/common/Text");
const i18n_1 = require("../../i18n");
const assets_1 = require("../../assets");
const useScreenDimensions_1 = require("../../hooks/useScreenDimensions");
const OnboardingCard = ({ image, heading, content }) => {
    const aspectRatio = 0.93;
    const { screenWidth, screenHeight } = (0, useScreenDimensions_1.useScreenDimensions)();
    let width = screenWidth * 0.95;
    let height = width / aspectRatio;
    if (height > screenHeight) {
        height = screenHeight * 0.8;
        width = height * aspectRatio;
    }
    return (<Container>
      <Card style={{ width, height }}>
        <WelcomeContainer>
          <LaunchContainer>
            <LaunchLogo resizeMode="contain" source={assets_1.assets.static.launch_icon}/>
          </LaunchContainer>
          <WelcomeText>welcome_heading</WelcomeText>
        </WelcomeContainer>
        <ContentContainer>
          <ImageBox source={image} resizeMode="contain"/>
          <HeadingText>{(0, i18n_1.capitalizeFLetter)((0, i18n_1.translate)(heading))}</HeadingText>
          <ContentText>{content}</ContentText>
        </ContentContainer>
      </Card>
    </Container>);
};
exports.OnboardingCard = OnboardingCard;
const Container = native_1.default.View `
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;
const HeadingText = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  margin-vertical: 30px;
  font-size: 22;
  font-family: Roboto-Black;
  text-align: center;
`;
const ContentText = (0, native_1.default)(Text_1.Text) `
  font-size: 16;
  text-align: center;
  color: #000000;
`;
const Card = native_1.default.View `
  elevation: 4;
  background-color: #fff;
  padding-horizontal: 20px;
  border-radius: 10px;
  padding-vertical: 25px;
  align-items: center;
  justify-content: center;
`;
const ImageBox = native_1.default.Image `
  height: 100px;
  width: 100px;
`;
const WelcomeContainer = native_1.default.View `
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const ContentContainer = native_1.default.View `
  width: 100%;
  align-items: center;
  margin-top: auto;
  margin-bottom: auto;
`;
const WelcomeText = (0, native_1.default)(Text_1.Text) `
  font-size: 28;
  text-align: left;
  width: 65%;
  font-family: Roboto-Black;
  color: #e3629b;
`;
const LaunchContainer = native_1.default.View `
  width: 30%;
  aspect-ratio: 1;
  background-color: #fff;
  elevation: 5;
  border-radius: 200px;
  margin-right: 5%;
  justify-content: center;
  align-items: center;
`;
const LaunchLogo = native_1.default.Image `
  height: 85%;
  aspect-ratio: 1;
`;
//# sourceMappingURL=OnboardingCard.jsx.map