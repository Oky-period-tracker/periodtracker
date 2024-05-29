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
import AuthNavigator, { AuthStackParamList } from "./AuthNavigator";

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

const linking: LinkingOptions<RootStackParamList> = {
  enabled: true,
  prefixes: [],
  config: {
    screens: {
      // ===== Unauthenticated ===== //
      Welcome: "welcome",
      Auth: "auth",
      Info: "info",
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
  const isLoggedIn = false; // TODO:

  return (
    <NavigationContainer linking={linking} theme={theme}>
      {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default RootNavigator;
