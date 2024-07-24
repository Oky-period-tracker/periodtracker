import { useSelector } from "../redux/useSelector";
import { currentLocaleSelector } from "../redux/selectors";
import { Locale, calendarTranslations } from "../core/modules/translations";
import React from "react";

export const useMonths = () => {
  const locale = useSelector(currentLocaleSelector) as Locale;
  const months = calendarTranslations[locale].monthNames;

  const monthOptions = React.useMemo(
    () =>
      months.map((item) => ({
        label: item,
        value: item,
      })),
    [locale]
  );

  return { months, monthOptions };
};
