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
exports.CalendarAssetDemo = CalendarAssetDemo;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const index_1 = require("../../assets/index");
const useSelector_1 = require("../../hooks/useSelector");
const selectors = __importStar(require("../../redux/selectors"));
const useScreenDimensions_1 = require("../../hooks/useScreenDimensions");
function CalendarAssetDemo() {
    const { screenWidth, screenHeight } = (0, useScreenDimensions_1.useScreenDimensions)();
    const locale = (0, useSelector_1.useSelector)(selectors.currentLocaleSelector);
    const source = index_1.assets.general.calendarStatic[locale];
    return (<DayCarouselItemContainer style={{
            width: 0.6 * screenWidth,
            height: 0.4 * screenHeight,
            alignSelf: 'center',
        }}>
      <ImageContainer source={source}/>
    </DayCarouselItemContainer>);
}
const DayCarouselItemContainer = native_1.default.View `
  background-color: #fff;
  border-radius: 10px;
  elevation: 6;
  margin-horizontal: 10px;
  padding-horizontal: 20;
  padding-vertical: 15;
`;
const ImageContainer = native_1.default.Image `
  height: 100%;
  width: 100%;
  resize-mode: contain;
`;
//# sourceMappingURL=CalendarAssetDemo.jsx.map