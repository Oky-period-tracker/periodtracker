import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "../../screens/MainScreen";
import DayScreen from "../../screens/DayScreen";
import Calendar from "../../screens/Calendar";
import TutorialFirstScreen from "../../screens/TutorialFirstScreen";
import TutorialSecondScreen from "../../screens/TutorialSecondScreen";

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName={"MainScreen"}>
      <Stack.Screen name={"MainScreen"} component={MainScreen} />
      <Stack.Screen name={"DayScreen"} component={DayScreen} />
      <Stack.Screen name={"Calendar"} component={Calendar} />
      <Stack.Screen
        name={"TutorialFirstScreen"}
        component={TutorialFirstScreen}
      />
      <Stack.Screen
        name={"TutorialSecondScreen"}
        component={TutorialSecondScreen}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
