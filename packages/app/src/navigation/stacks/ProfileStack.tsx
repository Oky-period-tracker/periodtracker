import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../../screens/ProfileScreen";
import AvatarAndThemeScreen from "../../screens/AvatarAndThemeScreen";
import SettingsStack from "./SettingsStack";

const Stack = createNativeStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator initialRouteName={"ProfileScreen"}>
      <Stack.Screen name={"ProfileScreen"} component={ProfileScreen} />
      <Stack.Screen
        name={"AvatarAndThemeScreen"}
        component={AvatarAndThemeScreen}
      />
      <Stack.Screen name={"SettingsStack"} component={SettingsStack} />
    </Stack.Navigator>
  );
}

export default ProfileStack;
