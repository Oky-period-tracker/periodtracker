import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileStack from "./stacks/ProfileStack";
import HomeStack from "./stacks/HomeStack";
import EncyclopediaStack from "./stacks/EncyclopediaStack";
import SettingsStack from "./stacks/SettingsStack";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"HomeStack"}>
        <Stack.Screen name={"ProfileStack"} component={ProfileStack} />
        <Stack.Screen name={"HomeStack"} component={HomeStack} />
        <Stack.Screen
          name={"EncyclopediaStack"}
          component={EncyclopediaStack}
        />
        <Stack.Screen name={"SettingsStack"} component={SettingsStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
