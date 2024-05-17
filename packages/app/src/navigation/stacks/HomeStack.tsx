import * as React from "react";
import NavigationStack, { StackConfig } from "../NavigationStack";
import MainScreen from "../../screens/MainScreen";
import DayScreen from "../../screens/DayScreen";
import CalendarScreen from "../../screens/CalendarScreen";
import TutorialFirstScreen from "../../screens/TutorialFirstScreen";
import TutorialSecondScreen from "../../screens/TutorialSecondScreen";

const config: StackConfig = {
  initialRouteName: "Home",
  screens: [
    {
      title: "Home",
      name: "Home",
      Component: MainScreen,
    },
    {
      title: "Day",
      name: "Day",
      Component: DayScreen,
    },
    {
      title: "Calendar",
      name: "Calendar",
      Component: CalendarScreen,
    },
    {
      title: "Tutorial",
      name: "TutorialOne",
      Component: TutorialFirstScreen,
    },
    {
      title: "TutorialTwo",
      name: "TutorialSecondScreen",
      Component: TutorialSecondScreen,
    },
  ],
};

const HomeStack = () => <NavigationStack config={config} />;

export default HomeStack;
