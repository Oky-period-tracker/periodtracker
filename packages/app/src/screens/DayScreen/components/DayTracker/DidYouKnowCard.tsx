import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const DidYouKnowCard = () => {
  // TODO: Get random DYK entry from redux
  const item = {
    id: "4416e050-d4d5-4313-a268-410410021668",
    isAgeRestricted: false,
    title: "Menstruation and menstrual cycle",
    content:
      "In regular cycles, ovulation happens 10–15 days before your next period. 📆",
    live: true,
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Did you know?</Text>
      <Text>Learn a new fact about your body every day!</Text>
      <View style={styles.body}>
        <Text style={styles.content}>{item.content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    padding: 24,
  },
  button: {
    marginLeft: "auto",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F49200",
    marginBottom: 24,
  },
  body: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E3629B",
    marginBottom: 24,
    textAlign: "center",
  },
});
