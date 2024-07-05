import * as React from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { Text } from "../../../components/Text";
import { useScreenDimensions } from "../../../hooks/useScreenDimensions";
import { useTodayPrediction } from "../../../contexts/PredictionProvider";
import { useDayStatus } from "../../../hooks/useDayStatus";

export const CenterCard = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const { width } = useScreenDimensions();
  const todaysInfo = useTodayPrediction();
  const status = useDayStatus(todaysInfo);

  return (
    <View
      style={[
        styles.container,
        { left: width / 2 - WIDTH - MARGIN_RIGHT },
        style,
      ]}
    >
      <Text style={styles.number} status={status}>
        {todaysInfo.onPeriod
          ? todaysInfo.daysLeftOnPeriod
          : todaysInfo.daysUntilNextPeriod}
      </Text>
      <Text style={styles.text} status={status}>
        {todaysInfo.onPeriod ? "days left" : "days to go"}
      </Text>
    </View>
  );
};

const WIDTH = 120;
const MARGIN_RIGHT = 8;

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: 80,
    backgroundColor: "#FFF",
    position: "absolute",
    borderRadius: 12,
    flexDirection: "row",
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
});
