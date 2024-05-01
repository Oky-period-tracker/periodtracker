import * as React from "react";
import { View, Text, Button } from "react-native";

function AboutScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>AboutScreen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}

export default AboutScreen;
