import React from "react";
import { useSignUp } from "../SignUpContext";
import { WheelPickerModal } from "../../../../../components/WheelPickerModal";
import { SegmentControl } from "../../../../../components/SegmentControl";
import {
  WheelPickerOption,
  useInitialWheelOption,
} from "../../../../../components/WheelPicker";
import { useProvinceOptions } from "../../../../../hooks/useProvinceOptions";
import { useCountryOptions } from "../../../../../hooks/useCountryOptions";
import { AuthCardBody } from "../../AuthCardBody";
import { useTranslate } from "../../../../../hooks/useTranslate";

export const AskLocation = () => {
  const translate = useTranslate();
  const { state, dispatch } = useSignUp();

  const onChangeCountry = (option: WheelPickerOption | undefined) => {
    dispatch({ type: "country", value: option?.value });
  };

  const onChangeProvince = (option: WheelPickerOption | undefined) => {
    dispatch({ type: "province", value: option?.value });
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
    <AuthCardBody>
      <WheelPickerModal
        initialOption={initialCountry}
        options={countryOptions}
        onSelect={onChangeCountry}
        placeholder={"country"}
        accessibilityLabel={translate("search_country")}
        searchEnabled
      />
      <WheelPickerModal
        initialOption={initialProvince}
        options={provinceOptions}
        onSelect={onChangeProvince}
        placeholder={"province"}
        searchEnabled
      />
      <SegmentControl
        options={locations}
        selected={state.location}
        onSelect={onChangeLocation}
      />
    </AuthCardBody>
  );
};

const locations = [
  { value: "Urban", label: "Urban", iconName: "building" },
  { value: "Rural", label: "Rural", iconName: "leaf" },
];
