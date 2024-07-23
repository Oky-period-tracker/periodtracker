import { useSelector } from "../redux/useSelector";
import { verifyPeriodDaySelectorWithDate } from "../redux/selectors";
import { PredictionDayInfo } from "../prediction";
import { PaletteStatus } from "../config/theme";
import { Appearance } from "../components/IconButton";

export type PeriodStatus =
  | "period"
  | "notVerifiedDay"
  | "fertile"
  | "nonPeriod";

export const useDayStatus = (
  dataEntry: PredictionDayInfo
): {
  status: PaletteStatus;
  appearance: Appearance;
} => {
  const day = useSelector((state) =>
    verifyPeriodDaySelectorWithDate(state, dataEntry.date)
  );

  // @ts-expect-error TODO:
  const isVerified = day?.periodDay;

  if (dataEntry.onPeriod && isVerified) {
    return {
      status: "danger",
      appearance: "fill",
    };
  }

  if (dataEntry.onPeriod && !isVerified) {
    return {
      status: "danger",
      appearance: "outline",
    };
  }

  if (dataEntry.onFertile) {
    return {
      status: "tertiary",
      appearance: "fill",
    };
  }

  return {
    status: "neutral",
    appearance: "fill",
  };
};
