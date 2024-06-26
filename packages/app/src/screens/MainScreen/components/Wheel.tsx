import React from "react";
import { StyleSheet } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
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
    rotationAngle,
    selectedIndex,
    selectedScale,
  } = useDayScroll();

  const { BUTTON_SIZE } = constants;

  return (
    <GestureDetector gesture={wheelPanGesture}>
      <Animated.View style={[styles.container, wheelAnimatedStyle]}>
        {data.map((item, index) => {
          const position = calculateButtonPosition(index);
          const text = formatMomentDayMonth(item.date);

          const wheelButtonAnimatedStyle = useAnimatedStyle(() => {
            if (
              rotationAngle === null ||
              selectedScale === null ||
              selectedIndex === null
            ) {
              return {};
            }

            const isSelected = index === selectedIndex.value;
            const scale = isSelected ? selectedScale.value : 1;

            return {
              // Buttons counter rotate to stay level
              transform: [{ rotate: `${-rotationAngle.value}rad` }, { scale }],
              width: BUTTON_SIZE,
              height: BUTTON_SIZE,
            };
          });

          return (
            <Animated.View
              key={`wheel-button-${index}`}
              style={[styles.button, position, wheelButtonAnimatedStyle]}
            >
              <IconButton size={BUTTON_SIZE} Icon={Cloud} text={text} />
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
