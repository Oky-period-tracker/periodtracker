import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { PaletteStatus, palette } from "../config/theme";
import { translate } from "../translation";

export type CustomTextProps = RNTextProps & {
  status?: PaletteStatus;
  enableTranslate?: boolean;
};

export const Text: React.FC<CustomTextProps> = ({
  children,
  status = "basic",
  style,
  enableTranslate = true,
  ...props
}) => {
  const color = palette[status].text;

  const getContent = () => {
    if (enableTranslate && typeof children === "string") {
      return translate(children);
    }
    return children;
  };

  return (
    <RNText style={[{ color, fontFamily: "Roboto-Medium" }, style]} {...props}>
      {getContent()}
    </RNText>
  );
};
