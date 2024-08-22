import { useSelector } from "../redux/useSelector";
import { verifyPeriodDaySelectorWithDate } from "../redux/selectors";
import { PredictionDayInfo } from "../prediction";
import { PaletteStatus } from "../config/theme";
import { Appearance } from "../components/IconButton";
import { ReduxState } from "../redux/reducers";

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

export const getDayStatus = (
  state: ReduxState,
  dataEntry: PredictionDayInfo
): {
  status: PaletteStatus;
  appearance: Appearance;
} => {
  const day = verifyPeriodDaySelectorWithDate(state, dataEntry.date);

  // @ts-expect-error TODO:
  const isVerified = day?.periodDay;

  if (dataEntry.onPeriod && isVerified) {
    return {
      status: "danger",
      appearance: "fill",
    };
  }

  // TODO: theres some issue with the predicted days, for some reason they appear as if  isVerified is true, but the dailycards correctly are aware that they are not, likely something due to the dact that we are selecting redux state in this weird way

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
