import React from "react";
import { StyleSheet, View } from "react-native";

import { useTutorial } from "../TutorialContext";
import Cloud from "../../../components/icons/Cloud";
import { Text } from "../../../components/Text";
import { DatePicker } from "../../../components/DatePicker";
import { NotesCard } from "../../DayScreen/components/DayTracker/NotesCard";
import { useScreenDimensions } from "../../../hooks/useScreenDimensions";
import { EmojiQuestionCard } from "../../DayScreen/components/DayTracker/EmojiQuestionCard";

export const TutorialFeature = () => {
  const { state, stepConfig } = useTutorial();

  if (!state.isPlaying || !stepConfig || !stepConfig.feature) {
    return null;
  }

  const Feature = stepConfig.feature;

  return <Feature />;
};

export const CloudColors = () => {
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

export const CloudPrediction = () => {
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

export const CalendarFeature = () => {
  return (
    <View style={styles.calendarContainer}>
      <DatePicker
        selectedDate={new Date()}
        onDayPress={() => {
          //
        }}
      />
    </View>
  );
};

export const ActivityCardFeature = () => {
  const { width } = useScreenDimensions();

  const aspectRatio = 0.75;
  const w = width - 60 - 24 - 24 - 24;
  const h = w / aspectRatio;

  return (
    <View style={[styles.notesCard, { width: w, height: h }]}>
      <EmojiQuestionCard topic={"activity"} size={"small"} />
    </View>
  );
};

export const NotesFeature = () => {
  const { width } = useScreenDimensions();

  const aspectRatio = 0.75;
  const w = width - 60 - 24 - 24 - 24;
  const h = w / aspectRatio;

  return (
    <View style={[styles.notesCard, { width: w, height: h }]}>
      <NotesCard />
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
  calendarContainer: {
    position: "absolute",
    top: 80,
  },
  notesCard: {
    position: "absolute",
    top: 80,
    left: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 20,
    overflow: "hidden",
    width: "100%",
  },
});
