import React from "react";
import { StyleSheet, View } from "react-native";
import { useSignUp } from "../SignUpContext";
import { ModalSelector } from "../../../../../components/ModalSelector";
import { countries, provinces } from "../../../../../data/data";
import { SegmentControl } from "../../../../../components/SegmentControl";

const locations = [
  { value: "Urban", label: "Urban", iconName: "building" },
  { value: "Rural", label: "Rural", iconName: "leaf" },
];

// TODO: redux state
const locale = "en";

export const AskLocation = () => {
  const { state, dispatch, errors } = useSignUp();

  const onChangeCountry = (value: string) => {
    dispatch({ type: "country", value });
  };

  const onChangeProvince = (value: string) => {
    dispatch({ type: "province", value });
  };

  const onChangeLocation = (value: string) => {
    dispatch({ type: "location", value });
  };

  const countryOptions = React.useMemo(() => {
    return Object.entries(countries).map(([key, item]) => ({
      label: item[locale],
      value: key,
    }));
  }, [countries, locale]);

  const provinceOptions = React.useMemo(() => {
    const countryCode = state.country ? state.country : null;

    const filteredProvinces = provinces.filter(
      ({ code, uid }) => code === countryCode || uid === 0
    );

    return filteredProvinces.map((item) => ({
      label: item[locale],
      value: item.uid.toString(),
    }));
  }, [state.country, provinces, locale]);

  const provinceOption = React.useMemo(() => {
    return provinceOptions.find((item) => item.value === state.province);
  }, [provinceOptions, state.province]);

  const countryDisplay = countries?.[state.country]?.[locale] ?? "";
  const provinceDisplay = provinceOption?.label ?? "";

  return (
    <View style={styles.container}>
      <ModalSelector
        displayValue={countryDisplay}
        options={countryOptions}
        onSelect={onChangeCountry}
        placeholder={"country"}
        errors={errors}
        errorKey={"no_country"}
        errorsVisible={state.errorsVisible}
        searchEnabled
      />
      <ModalSelector
        displayValue={provinceDisplay}
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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
});
