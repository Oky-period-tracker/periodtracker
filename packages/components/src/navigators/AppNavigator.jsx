"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_navigation_1 = require("react-navigation");
const react_navigation_stack_1 = require("react-navigation-stack");
const react_navigation_tabs_1 = require("react-navigation-tabs");
const AuthScreen_1 = require("../screens/AuthScreen");
const InfoScreen_1 = require("../screens/InfoScreen");
const EncyclopediaScreen_1 = require("../screens/EncyclopediaScreen");
const TermsScreen_1 = require("../screens/settings/TermsScreen");
const AboutScreen_1 = require("../screens/settings/AboutScreen");
const SplashScreen_1 = require("../screens/SplashScreen");
const OnboardingScreen_1 = require("../screens/OnboardingScreen");
const MainScreen_1 = require("../screens/MainScreen");
const TutorialFirstScreen_1 = require("../screens/TutorialFirstScreen");
const TutorialSecondScreen_1 = require("../screens/TutorialSecondScreen");
const SettingsScreen_1 = require("../screens/SettingsScreen");
const PrivacyScreen_1 = require("../screens/settings/PrivacyScreen");
const AccessScreen_1 = require("../screens/settings/AccessScreen");
const ContactUsScreen_1 = require("../screens/ContactUsScreen");
const DayScreen_1 = require("../screens/DayScreen");
const Calendar_1 = require("../screens/mainScreen/Calendar");
const ProfileScreen_1 = require("../screens/ProfileScreen");
const NavigationBar_1 = require("../components/common/NavigationBar");
const EditProfileScreen_1 = require("../screens/EditProfileScreen");
const ArticlesScreen_1 = require("../screens/ArticlesScreen");
const AvatarAndThemeScreen_1 = require("../screens/AvatarAndThemeScreen");
const JourneyScreen_1 = require("../screens/JourneyScreen");
const FindHelpScreen_1 = require("../screens/FindHelpScreen");
const PasswordRequestScreen_1 = require("../screens/PasswordRequestScreen");
const VideoScreen_1 = require("../screens/VideoScreen");
const navigationService_1 = require("../services/navigationService");
const react_redux_1 = require("react-redux");
const TutorialFirstStack = (0, react_navigation_stack_1.createStackNavigator)({ TutorialFirstScreen: TutorialFirstScreen_1.TutorialFirstScreen }, { headerMode: 'none', initialRouteName: 'TutorialFirstScreen' });
const TutorialSecondStack = (0, react_navigation_stack_1.createStackNavigator)({ TutorialSecondScreen: TutorialSecondScreen_1.TutorialSecondScreen }, { headerMode: 'none', initialRouteName: 'TutorialSecondScreen' });
const VideoStack = (0, react_navigation_stack_1.createStackNavigator)({ VideoScreen: VideoScreen_1.VideoScreen }, { headerMode: 'none', initialRouteName: 'VideoScreen' });
const HomeStack = (0, react_navigation_stack_1.createStackNavigator)({
    MainScreen: MainScreen_1.MainScreen,
    DayScreen: DayScreen_1.DayScreen,
    Calendar: Calendar_1.Calendar,
}, { headerMode: 'none', initialRouteName: 'MainScreen' });
HomeStack.navigationOptions = {
    lazy: false,
    tabBarIcon: ({ focused }) => <NavigationBar_1.NavigationBar focused={focused} name="main"/>,
};
// ---------------------------------------
const ProfileStack = (0, react_navigation_stack_1.createStackNavigator)({ ProfileScreen: ProfileScreen_1.ProfileScreen, EditProfileScreen: EditProfileScreen_1.EditProfileScreen, AvatarAndThemeScreen: AvatarAndThemeScreen_1.AvatarAndThemeScreen }, { headerMode: 'none' });
ProfileStack.navigationOptions = {
    tabBarIcon: ({ focused }) => <NavigationBar_1.NavigationBar focused={focused} name="profile"/>,
};
// ---------------------------------------
const EncyclopediaStack = (0, react_navigation_stack_1.createStackNavigator)({
    Encyclopedia: EncyclopediaScreen_1.EncyclopediaScreen,
    Articles: ArticlesScreen_1.ArticlesScreen,
    FindHelp: FindHelpScreen_1.FindHelpScreen,
}, { headerMode: 'none', initialRouteName: 'Encyclopedia' });
EncyclopediaStack.navigationOptions = {
    tabBarIcon: ({ focused }) => <NavigationBar_1.NavigationBar focused={focused} name="encyclopedia"/>,
};
const SettingsStack = (0, react_navigation_stack_1.createStackNavigator)({
    SettingsScreen: SettingsScreen_1.SettingsScreen,
    AccessScreen: AccessScreen_1.AccessScreen,
    TermsScreen: TermsScreen_1.TermsScreen,
    AboutScreen: AboutScreen_1.AboutScreen,
    PrivacyScreen: PrivacyScreen_1.PrivacyScreen,
    ContactUsScreen: ContactUsScreen_1.ContactUsScreen,
}, { headerMode: 'none', initialRouteName: 'SettingsScreen' });
const LoginStack = (0, react_navigation_stack_1.createStackNavigator)({
    AuthScreen: AuthScreen_1.AuthScreen,
    JourneyScreen: JourneyScreen_1.JourneyScreen,
    AvatarAndThemeScreen: AvatarAndThemeScreen_1.AvatarAndThemeScreen,
    InfoScreen: InfoScreen_1.InfoScreen,
    TermsScreen: TermsScreen_1.TermsScreen,
    AboutScreen: AboutScreen_1.AboutScreen,
    PrivacyScreen: PrivacyScreen_1.PrivacyScreen,
    EncyclopediaStack,
}, { headerMode: 'none', initialRouteName: 'AuthScreen' });
SettingsStack.navigationOptions = {
    tabBarIcon: ({ focused }) => <NavigationBar_1.NavigationBar focused={focused} name="settings"/>,
};
const MainStack = (0, react_navigation_tabs_1.createBottomTabNavigator)({
    ProfileStack,
    HomeStack,
    EncyclopediaStack,
    SettingsStack,
}, {
    tabBarOptions: {
        showLabel: false,
    },
    initialRouteName: 'HomeStack',
});
const Navigator = (0, react_navigation_stack_1.createStackNavigator)({
    SplashScreen: SplashScreen_1.SplashScreen,
    OnboardingScreen: OnboardingScreen_1.OnboardingScreen,
    PasswordRequestScreen: PasswordRequestScreen_1.PasswordRequestScreen,
    LoginStack,
    MainStack,
    TutorialFirstStack,
    TutorialSecondStack,
    VideoStack,
}, {
    initialRouteName: 'SplashScreen',
    headerMode: 'none',
});
const Navigation = (0, react_navigation_1.createAppContainer)(Navigator);
const SCREENS_TO_TRACK = ['MainScreen', 'ProfileScreen', 'Encyclopedia', 'Calendar'];
const AppNavigator = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    return (<Navigation ref={(navigatorRef) => {
            (0, navigationService_1.setTopLevelNavigator)(navigatorRef);
        }} onNavigationStateChange={(_, currentState) => {
            const screenName = (0, navigationService_1.getRouteName)(currentState);
            if (!screenName) {
                return;
            }
            if (!SCREENS_TO_TRACK.includes(screenName)) {
                return;
            }
        }} key="app-navigator"/>);
};
exports.default = AppNavigator;
//# sourceMappingURL=AppNavigator.jsx.map