import { StyleSheet, Text, View } from "react-native";
import { ButtonProps, DisplayButton } from "./Button";

type BadgeSize = "small" | "medium";

type EmojiBadgeProps = {
  emoji: string;
  text: string;
  status?: ButtonProps["status"];
  size?: BadgeSize;
};

export const EmojiBadge = ({
  emoji,
  text,
  status,
  size = "medium",
}: EmojiBadgeProps) => {
  const dimensions = sizes[size];

  return (
    <View>
      <DisplayButton
        style={{ width: dimensions.circle, height: dimensions.circle }}
        status={status}
      >
        <Text style={{ fontSize: dimensions.emoji }}>{emoji}</Text>
      </DisplayButton>
      <Text style={[styles.text, { fontSize: dimensions.text }]}>{text}</Text>
    </View>
  );
};

const sizes: Record<
  BadgeSize,
  {
    circle: number;
    emoji: number;
    text: number;
  }
> = {
  small: {
    circle: 28,
    emoji: 14,
    text: 10,
  },
  medium: {
    circle: 32,
    emoji: 16,
    text: 12,
  },
};

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
  },
});
