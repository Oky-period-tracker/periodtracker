import * as React from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Background } from "./src/components/Background";
import { Provider } from "react-redux";
import { store, persistor } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { useOrientationLock } from "./src/hooks/useOrientationLock";

function App() {
  useOrientationLock();

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
