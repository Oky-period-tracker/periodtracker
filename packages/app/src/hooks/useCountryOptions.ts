import React from "react";
import { countries } from "../data/data";
import { WheelPickerOption } from "../components/WheelPicker";

export const useCountryOptions = (): WheelPickerOption[] => {
  // TODO: redux state
  const locale = "en";

  const countryOptions = React.useMemo(() => {
    return Object.entries(countries).map(([key, item]) => ({
      label: item[locale],
      value: key,
    }));
  }, [countries, locale]);

  return countryOptions;
};
