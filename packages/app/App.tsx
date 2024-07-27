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
import { PredictionProvider } from "./src/contexts/PredictionProvider";
import { AuthProvider } from "./src/contexts/AuthContext";
import { LoadingProvider } from "./src/contexts/LoadingProvider";
import { StatusBar } from "react-native";
import analytics from "@react-native-firebase/analytics";
import Constants from "expo-constants";

function App() {
  useOrientationLock();

  React.useEffect(() => {
    if (Constants.appOwnership === null) {
      import("./firebase/firebase")
        .then(() => {
          analytics()
            .logAppOpen()
            .then(() => {
              console.log("Firebase initialized");
            });
        })
        .catch((error) => {
          console.error("Firebase initialization error:", error);
        });
    }
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AuthProvider>
              <PredictionProvider>
                <ResponsiveProvider>
                  <EncyclopediaProvider>
                    <Background>
                      <LoadingProvider>
                        <StatusBar hidden />
                        <RootNavigator />
                      </LoadingProvider>
                    </Background>
                  </EncyclopediaProvider>
                </ResponsiveProvider>
              </PredictionProvider>
            </AuthProvider>
          </PersistGate>
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default App;
