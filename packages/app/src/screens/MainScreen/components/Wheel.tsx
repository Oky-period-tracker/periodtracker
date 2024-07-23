import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { IconButton } from "../../../components/IconButton";
import { DayData, useDayScroll } from "../DayScrollContext";
import { formatMomentDayMonth } from "../../../services/utils";

import { useDayStatus } from "../../../hooks/useDayStatus";
import { useTutorial } from "../TutorialContext";
import { useSelector } from "react-redux";
import { isTutorialOneActiveSelector } from "../../../redux/selectors";
import { useLoading } from "../../../contexts/LoadingProvider";

export const Wheel = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const { data, wheelPanGesture, wheelAnimatedStyle } = useDayScroll();

  return (
    <GestureDetector gesture={wheelPanGesture}>
      <Animated.View style={[styles.container, wheelAnimatedStyle, style]}>
        {data.map((item, index) => (
          <WheelButton key={`wheel-button-${index}`} {...{ item, index }} />
        ))}
      </Animated.View>
    </GestureDetector>
  );
};

const WheelButton = ({ index, item }: { index: number; item: DayData }) => {
  const { status, appearance } = useDayStatus(item);
  const { setLoading } = useLoading();
  const { dispatch: tutorialDispatch } = useTutorial();

  const isTutorialOneActive = useSelector(isTutorialOneActiveSelector);

  const {
    constants,
    calculateButtonPosition,
    rotationAngle,
    selectedIndex,
    selectedScale,
    toggleDayModal,
  } = useDayScroll();

  const onPress = () => {
    if (isTutorialOneActive) {
      setLoading(true);
      tutorialDispatch({ type: "start", value: "tutorial_one" });
      return;
    }

    toggleDayModal();
  };

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
        text={text}
        onPress={onPress}
        disabled={!isSelected}
        status={status}
        appearance={appearance}
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
