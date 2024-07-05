import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../../../components/Text";
import { configForStep, useTutorial } from "../TutorialContext";
import { useScreenDimensions } from "../../../hooks/useScreenDimensions";

export const TutorialTextbox = () => {
  const { state, step } = useTutorial();
  const { width } = useScreenDimensions();

  if (!step || !state.isActive) {
    return null;
  }

  const { title, text } = configForStep[step];

  return (
    <View style={[styles.box, { width: width - 48 }]}>
      <Text style={styles.title} status={"primary"}>
        {title}
      </Text>
      <Text>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    position: "absolute",
    bottom: 12,
    borderRadius: 20,
    padding: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
