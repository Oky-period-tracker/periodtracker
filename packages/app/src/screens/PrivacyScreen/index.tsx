import * as React from "react";
import { View, Text, Button } from "react-native";

function PrivacyScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>PrivacyScreen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}

export default PrivacyScreen;
