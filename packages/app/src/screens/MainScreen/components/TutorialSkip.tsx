import React from "react";
import { FontAwesome } from "@expo/vector-icons";

import { Button } from "../../../components/Button";
import { StyleSheet } from "react-native";
import { useTutorial } from "../TutorialContext";

export const TutorialSkip = () => {
  const { dispatch } = useTutorial();

  const onSkip = () => {
    dispatch({ type: "skip" });
  };

  return (
    <Button style={styles.button} status={"basic"} onPress={onSkip}>
      <FontAwesome name="close" size={24} color="white" />
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 60,
    right: 24,
    width: 32,
    height: 32,
    zIndex: 9999,
  },
});
