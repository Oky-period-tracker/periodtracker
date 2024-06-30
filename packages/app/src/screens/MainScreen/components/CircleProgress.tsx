import React from "react";
import { StyleSheet } from "react-native";
import { Button, ButtonProps } from "../../../components/Button";
import { Text } from "../../../components/Text";
import { useTodayPrediction } from "../../../contexts/PredictionProvider";

export const CircleProgress = ({ onPress }: ButtonProps) => {
  const { cycleLength } = useTodayPrediction();

  return (
    <Button status={"secondary"} style={styles.button} onPress={onPress}>
      <Text style={styles.numberText}>
        {cycleLength === 100 ? "-" : cycleLength}
      </Text>
      <Text style={styles.dayText}>days</Text>
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 52,
    height: 52,
  },
  numberText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dayText: {},
});
