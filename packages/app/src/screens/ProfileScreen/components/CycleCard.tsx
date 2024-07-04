import React from "react";
import { StyleSheet, View } from "react-native";
import { EmojiBadge } from "../../../components/EmojiBadge";
import { useSelector } from "../../../redux/useSelector";
import { mostAnsweredSelector } from "../../../redux/selectors";
import { emojiOptions } from "../../DayScreen/components/DayTracker/config";
import { defaultEmoji } from "../../../config/options";
import { Moment } from "moment";
import { Text } from "../../../components/Text";

// TODO Make numbers bold, make sure text fits on one line
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

  const startDay = item.cycleStartDate.format("DD");
  const startMonth = item.cycleStartDate.format("MMM");

  const endDay = item.cycleEndDate.format("DD");
  const endMonth = item.cycleEndDate.format("MMM");

  const periodEndDate = item.cycleStartDate
    .clone()
    .add(item.periodLength, "days");

  const periodEndDay = periodEndDate.format("DD");
  const periodEndMonth = periodEndDate.format("MMM");

  return (
    <View style={styles.cycleCard}>
      {/* ===== Header ===== */}
      <View style={styles.cycleCardHeader}>
        <View style={styles.row}>
          <Text style={styles.headerText}>Cycle </Text>
          <Text style={[styles.headerText, styles.bold]}>{cycleNumber}</Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.headerText, styles.bold]}>
            {item.cycleLength}
          </Text>
          <Text style={styles.headerText}> day cycle</Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.headerText, styles.bold]}>{startDay}</Text>
          <Text style={styles.headerText}>{` ${startMonth} - `}</Text>
          <Text style={[styles.headerText, styles.bold]}>{endDay}</Text>
          <Text style={styles.headerText}>{` ${endMonth}`}</Text>
        </View>
      </View>

      {/* ===== Body ===== */}
      <View style={styles.cycleCardBody}>
        <View style={styles.cycleCardBodyLeft}>
          <View style={styles.row}>
            <Text style={styles.bold}>{item.periodLength}</Text>
            <Text> day period</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.bold}>{startDay}</Text>
            <Text>{` ${startMonth} - `}</Text>
            <Text style={styles.bold}>{periodEndDay}</Text>
            <Text>{` ${periodEndMonth}`}</Text>
          </View>
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
    fontSize: 16,
  },
  cycleCardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    padding: 16,
  },
  cycleCardBodyLeft: {
    flex: 2,
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  cycleCardBodyRight: {
    flex: 3,
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  bold: {
    fontWeight: "bold",
  },
});
