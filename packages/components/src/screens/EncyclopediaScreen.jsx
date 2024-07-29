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
exports.EncyclopediaScreen = EncyclopediaScreen;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const react_native_1 = require("react-native");
const PageContainer_1 = require("../components/layout/PageContainer");
const BackgroundTheme_1 = require("../components/layout/BackgroundTheme");
const useSelector_1 = require("../hooks/useSelector");
const selectors = __importStar(require("../redux/selectors"));
const Category_1 = require("./encyclopediaScreen/Category");
const SubCategoryCard_1 = require("./encyclopediaScreen/SubCategoryCard");
const Accordion_1 = __importDefault(require("react-native-collapsible/Accordion"));
const navigationService_1 = require("../services/navigationService");
const SearchBar_1 = require("./encyclopediaScreen/SearchBar");
const lodash_1 = __importDefault(require("lodash"));
const Avatar_1 = require("../components/common/Avatar/Avatar");
const useTextToSpeechHook_1 = require("../hooks/useTextToSpeechHook");
const config_1 = require("../config");
const react_redux_1 = require("react-redux");
const analytics_1 = __importDefault(require("@react-native-firebase/analytics"));
function EncyclopediaScreen({ navigation }) {
    const categories = (0, useSelector_1.useSelector)(selectors.allCategoriesSelector);
    const articles = (0, useSelector_1.useSelector)(selectors.allArticlesSelector);
    const videos = (0, useSelector_1.useSelector)(selectors.allVideosSelector);
    const subCategories = (0, useSelector_1.useSelector)(selectors.allSubCategoriesSelector);
    const subCategoriesObject = (0, useSelector_1.useSelector)(selectors.allSubCategoriesObjectSelector);
    const [activeCategories, setActiveCategory] = react_1.default.useState([]);
    const [isVideoTabActive, setVideoTabActive] = react_1.default.useState(false);
    const [filteredCategories, setFilteredCategories] = react_1.default.useState(categories);
    // TODO_ALEX redundant useState?
    const [shownCategories, setShownCategories] = react_1.default.useState(categories);
    const [searching, setSearching] = react_1.default.useState(false);
    const [position] = react_1.default.useState(new react_native_1.Animated.Value(0));
    const dispatch = (0, react_redux_1.useDispatch)();
    const categoryNames = categories.map((item) => item === null || item === void 0 ? void 0 : item.name);
    // TODO_ALEX redundant useState & useEffect?
    const [textArray, setTextArray] = react_1.default.useState(categoryNames);
    (0, useTextToSpeechHook_1.useTextToSpeechHook)({ navigation, text: (0, config_1.encyclopediaScreenText)(categories) });
    const togglePosition = (isUp) => {
        react_native_1.Animated.timing(position, {
            duration: 1000,
            useNativeDriver: true,
            toValue: isUp ? -100 : 0,
        }).start();
    };
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };
    react_1.default.useEffect(() => {
        if (!lodash_1.default.isEmpty(activeCategories)) {
            const subCatNamesText = categories[activeCategories[0]].subCategories.map((item) => subCategoriesObject[item].name);
            const tempCategoryArray = [categories[activeCategories[0]].name].concat(subCatNamesText); // this adds the category name to the front of the array
            setTextArray(tempCategoryArray);
            return;
        }
        setTextArray(categoryNames);
    }, [activeCategories]);
    return (<BackgroundTheme_1.BackgroundTheme>
      <PageContainer_1.PageContainer>
        <react_native_1.ScrollView onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
                togglePosition(true);
                return;
            }
            togglePosition(false);
        }} scrollEventThrottle={400} showsVerticalScrollIndicator={false}>
          <SearchBar_1.SearchBar {...{
        subCategories,
        categories,
        setActiveCategory,
        setFilteredCategories,
        shownCategories,
        searching,
        setSearching,
        articles,
    }}/>
          {!lodash_1.default.isEmpty(videos) && (<Accordion_1.default sections={[{ videos }]} renderHeader={(video, i, isActive) => (<Category_1.VideoCategory onPress={() => {
                    // TODO_ALEX: analytics?
                    (0, analytics_1.default)().logScreenView({
                        screen_class: 'ActiveCateogrey',
                        screen_name: 'CategoriesTapCount',
                    });
                    setVideoTabActive((current) => !current);
                }} {...{ isActive: isVideoTabActive }}/>)} activeSections={isVideoTabActive ? [0] : []} onChange={() => true} renderContent={(item) => (<Row>
                  {item.videos.map((videoData) => (<SubCategoryCard_1.SubCategoryCard key={`${videoData.title}-videos}`} title={videoData.title} 
                // TODO_ALEX: analytics?
                onPress={() => {
                        (0, analytics_1.default)().logScreenView({
                            screen_class: 'ActiveSubCateogrey',
                            screen_name: 'SubCategoriesTapCount',
                        });
                        (0, navigationService_1.navigate)('VideoScreen', { videoData });
                    }}/>))}
                </Row>)}/>)}
          {!lodash_1.default.isEmpty(filteredCategories) && (<Accordion_1.default sections={!lodash_1.default.isEmpty(filteredCategories) ? filteredCategories : shownCategories} renderHeader={(category, i, isActive) => (<Category_1.Category title={category.name} tags={category.tags} onPress={() => {
                    setActiveCategory(isActive ? [] : [i]);
                }} {...{ isActive }}/>)} activeSections={activeCategories} onChange={() => true} renderContent={(category) => (<Row>
                  {category.subCategories.map((subCategoryId) => (<SubCategoryCard_1.SubCategoryCard key={subCategoryId} title={(subCategories.find((item) => (item === null || item === void 0 ? void 0 : item.id) === subCategoryId) || {
                        name: 'no_name',
                    }).name} onPress={() => {
                        (0, navigationService_1.navigate)('Articles', { subCategory: subCategoryId });
                    }}/>))}
                </Row>)}/>)}
          <EmptyFill />
        </react_native_1.ScrollView>
        {!searching && (<AnimatedContainer style={{ transform: [{ translateY: position }] }}>
            <FloatingContainer onPress={() => (0, navigationService_1.navigate)('FindHelp', null)}>
              <Avatar_1.Avatar stationary={true} disable={true} textShown={'find help'} isProgressVisible={false}/>
            </FloatingContainer>
          </AnimatedContainer>)}
      </PageContainer_1.PageContainer>
    </BackgroundTheme_1.BackgroundTheme>);
}
const Row = native_1.default.View `
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 6;
  flex-wrap: wrap;
`;
const EmptyFill = native_1.default.View `
  height: 40px;
`;
const FloatingContainer = native_1.default.TouchableOpacity ``;
const AnimatedContainer = (0, native_1.default)(react_native_1.Animated.View) `
  position: absolute;
  bottom: -10;
  right: 10;
`;
//# sourceMappingURL=EncyclopediaScreen.jsx.map