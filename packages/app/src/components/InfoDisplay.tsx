import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "./Text";
import { globalStyles } from "../config/theme";

export const InfoDisplay = ({
  content,
}: {
  content: {
    type: "HEADING" | "CONTENT";
    content: string;
  }[];
}) => {
  return (
    <View style={[styles.container, globalStyles.shadow]}>
      {content.map((item, i) => (
        <Text
          key={`info-${i}`}
          style={[styles.text, item.type === "HEADING" && styles.heading]}
          enableTranslate={false}
        >
          {item.content}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 4,
    marginBottom: 80,
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
