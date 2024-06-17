import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const InfoDisplay = ({
  content,
}: {
  content: {
    type: "HEADING" | "CONTENT";
    content: string;
  }[];
}) => {
  return (
    <View style={styles.container}>
      {content.map((item, i) => (
        <Text
          key={`info-${i}`}
          style={[styles.text, item.type === "HEADING" && styles.heading]}
        >
          {item.content}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    marginVertical: 4,
    padding: 24,
  },
  text: {
    marginBottom: 8,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
