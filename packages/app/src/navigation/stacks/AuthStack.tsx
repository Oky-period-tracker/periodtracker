import * as React from "react";

import AuthScreen from "../../screens/AuthScreen";

import InfoScreen from "../../screens/InfoScreen";
import NavigationStack, { StackConfig } from "../components/NavigationStack";
import EncyclopediaScreen from "../../screens/EncyclopediaScreen";
import ArticlesScreen from "../../screens/ArticlesScreen";
import FindHelpScreen from "../../screens/FindHelpScreen";
import VideoScreen from "../../screens/VideoScreen";
import TermsScreen from "../../screens/TermsScreen";
import AboutScreen from "../../screens/AboutScreen";
import PrivacyScreen from "../../screens/PrivacyScreen";

export type AuthStackParamList = {
  Auth: undefined;
  Info: undefined;
  Terms: undefined;
  About: undefined;
  Privacy: undefined;
  Encyclopedia: undefined;
  Articles: {
    subcategoryId: string;
  };
  Help: undefined;
  Video: undefined;
};

const config: StackConfig<keyof AuthStackParamList> = {
  initialRouteName: "Auth",
  screens: {
    Auth: {
      title: "",
      component: AuthScreen,
    },
    Info: {
      title: "Info",
      component: InfoScreen,
    },
    Terms: {
      title: "Terms & Conditions",
      component: TermsScreen,
      backRoute: "Info",
    },
    About: {
      title: "About",
      component: AboutScreen,
      backRoute: "Info",
    },
    Privacy: {
      title: "Privacy",
      component: PrivacyScreen,
      backRoute: "Info",
    },
    Encyclopedia: {
      title: "Encyclopedia",
      component: EncyclopediaScreen,
      backRoute: "Info",
    },
    Articles: {
      title: "Articles",
      component: ArticlesScreen,
      backRoute: "Encyclopedia",
    },
    Help: {
      title: "Find Help",
      component: FindHelpScreen,
      backRoute: "Encyclopedia",
    },
    Video: {
      title: "Video",
      component: VideoScreen,
      backRoute: "Encyclopedia",
    },
  },
};

const AuthStack = () => <NavigationStack config={config} />;

export default AuthStack;
