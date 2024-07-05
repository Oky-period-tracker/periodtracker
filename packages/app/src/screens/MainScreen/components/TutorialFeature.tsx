import React from "react";
import { StyleSheet, View } from "react-native";

import { useTutorial } from "../TutorialContext";
import Cloud from "../../../components/icons/Cloud";
import { Text } from "../../../components/Text";

export const TutorialFeature = () => {
  const { state, step } = useTutorial();

  if (!step || !state.isActive) {
    return null;
  }

  if (step === "colors") {
    return <CloudColors />;
  }

  if (["verify", "predicted", "period", "no_period"].includes(step)) {
    return <CloudPrediction />;
  }

  return null;
};

const CloudColors = () => {
  return (
    <View style={styles.clouds}>
      <View style={styles.cloudColumn}>
        <Text style={styles.cloudText}>Period Day</Text>
        <Cloud status={"danger"} />
      </View>

      <View style={styles.cloudColumn}>
        <Text style={styles.cloudText}>Period Day</Text>
        <Cloud status={"tertiary"} />
      </View>

      <View style={styles.cloudColumn}>
        <Text style={styles.cloudText}>Period Day</Text>
        <Cloud status={"neutral"} />
      </View>
    </View>
  );
};

const CloudPrediction = () => {
  return (
    <View style={styles.clouds}>
      <View style={styles.cloudColumn}>
        <Text style={styles.cloudText}>Period Day</Text>
        <Cloud status={"basic"} />
      </View>

      <View style={styles.cloudColumn}>
        <Text style={styles.cloudText}>Period Day</Text>
        <Cloud status={"danger"} />
      </View>

      <View style={styles.cloudColumn}>
        <Text style={styles.cloudText}>Period Day</Text>
        <Cloud status={"neutral"} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  clouds: {
    position: "absolute",
    top: 0,
    flexDirection: "row",
  },
  cloudColumn: {
    margin: 8,
    flexDirection: "column",
    alignItems: "center",
  },
  cloudText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});
