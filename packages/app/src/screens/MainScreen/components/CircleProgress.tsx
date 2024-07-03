import React from "react";
import { StyleSheet } from "react-native";
import { Button, ButtonProps } from "../../../components/Button";
import { Text } from "../../../components/Text";
import { useTodayPrediction } from "../../../contexts/PredictionProvider";
import PieChart from "react-native-pie-chart";

export const CircleProgress = ({
  size = 52,
  onPress,
}: ButtonProps & { size?: number }) => {
  const { cycleDay, cycleLength } = useTodayPrediction();
  const series = [cycleDay, cycleLength - cycleDay];

  return (
    <Button
      onPress={onPress}
      status={"secondary"}
      style={{
        width: size,
        height: size,
      }}
    >
      <PieChart
        widthAndHeight={size}
        series={series}
        sliceColor={sliceColor}
        style={styles.pie}
      />
      <Text style={styles.numberText}>
        {cycleLength === 100 ? "-" : cycleLength}
      </Text>
      <Text>days</Text>
    </Button>
  );
};

const sliceColor = ["#fff", "transparent"];

const styles = StyleSheet.create({
  numberText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pie: {
    position: "absolute",
    opacity: 0.5,
  },
});
