import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { DisplayButton } from "../../../../components/Button";
import { Text } from "../../../../components/Text";

export const QuizCard = () => {
  // TODO: Get random Quiz entry from redux

  const [selectedAnswer, setSelectedAnswer] = React.useState<{
    text: string;
    emoji: string;
    isCorrect: boolean;
  }>();

  const response = selectedAnswer
    ? selectedAnswer?.isCorrect
      ? item.response.correct
      : item.response.in_correct
    : "";

  return (
    <View style={[styles.page]}>
      <Text style={styles.title}>Quiz</Text>
      <Text>Test your knowledge when it comes to periods and body stuff!</Text>
      <View style={styles.body}>
        <Text style={styles.question}>{item.question}</Text>
        {item.answers.map((answer) => {
          const isSelected = answer.text === selectedAnswer?.text;
          const status = isSelected ? "danger" : "basic";
          const onPress = () => {
            setSelectedAnswer(answer);
          };

          return (
            <TouchableOpacity
              key={answer.text}
              onPress={onPress}
              style={styles.checkboxContainer}
              disabled={!!selectedAnswer}
            >
              <DisplayButton style={styles.checkbox} status={status} />
              <Text status={status} style={styles.label}>
                {answer.text}
              </Text>
            </TouchableOpacity>
          );
        })}
        <Text style={styles.response}>{response}</Text>
      </View>
    </View>
  );
};

const item = {
  id: "b3e12603-b0ad-4b1d-9c8f-a52ce6ef0ac0",
  isAgeRestricted: false,
  topic: "Menstruation and menstrual cycle",
  question: "How many parts does the menstrual cycle have? 🕓",
  answers: [
    { text: "2", emoji: "", isCorrect: true },
    { text: "3", emoji: "", isCorrect: false },
    { text: "5", emoji: "", isCorrect: false },
  ],
  response: {
    correct:
      "Correct! 👍 Your cycle has 2 parts: before ovulation and after ovulation.",
    in_correct:
      "Wrong answer — your cycle has 2 parts: before ovulation, and after ovulation. 😯",
  },
  live: true,
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
  body: {
    flex: 1,
    justifyContent: "center",
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F49200",
    marginTop: 24,
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 40,
    height: 40,
    marginRight: 12,
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
  },
  response: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E3629B",
    marginVertical: "auto",
    textAlign: "center",
  },
});
