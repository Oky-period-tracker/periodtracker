import React from "react";
import { ThemeName } from "../core/modules";
import { useDayStatus } from "../hooks/useDayStatus";
import { IconButton } from "./IconButton";
import { usePredictDay } from "../contexts/PredictionProvider";
import { useFormatDate } from "../hooks/useFormatDate";
import { useSelector } from "react-redux";
import { currentThemeSelector } from "../redux/selectors";
import { Moment } from "moment";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { DayModal } from "./DayModal";
import { useToggle } from "../hooks/useToggle";
import { Button } from "./Button";
import { useTranslate } from "../hooks/useTranslate";
import { InfoButton } from "./InfoButton";

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
  const iconText = formatMomentDayMonth(dataEntry.date);

  return (
    <View style={[styles.container, style]}>
      {dataEntry.onFertile && (
        <InfoButton
          title={"fertile_popup_heading"}
          content={"fertile_popup"}
          status={status}
        />
      )}
      <IconButton
        status={status}
        appearance={appearance}
        text={iconText}
        accessibilityLabel={iconText}
        size={IconSize}
        style={styles.iconButton}
        onPress={toggleVisible}
      />
      <Button
        status={status}
        appearance={appearance}
        textStyle={styles.dayText}
        style={styles.button}
        onPress={toggleVisible}
        accessibilityLabel={dayText}
        enableTranslate={false}
      >
        {dayText}
      </Button>
      <DayModal
        visible={visible}
        toggleVisible={toggleVisible}
        data={dataEntry}
      />
    </View>
  );
};

const IconSizeForTheme: Record<ThemeName, number> = {
  hills: 80,
  mosaic: 60,
  village: 80,
  desert: 60,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginHorizontal: 8,
  },
  button: {
    width: 100,
  },
  dayText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
