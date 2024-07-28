import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Text } from "../../../../components/Text";
import { Hr } from "../../../../components/Hr";
import { SurveyConsent } from "./SurveyConsent";
import { useSurvey } from "./SurveyContext";
import { SurveyCollect } from "./SurveyCollect";
import { Button } from "../../../../components/Button";
import { ScreenProps } from "../../../../navigation/RootNavigator";
import { InfoButton } from "../../../../components/InfoButton";

export const Survey = ({ navigation }: ScreenProps<"Day">) => {
  const { state, dispatch } = useSurvey();

  const onConfirm = () => {
    dispatch({ type: "continue" });
  };

  const goToContact = () => {
    navigation.navigate("Contact");
  };

  const consentQuestion = "will_you_answer_survey_questions";

  if (!state.survey) {
    return null;
  }

  const currentQuestion = state.survey.questions[state.questionIndex];

  const question = state.consented ? currentQuestion.question : consentQuestion;

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
          <>
            <Text style={styles.thanks} status={"danger"}>
              thank_you_msg
            </Text>
            <Button
              onPress={goToContact}
              style={styles.contact}
              status={"basic"}
            >
              contact_us
            </Button>
          </>
        ) : (
          <>
            <Text style={styles.question}>{question}</Text>
            {!state.consented ? <SurveyConsent /> : <SurveyCollect />}
          </>
        )}
      </View>

      <Hr />
      <TouchableOpacity onPress={onConfirm} style={styles.confirm}>
        <Text style={styles.confirmText}>confirm</Text>
      </TouchableOpacity>
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
  confirm: {
    padding: 24,
  },
  confirmText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
