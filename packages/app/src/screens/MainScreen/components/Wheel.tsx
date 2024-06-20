import React from "react";
import { StyleSheet } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import Cloud from "../../../components/icons/Cloud";
import { IconButton } from "../../../components/IconButton";
import { useDayScroll } from "../DayScrollContext";
import { formatDayMonth } from "../../../services/utils";

export const Wheel = () => {
  const {
    data,
    //
    animatedWheelStyle,
    animatedButtonStyle,
    panWheelGesture,
    calculateButtonPosition,
    RADIUS,
    BUTTON_SIZE,
  } = useDayScroll();

  return (
    <GestureDetector gesture={panWheelGesture}>
      <Animated.View
        style={[
          styles.container,
          {
            width: RADIUS * 2,
            height: RADIUS * 2,
          },
          animatedWheelStyle,
        ]}
      >
        {data.map((item, i) => {
          const position = calculateButtonPosition(i);
          const text = formatDayMonth(item.date);

          return (
            <Animated.View
              key={`wheel-button-${i}`}
              style={[
                styles.button,
                {
                  width: BUTTON_SIZE,
                  height: BUTTON_SIZE,
                },
                position,
                animatedButtonStyle,
              ]}
            >
              <IconButton Icon={Cloud} size={BUTTON_SIZE} text={text} />
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
