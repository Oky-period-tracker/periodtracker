import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { EmojiBadge } from "../../../components/EmojiBadge";
import { useSelector } from "../../../redux/useSelector";
import { mostAnsweredSelector } from "../../../redux/selectors";
import { emojiOptions } from "../../DayScreen/components/DayTracker/config";
import { defaultEmoji } from "../../../config/options";
import { Moment } from "moment";
import { formatMomentDayMonth } from "../../../services/utils";

export const CycleCard = ({
  item,
  cycleNumber,
}: {
  item: {
    cycleStartDate: Moment;
    cycleEndDate: Moment;
    periodLength: number;
    cycleLength: number;
  };
  cycleNumber: number;
}) => {
  const cardAnswersValues = useSelector((state) =>
    mostAnsweredSelector(state, item.cycleStartDate, item.cycleEndDate)
  );

  const startString = formatMomentDayMonth(item.cycleStartDate);
  const endString = formatMomentDayMonth(item.cycleEndDate);

  const periodStartString = startString;
  const periodEnd = item.cycleStartDate.clone().add(item.periodLength, "days");
  const periodEndString = formatMomentDayMonth(periodEnd);

  return (
    <View style={styles.cycleCard}>
      <View style={styles.cycleCardHeader}>
        <Text style={styles.headerText}>{`Cycle ${cycleNumber}`}</Text>
        <Text style={styles.headerText}>{`${item.cycleLength} day cycle`}</Text>
        <Text style={styles.headerText}>{`${startString} - ${endString}`}</Text>
      </View>
      <View style={styles.cycleCardBody}>
        <View style={styles.cycleCardBodyLeft}>
          <Text>{`${item.periodLength} day period`}</Text>
          <Text>{`${periodStartString} - ${periodEndString}`}</Text>
        </View>
        <View style={styles.cycleCardBodyRight}>
          {Object.entries(emojiOptions).map(([key]) => {
            // @ts-expect-error TODO:
            const isArray = Array.isArray(cardAnswersValues[key]);

            const isEmojiActive = isArray
              ? // @ts-expect-error TODO:
                cardAnswersValues[key]?.length > 0
              : // @ts-expect-error TODO:
                !!cardAnswersValues[key];

            const answer = isEmojiActive
              ? isArray
                ? // @ts-expect-error TODO:
                  cardAnswersValues[key][0]
                : // @ts-expect-error TODO:
                  cardAnswersValues[key]
              : "";

            const emoji = isEmojiActive
              ? // @ts-expect-error TODO:
                emojiOptions[key][answer]
              : defaultEmoji;

            return (
              <EmojiBadge
                key={`${item.cycleStartDate}-${key}`}
                emoji={emoji}
                text={key} // TODO: translate
                status={isEmojiActive ? "danger" : "basic"}
                disabled
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cycleCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    height: 140,
    marginVertical: 4,
    flexDirection: "column",
    overflow: "hidden",
  },
  cycleCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e3629b",
    width: "100%",
    height: " 33%",
    paddingHorizontal: 16,
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cycleCardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  cycleCardBodyLeft: {
    width: "50%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    padding: 16,
  },
  cycleCardBodyRight: {
    width: "50%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
