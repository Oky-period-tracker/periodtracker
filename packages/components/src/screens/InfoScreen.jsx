"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoScreen = InfoScreen;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const BackgroundTheme_1 = require("../components/layout/BackgroundTheme");
const PageContainer_1 = require("../components/layout/PageContainer");
const Header_1 = require("../components/common/Header");
const Avatar_1 = require("../components/common/Avatar/Avatar");
const ListItem_1 = require("../components/common/ListItem");
const navigationService_1 = require("../services/navigationService");
const index_1 = require("../assets/index");
const Text_1 = require("../components/common/Text");
function InfoScreen() {
    return (<BackgroundTheme_1.BackgroundTheme>
      <PageContainer_1.PageContainer>
        <Header_1.Header screenTitle="info"/>
        <AvatarSection>
          <Avatar_1.Avatar isProgressVisible={false} style={{ position: 'absolute' }}/>
        </AvatarSection>
        <Container>
          <NavigationContainer style={{ flex: 1 }}>
            <NavigationLink onPress={() => (0, navigationService_1.navigate)('AboutScreen', null)}>
              <ListItem_1.ListItem title="about" description="about_info"/>
            </NavigationLink>
            <NavigationLink onPress={() => (0, navigationService_1.navigate)('TermsScreen', null)}>
              <ListItem_1.ListItem title="t_and_c" description="t_and_c_info"/>
            </NavigationLink>
            <NavigationLink onPress={() => {
            (0, navigationService_1.navigate)('PrivacyScreen', null);
        }}>
              <ListItem_1.ListItem style={{ borderBottomWidth: 0 }} title="privacy_policy" description="privacy_info"/>
            </NavigationLink>
          </NavigationContainer>
          <NavigationContainer style={{ marginTop: 12 }}>
            <Row onPress={() => {
            (0, navigationService_1.navigate)('Encyclopedia', null);
        }}>
              <Title style={{ textTransform: 'capitalize' }}>encyclopedia</Title>
              <NewsIcon source={index_1.assets.static.icons.news}/>
            </Row>
          </NavigationContainer>
        </Container>
      </PageContainer_1.PageContainer>
    </BackgroundTheme_1.BackgroundTheme>);
}
const NavigationLink = native_1.default.TouchableOpacity `
  flex: 1;
`;
const Row = native_1.default.TouchableOpacity `
  flex-direction: row;
  justify-content: space-between;
`;
const NavigationContainer = native_1.default.View `
  border-radius: 10px;
  elevation: 3;
  background: #fff;
  margin-horizontal: 2px;
`;
const Container = native_1.default.View `
  flex: 1;
  margin-bottom: 18px;
`;
const AvatarSection = native_1.default.View `
  flex: 1;
  justify-content: center;
`;
const NewsIcon = native_1.default.Image `
  width: 28px;
  height: 28px;
  margin-right: 13px;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const Title = (0, native_1.default)(Text_1.Text) `
  font-size: 16;
  text-align: center;
  font-family: Roboto-Black;
  padding-left: 30px;
  padding-top: 15px;
  padding-bottom: 15px;
`;
//# sourceMappingURL=InfoScreen.jsx.map