import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import { PaletteStatus, palette } from "../config/theme";
import { Appearance } from "./IconButton";

export type ButtonProps = ViewProps & {
  onPress?: () => void;
  status?: PaletteStatus;
  appearance?: Appearance;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
};

export const Button = ({
  style,
  onPress,
  status = "primary",
  appearance = "fill",
  ...props
}: ButtonProps) => {
  const colors = palette[status];

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.base }, style]}
      onPress={onPress}
      {...props}
    >
      <ButtonInner status={status} appearance={appearance} {...props} />
    </TouchableOpacity>
  );
};

export const DisplayButton = ({
  style,
  status = "primary",
  ...props
}: ButtonProps) => {
  const colors = palette[status];

  return (
    <View
      style={[styles.container, { backgroundColor: colors.base }, style]}
      {...props}
    >
      <ButtonInner status={status} {...props} />
    </View>
  );
};

const ButtonInner = ({
  status = "primary",
  appearance = "fill",
  textStyle,
  ...props
}: ButtonProps) => {
  const colors = palette[status];

  const children = props.children ? (
    typeof props.children === "string" ? (
      <Text
        style={[
          styles.text,
          textStyle,
          appearance === "outline" && { color: colors.base },
        ]}
      >
        {props.children}
      </Text>
    ) : (
      props.children
    )
  ) : null;

  if (appearance === "outline") {
    return (
      <View
        style={[
          styles.outline,
          {
            backgroundColor: "#fff",
            borderColor: colors.base,
          },
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <>
      <View style={[styles.shadow, { backgroundColor: colors.shadow }]} />
      <View style={[styles.highlight, { backgroundColor: colors.highlight }]} />
      <View style={[styles.body, { backgroundColor: colors.base }]}>
        {children}
      </View>
    </>
  );
};

const offset = 2;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 100,
    borderRadius: 500,
    margin: offset,
  },
  highlight: {
    position: "absolute",
    top: -offset,
    left: -offset,
    width: "100%",
    height: "100%",
    borderRadius: 500,
    backgroundColor: "#fff",
  },
  shadow: {
    position: "absolute",
    bottom: -offset,
    left: -offset,
    width: "100%",
    height: "100%",
    borderRadius: 500,
  },
  body: {
    margin: "auto",
    width: "100%",
    height: "100%",
    borderRadius: 500,
    justifyContent: "center",
    alignItems: "center",
    padding: offset,
    paddingRight: offset * 2,
  },
  text: {
    textAlign: "center",
  },
  outline: {
    margin: "auto",
    width: "100%",
    height: "100%",
    borderRadius: 500,
    justifyContent: "center",
    alignItems: "center",
    padding: offset,
    paddingRight: offset * 2,
    borderWidth: 1,
    borderLeftWidth: 4 + 1,
  },
});
