import * as React from "react";
import NavigationStack, { StackConfig } from "../NavigationStack";
import MainScreen from "../../screens/MainScreen";
import DayScreen from "../../screens/DayScreen";
import CalendarScreen from "../../screens/CalendarScreen";
import TutorialFirstScreen from "../../screens/TutorialFirstScreen";
import TutorialSecondScreen from "../../screens/TutorialSecondScreen";

const config: StackConfig = {
  initialRouteName: "MainScreen",
  screens: [
    {
      title: "Home",
      name: "MainScreen",
      Component: MainScreen,
    },
    {
      title: "Day",
      name: "DayScreen",
      Component: DayScreen,
    },
    {
      title: "Calendar",
      name: "Calendar",
      Component: CalendarScreen,
    },
    {
      title: "Tutorial",
      name: "TutorialFirstScreen",
      Component: TutorialFirstScreen,
    },
    {
      title: "Tutorial",
      name: "TutorialSecondScreen",
      Component: TutorialSecondScreen,
    },
  ],
};

const HomeStack = () => <NavigationStack config={config} />;

export default HomeStack;
