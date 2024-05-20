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
import { store, persistor } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";

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
        <PersistGate loading={null} persistor={persistor}>
          <Background>
            <RootNavigator />
          </Background>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
