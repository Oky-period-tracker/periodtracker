import * as React from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { IS_TABLET } from "./src/services/tablet";
import {
  OrientationLock,
  lockAsync,
  unlockAsync,
} from "expo-screen-orientation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Background } from "./src/components/Background";

function App() {
  React.useEffect(() => {
    if (IS_TABLET) {
      return;
    }

    lockAsync(OrientationLock.PORTRAIT_UP);

    return () => {
      unlockAsync();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <Background>
        <RootNavigator />
      </Background>
    </SafeAreaProvider>
  );
}

export default App;
