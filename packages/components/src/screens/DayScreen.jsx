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
exports.DayScreen = DayScreen;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const BackgroundTheme_1 = require("../components/layout/BackgroundTheme");
const Header_1 = require("../components/common/Header");
const DayBadge_1 = require("../components/common/DayBadge");
const DateBadge_1 = require("../components/common/DateBadge");
const DayCarousel_1 = require("./dayScreen/DayCarousel");
const navigationService_1 = require("../services/navigationService");
const useKeyboardController_1 = require("../hooks/useKeyboardController");
const InformationButton_1 = require("../components/common/InformationButton");
const assets_1 = require("../assets");
const PredictionProvider_1 = require("../components/context/PredictionProvider");
const ThemedModal_1 = require("../components/common/ThemedModal");
const ColourButtons_1 = require("./mainScreen/ColourButtons");
const selectors = __importStar(require("../redux/selectors"));
const useSelector_1 = require("../hooks/useSelector");
const moment_1 = __importDefault(require("moment"));
function DayScreen({ navigation }) {
    const temp = navigation.getParam('data');
    const dataEntry = (0, PredictionProvider_1.usePredictDay)(temp.date);
    const [isVisible, setIsVisible] = react_1.default.useState(false);
    const { keyboardIsOpen, dismiss } = (0, useKeyboardController_1.useKeyboardController)();
    const cardAnswersToday = (0, useSelector_1.useSelector)((state) => selectors.verifyPeriodDaySelectorWithDate(state, (0, moment_1.default)(dataEntry.date)));
    const goBack = () => {
        if (keyboardIsOpen) {
            return dismiss();
        }
        return (0, navigationService_1.BackOneScreen)();
    };
    const navigateToTutorial = () => {
        requestAnimationFrame(() => {
            (0, navigationService_1.navigateAndReset)('TutorialFirstStack', null);
        });
    };
    return (<BackgroundTheme_1.BackgroundTheme>
      <InfoSection>
        {dataEntry.onFertile && !dataEntry.onPeriod && (<InformationButton_1.InformationButton icon={assets_1.assets.static.icons.infoBlue} iconStyle={{ height: 25, width: 25 }} style={{
                marginTop: 'auto',
                marginBottom: 'auto',
                marginRight: 10,
            }}/>)}

        <DateBadge_1.DateBadge style={{ width: 60, height: 60, marginRight: 10 }} dataEntry={dataEntry} showModal={() => setIsVisible(true)} cardValues={cardAnswersToday}/>
        <DayBadge_1.DayBadge style={{ width: 90, height: 50 }} fontSizes={{ small: 16, big: 24 }} dataEntry={dataEntry} cardValues={cardAnswersToday}/>
      </InfoSection>
      <Header_1.Header onPressBackButton={goBack} screenTitle={''} showScreenTitle={false}/>
      <DayCarouselSection>
        <DayCarousel_1.DayCarousel navigation={navigation} dataEntry={dataEntry}/>
      </DayCarouselSection>
      <ThemedModal_1.ThemedModal {...{ isVisible, setIsVisible }}>
        <ColourButtons_1.ColourButtons navigateToTutorial={navigateToTutorial} inputDay={dataEntry.date} hide={() => setIsVisible(false)} onPress={() => setIsVisible(false)} selectedDayInfo={dataEntry} cardValues={cardAnswersToday}/>
      </ThemedModal_1.ThemedModal>
    </BackgroundTheme_1.BackgroundTheme>);
}
const DayCarouselSection = native_1.default.View `
  width: 100%;
  flex: 1;
  padding-bottom: 25px;
`;
const InfoSection = native_1.default.View `
  flex-direction: row;
  align-items: center;
  position: absolute;
  z-index: 10;
  top: 8px;
  right: 30px;
`;
//# sourceMappingURL=DayScreen.jsx.map