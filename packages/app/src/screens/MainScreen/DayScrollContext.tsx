import React from "react";
import { LayoutChangeEvent } from "react-native";
import { Gesture, PanGesture } from "react-native-gesture-handler";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  AnimatedStyle,
} from "react-native-reanimated";

export type DayScrollContext = {
  data: { date: Date }[];
  constants: {
    BUTTON_SIZE: number;
    CARD_WIDTH: number;
    CARD_HEIGHT: number;
    CARD_MARGIN: number;
  };
  onBodyLayout: (event: LayoutChangeEvent) => void;
  // Carousel
  carouselPanGesture: PanGesture;
  carouselAnimatedStyle: AnimatedStyle;
  // Wheel
  calculateButtonPosition: (index: number) => { top: number; left: number };
  wheelPanGesture: PanGesture;
  wheelAnimatedStyle: AnimatedStyle;
  wheelButtonAnimatedStyle: AnimatedStyle;
};

// Carousel
const CARD_WIDTH = 260;
const ASPECT_RATIO = 0.7;
const CARD_HEIGHT = CARD_WIDTH * ASPECT_RATIO;
const CARD_MARGIN = 12;
const FULL_CARD_WIDTH = CARD_WIDTH + CARD_MARGIN;

// Wheel
const BUTTON_SIZE = 80;
const NUMBER_OF_BUTTONS = 12;
const ANGLE_FULL_CIRCLE = 2 * Math.PI;
const ANGLE_BETWEEN_BUTTONS = ANGLE_FULL_CIRCLE / NUMBER_OF_BUTTONS;
const ROTATION_PER_PIXEL_DRAGGED = ANGLE_BETWEEN_BUTTONS / FULL_CARD_WIDTH;

const constants = {
  BUTTON_SIZE,
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_MARGIN,
};

const defaultValue: DayScrollContext = {
  data: [],
  constants,
  onBodyLayout: () => {
    //
  },
  // Carousel
  carouselPanGesture: Gesture.Pan(),
  carouselAnimatedStyle: {},
  // Wheel
  wheelPanGesture: Gesture.Pan(),
  wheelAnimatedStyle: {},
  wheelButtonAnimatedStyle: {},
  calculateButtonPosition: () => {
    return {
      top: 0,
      left: 0,
    };
  },
};

const DayScrollContext = React.createContext<DayScrollContext>(defaultValue);

export const DayScrollProvider = ({ children }: React.PropsWithChildren) => {
  const [wheelHeight, setWheelHeight] = React.useState(0);
  const RADIUS = wheelHeight / 2;

  const onBodyLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setWheelHeight(height);
  };

  // Carousel
  const translationX = useSharedValue(0);
  const cumulativeTranslationX = useSharedValue(0);

  // Wheel
  const rotationAngle = useSharedValue(0);
  const cumulativeRotation = useSharedValue(0);

  // ================ Carousel Worklet ================ //
  const calculateClosestCardPosition = (position: number) => {
    "worklet";
    const closestIndex = Math.round(position / FULL_CARD_WIDTH);
    return closestIndex * FULL_CARD_WIDTH;
  };

  // ================ Wheel Worklets ================ //
  const calculateButtonPosition = (index: number) => {
    const distanceFromCenter = RADIUS - BUTTON_SIZE / 2;
    const x = distanceFromCenter * Math.cos(index * ANGLE_BETWEEN_BUTTONS);
    const y = distanceFromCenter * Math.sin(index * ANGLE_BETWEEN_BUTTONS);
    const top = y + distanceFromCenter;
    const left = x + distanceFromCenter;
    return { top, left };
  };

  const calculateRotationAngle = (displacement: number) => {
    "worklet";
    const angle = displacement * ROTATION_PER_PIXEL_DRAGGED;
    return Math.min(angle, ANGLE_FULL_CIRCLE);
  };

  const calculateClosestSegmentAngle = (angle: number) => {
    "worklet";
    const segmentIndex = Math.round(angle / ANGLE_BETWEEN_BUTTONS);
    return segmentIndex * ANGLE_BETWEEN_BUTTONS;
  };

  // ================ Handle Gestures ================ //
  const handlePanUpdate = (displacement: number) => {
    "worklet";
    // Carousel
    translationX.value = cumulativeTranslationX.value + displacement;

    // Wheel
    const angle = calculateRotationAngle(displacement);
    rotationAngle.value = cumulativeRotation.value + angle;
  };

  const handlePanEnd = (displacement: number) => {
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

  const carouselPanGesture = Gesture.Pan()
    .onUpdate((event) => {
      handlePanUpdate(event.translationX);
    })
    .onEnd((event) => {
      handlePanEnd(event.translationX);
    });

  const wheelPanGesture = Gesture.Pan()
    .onUpdate((event) => {
      handlePanUpdate(-event.translationY);
    })
    .onEnd((event) => {
      handlePanEnd(-event.translationY);
    });

  // ================ Animated Styles ================ //
  const wheelAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotationAngle.value}rad` }],
      width: RADIUS * 2,
      height: RADIUS * 2,
    };
  });

  const wheelButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      // Buttons counter rotate to stay level
      transform: [{ rotate: `${-rotationAngle.value}rad` }],
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
    };
  });

  const carouselAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translationX.value }],
    };
  });

  return (
    <DayScrollContext.Provider
      value={{
        data,
        constants,
        onBodyLayout,
        // Carousel
        carouselPanGesture,
        carouselAnimatedStyle,
        // Wheel
        calculateButtonPosition,
        wheelPanGesture,
        wheelAnimatedStyle,
        wheelButtonAnimatedStyle,
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

const data = generateDateArray(new Date(), NUMBER_OF_BUTTONS);
