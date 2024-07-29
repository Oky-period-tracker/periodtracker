"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoCategory = exports.Category = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const EmojiSelector_1 = require("../../components/common/EmojiSelector");
const Text_1 = require("../../components/common/Text");
const i18n_1 = require("../../i18n");
const Category = ({ title, tags, onPress, isActive = false }) => {
    return (<CategoryContainer onPress={onPress}>
      <TitleContainer>
        <Title style={{ color: isActive ? '#e3629b' : '#ff9e00' }}>
          {(0, i18n_1.capitalizeFLetter)(title.trim())}
        </Title>
      </TitleContainer>
      <TagsContainer>
        <EmojiSelector_1.EmojiSelector title={tags.primary.name} isActive={isActive} isTextVisible={true} emoji={tags.primary.emoji} style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginBottom: null,
        }} emojiStyle={{ fontSize: 20 }} textStyle={{
            position: 'absolute',
            bottom: -10,
            fontSize: 8,
            zIndex: 45,
            elevation: 6,
        }} color="#e3629b" onPress={onPress}/>
      </TagsContainer>
    </CategoryContainer>);
};
exports.Category = Category;
const VideoCategory = ({ onPress, isActive = false }) => {
    const tags = { primary: { name: 'videos', emoji: '🎥' } };
    return (<VideoCategoryContainer onPress={onPress}>
      <TitleContainer>
        <VideosTitle style={{ color: isActive ? '#e3629b' : '#ff9e00' }}>videos</VideosTitle>
      </TitleContainer>
      <TagsContainer>
        <EmojiSelector_1.EmojiSelector title={tags.primary.name} isActive={isActive} isTextVisible={true} emoji={tags.primary.emoji} style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginBottom: null,
        }} emojiStyle={{ fontSize: 20 }} textStyle={{
            position: 'absolute',
            bottom: -10,
            fontSize: 8,
            zIndex: 45,
            elevation: 6,
        }} color="#e3629b" onPress={onPress}/>
      </TagsContainer>
    </VideoCategoryContainer>);
};
exports.VideoCategory = VideoCategory;
const CategoryContainer = native_1.default.TouchableOpacity `
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
  background-color: #fff;
  elevation: 5;
  border-radius: 10px;
  margin-vertical: 4px;
  margin-horizontal: 4px;
  min-height: 80px;
`;
const VideoCategoryContainer = native_1.default.TouchableOpacity `
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
  background-color: #ffe6e3;
  elevation: 5;
  border-radius: 10px;
  margin-vertical: 4px;
  margin-horizontal: 4px;
  min-height: 120px;
`;
const TagsContainer = native_1.default.View `
  flex-direction: row;
  height: 50px;
  width: 50px;
  justify-content: center;
  align-items: center;
`;
const TitleContainer = native_1.default.View `
  flex: 1;
`;
const Title = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  font-family: Roboto-Black;
  font-size: 18;
`;
const VideosTitle = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Black;
  font-size: 22;
`;
//# sourceMappingURL=Category.jsx.map