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
exports.FindHelpScreen = FindHelpScreen;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const native_1 = __importDefault(require("styled-components/native"));
const BackgroundTheme_1 = require("../components/layout/BackgroundTheme");
const Header_1 = require("../components/common/Header");
const Avatar_1 = require("../components/common/Avatar/Avatar");
const Text_1 = require("../components/common/Text");
const SwiperContainer_1 = require("../components/common/SwiperContainer");
const PageContainer_1 = require("../components/layout/PageContainer");
const useSelector_1 = require("../hooks/useSelector");
const selectors = __importStar(require("../redux/selectors"));
const useTextToSpeechHook_1 = require("../hooks/useTextToSpeechHook");
const useScreenDimensions_1 = require("../hooks/useScreenDimensions");
function FindHelpScreen({ navigation }) {
    const { screenHeight, screenWidth } = (0, useScreenDimensions_1.useScreenDimensions)();
    const heightOfCarousel = screenHeight * 0.5;
    const helpCenters = (0, useSelector_1.useSelector)(selectors.allHelpCentersForCurrentLocale);
    const [textToSpeak, setTextToSpeak] = react_1.default.useState([]);
    react_1.default.useEffect(() => {
        const text = helpCenters.reduce((acc, item, index) => {
            let heading = '';
            let caption = '';
            let phoneOne = '';
            let phoneTwo = '';
            let address = '';
            let website = '';
            const pageNumber = `page number ${index + 1}`;
            heading = item.title && item.title;
            caption = item.caption && item.caption;
            phoneOne = item.contactOne && item.contactOne;
            phoneTwo = item.contactTwo && item.contactTwo;
            address = item.address && item.address;
            website = item.website && item.website;
            return acc.concat([
                heading,
                ...(caption !== '' ? [caption] : []),
                ...(phoneOne !== '' ? [phoneOne] : []),
                ...(phoneTwo !== '' ? [phoneTwo] : []),
                ...(address !== '' ? [address] : []),
                ...(website !== '' ? [website] : []),
                pageNumber,
            ]);
        }, []);
        setTextToSpeak(text);
    }, []);
    (0, useTextToSpeechHook_1.useTextToSpeechHook)({ navigation, text: textToSpeak });
    return (<BackgroundTheme_1.BackgroundTheme>
      <PageContainer_1.PageContainer>
        <Header_1.Header screenTitle="find help"/>
        <MiddleSection>
          <AvatarSection>
            <Avatar_1.Avatar avatarStyle={styles.avatarStyle} style={styles.avatar} disable={true} isProgressVisible={false}/>
          </AvatarSection>
        </MiddleSection>
        <CarouselSection style={{ width: screenWidth, height: heightOfCarousel }}>
          <SwiperContainer_1.SwiperContainer pagingEnabled={true} scrollEnabled={true} ref={null}>
            {helpCenters.map((item, index) => {
            return (<CarouselItem key={index}>
                  <CardTitle>{item.title}</CardTitle>
                  {item.caption !== '' && (<CardTitle style={{ fontSize: 16 }}>{item.caption}</CardTitle>)}
                  <CardRow>
                    <Col>
                      <InfoItemTitle>card_phone_number</InfoItemTitle>
                      <InfoItemDescription>{item.contactOne}</InfoItemDescription>
                    </Col>
                    {item.contactTwo !== '' && (<Col>
                        <InfoItemTitle>card_phone_number</InfoItemTitle>
                        <InfoItemDescription>{item.contactTwo}</InfoItemDescription>
                      </Col>)}
                  </CardRow>
                  {item.address !== '' && (<CardRow>
                      <Col>
                        <InfoItemTitle>card_address</InfoItemTitle>
                        <InfoItemDescription>{item.address}</InfoItemDescription>
                      </Col>
                    </CardRow>)}
                  {item.website !== '' && (<CardRow>
                      <Col>
                        <InfoItemTitle>card_website</InfoItemTitle>
                        <InfoItemDescription>{item.website}</InfoItemDescription>
                      </Col>
                    </CardRow>)}
                </CarouselItem>);
        })}
          </SwiperContainer_1.SwiperContainer>
        </CarouselSection>
      </PageContainer_1.PageContainer>
    </BackgroundTheme_1.BackgroundTheme>);
}
const MiddleSection = native_1.default.View `
  width: 100%;
  overflow: hidden;
  height: 30%;
`;
const AvatarSection = native_1.default.View `
  justify-content: flex-start;
  align-items: flex-start;
  width: 50%;
`;
const CarouselSection = native_1.default.View `
  left: -10;
  align-items: center;
  justify-content: center;
`;
const CardTitle = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  font-size: 20;
  font-family: Roboto-Black;
  color: #e3629b;
  margin-bottom: 10px;
`;
const CardRow = native_1.default.View `
  flex-direction: row;
  width: 95%;
  margin-bottom: 5px;
  overflow-hidden;
`;
const Col = native_1.default.View `
  flex: 1;
  flex-direction: column;
`;
const InfoItemTitle = (0, native_1.default)(Text_1.Text) `
  font-size: 16;
  margin-bottom: 2px;
  color: #000;
`;
const InfoItemDescription = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  font-size: 14;
  color: #000;
  align-self: flex-start;
  flex-wrap: wrap;
  font-family: Roboto-Regular;
`;
const CarouselItem = native_1.default.View `
  width: 95%;
  padding-horizontal: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #fff;
  border-radius: 10px;
  margin-horizontal: 10px;
  margin-top: auto;
  margin-bottom: auto;
  elevation: 4;
`;
const styles = react_native_1.StyleSheet.create({
    avatar: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    avatarStyle: {
        width: 110,
        bottom: null,
        top: react_native_1.Platform.OS === 'ios' ? -25 : -30,
    },
});
//# sourceMappingURL=FindHelpScreen.jsx.map