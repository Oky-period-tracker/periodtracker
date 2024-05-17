import * as React from "react";
import EncyclopediaScreen from "../../screens/EncyclopediaScreen";
import ArticlesScreen from "../../screens/ArticlesScreen";
import FindHelpScreen from "../../screens/FindHelpScreen";
import VideoScreen from "../../screens/VideoScreen";
import NavigationStack, { StackConfig } from "../NavigationStack";

const config: StackConfig = {
  initialRouteName: "Encyclopedia",
  screens: [
    {
      title: "Encyclopedia",
      name: "Encyclopedia",
      Component: EncyclopediaScreen,
    },
    {
      title: "Articles",
      name: "Articles",
      Component: ArticlesScreen,
    },
    {
      title: "Find Help",
      name: "Help",
      Component: FindHelpScreen,
    },
    {
      title: "Video",
      name: "Video",
      Component: VideoScreen,
    },
  ],
};

const EncyclopediaStack = () => <NavigationStack config={config} />;

export default EncyclopediaStack;
