import * as React from "react";
import NavigationStack, { StackConfig } from "../components/NavigationStack";
import MainScreen from "../../screens/MainScreen";
import DayScreen from "../../screens/DayScreen";
import CalendarScreen from "../../screens/CalendarScreen";
import TutorialFirstScreen from "../../screens/TutorialFirstScreen";
import TutorialSecondScreen from "../../screens/TutorialSecondScreen";
import moment from "moment";
import { Tutorial } from "../../screens/MainScreen/TutorialContext";

export type HomeStackParamList = {
  Home: {
    tutorial: Tutorial;
  };
  Calendar: undefined;
  TutorialOne: undefined;
  TutorialTwo: undefined;
  Day: {
    date: moment.Moment;
  };
};

const config: StackConfig<keyof HomeStackParamList> = {
  initialRouteName: "Home",
  screens: {
    Home: {
      title: "home",
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
