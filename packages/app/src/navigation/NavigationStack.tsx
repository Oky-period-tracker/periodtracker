import * as React from "react";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { Header } from "./components/Header";
import { recordToArray } from "../services/utils";

const Stack = createNativeStackNavigator();

type ParamListBase = Record<string, undefined>;

export type StackConfig<T extends ParamListBase> = {
  initialRouteName: string;
  screens: {
    [K in keyof T]: {
      title: string;
      component: (NativeStackScreenProps) => React.ReactElement;
    };
  };
};

function NavigationStack({ config }: { config: StackConfig<ParamListBase> }) {
  return (
    <Stack.Navigator
      initialRouteName={config.initialRouteName}
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    >
      {recordToArray<StackConfig<ParamListBase>["screens"]>(config.screens).map(
        ([name, { title, component }]) => (
          <Stack.Screen
            key={name}
            name={name}
            component={component}
            options={{
              title,
            }}
          />
        )
      )}
    </Stack.Navigator>
  );
}

export default NavigationStack;
