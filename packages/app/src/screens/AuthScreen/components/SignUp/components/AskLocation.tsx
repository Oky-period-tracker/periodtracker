import React from "react";
import { StyleSheet, View } from "react-native";
import { useSignUp } from "../SignUpContext";
import { WheelPickerModal } from "../../../../../components/WheelPickerModal";
import { SegmentControl } from "../../../../../components/SegmentControl";
import {
  WheelPickerOption,
  useInitialWheelOption,
} from "../../../../../components/WheelPicker";
import { useProvinceOptions } from "../../../../../hooks/useProvinceOptions";
import { useCountryOptions } from "../../../../../hooks/useCountryOptions";

export const AskLocation = () => {
  const { state, dispatch, errors } = useSignUp();

  const onChangeCountry = ({ value }: WheelPickerOption) => {
    dispatch({ type: "country", value });
  };

  const onChangeProvince = ({ value }: WheelPickerOption) => {
    dispatch({ type: "province", value });
  };

  const onChangeLocation = (value: string) => {
    dispatch({ type: "location", value });
  };

  const countryOptions = useCountryOptions();
  const provinceOptions = useProvinceOptions(state.country);

  const initialCountry = useInitialWheelOption(state.country, countryOptions);
  const initialProvince = useInitialWheelOption(
    state.province,
    provinceOptions
  );

  return (
    <View style={styles.container}>
      <WheelPickerModal
        initialOption={initialCountry}
        options={countryOptions}
        onSelect={onChangeCountry}
        placeholder={"country"}
        errors={errors}
        errorKey={"no_country"}
        errorsVisible={state.errorsVisible}
        searchEnabled
      />
      <WheelPickerModal
        initialOption={initialProvince}
        options={provinceOptions}
        onSelect={onChangeProvince}
        placeholder={"province"}
        errors={errors}
        errorKey={"no_province"}
        errorsVisible={state.errorsVisible}
        searchEnabled
      />
      <SegmentControl
        options={locations}
        selected={state.location}
        onSelect={onChangeLocation}
        errors={errors}
        errorKey={"no_location"}
        errorsVisible={state.errorsVisible}
      />
    </View>
  );
};

const locations = [
  { value: "Urban", label: "Urban", iconName: "building" },
  { value: "Rural", label: "Rural", iconName: "leaf" },
];

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
});
