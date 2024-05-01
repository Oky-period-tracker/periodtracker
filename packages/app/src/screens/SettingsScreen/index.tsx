import * as React from "react";
import { View, Text, Button } from "react-native";

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
        title="ContactUsScreen"
        onPress={() => navigation.navigate("ContactUsScreen")}
      />
    </View>
  );
}

export default SettingsScreen;
