import React from "react";
import LottieView from "lottie-react-native";
import { assets } from "../../assets";
import { useDayScroll } from "../../screens/MainScreen/DayScrollContext";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ProgressSection } from "./ProgressSection";
import { useSelector } from "react-redux";
import { currentAvatarSelector } from "../../redux/selectors";

export const Avatar = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const avatar = useSelector(currentAvatarSelector);
  const { diameter } = useDayScroll();

  // @ts-expect-error TODO:
  const source = assets.lottie.avatars[avatar];
  const lottieAspectRatio = source.w / source.h;
  const lottieWidth = diameter * 0.33 - 12;
  const lottieHeight = lottieWidth / lottieAspectRatio;

  return (
    <View style={styles.container}>
      <LottieView
        resizeMode="contain"
        style={[
          style,
          {
            width: lottieWidth,
            height: lottieHeight,
          },
        ]}
        source={source}
      />
      <ProgressSection />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
    position: "absolute",
    top: -52, // CircleProgress height
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
