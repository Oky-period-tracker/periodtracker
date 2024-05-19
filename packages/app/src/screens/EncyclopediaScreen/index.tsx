import * as React from "react";
import { View } from "react-native";

import Accordion from "./components/Accordion";
import { Screen } from "../../components/Screen";
import { HelpCard } from "./components/HelpCard";
import { ScreenComponent } from "../../navigation/RootNavigator";

const EncyclopediaScreen: ScreenComponent<"Encyclopedia"> = ({
  navigation,
}) => {
  const goToHelpScreen = () => navigation.navigate("Help");

  return (
    <Screen>
      <HelpCard onPress={goToHelpScreen} />
      <Accordion />
    </Screen>
  );
};

export default EncyclopediaScreen;
