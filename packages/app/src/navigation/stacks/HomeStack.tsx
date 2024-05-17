import * as React from "react";
import NavigationStack, { StackConfig } from "../NavigationStack";
import MainScreen from "../../screens/MainScreen";
import DayScreen from "../../screens/DayScreen";
import CalendarScreen from "../../screens/CalendarScreen";
import TutorialFirstScreen from "../../screens/TutorialFirstScreen";
import TutorialSecondScreen from "../../screens/TutorialSecondScreen";

export type HomeStackParamList = {
  Home: undefined;
  Calendar: undefined;
  TutorialOne: undefined;
  TutorialTwo: undefined;
  Day: undefined;
};

const config: StackConfig<HomeStackParamList> = {
  initialRouteName: "Home",
  screens: {
    Home: {
      title: "Home",
      component: MainScreen,
    },
    Day: {
      title: "Day",
      component: DayScreen,
    },
    Calendar: {
      title: "Calendar",
      component: CalendarScreen,
    },
    TutorialOne: {
      title: "Tutorial",
      component: TutorialFirstScreen,
    },
    TutorialTwo: {
      title: "TutorialTwo",
      component: TutorialSecondScreen,
    },
  },
};

const HomeStack = () => <NavigationStack config={config} />;

export default HomeStack;
