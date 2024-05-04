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

function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={"HomeStack"}
        screenOptions={screenOptions}
      >
        <Tab.Screen
          name={"ProfileStack"}
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
          name={"HomeStack"}
          component={HomeStack}
          options={{
            ...options,
            tabBarIcon: ({ focused, size }) => (
              <TabIcon focused={focused}>
                <FontAwesome size={size} name={"home"} color={"#fff"} />
              </TabIcon>
            ),
          }}
        />
        <Tab.Screen
          name={"EncyclopediaStack"}
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
          name={"SettingsStack"}
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
