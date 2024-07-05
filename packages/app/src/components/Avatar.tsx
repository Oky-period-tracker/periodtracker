import React from "react";
import LottieView from "lottie-react-native";
import { assets } from "../assets";
import { useDayScroll } from "../screens/MainScreen/DayScrollContext";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

export const Avatar = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const { diameter } = useDayScroll();

  return (
    <LottieView
      resizeMode="contain"
      style={[
        styles.lottie,
        style,
        { width: diameter * 0.33 - 12, height: diameter * 0.8 },
      ]}
      source={assets.lottie.avatars["ari"]}
    />
  );
};

const styles = StyleSheet.create({
  lottie: {
    margin: 8,
    position: "absolute",
    top: -52, // CircleProgress height
  },
});
