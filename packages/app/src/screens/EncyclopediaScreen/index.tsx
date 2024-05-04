import * as React from "react";
import { View } from "react-native";

import Accordion from "./components/Accordion";

function EncyclopediaScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "red",
        padding: 12,
      }}
    >
      <Accordion />
    </View>
  );
}

export default EncyclopediaScreen;
