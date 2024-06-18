import React from "react";
import { provinces } from "../data/data";
import { WheelPickerOption } from "../components/WheelPicker";

export const useProvinceOptions = (
  country: string | undefined
): WheelPickerOption[] => {
  // TODO: redux state
  const locale = "en";

  const provinceOptions = React.useMemo(() => {
    const countryCode = country ? country : null;

    const filteredProvinces = provinces.filter(
      ({ code, uid }) => code === countryCode || uid === 0
    );

    return filteredProvinces.map((item) => ({
      label: item[locale],
      value: item.uid.toString(),
    }));
  }, [country, provinces, locale]);

  return provinceOptions;
};
