import * as React from "react";
import EncyclopediaScreen from "../../screens/EncyclopediaScreen";
import ArticlesScreen from "../../screens/ArticlesScreen";
import FindHelpScreen from "../../screens/FindHelpScreen";
import VideoScreen from "../../screens/VideoScreen";
import NavigationStack, { StackConfig } from "../components/NavigationStack";

export type EncyclopediaStackParamList = {
  Encyclopedia: undefined;
  Articles: {
    subcategoryId: string;
  };
  Help: undefined;
  Video: undefined;
};

const config: StackConfig<keyof EncyclopediaStackParamList> = {
  initialRouteName: "Encyclopedia",
  screens: {
    Encyclopedia: {
      title: "Encyclopedia",
      component: EncyclopediaScreen,
    },
    Articles: {
      title: "Articles",
      component: ArticlesScreen,
    },
    Help: {
      title: "Find Help",
      component: FindHelpScreen,
    },
    Video: {
      title: "Video",
      component: VideoScreen,
    },
  },
};

const EncyclopediaStack = () => <NavigationStack config={config} />;

export default EncyclopediaStack;
