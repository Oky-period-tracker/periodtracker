import * as React from "react";
import {
  LinkingOptions,
  NavigationContainer,
  DefaultTheme,
  Theme,
  useNavigationContainerRef,
} from "@react-navigation/native";

import { ProfileStackParamList } from "./stacks/ProfileStack";
import { HomeStackParamList } from "./stacks/HomeStack";
import { EncyclopediaStackParamList } from "./stacks/EncyclopediaStack";
import { SettingsStackParamList } from "./stacks/SettingsStack";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MainNavigator, { MainStackParamList } from "./MainNavigator";
import AuthStack, { AuthStackParamList } from "./stacks/AuthStack";
import { useSelector } from "../redux/useSelector";
import { currentUserSelector } from "../redux/selectors";
import { useAuth } from "../contexts/AuthContext";
import analytics from "@react-native-firebase/analytics";

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

const loggedOutLinking: LinkingOptions<GlobalParamList> = {
  ...baseLinking,
  config: {
    screens: {
      Auth: "",
      Info: "info",
      Encyclopedia: "encyclopedia",
      Articles: "articles/:subcategoryId",
      Help: "help",
    },
  },
};

const loggedInLinking: LinkingOptions<GlobalParamList> = {
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
        },
      },
      // ===== Settings ===== //
      settings: {
        path: "settings",
        screens: {
          Settings: "",
          Access: "access_setting",
          Terms: "t_and_c",
          About: "about",
          Privacy: "privacy_policy",
          Contact: "contact_us",
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
  const user = useSelector(currentUserSelector);
  const { isLoggedIn } = useAuth();

  const hasAccess = user && isLoggedIn;

  //eslint-disable-next-line 
  const linking: LinkingOptions<any> = hasAccess
    ? loggedInLinking
    : loggedOutLinking;

  const navigationRef = useNavigationContainerRef();
  const routeNameRef = React.useRef<string | null>(null);
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        const currentRoute = navigationRef.getCurrentRoute();
        if (currentRoute) {
          routeNameRef.current = currentRoute.name;
        }
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute()?.name || null;
        const trackScreenView = () => {
          if (currentRouteName) {
            analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
            if (currentRouteName === "Encyclopedia") {
              analytics().logEvent("users_accessing_encyclopedia");
            }
          }
        };

        if (previousRouteName !== currentRouteName) {
          routeNameRef.current = currentRouteName;
          trackScreenView();
        }
      }}
      linking={linking}
      theme={theme}
    >
      {hasAccess ? <MainNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default RootNavigator;
