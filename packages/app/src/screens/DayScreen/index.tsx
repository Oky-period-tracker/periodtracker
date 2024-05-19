import * as React from "react";
import { View, Text } from "react-native";
import { ScreenComponent } from "../../navigation/RootNavigator";

const DayScreen: ScreenComponent<"Day"> = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>DayScreen</Text>
    </View>
  );
};

export default DayScreen;
