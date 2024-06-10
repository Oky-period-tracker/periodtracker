import React from "react";
import { StyleSheet, View } from "react-native";
import { useSignUp } from "../SignUpContext";
import { ModalSelector } from "../../../../../components/ModalSelector";
import { generateRange } from "../../../../../services/utils";

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

  const onChangeMonth = (v: string) => {
    const value = months.indexOf(v);
    dispatch({ type: "month", value });
  };

  const onChangeYear = (v: string) => {
    const value = parseInt(v);
    dispatch({ type: "year", value });
  };

  return (
    <View style={styles.container}>
      <ModalSelector
        displayValue={month}
        options={monthOptions}
        onSelect={onChangeMonth}
        placeholder={"what month were you born"}
        errors={errors}
        errorKey={"no_month"}
        errorsVisible={state.errorsVisible}
      />
      <ModalSelector
        displayValue={year}
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
