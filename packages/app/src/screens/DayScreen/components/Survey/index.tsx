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

  const consentQuestion =
    "Will you answer a few questions? It will take 2 to 3 minutes";

  if (!state.survey) {
    return null;
  }

  const currentQuestion = state.survey.questions[state.questionIndex];

  const question = state.consented ? currentQuestion.question : consentQuestion;

  return (
    <View style={styles.page}>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.title}>Feedback</Text>
          <InfoButton title={"survey"} content={"info_button_survey"} />
        </View>
        <Text>Tell us about your experience with Oky.</Text>
        <Text>Choose one option from the list.</Text>

        {state.hasAnsweredAll ? (
          <>
            <Text style={styles.thanks} status={"danger"}>
              Thank you! If you want to provide some additional feedback you can
              always do it in the settings menu
            </Text>
            <Button
              onPress={goToContact}
              style={styles.contact}
              status={"basic"}
            >
              Contact us
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
        <Text style={styles.confirmText}>Confirm</Text>
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
