import * as React from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { IS_TABLET } from "./src/services/tablet";
import {
  OrientationLock,
  lockAsync,
  unlockAsync,
} from "expo-screen-orientation";

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

  return <RootNavigator />;
}

export default App;
