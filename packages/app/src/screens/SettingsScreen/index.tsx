import * as React from "react";
import { View, Text } from "react-native";
import { Button } from "../../components/Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>SettingsScreen</Text>
      <Button
        title="AccessScreen"
        onPress={() => navigation.navigate("AccessScreen")}
      />
      <Button
        title="TermsScreen"
        onPress={() => navigation.navigate("TermsScreen")}
      />
      <Button
        title="AboutScreen"
        onPress={() => navigation.navigate("AboutScreen")}
      />
      <Button
        title="PrivacyScreen"
        onPress={() => navigation.navigate("PrivacyScreen")}
      />
      <Button
        style={{ width: 160 }}
        title="ContactUsScreen"
        onPress={() => navigation.navigate("ContactUsScreen")}
      />
      <Button style={{ width: 40, height: 40 }}>
        <FontAwesome size={20} name="user" color={"white"} />
      </Button>
    </View>
  );
}

export default SettingsScreen;
