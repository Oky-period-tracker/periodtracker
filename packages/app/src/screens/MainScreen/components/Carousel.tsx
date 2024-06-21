import React from "react";
import { StyleSheet } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { DailyCard } from "../../../components/DailyCard";
import { useDayScroll } from "../DayScrollContext";

export const Carousel = () => {
  const { data, carouselPanGesture, carouselAnimatedStyle } = useDayScroll();

  return (
    <GestureDetector gesture={carouselPanGesture}>
      <Animated.View style={[styles.container, carouselAnimatedStyle]}>
        {data.map((_, i) => {
          return (
            <DailyCard
              key={`carousel-card-${i}`}
              onPress={() => {
                //
              }}
            />
          );
        })}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
