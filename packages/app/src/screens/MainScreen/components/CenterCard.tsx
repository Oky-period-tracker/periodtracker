import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "../../../components/Text";
import { useScreenDimensions } from "../../../hooks/useScreenDimensions";
import { palette } from "../../../config/theme";

export const CenterCard = () => {
  const { width } = useScreenDimensions();

  return (
    <View
      style={[styles.container, { left: width / 2 - WIDTH - MARGIN_RIGHT }]}
    >
      <Text style={styles.number} status={"neutral"}>
        19
      </Text>
      <Text style={styles.text} status={"neutral"}>
        {`days to next period`}
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
    color: palette["neutral"].base,
    flex: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: palette["neutral"].base,
    flex: 1,
  },
});
