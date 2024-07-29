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
exports.AboutScreen = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const BackgroundTheme_1 = require("../../components/layout/BackgroundTheme");
const Text_1 = require("../../components/common/Text");
const Header_1 = require("../../components/common/Header");
const Icon_1 = require("../../components/common/Icon");
const useSelector_1 = require("../../hooks/useSelector");
const selectors = __importStar(require("../../redux/selectors"));
const useTextToSpeechHook_1 = require("../../hooks/useTextToSpeechHook");
const config_1 = require("../../config");
const react_native_1 = require("react-native");
const assets_1 = require("../../assets");
const AboutScreen = ({ navigation }) => {
    const aboutContent = (0, useSelector_1.useSelector)(selectors.aboutContent);
    const aboutBanner = (0, useSelector_1.useSelector)(selectors.aboutBanner);
    const locale = (0, useSelector_1.useSelector)(selectors.currentLocaleSelector);
    const iconSource = aboutBanner ? { uri: aboutBanner } : assets_1.assets.general.aboutBanner[locale];
    (0, useTextToSpeechHook_1.useTextToSpeechHook)({ navigation, text: (0, config_1.aboutScreenText)() });
    return (<BackgroundTheme_1.BackgroundTheme>
      <PageContainer showsVerticalScrollIndicator={false}>
        <Header_1.Header style={styles.header} screenTitle="about"/>
        <Container>
          <ImagesContainer>
            <Icon_1.Icon style={styles.icon} source={iconSource}/>
          </ImagesContainer>
          {aboutContent.map((item, i) => {
            const isLast = i === aboutContent.length - 1;
            if (item.type === 'HEADING') {
                return <HeadingText>{item.content}</HeadingText>;
            }
            if (item.type === 'CONTENT') {
                return <TextStyle style={isLast && styles.lastItem}>{item.content}</TextStyle>;
            }
        })}
        </Container>
      </PageContainer>
    </BackgroundTheme_1.BackgroundTheme>);
};
exports.AboutScreen = AboutScreen;
const Container = native_1.default.View `
  border-radius: 10px;
  elevation: 2;
  flex: 1;
  margin-bottom: 30px;
  margin-horizontal: 10px;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff;
`;
// The reason the text has background colour and not a view was because of a bug on old versions of android and react native UIView
// this bug would cause views greater than a few thousand pixels the view colour would make itself transparent
const HeadingText = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  padding-left: 42px;
  padding-right: 42px;
  font-size: 16;
  padding-bottom: 10px;
  font-family: Roboto-Black;
  text-align: justify;
  color: #4d4d4d;
  background-color: #fff;
`;
const TextStyle = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  padding-left: 42px;
  padding-right: 42px;
  padding-bottom: 10px;
  font-size: 16;
  text-align: justify;
  color: #4d4d4d;
  background-color: #fff;
`;
const ImagesContainer = native_1.default.View `
  align-items: center;
  padding: 28px;
  width: 100%;
  background-color: #fff;
`;
const PageContainer = native_1.default.ScrollView ``;
const styles = react_native_1.StyleSheet.create({
    header: {
        paddingLeft: 10,
        paddingRight: 15,
    },
    icon: {
        resizeMode: 'contain',
        width: '100%',
        height: 200,
    },
    lastItem: {
        paddingBottom: 30,
    },
});
//# sourceMappingURL=AboutScreen.jsx.map