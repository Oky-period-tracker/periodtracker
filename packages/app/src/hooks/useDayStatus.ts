import { PaletteStatus } from "../config/theme";
import { DayData } from "../screens/MainScreen/DayScrollContext";

export const useDayStatus = (data: DayData): PaletteStatus => {
  if (data.onPeriod) {
    return "danger";
  }
  if (data.onFertile) {
    return "tertiary";
  }
  return "neutral";
};
