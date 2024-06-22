import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { DisplayButton } from "./Button";
import Cloud from "./icons/Cloud";
import { Star } from "./icons/Star";
import { EmojiBadge } from "./EmojiBadge";
import { IconButton } from "./IconButton";
import { DayData, useDayScroll } from "../screens/MainScreen/DayScrollContext";
import { formatMomentDayMonth } from "../services/utils";

type DailyCardProps = {
  item: DayData;
  onPress: () => void;
};

export const DailyCard = ({ item, onPress }: DailyCardProps) => {
  const { constants } = useDayScroll();
  const { CARD_WIDTH, CARD_MARGIN } = constants;
  const status = "neutral";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        {
          width: CARD_WIDTH,
          margin: CARD_MARGIN,
          marginHorizontal: CARD_MARGIN / 2,
        },
      ]}
    >
      <View style={styles.top}>
        <DisplayButton status={status} textStyle={styles.dayText}>
          {"Day N"}
        </DisplayButton>
        <IconButton Icon={Cloud} text={formatMomentDayMonth(item.date)} />
        <Star size={24} />
      </View>

      <View style={styles.bottom}>
        <EmojiBadge emoji={"😊"} text={"Mood"} status={status} />
        <EmojiBadge emoji={"😊"} text={"Mood"} status={status} />
        <EmojiBadge emoji={"😊"} text={"Mood"} status={status} />
        <EmojiBadge emoji={"😊"} text={"Mood"} status={status} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: "#fff",
    overflow: "hidden",
    aspectRatio: 1.5,
    flexDirection: "column",
    padding: 12,
  },
  top: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  dayText: {
    color: "#fff",
    fontWeight: "bold",
  },
  iconRight: {
    height: 24,
    width: 24,
  },
  bottom: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
