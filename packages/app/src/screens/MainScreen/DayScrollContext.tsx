import moment, { Moment } from "moment";
import React from "react";
import { LayoutChangeEvent } from "react-native";
import { Gesture, PanGesture } from "react-native-gesture-handler";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  AnimatedStyle,
  runOnJS,
  SharedValue,
} from "react-native-reanimated";
import _ from "lodash";

export type DayData = {
  date: Moment;
};

export type DayScrollContext = {
  data: DayData[];
  constants: {
    CARD_WIDTH: number;
    CARD_MARGIN: number;
    FULL_CARD_WIDTH: number;
    BUTTON_SIZE: number;
    NUMBER_OF_BUTTONS: number;
  };
  onBodyLayout: (event: LayoutChangeEvent) => void;
  // Carousel
  carouselPanGesture: PanGesture;
  translationX: SharedValue<number> | null;
  totalOffset: SharedValue<number> | null;
  offset: SharedValue<number> | null;
  // Wheel
  calculateButtonPosition: (index: number) => { top: number; left: number };
  wheelPanGesture: PanGesture;
  wheelAnimatedStyle: AnimatedStyle;
  wheelButtonAnimatedStyle: AnimatedStyle;
};

type DayScrollState = {
  startDate: Moment;
  endDate: Moment;
  currentIndex: number;
};

// Carousel
const CARD_WIDTH = 260;
const CARD_MARGIN = 12;
const FULL_CARD_WIDTH = CARD_WIDTH + CARD_MARGIN;

// Wheel
const BUTTON_SIZE = 80;
const NUMBER_OF_BUTTONS = 12;
const ANGLE_FULL_CIRCLE = 2 * Math.PI;
const ANGLE_BETWEEN_BUTTONS = ANGLE_FULL_CIRCLE / NUMBER_OF_BUTTONS;
const ROTATION_PER_PIXEL_DRAGGED = ANGLE_BETWEEN_BUTTONS / FULL_CARD_WIDTH;

const SCROLL_SPEED_MULTIPLIER = 2;
const SETTLE_DURATION = 500;

const constants = {
  CARD_WIDTH,
  CARD_MARGIN,
  FULL_CARD_WIDTH,
  BUTTON_SIZE,
  NUMBER_OF_BUTTONS,
};

const defaultValue: DayScrollContext = {
  data: [],
  constants,
  onBodyLayout: () => {
    //
  },
  // Carousel
  carouselPanGesture: Gesture.Pan(),
  translationX: null,
  totalOffset: null,
  offset: null,
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

const today = moment().startOf("day");
const todayMinusSevenDays = moment(today.clone().add(-7, "days"));
const todaysPlusFourDays = moment(today.clone().add(4, "days"));

const initialState: DayScrollState = {
  startDate: todayMinusSevenDays,
  endDate: todaysPlusFourDays,
  currentIndex: 0,
};

export const DayScrollProvider = ({ children }: React.PropsWithChildren) => {
  const [state, setState] = React.useState(initialState);

  const { startDate, endDate } = state;

  const fullInfoForDateRange = useCalculateFullInfoForDateRange(
    startDate,
    endDate
  );

  const [diameter, setDiameter] = React.useState(0);
  const radius = diameter / 2;

  const onBodyLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setDiameter(height);
  };

  // Shared Values
  const offset = useSharedValue(0);
  const totalOffset = useSharedValue(0);

  // Carousel
  const initialX = -FULL_CARD_WIDTH * (NUMBER_OF_BUTTONS / 2);
  const translationX = useSharedValue(initialX);
  const totalTranslationX = useSharedValue(initialX);

  // Wheel
  const rotationAngle = useSharedValue(0);
  const totalRotation = useSharedValue(0);

  const handleInfiniteData = (indexChange: number) => {
    if (indexChange === 0) {
      return;
    }

    setState({
      ...state,
      startDate: state.startDate.add(indexChange, "days"),
      endDate: state.endDate.add(indexChange, "days"),
    });
  };

  // ================ Carousel Worklet ================ //
  const calculateClosestCardPosition = (position: number) => {
    "worklet";
    const closestIndex = Math.round(position / FULL_CARD_WIDTH);
    return closestIndex * FULL_CARD_WIDTH;
  };

  // ================ Wheel Worklets ================ //
  const calculateButtonPosition = (index: number) => {
    const distanceFromCenter = radius - BUTTON_SIZE / 2;
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
    translationX.value = totalTranslationX.value + displacement;

    // Wheel
    const angle = calculateRotationAngle(displacement);
    rotationAngle.value = totalRotation.value + angle;
  };

  const handlePanEnd = (displacement: number) => {
    "worklet";
    // Carousel
    const endX = totalTranslationX.value + displacement;
    const endPosition = calculateClosestCardPosition(endX);
    translationX.value = withTiming(endPosition, { duration: SETTLE_DURATION });
    totalTranslationX.value = endPosition;

    // Wheel
    const angle = calculateRotationAngle(displacement);
    const endAngle = calculateClosestSegmentAngle(totalRotation.value + angle);
    totalRotation.value = endAngle;
    rotationAngle.value = withTiming(
      endAngle,
      { duration: SETTLE_DURATION },
      () => {
        const change = Math.round(-displacement / FULL_CARD_WIDTH);
        totalOffset.value = totalOffset.value + change;
        offset.value = (offset.value + change) % NUMBER_OF_BUTTONS;

        runOnJS(handleInfiniteData)(change);
      }
    );
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
      handlePanUpdate(-event.translationY * SCROLL_SPEED_MULTIPLIER);
    })
    .onEnd((event) => {
      handlePanEnd(-event.translationY * SCROLL_SPEED_MULTIPLIER);
    });

  // ================ Animated Styles ================ //
  const wheelAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotationAngle.value}rad` }],
      width: diameter,
      height: diameter,
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

  return (
    <DayScrollContext.Provider
      value={{
        data: reorderData(fullInfoForDateRange, offset.value),
        constants,
        onBodyLayout,
        // Carousel
        carouselPanGesture,
        translationX,
        totalOffset,
        offset,
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

const calculateFullInfoForDateRange = (startDate: Moment, endDate: Moment) => {
  const loop = moment(startDate).startOf("day");
  const dateArray = [];

  while (loop <= endDate) {
    const date = moment(loop.date(loop.date() + 1)).startOf("day");
    dateArray.push({ date });
  }
  return dateArray;
};

function useCalculateFullInfoForDateRange(startDate: Moment, endDate: Moment) {
  return calculateFullInfoForDateRange(startDate, endDate);
  // return React.useMemo(() => {
  //   return calculateFullInfoForDateRange(startDate, endDate);
  // }, [startDate, endDate]);
}

function reorderData(array: DayData[], offset = 0) {
  const reorder = _.chunk(array, array.length / 2).flat();

  if (offset < 0) {
    return [
      ..._.takeRight(reorder, array.length - Math.abs(offset)),
      ..._.take(reorder, Math.abs(offset)),
    ];
  }

  return [
    ..._.takeRight(reorder, offset),
    ..._.take(reorder, array.length - offset),
  ];
}
