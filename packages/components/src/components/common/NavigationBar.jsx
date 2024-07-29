"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationBar = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const index_1 = require("../../assets/index");
const useScreenDimensions_1 = require("../../hooks/useScreenDimensions");
const react_native_1 = require("react-native");
const tablet_1 = require("../../config/tablet");
const NavigationBar = ({ focused, name, }) => {
    const { screenWidth } = (0, useScreenDimensions_1.useScreenDimensions)();
    return (<Column style={{
            backgroundColor: focused ? '#F5F5F5' : '#F1F1F1',
            width: screenWidth / 4,
        }}>
      <ImageWrapper accessibilityLabel={name} style={{ elevation: focused ? 5 : 0 }}>
        <Icon source={focused ? index_1.assets.static.icons.tabs[name] : index_1.assets.static.icons.tabs[name + 'Grey']}/>
      </ImageWrapper>
    </Column>);
};
exports.NavigationBar = NavigationBar;
const Column = native_1.default.View `
  justify-content: center;
  align-items: center;
  height: ${tablet_1.IS_TABLET ? '80' : '56'}px;
  margin-bottom: ${tablet_1.IS_TABLET && react_native_1.Platform.OS === 'ios' ? '0' : '5'}px;
  border-left-width: 0.5px;
  border-right-width: 0.5px;
  border-color: #e1e2e2;
`;
const Icon = native_1.default.Image `
  width: 44;
  height: 44px;
`;
const ImageWrapper = native_1.default.View `
  width: 44;
  height: 44px;
  border-radius: 22px;
  background-color: transparent;
`;
//# sourceMappingURL=NavigationBar.jsx.map