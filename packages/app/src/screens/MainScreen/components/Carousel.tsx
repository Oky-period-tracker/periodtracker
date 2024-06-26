import React from "react";
import { StyleSheet, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { DailyCard } from "../../../components/DailyCard";
import { DayData, useDayScroll } from "../DayScrollContext";

export const Carousel = () => {
  const { data, carouselPanGesture } = useDayScroll();

  return (
    <GestureDetector gesture={carouselPanGesture}>
      <View style={styles.container}>
        {data.map((item, i) => {
          return <CarouselCard key={`${item}${i}`} index={i} item={item} />;
        })}
      </View>
    </GestureDetector>
  );
};

const CarouselCard = ({ index, item }: { index: number; item: DayData }) => {
  const { translationX, constants, totalOffset, offset } = useDayScroll();

  const { FULL_CARD_WIDTH, NUMBER_OF_BUTTONS } = constants;

  const carouselAnimatedStyle = useAnimatedStyle(() => {
    if (offset === null || totalOffset === null || translationX === null) {
      return {};
    }

    const shouldMove =
      index <
      (offset.value < 0 ? NUMBER_OF_BUTTONS + offset.value : offset.value)
        ? 1
        : 0;
    const multiplier =
      Math.floor(totalOffset.value / NUMBER_OF_BUTTONS) + shouldMove;
    const translateX =
      translationX.value + FULL_CARD_WIDTH * NUMBER_OF_BUTTONS * multiplier;

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View style={[carouselAnimatedStyle]}>
      <DailyCard
        item={item}
        onPress={() => {
          //
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
