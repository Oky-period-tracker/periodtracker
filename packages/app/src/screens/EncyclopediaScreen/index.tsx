import * as React from "react";
import { View } from "react-native";

import Accordion from "./components/Accordion";
import { Screen } from "../../components/Screen";
import { HelpCard } from "./components/HelpCard";

function EncyclopediaScreen({ navigation }) {
  const goToHelpScreen = () => navigation.navigate("Help");

  return (
    <Screen>
      <HelpCard onPress={goToHelpScreen} />
      <Accordion />
    </Screen>
  );
}

export default EncyclopediaScreen;
