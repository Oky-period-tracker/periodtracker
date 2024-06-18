import React from "react";
import { StyleSheet, View } from "react-native";
import { useSignUp } from "../SignUpContext";
import { ModalSelector } from "../../../../../components/ModalSelector";
import { generateRange } from "../../../../../services/utils";
import { WheelPickerOption } from "../../../../../components/WheelPicker";

// TODO: Submodule
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthOptions = months.map((item) => ({ label: item, value: item }));

const now = new Date();
const currentYear = now.getFullYear();
const years = generateRange(currentYear - 7, currentYear - 100).map((item) =>
  item.toString()
);

const yearOptions = years.map((item) => ({ label: item, value: item }));

export const AskAge = () => {
  const { state, dispatch, errors } = useSignUp();

  const month = months[state.month];
  const year = state.year?.toString();

  const onChangeMonth = (option: WheelPickerOption) => {
    const value = monthOptions.findIndex((item) => item.value === option.value);
    dispatch({ type: "month", value });
  };

  const onChangeYear = (option: WheelPickerOption) => {
    const value = parseInt(option.value);
    dispatch({ type: "year", value });
  };

  const initialMonth = monthOptions.find((item) => item.value === month);
  const initialYear = yearOptions.find((item) => item.value === year);

  return (
    <View style={styles.container}>
      <ModalSelector
        initialOption={initialMonth}
        options={monthOptions}
        onSelect={onChangeMonth}
        placeholder={"what month were you born"}
        errors={errors}
        errorKey={"no_month"}
        errorsVisible={state.errorsVisible}
      />
      <ModalSelector
        initialOption={initialYear}
        options={yearOptions}
        onSelect={onChangeYear}
        placeholder={"what year were you born"}
        errors={errors}
        errorKey={"no_year"}
        errorsVisible={state.errorsVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
});
