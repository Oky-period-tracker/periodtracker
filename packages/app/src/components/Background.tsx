import {
  ImageBackground,
  ImageBackgroundProps,
  StyleSheet,
  View,
} from "react-native";
import { assets } from "../assets";
import { PropsWithChildren } from "react";

export const Background = ({ children }: PropsWithChildren) => {
  const image = assets.backgrounds.hills.default;

  return (
    <ImageBackground source={image} style={styles.default}>
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  default: {
    width: "100%",
    height: "100%",
  },
});
