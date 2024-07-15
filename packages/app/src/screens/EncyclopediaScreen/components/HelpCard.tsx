import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { Text } from "../../../components/Text";

export const HelpCard = ({ ...props }: TouchableOpacityProps) => {
  return (
    <TouchableOpacity style={styles.helpCard} {...props}>
      <Text>Find Help</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  helpCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 200,
    height: 100,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
