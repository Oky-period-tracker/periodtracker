import * as React from "react";
import { View, Text, Button } from "react-native";

function ContactUsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>ContactUsScreen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}

export default ContactUsScreen;
