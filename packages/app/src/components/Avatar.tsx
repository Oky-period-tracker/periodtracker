import React from "react";
import LottieView from "lottie-react-native";
import { assets } from "../assets";
import { useDayScroll } from "../screens/MainScreen/DayScrollContext";

export const Avatar = () => {
  const { diameter } = useDayScroll();

  return (
    <LottieView
      resizeMode="contain"
      style={{
        width: diameter * 0.33 - 12,
        height: diameter * 0.8,
        margin: 8,
        position: "absolute",
        top: -52, // CircleProgress height
      }}
      source={assets.lottie.avatars["ari"]}
    />
  );
};
