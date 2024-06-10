import React from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  GestureEvent,
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
} from "react-native-gesture-handler";
import { Button } from "./Button";

type SwiperProps = {
  pages: React.ReactElement[];
  renderActionRight?: (currentPage: number, total: number) => React.ReactNode;
};

export const Swiper = ({ pages, renderActionRight }: SwiperProps) => {
  const translateX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const [containerWidth, setContainerWidth] = React.useState(0);

  const fullWidth = containerWidth + marginRight;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const onGestureEvent = (
    event: GestureEvent<PanGestureHandlerEventPayload>
  ) => {
    const { translationX } = event.nativeEvent;
    translateX.value = translationX - currentIndex * fullWidth;
  };

  const onHandlerStateChange = (
    event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>
  ) => {
    if (event.nativeEvent.oldState !== State.ACTIVE) {
      return;
    }

    const { translationX } = event.nativeEvent;
    const newIndex = currentIndex - Math.sign(translationX);
    const isValid = newIndex >= 0 && newIndex < pages.length;

    if (isValid) {
      setCurrentIndex(newIndex);
      translateX.value = withTiming(-newIndex * fullWidth);
      return;
    }

    translateX.value = withTiming(-currentIndex * fullWidth);
  };

  const handleIndicatorPress = (index: number) => {
    setCurrentIndex(index);
    translateX.value = withTiming(-index * fullWidth);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
    translateX.value = withTiming(-currentIndex * fullWidth);
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <View style={styles.container} onLayout={onLayout}>
        <Animated.View style={[styles.pagesContainer, animatedStyle]}>
          {pages.map((page, index) => (
            <View key={index} style={styles.page}>
              {page}
            </View>
          ))}
        </Animated.View>

        <View style={styles.footer}>
          <View style={styles.footerAction} />
          {pages.map((_, index) => {
            const isSelected = currentIndex === index;
            const onPress = () => handleIndicatorPress(index);

            return (
              <Button
                key={`indicator-${index}`}
                onPress={onPress}
                style={styles.indicator}
                status={isSelected ? "danger" : "basic"}
              />
            );
          })}
          <View style={styles.footerAction}>
            {renderActionRight(currentIndex, pages.length)}
          </View>
        </View>
      </View>
    </PanGestureHandler>
  );
};

const marginRight = 12; // Same as <Screen> padding

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  pagesContainer: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 20,
    overflow: "hidden",
    width: "100%",
    marginRight,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
  },
  footerAction: {
    flex: 1,
    height: "100%",
  },
  indicator: {
    width: 16,
    height: 16,
    margin: 8,
  },
});
