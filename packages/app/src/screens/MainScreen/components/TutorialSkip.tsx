import React from "react";
import { FontAwesome } from "@expo/vector-icons";

import { Button } from "../../../components/Button";
import { StyleSheet } from "react-native";
import { useTutorial } from "../TutorialContext";
import { useTranslate } from "../../../hooks/useTranslate";

export const TutorialSkip = () => {
  const { dispatch, steps } = useTutorial();
  const translate = useTranslate();

  const onSkip = () => {
    dispatch({ type: "skip", value: steps.length });
  };

  return (
    <Button style={styles.button} status={"basic"} onPress={onSkip}>
      <FontAwesome
        name="close"
        size={24}
        color="white"
        accessibilityLabel={translate("close")}
      />
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
