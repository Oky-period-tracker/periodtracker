import * as React from "react";
import {
  LinkingOptions,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native";
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import ProfileStack, { ProfileStackParamList } from "./stacks/ProfileStack";
import HomeStack, { HomeStackParamList } from "./stacks/HomeStack";
import EncyclopediaStack, {
  EncyclopediaStackParamList,
} from "./stacks/EncyclopediaStack";
import SettingsStack, { SettingsStackParamList } from "./stacks/SettingsStack";
import { TabIcon } from "./components/TabIcon";

export type ParamList = {
  profile: NavigatorScreenParams<ProfileStackParamList>;
  home: NavigatorScreenParams<HomeStackParamList>;
  encyclopedia: NavigatorScreenParams<EncyclopediaStackParamList>;
  settings: NavigatorScreenParams<SettingsStackParamList>;
};

const linking: LinkingOptions<ParamList> = {
  enabled: true,
  prefixes: [],
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
          Articles: "articles",
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

const screenOptions: BottomTabNavigationOptions = {
  tabBarStyle: {
    height: 60,
  },
};

const options: BottomTabNavigationOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarItemStyle: {
    backgroundColor: "#F1F1F1",
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#F5F5F5",
  },
};

const Tab = createBottomTabNavigator();

function RootNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <Tab.Navigator initialRouteName={"home"} screenOptions={screenOptions}>
        <Tab.Screen
          name={"profile"}
          component={ProfileStack}
          options={{
            ...options,
            tabBarIcon: ({ focused, size }) => (
              <TabIcon focused={focused}>
                <FontAwesome size={size} name={"user"} color={"#fff"} />
              </TabIcon>
            ),
          }}
        />
        <Tab.Screen
          name={"home"}
          component={HomeStack}
          options={{
            ...options,
            tabBarIcon: ({ focused, size }) => (
              <TabIcon focused={focused}>
                <FontAwesome size={size} name={"calendar"} color={"#fff"} />
              </TabIcon>
            ),
          }}
        />
        <Tab.Screen
          name={"encyclopedia"}
          component={EncyclopediaStack}
          options={{
            ...options,
            tabBarIcon: ({ focused, size }) => (
              <TabIcon focused={focused}>
                <FontAwesome size={size} name={"book"} color={"#fff"} />
              </TabIcon>
            ),
          }}
        />
        <Tab.Screen
          name={"settings"}
          component={SettingsStack}
          options={{
            ...options,
            tabBarIcon: ({ focused, size }) => (
              <TabIcon focused={focused}>
                <FontAwesome size={size} name={"gear"} color={"#fff"} />
              </TabIcon>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
