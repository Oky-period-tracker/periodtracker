import React from "react";
import { StyleSheet, TextProps } from "react-native";
import { Text } from "./Text";

export const ErrorText = ({ style, children, ...props }: TextProps) => {
  return (
    <Text style={[styles.error, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  error: {
    color: "#ff0000",
    fontSize: 10,
    textAlign: "center",
  },
});
