import * as React from "react";
import { View } from "react-native";

import Accordion from "./components/Accordion";
import { Screen } from "../../components/Screen";

function EncyclopediaScreen({ navigation }) {
  return (
    <Screen>
      <Accordion />
    </Screen>
  );
}

export default EncyclopediaScreen;
