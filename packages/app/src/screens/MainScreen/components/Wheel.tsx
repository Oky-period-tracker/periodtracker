import React from "react";
import { StyleSheet } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import Cloud from "../../../components/icons/Cloud";
import { IconButton } from "../../../components/IconButton";
import { DayData, useDayScroll } from "../DayScrollContext";
import { formatMomentDayMonth } from "../../../services/utils";

export const Wheel = () => {
  const { data, wheelPanGesture, wheelAnimatedStyle } = useDayScroll();

  return (
    <GestureDetector gesture={wheelPanGesture}>
      <Animated.View style={[styles.container, wheelAnimatedStyle]}>
        {data.map((item, index) => (
          <WheelButton key={`wheel-button-${index}`} {...{ item, index }} />
        ))}
      </Animated.View>
    </GestureDetector>
  );
};

const WheelButton = ({ index, item }: { index: number; item: DayData }) => {
  const {
    constants,
    calculateButtonPosition,
    rotationAngle,
    selectedIndex,
    selectedScale,
    toggleDayModal,
  } = useDayScroll();

  const { BUTTON_SIZE } = constants;

  const position = calculateButtonPosition(index);
  const text = formatMomentDayMonth(item.date);
  const isSelected = index === selectedIndex?.value;

  const wheelButtonAnimatedStyle = useAnimatedStyle(() => {
    if (
      rotationAngle === null ||
      selectedScale === null ||
      selectedIndex === null
    ) {
      return {};
    }

    const selected = index === selectedIndex?.value;

    const scale = selected ? selectedScale.value : 1;

    return {
      // Buttons counter rotate to stay level
      transform: [{ rotate: `${-rotationAngle.value}rad` }, { scale }],
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
    };
  });

  return (
    <Animated.View style={[styles.button, position, wheelButtonAnimatedStyle]}>
      <IconButton
        size={BUTTON_SIZE}
        Icon={Cloud}
        text={text}
        onPress={toggleDayModal}
        disabled={!isSelected}
      />
    </Animated.View>
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
