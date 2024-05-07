import * as React from "react";
import { View, Text } from "react-native";
import { Button } from "../../components/Button";

function MainScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>MainScreen</Text>
      <Button onPress={() => navigation.navigate("CalendarScreen")}>
        Calendar
      </Button>
    </View>
  );
}

export default MainScreen;
