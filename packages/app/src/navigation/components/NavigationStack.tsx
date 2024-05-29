import * as React from "react";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { Header } from "./Header";
import { recordToArray } from "../../services/utils";
import { GlobalParamList, ScreenComponent } from "../RootNavigator";

export type CustomStackNavigationOptions = NativeStackNavigationOptions & {
  name?: string;
  initialRouteName?: string;
};

export type StackConfig<T extends keyof GlobalParamList> = {
  initialRouteName: T;
  screens: {
    [K in T]: {
      title: string;
      component: ScreenComponent<K>;
    };
  };
};

const Stack = createNativeStackNavigator();

function NavigationStack<T extends keyof GlobalParamList>({
  config,
}: {
  config: StackConfig<T>;
}) {
  const { initialRouteName } = config;

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        header: (props) => <Header {...props} />,
        animation: "none",
      }}
    >
      {recordToArray<StackConfig<T>["screens"]>(config.screens).map(
        ([name, { title, component }]) => {
          const options: CustomStackNavigationOptions = {
            name,
            title,
            initialRouteName,
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
