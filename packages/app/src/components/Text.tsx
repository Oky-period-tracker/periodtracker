import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { PaletteStatus, palette } from "../config/theme";

type TextProps = RNTextProps & {
  status?: PaletteStatus;
};

export const Text = ({ status = "basic", style, ...props }: TextProps) => {
  const color = palette[status].text;

  return <RNText style={[{ color }, style]} {...props} />;
};
