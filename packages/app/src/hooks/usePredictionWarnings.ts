import moment, { Moment } from "moment";
import { useAvatarMessage } from "../contexts/AvatarMessageContext";
import { useTodayPrediction } from "../contexts/PredictionProvider";

export const useCheckDayWarning = () => {
  const { setAvatarMessage } = useAvatarMessage();
  const currentCycleInfo = useTodayPrediction();

  return (inputDay: Moment) => {
    const diffFromStart = inputDay.diff(currentCycleInfo.date, "days");
    if (moment(inputDay).isAfter(moment())) {
      setAvatarMessage("too_far_ahead");
      return true;
    }
    if (diffFromStart < -14 && currentCycleInfo.cycleDay !== 0) {
      setAvatarMessage("too_far_behind");
      return true;
    }
    if (diffFromStart > 14 && currentCycleInfo.cycleDay !== 0) {
      // The 0 check is for the use case when there is no history and you move the period forward by accident and put yourself in a state that the cycle has no current information
      setAvatarMessage("too_far_ahead");
      return true;
    }
    return false;
  };
};
