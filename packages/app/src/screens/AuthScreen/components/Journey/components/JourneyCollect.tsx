import React from "react";
import { JourneyStep, useJourney } from "../JourneyContext";
import {
  WheelPicker,
  WheelPickerOption,
} from "../../../../../components/WheelPicker";
import { DateData } from "react-native-calendars";
import { DatePicker } from "../../../../../components/DatePicker";

export const JourneyCollect = ({ step }: { step: JourneyStep }) => {
  const { state, dispatch, dayOptions, weekOptions } = useJourney();

  const day = dayOptions.find((item) => item.value === state.periodLength);
  const week = weekOptions.find((item) => item.value === state.cycleLength);

  const setDate = (day: DateData) => {
    const value = new Date(day.timestamp);
    dispatch({ type: "startDate", value });
  };

  const setPeriodLength = (option: WheelPickerOption | undefined) => {
    const value = option?.value;
    dispatch({ type: "periodLength", value });
  };

  const setCycleLength = (option: WheelPickerOption | undefined) => {
    const value = option?.value;
    dispatch({ type: "cycleLength", value });
  };

  return (
    <>
      {step === "when_last_period" && (
        <DatePicker selectedDate={state.startDate} onDayPress={setDate} />
      )}
      {step === "number_days" && (
        <WheelPicker
          initialOption={day}
          options={dayOptions}
          onChange={setPeriodLength}
          resetDeps={[step]}
        />
      )}
      {step === "number_weeks_between" && (
        <WheelPicker
          initialOption={week}
          options={weekOptions}
          onChange={setCycleLength}
          resetDeps={[step]}
        />
      )}
    </>
  );
};
