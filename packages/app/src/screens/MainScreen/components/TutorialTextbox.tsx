import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../../../components/Text";
import { useTutorial } from "../TutorialContext";
import { useScreenDimensions } from "../../../hooks/useScreenDimensions";
import { globalStyles } from "../../../config/theme";

export const TutorialTextbox = () => {
  const { state, stepConfig } = useTutorial();
  const { width } = useScreenDimensions();

  if (!stepConfig || !state.isPlaying) {
    return null;
  }

  const { title, text, textBoxTop } = stepConfig;

  return (
    <View
      style={[
        styles.box,
        globalStyles.shadow,
        { width: width - 48 },
        textBoxTop && styles.top,
      ]}
    >
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
  top: {
    bottom: undefined,
    top: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
