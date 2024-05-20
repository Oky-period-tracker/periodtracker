import * as React from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { IS_TABLET, IS_WEB } from "./src/services/device";
import {
  OrientationLock,
  lockAsync,
  unlockAsync,
} from "expo-screen-orientation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Background } from "./src/components/Background";
import { Provider } from "react-redux";
import store from "./src/redux/store";

function App() {
  React.useEffect(() => {
    if (IS_TABLET || IS_WEB) {
      return;
    }

    lockAsync(OrientationLock.PORTRAIT_UP);

    return () => {
      unlockAsync();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <Background>
          <RootNavigator />
        </Background>
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
