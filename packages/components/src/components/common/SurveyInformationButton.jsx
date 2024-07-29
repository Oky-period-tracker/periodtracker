"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyInformationButton = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("./Text");
const Icon_1 = require("./Icon");
const assets_1 = require("../../assets");
const ThemedModal_1 = require("./ThemedModal");
const textToSpeech_1 = require("../../services/textToSpeech");
const SurveyInformationButton = ({ onPress, style, icon = assets_1.assets.static.icons.infoPink, iconStyle, }) => {
    const [isVisible, setIsVisible] = react_1.default.useState(false);
    return (<>
      <TouchableArea style={style} accessibilityLabel={(0, textToSpeech_1.getAccessibilityLabel)('Information button')} onPress={() => {
            onPress ? onPress() : setIsVisible(true);
        }}>
        <Icon_1.Icon style={iconStyle} source={icon}/>
      </TouchableArea>
      <ThemedModal_1.ThemedModal {...{ isVisible, setIsVisible }}>
        <CardPicker>
          <Heading>survey</Heading>
          <TextContent>info_button_survey</TextContent>
        </CardPicker>
      </ThemedModal_1.ThemedModal>
    </>);
};
exports.SurveyInformationButton = SurveyInformationButton;
const TouchableArea = native_1.default.TouchableOpacity `
  padding-vertical: 25;
`;
const TutorialLaunchLabel = (0, native_1.default)(Text_1.Text) `
  color: white;
  font-size: 12;
  margin-left: 10;
  font-family: Roboto-Black;
`;
const CardPicker = native_1.default.View `
  width: 95%;
  background-color: #fff;
  border-radius: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: center;
  padding-vertical: 15;
  padding-horizontal: 15;
`;
const Heading = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Black;
  font-size: 18;
  margin-bottom: 10;
  color: #a2c72d;
`;
const TextContent = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Regular;
  font-size: 16;
  margin-bottom: 10;
`;
//# sourceMappingURL=SurveyInformationButton.jsx.map