import React from "react";
import {
  Appearance,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { SvgIconProps } from "./icons/types";
import { ThemeName } from "../core/modules";
import Cloud from "./icons/Cloud";
import { CloudOutline } from "./icons/CloudOutline";
import { StarOutline } from "./icons/StarOutline";
import { CircleOutline } from "./icons/CircleOutline";
import { Star } from "./icons/Star";
import { Circle } from "./icons/Circle";
import { useSelector } from "react-redux";
import { currentThemeSelector } from "../redux/selectors";
import { palette } from "../config/theme";

export type Appearance = "fill" | "outline";

type IconButtonProps = SvgIconProps & {
  appearance?: Appearance;
  onPress?: () => void;
  text?: string;
  textStyle?: TextStyle;
  disabled?: boolean;
};

// @ts-expect-error TODO:
const IconForTheme: Record<
  ThemeName,
  Record<Appearance, React.FC<SvgIconProps>>
> = {
  hills: {
    fill: Cloud,
    outline: CloudOutline,
  },
  mosaic: {
    fill: Star,
    outline: StarOutline,
  },
  village: {
    fill: Cloud,
    outline: CloudOutline,
  },
  desert: {
    fill: Circle,
    outline: CircleOutline,
  },
};

export const IconButton = ({
  appearance = "fill",
  status = "neutral",
  style,
  text,
  textStyle,
  size = 80,
  onPress,
  disabled,
}: IconButtonProps) => {
  const theme = useSelector(currentThemeSelector);
  const Icon = IconForTheme?.[theme]?.[appearance] ?? Cloud;

  return (
    <TouchableOpacity
      style={[styles.button, { width: size, height: size }, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Icon status={status} style={styles.icon} />
      <Text
        style={[
          styles.text,
          textStyle,
          appearance === "outline" && { color: palette[status].base },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  text: {
    width: "60%",
    textAlign: "center",
    fontWeight: "bold",
    marginRight: 8,
    color: "#fff",
  },
});
