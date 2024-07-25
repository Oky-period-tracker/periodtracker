import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../Text";
import { useAvatarMessage } from "../../contexts/AvatarMessageContext";

export const AvatarMessage = () => {
  const { message } = useAvatarMessage();

  if (!message) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text enableTranslate={false}>{message}</Text>
      <View style={styles.triangle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 80,
    left: 120,
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 160,
    minHeight: 60,
    padding: 12,
    zIndex: 99999,
  },
  triangle: {
    borderTopWidth: 20,
    borderRightWidth: 16,
    borderTopColor: "#fff",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    position: "absolute",
    left: 16,
    bottom: -20,
  },
});
