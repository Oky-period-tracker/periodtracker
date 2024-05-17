import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import ProfileStack from "./stacks/ProfileStack";
import HomeStack from "./stacks/HomeStack";
import EncyclopediaStack from "./stacks/EncyclopediaStack";
import SettingsStack from "./stacks/SettingsStack";
import { TabIcon } from "./components/TabIcon";

const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarStyle: {
    height: 60,
  },
};

const options = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarItemStyle: {
    backgroundColor: "#F1F1F1",
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#F5F5F5",
  },
};

const linking = {
  enabled: true,
  prefixes: [],
  config: {
    screens: {
      profile: {
        path: "profile",
        screens: {
          Profile: "",
          EditProfile: "edit",
          AvatarAndTheme: "avatar-and-theme",
        },
      },
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
      encyclopedia: {
        path: "encyclopedia",
        screens: {
          Encyclopedia: "",
          Articles: "articles",
          Help: "help",
          Video: "video",
        },
      },
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
