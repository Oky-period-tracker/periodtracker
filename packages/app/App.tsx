import "react-native-get-random-values";
import * as React from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Background } from "./src/components/Background";
import { Provider } from "react-redux";
import { store, persistor } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { useOrientationLock } from "./src/hooks/useOrientationLock";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { EncyclopediaProvider } from "./src/screens/EncyclopediaScreen/EncyclopediaContext";
import { ResponsiveProvider } from "./src/contexts/ResponsiveContext";

function App() {
  useOrientationLock();

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Background>
              <ResponsiveProvider>
                <EncyclopediaProvider>
                  <RootNavigator />
                </EncyclopediaProvider>
              </ResponsiveProvider>
            </Background>
          </PersistGate>
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default App;
