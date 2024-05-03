import * as React from "react";
import EncyclopediaScreen from "../../screens/EncyclopediaScreen";
import ArticlesScreen from "../../screens/ArticlesScreen";
import FindHelpScreen from "../../screens/FindHelpScreen";
import VideoScreen from "../../screens/VideoScreen";
import NavigationStack, { StackConfig } from "../NavigationStack";

const config: StackConfig = {
  initialRouteName: "EncyclopediaScreen",
  screens: [
    {
      title: "Encyclopedia",
      name: "EncyclopediaScreen",
      Component: EncyclopediaScreen,
    },
    {
      title: "Articles",
      name: "ArticlesScreen",
      Component: ArticlesScreen,
    },
    {
      title: "Find Help",
      name: "FindHelpScreen",
      Component: FindHelpScreen,
    },
    {
      title: "Video",
      name: "VideoScreen",
      Component: VideoScreen,
    },
  ],
};

const EncyclopediaStack = () => <NavigationStack config={config} />;

export default EncyclopediaStack;
