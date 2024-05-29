import * as React from "react";

import AuthScreen from "../../screens/AuthScreen";

import InfoScreen from "../../screens/InfoScreen";
import NavigationStack, { StackConfig } from "../components/NavigationStack";
import WelcomeScreen from "../../screens/Welcome";
import EncyclopediaScreen from "../../screens/EncyclopediaScreen";
import ArticlesScreen from "../../screens/ArticlesScreen";
import FindHelpScreen from "../../screens/FindHelpScreen";
import VideoScreen from "../../screens/VideoScreen";

export type AuthStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  Info: undefined;
  // Encyclopedia
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
    Welcome: {
      title: "Welcome",
      component: WelcomeScreen,
    },
    Auth: {
      title: "",
      component: AuthScreen,
    },
    Info: {
      title: "Info",
      component: InfoScreen,
    },
    Encyclopedia: {
      title: "Encyclopedia",
      component: EncyclopediaScreen,
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
