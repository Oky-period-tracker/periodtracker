import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import ProfileStack from "./stacks/ProfileStack";
import HomeStack from "./stacks/HomeStack";
import EncyclopediaStack from "./stacks/EncyclopediaStack";
import SettingsStack from "./stacks/SettingsStack";
import { UntouchableButton } from "../components/Button";

const Tab = createBottomTabNavigator();

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

const TabIcon = ({
  focused,
  children,
}: {
  children: React.ReactNode;
  focused: boolean;
}) => {
  return (
    <UntouchableButton
      status={focused ? "primary" : "secondary"}
      style={{ width: 40, height: 40 }}
    >
      {children}
    </UntouchableButton>
  );
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
