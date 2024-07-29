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
exports.SearchBar = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const Header_1 = require("../../components/common/Header");
const RoundedInput_1 = require("../../components/common/RoundedInput");
const IconButton_1 = require("../../components/common/buttons/IconButton");
const native_1 = __importDefault(require("styled-components/native"));
const searchFunctions_1 = require("./searchFunctions");
const EmojiSelector_1 = require("../../components/common/EmojiSelector");
const useSelector_1 = require("../../hooks/useSelector");
const selectors = __importStar(require("../../redux/selectors"));
const i18n_1 = require("../../i18n");
const SearchBar = ({ setFilteredCategories, setActiveCategory, categories, subCategories, shownCategories, searching, setSearching, articles, }) => {
    const [searchStr, setSearchStr] = react_1.default.useState('');
    const [emojiFilter, updateEmojiFilter] = react_1.default.useState([]);
    const locale = (0, useSelector_1.useSelector)(selectors.currentLocaleSelector);
    const emojiList = (0, useSelector_1.useSelector)(selectors.allCategoryEmojis);
    return (<>
      <Header_1.Header screenTitle="encyclopedia" showGoBackButton={true} onPressBackButton={searching &&
            (() => {
                setFilteredCategories(categories);
                updateEmojiFilter([]);
                setSearching(false);
                setSearchStr('');
            })}/>
      <Row style={{ alignItems: 'center', marginBottom: 10 }}>
        <RoundedInput_1.RoundedInput inputProps={{
            blurOnSubmit: false,
            value: searchStr,
            placeholder: (0, i18n_1.translate)('type_to_search'),
            keyboardType: 'default',
            returnKeyType: 'search',
            onChangeText: (text) => {
                setSearchStr(text);
                setActiveCategory([]);
                const filteredResults = (0, searchFunctions_1.handleSearchResult)(text, categories, subCategories, articles, locale);
                setFilteredCategories(filteredResults);
            },
            onFocus: () => {
                if (!searching) {
                    setFilteredCategories([]);
                    setSearching(true);
                }
            },
            onSubmitEditing: () => {
                react_native_1.Keyboard.dismiss();
            },
        }}/>
        {searching && searchStr.length > 0 && (<AbsoluteContainer>
            <IconButton_1.IconButton onPress={() => {
                setFilteredCategories(categories);
                updateEmojiFilter([]);
                setSearching(false);
                setSearchStr('');
            }} name="close" accessibilityLabel={(0, i18n_1.translate)('clear_search')}/>
          </AbsoluteContainer>)}
      </Row>
      {searching && (<react_native_1.ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ height: 70, marginVertical: 5 }}>
          <ScrollRow>
            {emojiList.map((object, index) => {
                return (<EmojiSelector_1.EmojiSelector key={index} style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        marginHorizontal: 8,
                        marginBottom: 0,
                    }} emoji={object.emoji} title={object.tag} emojiStyle={{ fontSize: 20 }} textStyle={{ fontSize: 8 }} color="#e3629b" isActive={emojiFilter.indexOf(object.emoji) !== -1} onPress={() => {
                        setFilteredCategories((0, searchFunctions_1.handleCategoriesFilter)(shownCategories, emojiFilter.indexOf(object.emoji) === -1
                            ? [...emojiFilter, object.emoji]
                            : emojiFilter.filter((item) => item !== object.emoji), searchStr, subCategories, articles, locale));
                        updateEmojiFilter(emojiFilter.indexOf(object.emoji) === -1
                            ? [...emojiFilter, object.emoji]
                            : emojiFilter.filter((item) => item !== object.emoji));
                    }}/>);
            })}
          </ScrollRow>
        </react_native_1.ScrollView>)}
    </>);
};
exports.SearchBar = SearchBar;
const Row = native_1.default.View `
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 6;
  flex-wrap: wrap;
`;
const AbsoluteContainer = native_1.default.View `
  position: absolute;
  right: 10;
  top: 7.5;
  elevation: 50;
  z-index: 999;
`;
const ScrollRow = native_1.default.View `
  flex-direction: row;
  height: 100%;
  background-color: transparent;
  align-items: center;
  justify-content: center;
`;
//# sourceMappingURL=SearchBar.jsx.map