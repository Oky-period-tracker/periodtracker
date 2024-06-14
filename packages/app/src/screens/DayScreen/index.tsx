import * as React from "react";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { Screen } from "../../components/Screen";
import { DayTracker } from "./components/DayTracker";

const DayScreen: ScreenComponent<"Day"> = () => {
  return (
    <Screen>
      <DayTracker />
    </Screen>
  );
};

export default DayScreen;
