import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { EmojiBadge } from "../../../../components/EmojiBadge";
import { EmojiCardText, emojiOptions } from "./config";
import { EmojiQuestionOptions } from "./types";
import { useSelector } from "../../../../redux/useSelector";
import {
  cardAnswerSelector,
  currentUserSelector,
} from "../../../../redux/selectors";
import { DayData } from "../../../MainScreen/DayScrollContext";
import { useDispatch } from "react-redux";
import { answerDailyCard } from "../../../../redux/actions";

export const EmojiQuestionCard = ({
  topic,
  dataEntry,
}: {
  topic: keyof EmojiQuestionOptions;
  dataEntry: DayData;
}) => {
  const mutuallyExclusive = topic === "flow";
  const userID = useSelector(currentUserSelector)?.id;

  const selectedEmojis = useSelector((state) =>
    cardAnswerSelector(state, dataEntry.date)
  );

  const dispatch = useDispatch();

  const onEmojiPress = (answer: string) => {
    if (!userID) {
      return;
    }

    dispatch(
      answerDailyCard({
        cardName: topic,
        // @ts-expect-error TODO:
        answer,
        userID,
        utcDateTime: dataEntry.date,
        mutuallyExclusive,
        periodDay: dataEntry.onPeriod,
      })
    );
  };

  const options = Object.entries(emojiOptions[topic]);
  const { title, description, question } = EmojiCardText[topic];

  return (
    <View style={styles.page}>
      <Text style={styles.title}>{title}</Text>
      <Text>{description}</Text>
      <Text style={styles.question}>{question}</Text>
      <View style={styles.body}>
        <View style={styles.emojiContainer}>
          {options.map(([key, emoji]) => {
            // @ts-expect-error TODO:
            const isSelected = selectedEmojis[topic]?.includes?.(key);
            const status = isSelected ? "neutral" : "basic";
            const onPress = () => {
              onEmojiPress(key);
            };

            return (
              <EmojiBadge
                key={key}
                onPress={onPress}
                emoji={emoji}
                text={key}
                status={status}
                size={"large"}
                style={styles.emojiBadge}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    padding: 24,
  },
  button: {
    marginLeft: "auto",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F49200",
    marginBottom: 24,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F49200",
    marginTop: 24,
    marginBottom: 12,
  },
  body: {
    flex: 1,
    justifyContent: "center",
  },
  emojiContainer: {
    minHeight: 200,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  emojiBadge: {
    flexBasis: "30%",
    marginVertical: 24,
  },
});
