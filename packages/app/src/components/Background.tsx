import React from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { PropsWithChildren } from "react";
import { useSelector } from "../redux/useSelector";
import { currentThemeSelector } from "../redux/selectors";
import { getAsset } from "../services/asset";
import { ThemeName } from "../core/modules";
import { useTodayPrediction } from "../contexts/PredictionProvider";

export const Background = ({ children }: PropsWithChildren) => {
  const { onPeriod } = useTodayPrediction();
  const theme = useSelector(currentThemeSelector);
  const image = getBackgroundImage(theme, onPeriod);

  return (
    <ImageBackground source={image} style={styles.default}>
      {children}
    </ImageBackground>
  );
};

const getBackgroundImage = (theme: ThemeName, onPeriod: boolean) => {
  if (onPeriod) {
    return getAsset(`backgrounds.${theme}.onPeriod`);
  }
  return getAsset(`backgrounds.${theme}.default`);
};

const styles = StyleSheet.create({
  default: {
    width: "100%",
    height: "100%",
  },
});
