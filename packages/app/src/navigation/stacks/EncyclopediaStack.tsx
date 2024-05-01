import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EncyclopediaScreen from "../../screens/EncyclopediaScreen";
import ArticlesScreen from "../../screens/ArticlesScreen";
import FindHelpScreen from "../../screens/FindHelpScreen";
import VideoScreen from "../../screens/VideoScreen";

const Stack = createNativeStackNavigator();

function EncyclopediaStack() {
  return (
    <Stack.Navigator initialRouteName={"EncyclopediaScreen"}>
      <Stack.Screen
        name={"EncyclopediaScreen"}
        component={EncyclopediaScreen}
      />
      <Stack.Screen name={"ArticlesScreen"} component={ArticlesScreen} />
      <Stack.Screen name={"FindHelpScreen"} component={FindHelpScreen} />
      <Stack.Screen name={"VideoScreen"} component={VideoScreen} />
    </Stack.Navigator>
  );
}

export default EncyclopediaStack;
