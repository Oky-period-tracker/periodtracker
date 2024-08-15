import React from "react";
import { StyleSheet, View } from "react-native";
import { BadgeSize, EmojiBadge } from "../../../../components/EmojiBadge";
import {
  EmojiCardText,
  emojiOptions,
  offPeriodOptions,
  onPeriodOptions,
} from "./config";
import { EmojiQuestionOptions } from "./types";
import { useSelector } from "../../../../redux/useSelector";
import { Text } from "../../../../components/Text";
import {
  cardAnswerSelector,
  currentUserSelector,
} from "../../../../redux/selectors";
import { DayData } from "../../../MainScreen/DayScrollContext";
import { useDispatch } from "react-redux";
import { answerDailyCard } from "../../../../redux/actions";
import { DayModal } from "../../../../components/DayModal";
import { useToggle } from "../../../../hooks/useToggle";
import { useTranslate } from "../../../../hooks/useTranslate";
import Constants from "expo-constants";
import moment from "moment";
import { updateLastClickedEmojiDate } from "../../../../redux/actions";
import { analytics } from "../../../../firebase/firebase";

export const EmojiQuestionCard = ({
  topic,
  dataEntry,
  size = "large",
}: {
  topic: keyof EmojiQuestionOptions;
  dataEntry?: DayData;
  size?: BadgeSize;
  mutuallyExclusive?: boolean;
  includeDayModal?: boolean;
}) => {
  const translate = useTranslate();

  const mutuallyExclusive = topic === "flow";
  const includeDayModal = topic === "flow";
  const [dayModalVisible, toggleDayModal] = useToggle();

  const userID = useSelector(currentUserSelector)?.id;

  const selectedEmojis = dataEntry
    ? useSelector((state) => cardAnswerSelector(state, dataEntry?.date))
    : {};

  const dispatch = useDispatch();
  const lastClickedDate = useSelector(
    (state) => state.lastClickedDate.lastClickedEmojiDate
  );

  const onEmojiPress = (answer: string) => {
    if (!userID || !dataEntry) {
      return;
    }
    const todayDate = moment().format("YYYY-MM-DD");
    console.log("lastClickedDate", lastClickedDate);
    console.log("todayDate", todayDate);
    if (lastClickedDate !== todayDate) {
      if (Constants.appOwnership != "expo") {
        analytics?.()
          .logEvent("daily_card_answeredEmoji")
          .then(() => {
            console.log("logged daily_card_answeredEmoji");
          });
      }
      dispatch(updateLastClickedEmojiDate(todayDate));
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

    if (!includeDayModal) {
      return;
    }

    if (dataEntry?.onPeriod && offPeriodOptions.includes(answer)) {
      toggleDayModal();
    }

    if (!dataEntry?.onPeriod && onPeriodOptions.includes(answer)) {
      toggleDayModal();
    }
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

            const text = translate(key);

            return (
              <EmojiBadge
                key={key}
                onPress={onPress}
                emoji={emoji}
                text={text}
                status={status}
                size={size}
                style={styles.emojiBadge}
              />
            );
          })}
        </View>
      </View>
      {includeDayModal && dataEntry && (
        <DayModal
          visible={dayModalVisible}
          toggleVisible={toggleDayModal}
          data={dataEntry}
        />
      )}
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
    fontSize: 20,
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
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
  },
  emojiBadge: {
    flexBasis: "30%",
    marginVertical: 12,
  },
});
