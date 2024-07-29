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
exports.MainScreen = MainScreen;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const BackgroundTheme_1 = require("../components/layout/BackgroundTheme");
const CircleProgress_1 = require("./mainScreen/CircleProgress");
const native_1 = __importDefault(require("styled-components/native"));
const CircularSelection_1 = require("./mainScreen/wheelCarousel/CircularSelection");
const Carousel_1 = require("./mainScreen/wheelCarousel/Carousel");
const CenterCard_1 = require("./mainScreen/CenterCard");
const Avatar_1 = require("../components/common/Avatar/Avatar");
const ThemeContext_1 = require("../components/context/ThemeContext");
const navigationService_1 = require("../services/navigationService");
const useInfiniteScroll_1 = require("./mainScreen/wheelCarousel/useInfiniteScroll");
const useTextToSpeechHook_1 = require("../hooks/useTextToSpeechHook");
const config_1 = require("../config");
const PredictionProvider_1 = require("../components/context/PredictionProvider");
const useRandomText_1 = require("../hooks/useRandomText");
const InformationButton_1 = require("../components/common/InformationButton");
const assets_1 = require("../assets");
const actions = __importStar(require("../redux/actions"));
const react_redux_1 = require("react-redux");
const useSelector_1 = require("../hooks/useSelector");
const selectors = __importStar(require("../redux/selectors"));
const moment_1 = __importDefault(require("moment"));
const Flower_1 = require("../optional/Flower");
const tablet_1 = require("../config/tablet");
const useOrientation_1 = require("../hooks/useOrientation");
function MainScreen({ navigation }) {
    const { data } = (0, useInfiniteScroll_1.useInfiniteScroll)();
    const todayInfo = (0, PredictionProvider_1.useTodayPrediction)();
    const currentDate = Object.assign({}, todayInfo.date);
    const lastDate = (0, moment_1.default)(currentDate).add(4, 'days');
    const wheelDaysInfo = Array(7)
        .fill(1)
        .map((i) => lastDate.subtract(i, 'days').format('DD MMMM'));
    (0, useTextToSpeechHook_1.useTextToSpeechHook)({ navigation, text: (0, config_1.mainScreenSpeech)({ data, wheelDaysInfo, todayInfo }) });
    return <MainScreenContainer navigation={navigation}/>;
}
const MainScreenContainer = ({ navigation }) => {
    const { data } = (0, useInfiniteScroll_1.useInfiniteScroll)();
    const theme = (0, ThemeContext_1.useTheme)();
    const todayInfo = (0, PredictionProvider_1.useTodayPrediction)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const userID = (0, useSelector_1.useSelector)(selectors.currentUserSelector).id;
    const history = (0, PredictionProvider_1.useHistoryPrediction)();
    const currentUser = (0, useSelector_1.useSelector)(selectors.currentUserSelector);
    // @TODO: careful note here, may be worth the performance increase though May not work with Memo now
    react_1.default.useEffect(() => {
        dispatch(actions.fetchSurveyContentRequest(userID));
    }, []);
    (0, useRandomText_1.useRandomText)({ navigation });
    return <MainScreenActual key={theme.id}/>;
};
const MainScreenActual = react_1.default.memo(() => {
    const { data, index, isActive, currentIndex, absoluteIndex } = (0, useInfiniteScroll_1.useInfiniteScroll)();
    const allCardsData = (0, useSelector_1.useSelector)((state) => selectors.allCardAnswersSelector(state));
    const { onFertile, onPeriod } = (0, PredictionProvider_1.useTodayPrediction)();
    const [isFlowerModalVisible, setFlowerModalVisible] = react_1.default.useState(false);
    const orientation = (0, useOrientation_1.useOrientation)();
    const wheelSectionWidth = tablet_1.IS_TABLET ? (orientation === 'LANDSCAPE' ? '35%' : '40%') : '65%';
    return (<BackgroundTheme_1.BackgroundTheme>
      <TopSeparator>
        {onFertile && !onPeriod && (<InformationButton_1.InformationButton icon={assets_1.assets.static.icons.infoBlue} iconStyle={styles.icon} style={styles.info}/>)}
      </TopSeparator>
      <MiddleSection>
        <AvatarSection>
          <Row>
            <CircleProgress_1.CircleProgress isCalendarTextVisible={true} onPress={() => (0, navigationService_1.navigate)('Calendar', { verifiedPeriodsData: allCardsData })} fillColor="#FFC900" emptyFill="#F49200" style={styles.circle}/>
            <Flower_1.FlowerButton style={styles.flowerButton} onPress={() => setFlowerModalVisible(true)}/>
          </Row>
          <Avatar_1.Avatar style={styles.avatar}/>
        </AvatarSection>
        <WheelSection style={{ width: wheelSectionWidth }}>
          <CircularSelection_1.CircularSelection {...{ data, index, isActive, currentIndex, absoluteIndex }}/>
          <CenterCard_1.CenterCard />
        </WheelSection>
      </MiddleSection>
      <CarouselSection>
        <Carousel_1.Carousel {...{ index, data, isActive, currentIndex, absoluteIndex }}/>
      </CarouselSection>
      <Flower_1.FlowerModal isModalVisible={isFlowerModalVisible} onDismiss={() => setFlowerModalVisible(false)} isStatic={true}/>
    </BackgroundTheme_1.BackgroundTheme>);
});
const TopSeparator = native_1.default.View `
  height: 10%;
  width: 100%;
  z-index: 9998;
`;
const MiddleSection = native_1.default.View `
  height: 60%;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;
const AvatarSection = native_1.default.View `
  flex-direction: column;
  height: 100%;
  width: 35%;
  justify-content: flex-start;
  z-index: 9999;
`;
const Row = native_1.default.View `
  flex-direction: row;
  width: 100%;
  z-index: 9999;
`;
const WheelSection = native_1.default.View `
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;
const CarouselSection = native_1.default.View `
  height: 30%;
  padding-bottom: ${tablet_1.IS_TABLET ? 40 : 20}px;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;
const styles = react_native_1.StyleSheet.create({
    icon: {
        height: 25,
        width: 25,
    },
    info: {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: 20,
        alignSelf: 'flex-end',
    },
    flowerButton: {
        marginStart: 16,
    },
    avatar: {
        position: 'absolute',
        top: react_native_1.Platform.OS === 'ios' ? 120 : 90,
    },
    circle: {
        alignSelf: 'flex-start',
        marginLeft: 15,
        backgroundColor: '#FF8C00',
    },
});
//# sourceMappingURL=MainScreen.jsx.map