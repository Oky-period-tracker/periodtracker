import React from "react";
import { LayoutChangeEvent, StyleSheet, ViewStyle } from "react-native";
import { Gesture, PanGesture } from "react-native-gesture-handler";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  AnimatedStyle,
} from "react-native-reanimated";

export type DayScrollContext = {
  data: { date: Date }[];
  onBodyLayout: (event: LayoutChangeEvent) => void;
  // Wheel
  panWheelGesture: PanGesture;
  animatedWheelStyle: AnimatedStyle;
  animatedButtonStyle: AnimatedStyle;
  calculateButtonPosition: (index: number) => { top: number; left: number };
  RADIUS: number;
  BUTTON_SIZE: number;
  // Carousel
  panCarouselGesture: PanGesture;
  animatedCarouselStyle: AnimatedStyle;
  cardStyle: ViewStyle;
};

const defaultValue: DayScrollContext = {
  data: [],
  onBodyLayout: () => {
    //
  },
  panWheelGesture: Gesture.Pan(),
  animatedWheelStyle: {},
  animatedButtonStyle: {},
  calculateButtonPosition: () => {
    return {
      top: 0,
      left: 0,
    };
  },
  RADIUS: 0,
  BUTTON_SIZE: 0,
  //
  panCarouselGesture: Gesture.Pan(),
  animatedCarouselStyle: {},
  cardStyle: {},
};

const DayScrollContext = React.createContext<DayScrollContext>(defaultValue);

export const DayScrollProvider = ({ children }: React.PropsWithChildren) => {
  const [wheelHeight, setWheelHeight] = React.useState(0);
  const onBodyLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setWheelHeight(height);
  };

  const rotationAngle = useSharedValue(0);
  const cumulativeRotation = useSharedValue(0);

  const translationX = useSharedValue(0);
  const cumulativeTranslationX = useSharedValue(0);

  // ==================== WHEEL ==================== //
  const BUTTON_SIZE = 80;
  const RADIUS = wheelHeight / 2;
  const ANGLE_FULL_CIRCLE = 2 * Math.PI;
  const ANGLE_BETWEEN_BUTTONS = ANGLE_FULL_CIRCLE / NUMBER_OF_BUTTONS;
  const ROTATION_PER_PIXEL_DRAGGED = ANGLE_BETWEEN_BUTTONS / FULL_WIDTH;

  const calculateButtonPosition = (index: number) => {
    const distanceFromCenter = RADIUS - BUTTON_SIZE / 2;
    const x = distanceFromCenter * Math.cos(index * ANGLE_BETWEEN_BUTTONS);
    const y = distanceFromCenter * Math.sin(index * ANGLE_BETWEEN_BUTTONS);
    const top = RADIUS + y - BUTTON_SIZE / 2;
    const left = RADIUS + x - BUTTON_SIZE / 2;
    return { top, left };
  };

  const calculateRotationAngle = (displacement: number) => {
    "worklet";
    const angle = -displacement * ROTATION_PER_PIXEL_DRAGGED;
    return Math.min(angle, ANGLE_FULL_CIRCLE);
  };

  const calculateClosestSegmentAngle = (angle: number) => {
    "worklet";
    const segmentIndex = Math.round(angle / ANGLE_BETWEEN_BUTTONS);
    return segmentIndex * ANGLE_BETWEEN_BUTTONS;
  };

  const onUpdate = (displacement: number) => {
    "worklet";
    // Carousel
    translationX.value = cumulativeTranslationX.value + displacement;

    // Wheel
    const angle = calculateRotationAngle(displacement);
    rotationAngle.value = cumulativeRotation.value + angle;
  };

  const onEnd = (displacement: number) => {
    "worklet";
    // Carousel
    const endX = cumulativeTranslationX.value + displacement;
    const endPosition = calculateClosestCardPosition(endX);
    translationX.value = withTiming(endPosition, { duration: 500 });
    cumulativeTranslationX.value = endPosition;

    // Wheel
    const angle = calculateRotationAngle(displacement);
    const endAngle = calculateClosestSegmentAngle(
      cumulativeRotation.value + angle
    );
    cumulativeRotation.value = endAngle;
    rotationAngle.value = withTiming(endAngle, { duration: 500 });
  };

  const panWheelGesture = Gesture.Pan()
    .onUpdate((event) => {
      onUpdate(event.translationY);
    })
    .onEnd((event) => {
      onEnd(event.translationY);
    });

  const animatedWheelStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotationAngle.value}rad` }],
    };
  });

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      // Buttons counter rotate to stay level
      transform: [{ rotate: `${-rotationAngle.value}rad` }],
    };
  });

  // ==================== CAROUSEL ==================== //

  const panCarouselGesture = Gesture.Pan()
    .onUpdate((event) => {
      onUpdate(event.translationX);
    })
    .onEnd((event) => {
      onEnd(event.translationX);
    });

  const animatedCarouselStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translationX.value }],
    };
  });

  return (
    <DayScrollContext.Provider
      value={{
        data,
        onBodyLayout,
        //
        animatedWheelStyle,
        animatedButtonStyle,
        panWheelGesture,
        calculateButtonPosition,
        RADIUS,
        BUTTON_SIZE,
        //
        panCarouselGesture,
        animatedCarouselStyle,
        cardStyle: styles.card,
      }}
    >
      {children}
    </DayScrollContext.Provider>
  );
};

export const useDayScroll = () => {
  return React.useContext(DayScrollContext);
};

const generateDateArray = (startDate: Date, length: number) => {
  const dates = [];
  for (let i = 0; i < length; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push({ date });
  }
  return dates;
};

const NUMBER_OF_BUTTONS = 12;

const data = generateDateArray(new Date(), NUMBER_OF_BUTTONS);

//

const CARD_WIDTH = 260;
const ASPECT_RATIO = 0.7;
const CARD_HEIGHT = CARD_WIDTH * ASPECT_RATIO;
const CARD_MARGIN = 12;

const FULL_WIDTH = CARD_WIDTH + CARD_MARGIN;

const calculateClosestCardPosition = (position: number) => {
  "worklet";
  const closestIndex = Math.round(position / FULL_WIDTH);
  return closestIndex * FULL_WIDTH;
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    margin: CARD_MARGIN,
    marginHorizontal: CARD_MARGIN / 2,
  },
});
