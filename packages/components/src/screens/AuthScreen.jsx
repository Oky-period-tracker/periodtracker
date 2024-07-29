"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthScreen = AuthScreen;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const PageContainer_1 = require("../components/layout/PageContainer");
const Text_1 = require("../components/common/Text");
const BackgroundTheme_1 = require("../components/layout/BackgroundTheme");
const index_1 = require("../assets/index");
const AnimatedContainer_1 = require("./authScreen/AnimatedContainer");
const LanguageSelect_1 = require("../components/common/LanguageSelect");
const PrimaryButton_1 = require("../components/common/buttons/PrimaryButton");
const navigationService_1 = require("../services/navigationService");
const react_native_1 = require("react-native");
function AuthScreen() {
    const [toggled, setToggled] = react_1.default.useState(true);
    return (<BackgroundTheme_1.BackgroundTheme>
      <PageContainer_1.PageContainer style={styles.page}>
        {toggled && (<Row>
            <LaunchLogo resizeMode="contain" source={index_1.assets.static.launch_icon}/>
            <FlexContainer>
              <HeaderText>auth_welcome</HeaderText>
              <HeaderText style={styles.headerText}>auth_catchphrase</HeaderText>
            </FlexContainer>
          </Row>)}
        <Container />
        <Container>
          <AnimatedContainer_1.AnimatedContainer toggled={(val) => setToggled(val)}/>
        </Container>
        {toggled && (<BottomRow>
            <PrimaryButton_1.PrimaryButton style={styles.info} onPress={() => (0, navigationService_1.navigate)('InfoScreen', null)}>
              info
            </PrimaryButton_1.PrimaryButton>
            <LanguageSelect_1.LanguageSelect style={styles.language}/>
          </BottomRow>)}
      </PageContainer_1.PageContainer>
    </BackgroundTheme_1.BackgroundTheme>);
}
const HeaderText = (0, native_1.default)(Text_1.Text) `
  color: #f49200;
  font-family: Roboto-Black;
  font-size: 32;
`;
const Row = native_1.default.View `
  flex-direction: row;
  margin-horizontal: auto;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50;
`;
const BottomRow = native_1.default.View `
  flex: 1;
  flex-direction: row;
  width: 100%;
  position: absolute;
  align-self: center;
  bottom: 10;
  justify-content: space-between;
`;
const Container = native_1.default.View `
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
const LaunchLogo = native_1.default.Image `
  height: 110;
  width: 110;
  margin-left: 10;
  margin-right: 10;
`;
const FlexContainer = native_1.default.View `
  flex: 1;
`;
const styles = react_native_1.StyleSheet.create({
    page: { justifyContent: 'center' },
    headerText: { fontSize: 14 },
    info: { flex: 1, marginRight: 30 },
    language: { flex: 1, marginLeft: 30 },
});
//# sourceMappingURL=AuthScreen.jsx.map