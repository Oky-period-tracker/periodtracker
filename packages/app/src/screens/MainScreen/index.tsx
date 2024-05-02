import * as React from "react";
import { View, Text } from "react-native";
import { Button } from "../../components/Button";

function MainScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>MainScreen</Text>
      <Button
        title="SettingsStack"
        onPress={() => navigation.navigate("SettingsStack")}
      />
      <Button
        title="TermsScreen"
        onPress={() => navigation.navigate("TermsScreen")}
      />
      <Button
        title="DayScreen"
        onPress={() => navigation.navigate("DayScreen")}
      />
      <Button
        title="Calendar"
        onPress={() => navigation.navigate("Calendar")}
      />
    </View>
  );
}

export default MainScreen;
