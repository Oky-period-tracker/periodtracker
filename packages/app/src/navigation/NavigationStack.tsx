import * as React from "react";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { Header } from "./components/Header";
import { recordToArray } from "../services/utils";

type ParamListBase = Record<string, undefined>;

export type CustomStackNavigationOptions = NativeStackNavigationOptions & {
  showBackButton?: boolean;
};

export type StackConfig<T extends ParamListBase> = {
  initialRouteName: string;
  screens: {
    [K in keyof T]: {
      title: string;
      component: (NativeStackScreenProps) => React.ReactElement;
    };
  };
};

const Stack = createNativeStackNavigator();

function NavigationStack({ config }: { config: StackConfig<ParamListBase> }) {
  return (
    <Stack.Navigator
      initialRouteName={config.initialRouteName}
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    >
      {recordToArray<StackConfig<ParamListBase>["screens"]>(config.screens).map(
        ([name, { title, component }]) => {
          const options: CustomStackNavigationOptions = {
            showBackButton: name !== config.initialRouteName,
            title,
          };
          return (
            <Stack.Screen
              key={name}
              name={name}
              component={component}
              options={options}
            />
          );
        }
      )}
    </Stack.Navigator>
  );
}

export default NavigationStack;
