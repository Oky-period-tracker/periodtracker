import React from "react";
import { StyleSheet } from "react-native";
import { Text , CustomTextProps } from "./Text";

export const ErrorText = ({ style, children, ...props }: CustomTextProps) => {
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
