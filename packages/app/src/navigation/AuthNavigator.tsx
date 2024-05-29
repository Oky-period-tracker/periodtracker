import * as React from "react";
import { NavigatorScreenParams } from "@react-navigation/native";

import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import AuthScreen from "../screens/AuthScreen";
import EncyclopediaStack, {
  EncyclopediaStackParamList,
} from "./stacks/EncyclopediaStack";
import InfoScreen from "../screens/InfoScreen";

export type AuthStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  Info: undefined;
  encyclopedia: NavigatorScreenParams<EncyclopediaStackParamList>;
};

const options: NativeStackNavigationOptions = {
  headerShown: false,
};

const Stack = createNativeStackNavigator();

function AuthNavigator() {
  const hasOpenedApp = true; // TODO:
  const initialRouteName = hasOpenedApp ? "Auth" : "Welcome";

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        animation: "none",
      }}
    >
      <Stack.Screen name={"Welcome"} component={AuthScreen} options={options} />
      <Stack.Screen name={"Auth"} component={AuthScreen} options={options} />
      <Stack.Screen name={"Info"} component={InfoScreen} options={options} />
      <Stack.Screen
        // TODO: display back button
        name={"encyclopedia"}
        component={EncyclopediaStack}
        options={options}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
