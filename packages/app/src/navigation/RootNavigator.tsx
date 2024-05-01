import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import ProfileStack from "./stacks/ProfileStack";
import HomeStack from "./stacks/HomeStack";
import EncyclopediaStack from "./stacks/EncyclopediaStack";
import SettingsStack from "./stacks/SettingsStack";

const Tab = createBottomTabNavigator();

const options = {
  tabBarShowLabel: false,
  headerShown: false,
};

function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName={"HomeStack"}>
        <Tab.Screen
          name={"ProfileStack"}
          component={ProfileStack}
          options={{
            ...options,
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="user" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name={"HomeStack"}
          component={HomeStack}
          options={{
            ...options,
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name={"EncyclopediaStack"}
          component={EncyclopediaStack}
          options={{
            ...options,
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="book" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name={"SettingsStack"}
          component={SettingsStack}
          options={{
            ...options,
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="gear" color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
