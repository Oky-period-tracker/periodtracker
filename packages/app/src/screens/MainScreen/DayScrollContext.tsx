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
} from "react-native-reanimated";
import _ from "lodash";

export type DayData = {
  date: Moment;
};

export type DayScrollContext = {
  data: DayData[];
  constants: {
    BUTTON_SIZE: number;
    CARD_WIDTH: number;
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

type DayScrollState = {
  startDate: Moment;
  endDate: Moment;
  offset: number;
  currentIndex: number;
  page: number;
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
  BUTTON_SIZE,
  CARD_WIDTH,
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

const today = moment().startOf("day");
const todayMinusSevenDays = moment(today.clone().add(-7, "days"));
const todaysPlusFourDays = moment(today.clone().add(4, "days"));

const initialState: DayScrollState = {
  startDate: todayMinusSevenDays,
  endDate: todaysPlusFourDays,
  offset: 0,
  currentIndex: 0,
  page: 0,
};

export const DayScrollProvider = ({ children }: React.PropsWithChildren) => {
  const [state, setState] = React.useState(initialState);

  const { startDate, endDate, offset /* currentIndex, page  */ } = state;

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

  // Carousel
  const translationX = useSharedValue(0);
  const cumulativeTranslationX = useSharedValue(0);

  // Wheel
  const rotationAngle = useSharedValue(0);
  const cumulativeRotation = useSharedValue(0);

  const handleInfiniteData = (indexChange: number) => {
    if (indexChange > 0) {
      setState({
        ...state,
        offset: (state.offset + indexChange) % NUMBER_OF_BUTTONS,
        startDate: state.startDate.add(indexChange, "days"),
        endDate: state.endDate.add(indexChange, "days"),
      });
      return;
    }

    if (indexChange < 0) {
      setState({
        ...state,
        offset: (state.offset + indexChange) % NUMBER_OF_BUTTONS,
        startDate: state.startDate.add(indexChange, "days"),
        endDate: state.endDate.add(indexChange, "days"),
      });
      return;
    }
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
    translationX.value = cumulativeTranslationX.value + displacement;

    // Wheel
    const angle = calculateRotationAngle(displacement);
    rotationAngle.value = cumulativeRotation.value + angle;
  };

  const handlePanEnd = (displacement: number) => {
    "worklet";

    const change = Math.round(-displacement / FULL_CARD_WIDTH);
    runOnJS(handleInfiniteData)(change);

    // Carousel
    const endX = cumulativeTranslationX.value + displacement;
    const endPosition = calculateClosestCardPosition(endX);
    translationX.value = withTiming(endPosition, { duration: SETTLE_DURATION });
    cumulativeTranslationX.value = endPosition;

    // Wheel
    const angle = calculateRotationAngle(displacement);
    const endAngle = calculateClosestSegmentAngle(
      cumulativeRotation.value + angle
    );
    cumulativeRotation.value = endAngle;
    rotationAngle.value = withTiming(endAngle, { duration: SETTLE_DURATION });
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

  const carouselAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translationX.value }],
    };
  });

  return (
    <DayScrollContext.Provider
      value={{
        data: reorderData(fullInfoForDateRange, offset),
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
  const reorder = _.chunk(array, array.length / 2)
    // .reverse()
    .flat();

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
