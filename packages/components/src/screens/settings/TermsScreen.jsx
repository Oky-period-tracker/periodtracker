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
exports.TermsScreen = TermsScreen;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const BackgroundTheme_1 = require("../../components/layout/BackgroundTheme");
const Header_1 = require("../../components/common/Header");
const Text_1 = require("../../components/common/Text");
const react_native_1 = require("react-native");
const useSelector_1 = require("../../hooks/useSelector");
const selectors = __importStar(require("../../redux/selectors"));
const lodash_1 = require("lodash");
const useTextToSpeechHook_1 = require("../../hooks/useTextToSpeechHook");
const useScreenDimensions_1 = require("../../hooks/useScreenDimensions");
function TermsScreen({ navigation }) {
    const { screenWidth: width } = (0, useScreenDimensions_1.useScreenDimensions)();
    const [page, setPage] = react_1.default.useState(0);
    const termsAndConditions = (0, useSelector_1.useSelector)(selectors.termsAndConditionsContent);
    const speechText = termsAndConditions.map((item) => item.content);
    const content = termsAndConditions.map((item, i) => {
        const isLast = i === termsAndConditions.length - 1;
        if (item.type === 'HEADING') {
            return <HeadingText>{item.content}</HeadingText>;
        }
        if (item.type === 'CONTENT') {
            return <ContentText style={isLast && styles.last}>{item.content}</ContentText>;
        }
    });
    const itemsPerPage = 4;
    const chunks = (0, lodash_1.chunk)(content, itemsPerPage);
    const numPages = chunks.length;
    (0, useTextToSpeechHook_1.useTextToSpeechHook)({ navigation, text: speechText });
    return (<BackgroundTheme_1.BackgroundTheme>
      <Header_1.Header screenTitle="terms"/>
      <react_native_1.ScrollView showsHorizontalScrollIndicator={false} horizontal onMomentumScrollEnd={(event) => {
            setPage(Math.round(event.nativeEvent.contentOffset.x / width));
        }} style={styles.flex} scrollEnabled={true} pagingEnabled={true}>
        {chunks.map((contentGroup, index) => {
            return (<Container key={index} page={page}>
              {contentGroup}
            </Container>);
        })}
      </react_native_1.ScrollView>
      <DotsRow>
        {new Array(numPages).fill(0).map((item, index) => {
            return <Circle key={index} isHighlighted={index === page}/>;
        })}
      </DotsRow>
    </BackgroundTheme_1.BackgroundTheme>);
}
const Container = ({ children, page }) => {
    const { screenWidth: width } = (0, useScreenDimensions_1.useScreenDimensions)();
    const scrollRef = react_1.default.useRef(null);
    react_1.default.useEffect(() => {
        if (scrollRef === null)
            return;
        scrollRef.current.scrollTo({ y: 0 }); // resets the page
    }, [page]);
    return (<ScrollContainer style={{ width }} contentContainerStyle={{ width }} ref={scrollRef} showsVerticalScrollIndicator={false}>
      <ViewContainer>{children}</ViewContainer>
    </ScrollContainer>);
};
const ScrollContainer = native_1.default.ScrollView `
  height: 100%;
`;
const Circle = native_1.default.View `
  height: 15px;
  width: 15px;
  margin-horizontal: 2.5px;
  margin-bottom: 2.5px;
  border-radius: 10px;
  elevation: ${(props) => (props.isHighlighted ? 5 : 2)};
  background-color: ${(props) => (props.isHighlighted ? '#f9c7c1' : `#efefef`)};
`;
const ViewContainer = native_1.default.View `
  border-radius: 10px;
  padding: 40px;
  background-color: #fff;
  elevation: 2;
  margin-bottom: 28px;
  margin-horizontal: 12px;
`;
const ContentText = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  font-size: 14;
  color: #4d4d4d;
  margin-bottom: 10px;
  width: 100%;
  text-align: left;
`;
const HeadingText = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  font-size: 16;
  font-family: Roboto-Black;
  text-align: left;
  color: #4d4d4d;
  width: 100%;
  margin-bottom: 10px;
`;
const DotsRow = native_1.default.View `
  position: absolute;
  width: 90%;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  bottom: 20px;
  align-self: center;
  flex-direction: row;
`;
const styles = react_native_1.StyleSheet.create({
    flex: {
        flex: 1,
    },
    last: {
        paddingBottom: 30,
    },
});
//# sourceMappingURL=TermsScreen.jsx.map