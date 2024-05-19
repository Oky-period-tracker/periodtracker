import { StyleSheet, View } from "react-native";
import { Button } from "./Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";

export const Switch = () => {
  const [isSwitchedOn, setIsSwitchedOn] = React.useState(true);
  const onYesPress = () => setIsSwitchedOn(true);
  const onNoPress = () => setIsSwitchedOn(false);
  // TODO: update redux

  return (
    <View style={styles.container}>
      <Button
        status={isSwitchedOn ? "primary" : "basic"}
        style={styles.iconContainer}
        onPress={onYesPress}
      >
        <FontAwesome size={20} name={"check"} color={"#fff"} />
      </Button>
      <Button
        status={!isSwitchedOn ? "danger" : "basic"}
        style={styles.iconContainer}
        onPress={onNoPress}
      >
        <FontAwesome size={20} name={"close"} color={"#fff"} />
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    margin: 4,
  },
});
