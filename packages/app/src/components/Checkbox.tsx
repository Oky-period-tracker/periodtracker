import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "./Button";
import { Text } from "./Text";
import { PaletteStatus } from "../config/theme";


type CheckboxProps = {
  label: string;
  checked: boolean;
  onPress: () => void;
  checkedStatus?: PaletteStatus;
  checkedTextStatus?: PaletteStatus;
};

export const Checkbox = ({
  label,
  checked,
  onPress,
  checkedStatus = "primary",
  checkedTextStatus = "basic",
}: CheckboxProps) => {
  return (
    <View style={styles.container}>
      <Button
        onPress={onPress}
        status={checked ? checkedStatus : "basic"}
        style={styles.checkBox}
      ></Button>
      <Text style={styles.label} status={checked ? checkedTextStatus : "basic"}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },
  checkBox: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  label: {
    fontWeight: "bold",
  },
});
