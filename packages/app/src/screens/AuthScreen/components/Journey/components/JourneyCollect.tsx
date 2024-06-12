import React from "react";
import { JourneyStep, useJourney } from "../JourneyContext";
import { WheelPicker } from "../../../../../components/WheelPicker";
import { dayOptions, weekOptions } from "../journeyConfig";

export const JourneyCollect = ({ step }: { step: JourneyStep }) => {
  const { state, dispatch } = useJourney();

  const dayIndex = dayOptions.findIndex(
    (item) => item.value === state.periodLength
  );

  const weekIndex = weekOptions.findIndex(
    (item) => item.value === state.cycleLength
  );

  const setDate = (value: Date) => {
    dispatch({ type: "startDate", value });
  };

  const setPeriodLength = (i: number) => {
    const value = dayOptions[i].value;
    dispatch({ type: "periodLength", value });
  };

  const setCycleLength = (i: number) => {
    const value = weekOptions[i].value;
    dispatch({ type: "cycleLength", value });
  };

  return (
    <>
      {/* // TODO: Calendar */}
      {step === "when_last_period" && null}
      {step === "number_days" && (
        <WheelPicker
          selectedIndex={dayIndex}
          options={dayOptions}
          onChange={setPeriodLength}
          resetDeps={[step]}
        />
      )}
      {step === "number_weeks_between" && (
        <WheelPicker
          selectedIndex={weekIndex}
          options={weekOptions}
          onChange={setCycleLength}
          resetDeps={[step]}
        />
      )}
    </>
  );
};
