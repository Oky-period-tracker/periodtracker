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
exports.ProfileScreen = ProfileScreen;
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const native_1 = __importDefault(require("styled-components/native"));
const PageContainer_1 = require("../components/layout/PageContainer");
const Text_1 = require("../components/common/Text");
const BackgroundTheme_1 = require("../components/layout/BackgroundTheme");
const Header_1 = require("../components/common/Header");
const Icon_1 = require("../components/common/Icon");
const CircleProgress_1 = require("./mainScreen/CircleProgress");
const index_1 = require("../assets/index");
const ThemeContext_1 = require("../components/context/ThemeContext");
const CycleCard_1 = require("./profileScreen/CycleCard");
const react_native_1 = require("react-native");
const navigationService_1 = require("../services/navigationService");
const PrimaryButton_1 = require("../components/common/buttons/PrimaryButton");
const AvatarOption_1 = require("./avatarAndTheme/avatarSelect/AvatarOption");
const ThemeSelectItem_1 = require("./avatarAndTheme/ThemeSelectItem");
const PredictionProvider_1 = require("../components/context/PredictionProvider");
const useSelector_1 = require("../hooks/useSelector");
const actions = __importStar(require("../redux/actions"));
const selectors = __importStar(require("../redux/selectors"));
const index_2 = require("../i18n/index");
const IconButton_1 = require("../components/common/buttons/IconButton");
const config_1 = require("../config");
const useTextToSpeechHook_1 = require("../hooks/useTextToSpeechHook");
const moment_1 = __importDefault(require("moment"));
const ThemedModal_1 = require("../components/common/ThemedModal");
const font_1 = require("../services/font");
function ProfileScreen({ navigation }) {
    const History = (0, PredictionProvider_1.useHistoryPrediction)();
    const selectedAvatar = (0, useSelector_1.useSelector)(selectors.currentAvatarSelector);
    const [isModalVisible, setIsModalVisible] = react_1.default.useState(false);
    const [error, setError] = react_1.default.useState(false);
    const shouldSkip = react_1.default.useRef(0);
    const currentUser = (0, useSelector_1.useSelector)(selectors.currentUserSelector);
    const errorCode = (0, useSelector_1.useSelector)(selectors.authError);
    const todayInfo = (0, PredictionProvider_1.useTodayPrediction)();
    const { id: theme } = (0, ThemeContext_1.useTheme)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const connectAccountCount = (0, useSelector_1.useSelector)((state) => state.auth.connectAccountAttempts);
    const dateOfBirth = (0, moment_1.default)(currentUser.dateOfBirth);
    (0, useTextToSpeechHook_1.useTextToSpeechHook)({
        navigation,
        text: (0, config_1.profileScreenSpeech)({ currentUser, todayInfo, dateOfBirth, selectedAvatar, theme }),
    });
    react_1.default.useEffect(() => {
        if (shouldSkip.current < 1) {
            // This skips the first render when opening up the app. And only waits for more connect account attempts from buttons presses after that
            shouldSkip.current += 1;
            return;
        }
        setError(true);
    }, [connectAccountCount, error, errorCode]);
    if (!currentUser) {
        return <Empty />;
    }
    return (<BackgroundTheme_1.BackgroundTheme>
      <PageContainer_1.PageContainer>
        <Header_1.Header screenTitle="profile" showGoBackButton={false}/>

        <react_native_1.FlatList data={History} keyExtractor={(_, index) => index.toString()} renderItem={({ item, index }) => <CycleCard_1.CycleCard item={item} cycleNumber={index + 1}/>} ListHeaderComponent={<Container>
              <Touchable onPress={() => (0, navigationService_1.navigate)('EditProfileScreen', null)}>
                <Row style={[styles.firstRow, { borderBottomWidth: currentUser.isGuest ? 0 : 1 }]}>
                  <Column style={styles.center}>
                    <Icon_1.Icon source={currentUser.isGuest
                ? index_1.assets.static.icons.profileGuest
                : index_1.assets.static.icons.profileL} style={styles.icon}/>
                  </Column>
                  <Column style={styles.start}>
                    <Text_1.Text style={styles.headerText}>name</Text_1.Text>
                    <Text_1.Text style={styles.headerText}>age</Text_1.Text>
                    <Text_1.Text style={styles.headerText}>gender</Text_1.Text>
                    <Text_1.Text style={styles.headerText}>location</Text_1.Text>
                  </Column>
                  <Column style={styles.start}>
                    <ItemDescription>{currentUser.name}</ItemDescription>
                    <ItemDescription>
                      {(0, index_2.translate)(dateOfBirth.format('MMM')) + ' ' + dateOfBirth.format('YYYY')}
                    </ItemDescription>
                    <ItemDescription>
                      {(0, index_2.translate)(currentUser.gender).length > 13
                ? (0, index_2.translate)(currentUser.gender).substring(0, 13 - 3) + '...'
                : (0, index_2.translate)(currentUser.gender)}
                    </ItemDescription>
                    <ItemDescription>
                      {(0, index_2.translate)(currentUser.location.length > 10
                ? currentUser.location.substring(0, 10 - 3) + '...'
                : currentUser.location)}
                    </ItemDescription>
                  </Column>
                </Row>
              </Touchable>
              {currentUser.isGuest && (<>
                  <Row>
                    <Column style={styles.row}>
                      <IconButton_1.IconButton name="infoPink" onPress={() => {
                    setIsModalVisible(true);
                }} touchableStyle={styles.infoButton}/>
                      <Text_1.Text style={styles.guestText}>guest_mode_user_alert</Text_1.Text>
                    </Column>

                    <Column style={styles.start}>
                      <PrimaryButton_1.PrimaryButton style={styles.connectButton} textStyle={styles.white} onPress={() => {
                    setError(false);
                    dispatch(actions.convertGuestAccount({
                        id: currentUser.id,
                        name: currentUser.name,
                        dateOfBirth: currentUser.dateOfBirth,
                        gender: currentUser.gender,
                        location: currentUser.location,
                        country: currentUser.country,
                        province: currentUser.province,
                        password: currentUser.password,
                        secretQuestion: currentUser.secretQuestion,
                        secretAnswer: currentUser.secretAnswer,
                    }));
                }}>
                        connect_account
                      </PrimaryButton_1.PrimaryButton>
                    </Column>
                  </Row>
                  {error && (<Row style={styles.errorRow}>
                      <Text_1.Text style={styles.errorText}>
                        {errorCode === 409 ? 'error_same_name' : 'error_connect_guest'}
                      </Text_1.Text>
                    </Row>)}
                </>)}
              <Row>
                <Column>
                  <CircleProgress_1.CircleProgress disabled={true} fillColor="#FFC900" emptyFill="#F49200" size={60}/>
                </Column>
                <Column style={styles.start}>
                  <Text_1.Text style={styles.valuesText}>cycle_length</Text_1.Text>
                  <Text_1.Text style={styles.valuesText}>period_length</Text_1.Text>
                </Column>
                <Column style={styles.start}>
                  <ItemDescription>{`${todayInfo.cycleLength === 100 ? '-' : todayInfo.cycleLength} ${(0, index_2.translate)('days')}`}</ItemDescription>
                  <ItemDescription>{`${todayInfo.periodLength === 0 ? '-' : todayInfo.periodLength} ${(0, index_2.translate)('days')}`}</ItemDescription>
                </Column>
              </Row>
              <Touchable onPress={() => (0, navigationService_1.navigate)('AvatarAndThemeScreen', null)}>
                <Row style={styles.lastRow}>
                  <Column>
                    <AvatarOption_1.AvatarOption isDisabled={true} avatar={selectedAvatar} isSelected={false} style={styles.avatarOption}/>
                  </Column>
                  <Column style={styles.start}>
                    <ShadowWrapper>
                      <ThemeSelectItem_1.ThemeSelectItem theme={theme}/>
                    </ShadowWrapper>
                  </Column>
                  <Column style={styles.start}>
                    <ItemDescription style={styles.capitalize}>
                      {(0, index_2.translate)(selectedAvatar)}
                    </ItemDescription>
                    <ItemDescription style={styles.capitalize}>{(0, index_2.translate)(theme)}</ItemDescription>
                  </Column>
                </Row>
              </Touchable>
            </Container>} ListFooterComponent={<BottomFill />}/>
      </PageContainer_1.PageContainer>
      <ThemedModal_1.ThemedModal isVisible={isModalVisible} setIsVisible={setIsModalVisible}>
        <CardPicker>
          <Heading>alert</Heading>
          <TextContent>connect_account_info</TextContent>
        </CardPicker>
      </ThemedModal_1.ThemedModal>
    </BackgroundTheme_1.BackgroundTheme>);
}
const FONT_SCALE = (0, font_1.getDeviceFontScale)();
const Row = native_1.default.View `
  min-height: ${FONT_SCALE === 'EXTRA_LARGE' ? 128 : FONT_SCALE === 'LARGE' ? 120 : 100}px;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #eaeaea;
  align-items: center;
  justify-content: center;
  padding-horizontal: 8px;
`;
const Touchable = native_1.default.TouchableOpacity ``;
const Container = native_1.default.View `
  background-color: white;
  elevation: 3;
  margin-horizontal: 3px;
  border-radius: 10px;
`;
const Empty = native_1.default.View ``;
const Column = native_1.default.View `
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const ItemDescription = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  height: 30px;
  font-size: 16;
  text-align-vertical: center;
  font-family: Roboto-Black;
  color: #000;
`;
const BottomFill = native_1.default.View `
  height: 20px;
  width: 100%;
`;
const ShadowWrapper = native_1.default.View `
  height: 60px;
  width: 90px;
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
const styles = react_native_1.StyleSheet.create({
    flex: {
        flex: 1,
    },
    start: {
        alignItems: 'flex-start',
    },
    center: {
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    white: {
        color: 'white',
    },
    capitalize: {
        textTransform: 'capitalize',
    },
    connectButton: {
        height: 60,
        minWidth: 115,
        maxWidth: 180,
        padding: 4,
        alignSelf: 'center',
        backgroundColor: '#a2c72d',
    },
    errorRow: {
        minHeight: 40,
        height: 40,
    },
    errorText: {
        fontSize: 12,
        color: 'red',
        textAlignVertical: 'center',
        alignSelf: 'center',
        bottom: 0,
    },
    headerText: {
        minHeight: 30,
        textAlignVertical: 'center',
        fontSize: 12,
    },
    guestText: {
        width: '70%',
        textAlign: 'left',
        paddingLeft: 10,
        fontSize: 12,
        alignSelf: 'center',
    },
    valuesText: {
        minHeight: 30,
        fontSize: 12,
        textAlignVertical: 'center',
    },
    avatarOption: {
        height: 70,
        width: 70,
        marginBottom: 0,
    },
    infoButton: {
        paddingLeft: 40,
    },
    icon: {
        height: 57,
        width: 57,
    },
    firstRow: {
        minHeight: FONT_SCALE === 'EXTRA_LARGE' ? 150 : FONT_SCALE === 'LARGE' ? 145 : 140,
    },
    lastRow: {
        borderBottomWidth: 0,
        minHeight: FONT_SCALE === 'EXTRA_LARGE' ? 150 : FONT_SCALE === 'LARGE' ? 145 : 140,
    },
});
//# sourceMappingURL=ProfileScreen.jsx.map