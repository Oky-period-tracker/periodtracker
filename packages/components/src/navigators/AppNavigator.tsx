import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { AuthScreen } from '../screens/AuthScreen'
import { InfoScreen } from '../screens/InfoScreen'
import { EncyclopediaScreen } from '../screens/EncyclopediaScreen'
import { TermsScreen } from '../screens/settings/TermsScreen'
import { AboutScreen } from '../screens/settings/AboutScreen'
import { SplashScreen } from '../screens/SplashScreen'
import { OnboardingScreen } from '../screens/OnboardingScreen'
import { MainScreen } from '../screens/MainScreen'
import { TutorialFirstScreen } from '../screens/TutorialFirstScreen'
import { TutorialSecondScreen } from '../screens/TutorialSecondScreen'
import { SettingsScreen } from '../screens/SettingsScreen'
import { PrivacyScreen } from '../screens/settings/PrivacyScreen'
import { AccessScreen } from '../screens/settings/AccessScreen'
import { ContactUsScreen } from '../screens/ContactUsScreen'
import { DayScreen } from '../screens/DayScreen'
import { Calendar } from '../screens/mainScreen/Calendar'
import { ProfileScreen } from '../screens/ProfileScreen'
import { NavigationBar } from '../components/common/NavigationBar'
import { EditProfileScreen } from '../screens/EditProfileScreen'
import { ArticlesScreen } from '../screens/ArticlesScreen'
import { AvatarAndThemeScreen } from '../screens/AvatarAndThemeScreen'
import { JourneyScreen } from '../screens/JourneyScreen'
import { FindHelpScreen } from '../screens/FindHelpScreen'
import { ChatScreen } from '../screens/ChatScreen'
import { PasswordRequestScreen } from '../screens/PasswordRequestScreen'

const TutorialFirstStack = createStackNavigator(
  { TutorialFirstScreen },
  { headerMode: 'none', initialRouteName: 'TutorialFirstScreen' },
)

const TutorialSecondStack = createStackNavigator(
  { TutorialSecondScreen },
  { headerMode: 'none', initialRouteName: 'TutorialSecondScreen' },
)

const HomeStack = createStackNavigator(
  {
    MainScreen,
    DayScreen,
    Calendar,
  },
  { headerMode: 'none', initialRouteName: 'MainScreen' },
)

HomeStack.navigationOptions = {
  lazy: false,
  tabBarIcon: ({ focused }) => <NavigationBar focused={focused} name="main" />,
}

// ---------------------------------------

const ProfileStack = createStackNavigator(
  { ProfileScreen, EditProfileScreen, AvatarAndThemeScreen },
  { headerMode: 'none' },
)
ProfileStack.navigationOptions = {
  tabBarIcon: ({ focused }) => <NavigationBar focused={focused} name="profile" />,
}

// ---------------------------------------

const EncyclopediaStack = createStackNavigator(
  {
    Encyclopedia: EncyclopediaScreen,
    Articles: ArticlesScreen,
    FindHelp: FindHelpScreen,
    Chat: ChatScreen,
  },
  { headerMode: 'none', initialRouteName: 'Encyclopedia' },
)

EncyclopediaStack.navigationOptions = {
  tabBarIcon: ({ focused }) => <NavigationBar focused={focused} name="encyclopedia" />,
}

const SettingsStack = createStackNavigator(
  {
    SettingsScreen,
    AccessScreen,
    TermsScreen,
    AboutScreen,
    PrivacyScreen,
    ContactUsScreen,
  },
  { headerMode: 'none', initialRouteName: 'SettingsScreen' },
)

const LoginStack = createStackNavigator(
  {
    AuthScreen,
    JourneyScreen,
    AvatarAndThemeScreen,
    InfoScreen,
    TermsScreen,
    AboutScreen,
    PrivacyScreen,
    EncyclopediaStack,
  },
  { headerMode: 'none', initialRouteName: 'AuthScreen' },
)

SettingsStack.navigationOptions = {
  tabBarIcon: ({ focused }) => <NavigationBar focused={focused} name="settings" />,
}

const MainStack = createBottomTabNavigator(
  {
    ProfileStack,
    HomeStack,
    EncyclopediaStack,
    SettingsStack,
  },
  {
    tabBarOptions: {
      showLabel: false,
    },
    initialRouteName: 'HomeStack',
  },
)

const AppNavigator = createStackNavigator(
  {
    SplashScreen,
    OnboardingScreen,
    PasswordRequestScreen,
    LoginStack,
    MainStack,
    TutorialFirstStack,
    TutorialSecondStack,
  },
  {
    initialRouteName: 'SplashScreen',
    headerMode: 'none',
  },
)

export default createAppContainer(AppNavigator)
