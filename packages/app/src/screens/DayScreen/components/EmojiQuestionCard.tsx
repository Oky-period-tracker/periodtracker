import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { EmojiBadge } from "../../../components/EmojiBadge";
import { EmojiCardText, emojiOptions } from "./config";
import { EmojiQuestionOptions, EmojiQuestionsState } from "./types";

export const EmojiQuestionCard = ({
  topic,
}: {
  topic: keyof EmojiQuestionOptions;
}) => {
  const options = Object.entries(emojiOptions[topic]);
  const { title, description, question } = EmojiCardText[topic];

  const [selectedEmojis, setSelectedEmojis] =
    React.useState<EmojiQuestionsState>({});

  return (
    <View style={[styles.page]}>
      <Text style={styles.title}>{title}</Text>
      <Text>{description}</Text>
      <Text style={styles.question}>{question}</Text>
      <View style={styles.body}>
        <View style={styles.emojiContainer}>
          {options.map(([key, emoji]) => {
            // @ts-ignore
            const isSelected = selectedEmojis[topic]?.includes?.(key);
            const status = isSelected ? "primary" : "basic";
            const onPress = () => {
              setSelectedEmojis((current) => ({
                ...current,
                [topic]: {
                  ...current[topic],
                  key,
                },
              }));
            };

            return (
              <EmojiBadge
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
