import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { DisplayButton } from "./Button";
import { Text } from "./Text";
import { PaletteStatus } from "../config/theme";

type CheckBoxSize = "small" | "medium";

type CheckboxProps = {
  label: string;
  checked: boolean;
  onPress: () => void;
  size?: CheckBoxSize;
  checkedStatus?: PaletteStatus;
  checkedTextStatus?: PaletteStatus;
};

export const Checkbox = ({
  label,
  checked,
  onPress,
  size = "medium",
  checkedStatus = "primary",
  checkedTextStatus = "basic",
}: CheckboxProps) => {
  const sizes = sizeValues[size];

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <DisplayButton
        status={checked ? checkedStatus : "basic"}
        style={[
          styles.checkBox,
          { width: sizes.checkBox, height: sizes.checkBox },
        ]}
      />
      <Text
        style={{ fontWeight: sizes.fontWeight }}
        status={checked ? checkedTextStatus : "basic"}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const sizeValues: Record<
  CheckBoxSize,
  {
    checkBox: number;
    fontWeight: "bold" | undefined;
  }
> = {
  small: {
    checkBox: 24,
    fontWeight: undefined,
  },
  medium: {
    checkBox: 32,
    fontWeight: "bold",
  },
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },
  checkBox: {
    marginRight: 12,
  },
});
