import React from "react";
import { useSelector } from "../../redux/useSelector";
import { currentLocaleSelector } from "../../redux/selectors";
import { Locale, countries } from "../../core/modules/translations";
import { helpCenterAttributes } from "../../core/modules/translations/helpCenter";
import { HelpCenterAttribute } from "../../core/types";

export const useHelpCenterAttributes = () => {
  const locale = useSelector(currentLocaleSelector) as Locale;

  return React.useMemo(() => {
    return helpCenterAttributes[locale] as HelpCenterAttribute[];
  }, [countries, locale]);
};
