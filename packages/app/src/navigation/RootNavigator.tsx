import * as React from "react";
import {
  LinkingOptions,
  NavigationContainer,
  DefaultTheme,
  Theme,
} from "@react-navigation/native";

import { ProfileStackParamList } from "./stacks/ProfileStack";
import { HomeStackParamList } from "./stacks/HomeStack";
import { EncyclopediaStackParamList } from "./stacks/EncyclopediaStack";
import { SettingsStackParamList } from "./stacks/SettingsStack";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MainNavigator, { MainStackParamList } from "./MainNavigator";
import AuthStack, { AuthStackParamList } from "./stacks/AuthStack";

export type RootStackParamList = MainStackParamList & AuthStackParamList;

export type GlobalParamList = MainStackParamList &
  AuthStackParamList &
  ProfileStackParamList &
  HomeStackParamList &
  EncyclopediaStackParamList &
  SettingsStackParamList;

export type ScreenProps<T extends keyof GlobalParamList> =
  NativeStackScreenProps<GlobalParamList, T>;

export type ScreenComponent<T extends keyof GlobalParamList> = React.FC<
  ScreenProps<T>
>;

const baseLinking = {
  enabled: true,
  prefixes: [],
};

const loggedOutLinking: LinkingOptions<RootStackParamList> = {
  ...baseLinking,
  config: {
    screens: {
      Auth: "",
      Info: "info",
      Encyclopedia: "encyclopedia",
      Articles: "articles/:subcategoryId",
      Help: "help",
      Video: "video",
    },
  },
};

const loggedInLinking: LinkingOptions<RootStackParamList> = {
  ...baseLinking,
  config: {
    screens: {
      // ===== Profile ===== //
      profile: {
        path: "profile",
        screens: {
          Profile: "",
          EditProfile: "edit",
          AvatarAndTheme: "avatar-and-theme",
        },
      },
      // ===== Home ===== //
      home: {
        path: "home",
        screens: {
          Home: "",
          Calendar: "calendar",
          TutorialOne: "tutorial-1",
          TutorialTwo: "tutorial-2",
          Day: "day",
        },
      },
      // ===== Encyclopedia ===== //
      encyclopedia: {
        path: "encyclopedia",
        screens: {
          Encyclopedia: "",
          Articles: "articles/:subcategoryId",
          Help: "help",
          Video: "video",
        },
      },
      // ===== Settings ===== //
      settings: {
        path: "settings",
        screens: {
          Settings: "",
          Access: "access",
          Terms: "terms-and-conditions",
          About: "about",
          Privacy: "privacy",
          Contact: "contact",
        },
      },
    },
  },
};

const theme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};

function RootNavigator() {
  const isLoggedIn = true; // TODO:

  const linking = isLoggedIn ? loggedInLinking : loggedOutLinking;

  return (
    <NavigationContainer linking={linking} theme={theme}>
      {isLoggedIn ? <MainNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default RootNavigator;
