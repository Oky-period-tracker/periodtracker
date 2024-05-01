import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccessScreen from "../../screens/AccessScreen";
import TermsScreen from "../../screens/TermsScreen";
import AboutScreen from "../../screens/AboutScreen";
import PrivacyScreen from "../../screens/PrivacyScreen";
import ContactUsScreen from "../../screens/ContactUsScreen";

const Stack = createNativeStackNavigator();

function SettingsStack() {
  return (
    <Stack.Navigator initialRouteName={"SettingsScreen"}>
      <Stack.Screen name={"AccessScreen"} component={AccessScreen} />
      <Stack.Screen name={"TermsScreen"} component={TermsScreen} />
      <Stack.Screen name={"AboutScreen"} component={AboutScreen} />
      <Stack.Screen name={"PrivacyScreen"} component={PrivacyScreen} />
      <Stack.Screen name={"ContactUsScreen"} component={ContactUsScreen} />
    </Stack.Navigator>
  );
}

export default SettingsStack;
