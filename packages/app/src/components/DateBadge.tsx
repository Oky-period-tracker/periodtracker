import React from "react";
import { ThemeName } from "../core/modules";
import { useDayStatus } from "../hooks/useDayStatus";
import { IconButton } from "./IconButton";
import { usePredictDay } from "../contexts/PredictionProvider";
import { useFormatDate } from "../hooks/useFormatDate";
import { useSelector } from "react-redux";
import { currentThemeSelector } from "../redux/selectors";
import { Moment } from "moment";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { DayModal } from "./DayModal";
import { useToggle } from "../hooks/useToggle";
import { Button } from "./Button";
import { useTranslate } from "../hooks/useTranslate";

export const DateBadge = ({
  date,
  style,
}: {
  date: Moment;
  style: StyleProp<ViewStyle>;
}) => {
  const translate = useTranslate();
  const theme = useSelector(currentThemeSelector);
  const dataEntry = usePredictDay(date);
  const { status, appearance } = useDayStatus(dataEntry);
  const { formatMomentDayMonth } = useFormatDate();
  const [visible, toggleVisible] = useToggle();
  const IconSize = IconSizeForTheme[theme] ?? 80;
  const day = dataEntry.cycleDay === 0 ? "-" : dataEntry.cycleDay;
  const dayText = `${translate("Day")} ${day}`;

  return (
    <>
      <IconButton
        status={status}
        appearance={appearance}
        text={formatMomentDayMonth(dataEntry.date)}
        size={IconSize}
        style={style}
        onPress={toggleVisible}
      />
      <Button
        status={status}
        appearance={appearance}
        textStyle={styles.dayText}
        style={styles.button}
        onPress={toggleVisible}
        enableTranslate={false}
      >
        {dayText}
      </Button>
      <DayModal
        visible={visible}
        toggleVisible={toggleVisible}
        data={dataEntry}
      />
    </>
  );
};

const IconSizeForTheme: Record<ThemeName, number> = {
  hills: 80,
  mosaic: 60,
  village: 80,
  desert: 60,
};

const styles = StyleSheet.create({
  button: {
    width: 100,
    marginLeft: 8,
  },
  dayText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
