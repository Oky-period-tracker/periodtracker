import React from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

export type DayScrollContext = {
  // Wheel
  rotationAngle: SharedValue<number> | null;
  cumulativeRotation: SharedValue<number> | null;
  // Carousel
  translationX: SharedValue<number> | null;
  cumulativeTranslationX: SharedValue<number> | null;
};

const defaultValue: DayScrollContext = {
  rotationAngle: null,
  cumulativeRotation: null,
  translationX: null,
  cumulativeTranslationX: null,
};

const DayScrollContext = React.createContext<DayScrollContext>(defaultValue);

export const DayScrollProvider = ({ children }: React.PropsWithChildren) => {
  const rotationAngle = useSharedValue(0);
  const cumulativeRotation = useSharedValue(0);

  const translationX = useSharedValue(0);
  const cumulativeTranslationX = useSharedValue(0);

  return (
    <DayScrollContext.Provider
      value={{
        rotationAngle,
        cumulativeRotation,
        translationX,
        cumulativeTranslationX,
      }}
    >
      {children}
    </DayScrollContext.Provider>
  );
};

export const useDayScroll = () => {
  return React.useContext(DayScrollContext);
};
