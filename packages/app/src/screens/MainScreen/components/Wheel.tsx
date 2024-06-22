import React from "react";
import { StyleSheet } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import Cloud from "../../../components/icons/Cloud";
import { IconButton } from "../../../components/IconButton";
import { useDayScroll } from "../DayScrollContext";
import { formatMomentDayMonth } from "../../../services/utils";

export const Wheel = () => {
  const {
    data,
    constants,
    calculateButtonPosition,
    wheelPanGesture,
    wheelAnimatedStyle,
    wheelButtonAnimatedStyle,
  } = useDayScroll();

  return (
    <GestureDetector gesture={wheelPanGesture}>
      <Animated.View style={[styles.container, wheelAnimatedStyle]}>
        {data.map((item, i) => {
          const position = calculateButtonPosition(i);
          const text = formatMomentDayMonth(item.date);

          return (
            <Animated.View
              key={`wheel-button-${i}`}
              style={[styles.button, position, wheelButtonAnimatedStyle]}
            >
              <IconButton
                size={constants.BUTTON_SIZE}
                Icon={Cloud}
                text={text}
              />
            </Animated.View>
          );
        })}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
