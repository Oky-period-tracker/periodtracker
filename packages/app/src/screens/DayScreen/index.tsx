import * as React from "react";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { Quiz } from "./component/Quiz";
import { Screen } from "../../components/Screen";

const DayScreen: ScreenComponent<"Day"> = () => {
  return (
    <Screen>
      <Quiz />
    </Screen>
  );
};

export default DayScreen;
