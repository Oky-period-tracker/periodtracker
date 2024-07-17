import React from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { PropsWithChildren } from "react";
import { useSelector } from "../redux/useSelector";
import { currentThemeSelector } from "../redux/selectors";
import { getAsset } from "../services/asset";

export const Background = ({ children }: PropsWithChildren) => {
  const theme = useSelector(currentThemeSelector);
  const image = getAsset(`backgrounds.${theme}.default`);

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
