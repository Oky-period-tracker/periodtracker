import * as React from "react";
import { ScreenComponent } from "../../navigation/RootNavigator";
import { Screen } from "../../components/Screen";
import { DayTracker } from "./components/DayTracker";
import { Survey } from "./components/Survey";
import { SurveyProvider } from "./components/Survey/SurveyContext";

const DayScreen: ScreenComponent<"Day"> = (props) => {
  // TODO: get survey from redux
  const hasSurvey = false;

  return (
    <Screen>
      {hasSurvey ? (
        <SurveyProvider>
          <Survey {...props} />
        </SurveyProvider>
      ) : (
        <DayTracker {...props} />
      )}
    </Screen>
  );
};

export default DayScreen;
