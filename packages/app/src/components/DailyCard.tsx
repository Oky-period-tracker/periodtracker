import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DisplayButton } from "./Button";
import Cloud from "./icons/Cloud";
import { EmojiBadge } from "./EmojiBadge";
import { IconButton } from "./IconButton";
import { DayData, useDayScroll } from "../screens/MainScreen/DayScrollContext";
import { formatMomentDayMonth } from "../services/utils";
import { emojiOptions } from "../screens/DayScreen/components/DayTracker/config";
import { useSelector } from "../redux/useSelector";
import moment from "moment";
import {
  cardAnswerSelector,
  isTutorialTwoActiveSelector,
} from "../redux/selectors";
import { useNavigation } from "@react-navigation/native";
import { defaultEmoji } from "../config/options";
import { starColor } from "../config/theme";
import { useTutorial } from "../screens/MainScreen/TutorialContext";

type DailyCardProps = {
  dataEntry: DayData;
  disabled?: boolean;
};

export const DailyCard = ({ dataEntry, disabled }: DailyCardProps) => {
  const { dispatch: tutorialDispatch } = useTutorial();
  const { isDragging, constants } = useDayScroll();
  const { CARD_WIDTH, CARD_MARGIN } = constants;

  const isTutorialTwoActive = useSelector(isTutorialTwoActiveSelector);

  const cardAnswersValues = useSelector((state) =>
    cardAnswerSelector(state, moment(dataEntry.date))
  );

  const status = dataEntry.onPeriod
    ? "danger"
    : dataEntry.onFertile
    ? "tertiary"
    : "neutral";

  //eslint-disable-next-line
  const navigation = useNavigation() as any; // @TODO: Fixme

  const onPress = () => {
    if (isDragging?.current) {
      return;
    }

    if (isTutorialTwoActive) {
      tutorialDispatch({ type: "start", value: "tutorial_two" });
      return;
    }

    navigation.navigate("Day", { date: dataEntry.date });
  };

  const day = dataEntry.cycleDay === 0 ? "-" : dataEntry.cycleDay;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.card,
        {
          width: CARD_WIDTH,
          marginHorizontal: CARD_MARGIN / 2,
        },
      ]}
    >
      <View style={styles.top}>
        <DisplayButton
          status={status}
          textStyle={[styles.dayText]}
          style={{ width: CARD_WIDTH / 3 }}
        >
          {`Day ${day}`}
        </DisplayButton>
        <IconButton
          Icon={Cloud}
          text={formatMomentDayMonth(dataEntry.date)}
          status={status}
          size={80}
          disabled
        />
        <FontAwesome
          name={getStar(Object.keys(cardAnswersValues).length)}
          color={starColor}
          size={28}
        />
      </View>

      <View style={styles.bottom}>
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
              key={`${dataEntry.date}-${key}`}
              emoji={emoji}
              text={key} // TODO: translate
              status={isEmojiActive ? status : "basic"}
              disabled
            />
          );
        })}
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
    margin: 24,
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

const getStar = (numberOfElements: number) => {
  if (numberOfElements === null) return "star-o";
  if (numberOfElements < 2) return "star-o";
  if (numberOfElements >= 2 && numberOfElements < 4) return "star-half-full";
  if (numberOfElements >= 4) return "star";
};
