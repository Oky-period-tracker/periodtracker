import React from "react";
import { countries, Locale } from "../data/data";
import { WheelPickerOption } from "../components/WheelPicker";
import { useSelector } from "../redux/useSelector";
import { currentLocaleSelector } from "../redux/selectors";

export const useCountryOptions = (): WheelPickerOption[] => {
  const locale = useSelector(currentLocaleSelector) as Locale;

  const countryOptions = React.useMemo(() => {
    return Object.entries(countries).map(([key, item]) => ({
      label: item[locale],
      value: key,
    }));
  }, [countries, locale]);

  return countryOptions;
};
