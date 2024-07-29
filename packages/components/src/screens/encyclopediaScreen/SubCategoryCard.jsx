"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategoryCard = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../../components/common/Text");
const useScreenDimensions_1 = require("../../hooks/useScreenDimensions");
const SubCategoryCard = ({ title, onPress }) => {
    const { screenWidth } = (0, useScreenDimensions_1.useScreenDimensions)();
    return (<SubCategoryContainer activeOpacity={0.8} onPress={onPress} style={{ left: 0.05 * screenWidth, width: 0.87 * screenWidth }}>
      <Title>{title}</Title>
    </SubCategoryContainer>);
};
exports.SubCategoryCard = SubCategoryCard;
const SubCategoryContainer = native_1.default.TouchableOpacity `
  min-height: 65px;
  justify-content: center;
  align-items: flex-start;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
  background-color: #fff;
  elevation: 3;
  border-radius: 10px;
  margin-vertical: 5px;
  margin-horizontal: 2px;
`;
const Title = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  font-family: Roboto-Black;
  color: #ff9e00;
  font-size: 18;
`;
//# sourceMappingURL=SubCategoryCard.jsx.map