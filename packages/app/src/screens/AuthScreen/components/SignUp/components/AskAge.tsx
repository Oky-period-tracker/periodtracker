import React from "react";
import { StyleSheet, View } from "react-native";
import { useSignUp } from "../SignUpContext";
import { WheelPickerModal } from "../../../../../components/WheelPickerModal";
import { WheelPickerOption } from "../../../../../components/WheelPicker";
import { monthOptions, yearOptions } from "../../../../../config/options";
import { InfoButton } from "../../../../../components/InfoButton";
import { months } from "../../../../../core/modules/translations";

export const AskAge = () => {
  const { state, dispatch, errors } = useSignUp();

  const month = state.month ? months[state.month] : undefined;
  const year = state.year?.toString();

  const onChangeMonth = (option: WheelPickerOption | undefined) => {
    const index = monthOptions.findIndex(
      (item) => item.value === option?.value
    );
    const value = index >= 0 ? index : undefined;
    dispatch({ type: "month", value });
  };

  const onChangeYear = (option: WheelPickerOption | undefined) => {
    const value = option ? parseInt(option?.value) : undefined;
    dispatch({ type: "year", value });
  };

  const initialMonth = monthOptions.find((item) => item.value === month);
  const initialYear = yearOptions.find((item) => item.value === year);

  return (
    <View style={styles.container}>
      <WheelPickerModal
        initialOption={initialMonth}
        options={monthOptions}
        onSelect={onChangeMonth}
        placeholder={"what month were you born"}
        errors={errors}
        errorKey={"no_month"}
        errorsVisible={state.errorsVisible}
        actionLeft={
          <InfoButton title={"birth_info_heading"} content={"birth_info"} />
        }
      />
      <WheelPickerModal
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
