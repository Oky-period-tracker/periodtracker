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
exports.ArticlesScreen = ArticlesScreen;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const react_native_1 = require("react-native");
const PageContainer_1 = require("../components/layout/PageContainer");
const BackgroundTheme_1 = require("../components/layout/BackgroundTheme");
const useSelector_1 = require("../hooks/useSelector");
const selectors = __importStar(require("../redux/selectors"));
const Header_1 = require("../components/common/Header");
const Text_1 = require("../components/common/Text");
const useTextToSpeechHook_1 = require("../hooks/useTextToSpeechHook");
const ArticleItem = ({ article, index, articles }) => {
    const articleObject = (0, useSelector_1.useSelector)((state) => selectors.articleByIDSelector(state, article));
    if (!articleObject) {
        return null;
    }
    return (<ArticleContainer style={{
            width: '95%',
            minWidth: '95%',
            marginBottom: index === articles.length - 1 ? 20 : 5,
        }}>
      <Row style={{ alignItems: 'center' }}>
        <ArticleTitle>{articleObject.subCategory}</ArticleTitle>
      </Row>
      <Row style={{ alignItems: 'center' }}>
        <ArticleTitle style={{ fontSize: 14 }}>{articleObject.title}</ArticleTitle>
      </Row>
      <ArticleContent>{articleObject.content}</ArticleContent>
    </ArticleContainer>);
};
function ArticlesScreen({ navigation }) {
    const subCategory = navigation.getParam('subCategory');
    const subCategoryObject = (0, useSelector_1.useSelector)((state) => selectors.subCategoryByIDSelector(state, subCategory));
    const allArticlesByIDObject = (0, useSelector_1.useSelector)(selectors.articlesObjectByIDSelector);
    const articles = subCategoryObject.articles;
    const articlesTextArray = articles.reduce((acc, item) => {
        const selectedArticle = allArticlesByIDObject[item];
        if (!selectedArticle) {
            return acc;
        }
        return acc.concat([selectedArticle.subCategory, selectedArticle.title, selectedArticle.content]);
    }, []);
    (0, useTextToSpeechHook_1.useTextToSpeechHook)({ navigation, text: articlesTextArray });
    return (<BackgroundTheme_1.BackgroundTheme>
      <PageContainer_1.PageContainer>
        <Header_1.Header screenTitle="encyclopedia"/>
        <react_native_1.FlatList data={articles} horizontal={false} showsVerticalScrollIndicator={false} renderItem={({ item, index }) => {
            return <ArticleItem index={index} article={item} articles={articles}/>;
        }} style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', width: '100%' }} showsHorizontalScrollIndicator={false} keyExtractor={(_, index) => index.toString()}/>
      </PageContainer_1.PageContainer>
    </BackgroundTheme_1.BackgroundTheme>);
}
const Row = native_1.default.View `
  flex-direction: row;
  margin-bottom: 10;
  flex-wrap: wrap;
`;
const ArticleContainer = native_1.default.View `
  margin-vertical: 5px;
  border-radius: 10px;
  elevation: 3;
  background-color: #fff;
  padding-top: 20;
  padding-bottom: 35;
  padding-horizontal: 40;
`;
const ArticleTitle = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  font-size: 20;
  font-family: Roboto-Black;
  color: #e3629b;
  padding-bottom: 5;
`;
const ArticleContent = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  text-align: left;
  color: #1c1c1c;
`;
//# sourceMappingURL=ArticlesScreen.jsx.map