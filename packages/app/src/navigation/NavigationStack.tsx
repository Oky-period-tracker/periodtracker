import * as React from "react";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { Header } from "./components/Header";

const Stack = createNativeStackNavigator();

export type StackConfig = {
  initialRouteName: string;
  screens: {
    title: string;
    name: string;
    Component: (NativeStackScreenProps) => React.ReactElement;
  }[];
};

function NavigationStack({ config }) {
  return (
    <Stack.Navigator
      initialRouteName={config.initialRouteName}
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    >
      {config.screens.map(({ title, name, Component }) => (
        <Stack.Screen
          key={name}
          name={name}
          component={Component}
          options={{
            title,
          }}
        />
      ))}
    </Stack.Navigator>
  );
}

export default NavigationStack;
