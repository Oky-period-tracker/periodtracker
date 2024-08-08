import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Text } from "../../../../components/Text";
import { Hr } from "../../../../components/Hr";
import { SurveyConsent } from "./SurveyConsent";
import { useSurvey } from "./SurveyContext";
import { SurveyCollect } from "./SurveyCollect";
import { InfoButton } from "../../../../components/InfoButton";
import { Vr } from "../../../../components/Vr";

export const Survey = () => {
  const { state, dispatch } = useSurvey();

  const onConfirm = () => {
    dispatch({ type: "continue" });
  };

  const onSkip = () => {
    dispatch({ type: "skip" });
  };

  const consentQuestion = "will_you_answer_survey_questions";

  if (!state.survey) {
    return null;
  }

  const currentQuestion = state.survey.questions[state.questionIndex];

  const question = state.consented ? currentQuestion.question : consentQuestion;

  const isLastQuestion =
    state.questionIndex === state.survey.questions.length - 1 &&
    !state.hasAnsweredAll;

  return (
    <View style={styles.page}>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.title}>survey</Text>
          <InfoButton title={"survey"} content={"info_button_survey"} />
        </View>
        <Text>anonymous_answer</Text>
        <Text>choose_one</Text>

        {state.hasAnsweredAll ? (
          <Text style={styles.thanks} status={"danger"}>
            thank_you_msg
          </Text>
        ) : state.consented ? (
          <>
            <Text style={styles.question} enableTranslate={false}>
              {question}
            </Text>
            <SurveyCollect />
          </>
        ) : (
          <>
            <Text style={styles.question}>{consentQuestion}</Text>
            <SurveyConsent />
          </>
        )}
      </View>

      <Hr />
      <View style={styles.buttons}>
        {state.consented && !isLastQuestion && !state.hasAnsweredAll && (
          <>
            <TouchableOpacity onPress={onSkip} style={styles.button}>
              <Text style={styles.buttonText}>{"skip"}</Text>
            </TouchableOpacity>
            <Vr />
          </>
        )}
        <TouchableOpacity onPress={onConfirm} style={styles.button}>
          <Text style={styles.buttonText}>
            {isLastQuestion ? "submit" : "confirm"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    width: "100%",
    flex: 1,
    marginBottom: 80, // Same as Swiper footer
  },
  body: {
    width: "100%",
    flex: 1,
    marginBottom: "auto",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F49200",
    marginRight: 12,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F49200",
    marginTop: 24,
    marginBottom: 12,
  },
  thanks: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#",
    marginTop: 24,
    marginBottom: 12,
  },
  contact: {
    alignSelf: "center",
  },
  buttons: {
    alignSelf: "flex-end",
    width: "100%",
    flexDirection: "row",
  },
  button: {
    flex: 1,
    padding: 24,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
