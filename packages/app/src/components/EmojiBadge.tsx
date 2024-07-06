import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Button, ButtonProps } from "./Button";

export type BadgeSize = "tiny" | "small" | "medium" | "large";

type EmojiBadgeProps = {
  emoji: string;
  text: string;
  onPress?: () => void;
  style?: ViewStyle;
  status?: ButtonProps["status"];
  size?: BadgeSize;
  disabled?: boolean;
};

export const EmojiBadge = ({
  emoji,
  text,
  onPress,
  style,
  status,
  size = "medium",
  disabled,
}: EmojiBadgeProps) => {
  const dimensions = sizes[size];

  return (
    <View style={[styles.container, { width: dimensions.container }, style]}>
      <Button
        style={{
          width: dimensions.circle,
          height: dimensions.circle,
          marginBottom: dimensions.margin,
        }}
        status={status}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={{ fontSize: dimensions.emoji }}>{emoji}</Text>
      </Button>
      <Text style={[styles.text, { fontSize: dimensions.text }]}>{text}</Text>
    </View>
  );
};

const sizes: Record<
  BadgeSize,
  {
    container: number;
    circle: number;
    emoji: number;
    text: number;
    margin: number;
  }
> = {
  tiny: {
    container: 36,
    circle: 20,
    emoji: 10,
    text: 8,
    margin: 0,
  },
  small: {
    container: 48,
    circle: 28,
    emoji: 14,
    text: 10,
    margin: 2,
  },
  medium: {
    container: 52,
    circle: 36,
    emoji: 16,
    text: 12,
    margin: 4,
  },
  large: {
    container: 60,
    circle: 44,
    emoji: 22,
    text: 12,
    margin: 8,
  },
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
});
